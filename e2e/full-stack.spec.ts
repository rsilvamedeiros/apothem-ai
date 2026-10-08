import { expect, test } from "@playwright/test";
import { apiAvailable, signIn, WEB } from "./support/full-stack";

/**
 * The whole product path in a real browser against the real API (routes,
 * services, migrations on in-memory Postgres, mock model): sign-in by signed
 * token, organization, workspace, agent, tools, publish, run, human approval,
 * run result, audit and members. Skipped when the sibling apothem-api checkout
 * is not present.
 */

test.describe("full stack journey", () => {
  test.skip(!apiAvailable, "needs the sibling apothem-api checkout");

  test("an owner builds an agent, a write waits for approval, the approval completes the run", async ({ page, context }) => {
    test.setTimeout(180_000);
    const run = Date.now().toString(36);
    const email = `owner-${run}@example.com`;
    await signIn(context, email);

    // Sign-up on first login, then the organization picker.
    await page.goto(`${WEB}/`);
    await expect(page.getByRole("heading", { name: "Your organizations" })).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText(/don.t belong to any organization/i)).toBeVisible();

    // Organization.
    await page.getByLabel("Organization name").fill(`Acme ${run}`);
    await page.getByRole("button", { name: "Create organization" }).click();
    await page.waitForURL(/\/org\/[0-9a-f-]{36}$/);
    const orgId = page.url().split("/org/")[1]!;

    // Workspace.
    await page.getByPlaceholder("Workspace name").fill("Support");
    await page.getByPlaceholder("workspace-slug").fill(`support-${run}`);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await page.waitForURL(/\/workspace\/[0-9a-f-]{36}\/overview$/);
    const workspaceBase = `${WEB}/org/${orgId}/workspace/${page.url().split("/workspace/")[1]!.split("/")[0]}`;

    // Agent: create, instructions, tool with approval, publish.
    await page.goto(`${workspaceBase}/agents/new`);
    await page.getByLabel("Name", { exact: true }).fill("Notes bot");
    await page.getByRole("button", { name: "Create agent" }).click();
    await page.waitForURL(/\/agents\/[0-9a-f-]{36}$/);
    const agentUrl = page.url();

    await page.getByLabel("Instructions").fill("Save a note when the user asks you to.");
    await page.getByRole("button", { name: "Save draft" }).click();
    await expect(page.getByText("Draft saved.")).toBeVisible();

    await page.getByLabel(/create note/i).selectOption("required");
    await page.getByRole("button", { name: "Save tools" }).click();
    await expect(page.getByText(/Tools saved/)).toBeVisible();

    await page.getByRole("button", { name: "Publish new version" }).click();
    await expect(page.getByText("Published version 1.")).toBeVisible();

    // Run: the write must wait for a person.
    await page.goto(agentUrl);
    await page
      .getByLabel("Task")
      .fill('__mock_tool_call__ create_note {"title":"Call back","body":"Tomorrow 10am"}');
    await page.getByRole("button", { name: "Run agent" }).click();
    await expect(page.getByText("Waiting for approval").first()).toBeVisible();

    // Approval inbox: the exact proposal is visible; the owner is the only approver, so self-approval is allowed.
    await page.goto(`${workspaceBase}/approvals`);
    await expect(page.getByText("Create note")).toBeVisible();
    await expect(page.getByText("Tomorrow 10am")).toBeVisible();
    await page.getByRole("button", { name: "Approve" }).click();
    await expect(page.getByText(/Approved\. The action was performed/)).toBeVisible();

    // The run finished and kept its record.
    await page.goto(`${workspaceBase}/runs`);
    await expect(page.getByText("Completed").first()).toBeVisible();
    await page.getByRole("link", { name: /__mock_tool_call__/ }).click();
    await expect(page.getByText("Completed").first()).toBeVisible();
    await expect(page.getByText(/TOOL RESULT for create_note/)).toBeVisible();
    await expect(page.getByText(/Self-approved/)).toBeVisible();

    // Audit trail carries the whole story, without the note contents.
    await page.goto(`${WEB}/org/${orgId}/audit`);
    for (const action of ["approval.requested", "approval.approved", "run.completed", "agent.version_published"]) {
      await expect(page.getByRole("cell", { name: action }).first()).toBeVisible();
    }
    await expect(page.getByText("Tomorrow 10am")).toHaveCount(0);

    // Members.
    await page.goto(`${WEB}/org/${orgId}/members`);
    const ownerRow = page.getByRole("row").filter({ hasText: email });
    await expect(ownerRow).toBeVisible();
    await expect(ownerRow.getByRole("cell", { name: "Owner", exact: true })).toBeVisible();
    await expect(ownerRow.getByText("Active")).toBeVisible();
  });

  test("a stranger cannot reach another organization's pages", async ({ page, context }) => {
    const ownerEmail = `a-${Date.now().toString(36)}@example.com`;
    await signIn(context, ownerEmail);
    await page.goto(`${WEB}/`);
    await page.getByLabel("Organization name").fill(`Private ${Date.now().toString(36)}`);
    await page.getByRole("button", { name: "Create organization" }).click();
    await page.waitForURL(/\/org\/[0-9a-f-]{36}$/);
    const orgId = page.url().split("/org/")[1]!;

    // A different account signs in and tries the first organization's members and audit pages.
    await context.clearCookies();
    await signIn(context, `b-${Date.now().toString(36)}@example.com`);
    await page.goto(`${WEB}/org/${orgId}/members`);
    await expect(page.getByRole("table")).toHaveCount(0);
    await expect(page.getByText(ownerEmail)).toHaveCount(0);
    await page.goto(`${WEB}/org/${orgId}/audit`);
    await expect(page.getByRole("table")).toHaveCount(0);
  });
});
