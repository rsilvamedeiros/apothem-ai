import { expect, test, type Page } from "@playwright/test";
import { apiAvailable, signIn, WEB } from "./support/full-stack";

/**
 * Knowledge end to end in a real browser against the real API: a knowledge
 * base, a document, a search, an agent that answers from it through the
 * search tool, and the moment the base is archived. Skipped when the sibling
 * apothem-api checkout is not present.
 */
const POLICY = "# Refunds\n\nRefunds are issued to the original card within five business days.";
const QUESTION = "how long do refunds take";

test.describe("knowledge", () => {
  test.skip(!apiAvailable, "needs the sibling apothem-api checkout");

  async function workspaceFor(page: Page, run: string) {
    await page.goto(`${WEB}/`);
    await page.getByLabel("Organization name").fill(`Acme ${run}`);
    await page.getByRole("button", { name: "Create organization" }).click();
    await page.waitForURL(/\/org\/[0-9a-f-]{36}$/);
    const orgId = page.url().split("/org/")[1]!;
    await page.getByPlaceholder("Workspace name").fill("Support");
    await page.getByPlaceholder("workspace-slug").fill(`support-${run}`);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await page.waitForURL(/\/workspace\/[0-9a-f-]{36}\/overview$/);
    return { orgId, base: `${WEB}/org/${orgId}/workspace/${page.url().split("/workspace/")[1]!.split("/")[0]}` };
  }

  async function runAgent(page: Page, agentUrl: string) {
    await page.goto(agentUrl);
    await page.getByLabel("Task").fill(`__mock_tool_call__ search_knowledge {"query":"${QUESTION}"}`);
    await page.getByRole("button", { name: "Run agent" }).click();
    await expect(page.getByText("Completed").first()).toBeVisible();
  }

  test("an owner teaches an agent from pasted text, and archiving takes it away", async ({ page, context }) => {
    test.setTimeout(240_000);
    const run = Date.now().toString(36);
    await signIn(context, `kb-owner-${run}@example.com`);
    const { orgId, base } = await workspaceFor(page, run);

    // Knowledge base.
    await page.goto(`${base}/knowledge`);
    await expect(page.getByRole("heading", { name: "Knowledge", exact: true })).toBeVisible();
    await expect(page.getByText("No knowledge bases yet in this workspace.")).toBeVisible();
    await page.getByLabel("Name").fill("Handbook");
    await page.getByLabel(/Description/).fill("Customer policies");
    await page.getByRole("button", { name: "Create knowledge base" }).click();
    await page.waitForURL(/\/knowledge\/[0-9a-f-]{36}$/);
    const baseUrl = page.url();
    await expect(page.getByRole("heading", { level: 1, name: "Handbook" })).toBeVisible();
    await expect(page.getByText(/No documents yet/)).toBeVisible();

    // Document: added once, recognised when pasted again.
    await page.getByLabel("Title").fill("Refund policy");
    await page.getByLabel(/^Text/).fill(POLICY);
    await page.getByRole("button", { name: "Add document" }).click();
    await expect(page.getByText("Document added. Agents can retrieve from it now.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Documents" }).locator("..").getByText("Refund policy")).toBeVisible();
    await expect(page.getByText(/1 passage/)).toBeVisible();

    await page.getByLabel("Title").fill("Same text again");
    await page.getByLabel(/^Text/).fill(POLICY);
    await page.getByRole("button", { name: "Add document" }).click();
    await expect(page.getByText("This text is already in the knowledge base, so nothing was added.")).toBeVisible();

    // Search shows the passage with where it came from.
    await page.getByLabel("Question or keywords").fill(QUESTION);
    await page.getByRole("button", { name: "Search" }).click();
    const results = page.getByRole("list", { name: "Matching passages" });
    await expect(results).toContainText("Refund policy · Refunds, passage 1");
    await expect(results).toContainText("within five business days");

    await page.getByLabel("Question or keywords").fill("zebra migration");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("No passage matched. An agent would receive nothing for this query.")).toBeVisible();

    // An agent: instructions, the search tool, the base, publish.
    await page.goto(`${base}/agents/new`);
    await page.getByLabel("Name", { exact: true }).fill("Support bot");
    await page.getByRole("button", { name: "Create agent" }).click();
    await page.waitForURL(/\/agents\/[0-9a-f-]{36}$/);
    const agentUrl = page.url();
    await page.getByLabel("Instructions").fill("Answer from the handbook.");
    await page.getByRole("button", { name: "Save draft" }).click();
    await expect(page.getByText("Draft saved.")).toBeVisible();

    // Attaching the base before turning the tool on is flagged, then resolved.
    await page.getByRole("checkbox", { name: "Handbook", exact: true }).check();
    await expect(page.getByText(/only search these once the “Search knowledge” tool is turned on/)).toBeVisible();
    await page.getByRole("button", { name: "Save knowledge" }).click();
    await expect(page.getByText(/Knowledge saved/)).toBeVisible();

    await page.getByLabel(/search knowledge/i).selectOption("auto");
    await page.getByRole("button", { name: "Save tools" }).click();
    await expect(page.getByText(/Tools saved/)).toBeVisible();
    await expect(page.getByText(/only search these once/)).toHaveCount(0);

    await page.getByRole("button", { name: "Publish new version" }).click();
    await expect(page.getByText("Published version 1.")).toBeVisible();

    // The agent answers from the passage, with no approval needed for a read.
    await runAgent(page, agentUrl);
    await expect(page.getByText(/TOOL RESULT for search_knowledge/)).toBeVisible();
    await expect(page.getByText(/within five business days/)).toBeVisible();

    // The audit trail records the work, never the text.
    await page.goto(`${WEB}/org/${orgId}/audit`);
    for (const action of ["knowledge_base.created", "knowledge_document.added"]) {
      await expect(page.getByRole("cell", { name: action }).first()).toBeVisible();
    }
    await expect(page.getByText("five business days")).toHaveCount(0);

    // Archiving takes the knowledge away from the very next run.
    await page.goto(baseUrl);
    await page.getByRole("button", { name: "Archive" }).click();
    await page.getByRole("button", { name: "Confirm archive" }).click();
    await expect(page.getByText("Archived. Agents no longer retrieve from this knowledge base.")).toBeVisible();
    await expect(page.getByText("An archived knowledge base cannot be searched.")).toBeVisible();

    await runAgent(page, agentUrl);
    await expect(page.getByText(/TOOL RESULT for search_knowledge/)).toBeVisible();
    await expect(page.getByText(/within five business days/)).toHaveCount(0);
  });

  test("removing a document stops it from being found", async ({ page, context }) => {
    const run = Date.now().toString(36);
    await signIn(context, `kb-rm-${run}@example.com`);
    const { base } = await workspaceFor(page, run);
    await page.goto(`${base}/knowledge`);
    await page.getByLabel("Name").fill("Handbook");
    await page.getByRole("button", { name: "Create knowledge base" }).click();
    await page.waitForURL(/\/knowledge\/[0-9a-f-]{36}$/);
    await page.getByLabel("Title").fill("Refund policy");
    await page.getByLabel(/^Text/).fill(POLICY);
    await page.getByRole("button", { name: "Add document" }).click();
    await expect(page.getByText("Document added.")).toBeVisible();

    await page.getByLabel("Question or keywords").fill(QUESTION);
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByRole("list", { name: "Matching passages" })).toContainText("five business days");

    await page.getByRole("button", { name: "Remove Refund policy" }).click();
    await expect(page.getByText("Remove “Refund policy”? This cannot be undone.")).toBeVisible();
    await page.getByRole("button", { name: "Confirm remove" }).click();
    await expect(page.getByText(/No documents yet/)).toBeVisible();

    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("No passage matched. An agent would receive nothing for this query.")).toBeVisible();
  });

  test("another account cannot open the knowledge of a workspace it does not belong to", async ({ page, context }) => {
    const run = Date.now().toString(36);
    await signIn(context, `kb-a-${run}@example.com`);
    const { base } = await workspaceFor(page, run);
    await page.goto(`${base}/knowledge`);
    await page.getByLabel("Name").fill("Private handbook");
    await page.getByRole("button", { name: "Create knowledge base" }).click();
    await page.waitForURL(/\/knowledge\/[0-9a-f-]{36}$/);
    await page.getByLabel("Title").fill("Secret plans");
    await page.getByLabel(/^Text/).fill("The launch codename is falcon.");
    await page.getByRole("button", { name: "Add document" }).click();
    await expect(page.getByText("Document added.")).toBeVisible();
    const baseUrl = page.url();

    await context.clearCookies();
    await signIn(context, `kb-b-${run}@example.com`);
    await page.goto(baseUrl);
    await expect(page.getByRole("heading", { name: "Private handbook" })).toHaveCount(0);
    await expect(page.getByText("Secret plans")).toHaveCount(0);
    await expect(page.getByText("falcon")).toHaveCount(0);
    await page.goto(`${base}/knowledge`);
    await expect(page.getByText("Private handbook")).toHaveCount(0);
  });
});
