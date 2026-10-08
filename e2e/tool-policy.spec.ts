import { expect, test, type Page } from "@playwright/test";
import { apiAvailable, createWorkspace, signIn, WEB } from "./support/full-stack";

/**
 * Workspace tool policy end to end in a real browser against the real API: a
 * rule that forces approval, a rule that blocks a tool (also for work already
 * waiting), and lifting it. Skipped when the sibling apothem-api checkout is
 * not present.
 */
const WRITE = '__mock_tool_call__ create_note {"title":"Call back","body":"Tomorrow 10am"}';

test.describe("workspace tool policy", () => {
  test.skip(!apiAvailable, "needs the sibling apothem-api checkout");

  async function setRule(page: Page, settingsUrl: string, choice: "No workspace rule" | "Always ask a person first" | "Blocked") {
    await page.goto(settingsUrl);
    await page.getByLabel("Create note").selectOption({ label: choice });
    await page.getByRole("button", { name: "Save policy" }).click();
    await expect(page.getByText("Tool policy saved. It applies to the next run.")).toBeVisible();
  }

  async function runWrite(page: Page, agentUrl: string) {
    await page.goto(agentUrl);
    await page.getByLabel("Task").fill(WRITE);
    await page.getByRole("button", { name: "Run agent" }).click();
  }

  test("an owner can make a tool ask first, block it even for work already waiting, and lift the rule", async ({ page, context }) => {
    test.setTimeout(240_000);
    const run = Date.now().toString(36);
    await signIn(context, `policy-owner-${run}@example.com`);
    const { orgId, base } = await createWorkspace(page, run);
    const settings = `${base}/settings`;

    // An agent whose author set the write tool to run automatically.
    await page.goto(`${base}/agents/new`);
    await page.getByLabel("Name", { exact: true }).fill("Notes bot");
    await page.getByRole("button", { name: "Create agent" }).click();
    await page.waitForURL(/\/agents\/[0-9a-f-]{36}$/);
    const agentUrl = page.url();
    await page.getByLabel("Instructions").fill("Save a note when the user asks you to.");
    await page.getByRole("button", { name: "Save draft" }).click();
    await expect(page.getByText("Draft saved.")).toBeVisible();
    await page.getByLabel(/create note/i).selectOption("auto");
    await page.getByRole("button", { name: "Save tools" }).click();
    await expect(page.getByText(/Tools saved/)).toBeVisible();
    await page.getByRole("button", { name: "Publish new version" }).click();
    await expect(page.getByText("Published version 1.")).toBeVisible();

    // The settings page starts with no rules.
    await page.goto(settings);
    await expect(page.getByRole("heading", { name: "Tool policy" })).toBeVisible();
    await expect(page.getByLabel("Create note")).toHaveValue("none");

    // "Always ask first" overrides the author's "automatic".
    await setRule(page, settings, "Always ask a person first");
    await page.goto(agentUrl);
    await expect(page.getByText("Always asks first in this workspace")).toBeVisible();
    await runWrite(page, agentUrl);
    await expect(page.getByText("Waiting for approval").first()).toBeVisible();

    // Blocking the tool also protects the request that is already waiting.
    await setRule(page, settings, "Blocked");
    await page.goto(`${base}/approvals`);
    await expect(page.getByText("Tomorrow 10am")).toBeVisible();
    await page.getByRole("button", { name: "Approve" }).click();
    await expect(page.getByText(/can no longer be decided/)).toBeVisible();
    await page.goto(`${base}/runs`);
    await page.getByRole("link", { name: /__mock_tool_call__/ }).first().click();
    await expect(page.getByText("The approval no longer applied")).toBeVisible();
    await expect(page.getByText(/TOOL RESULT for create_note/)).toHaveCount(0);

    // A new run does not even get the tool; the author sees why.
    await page.goto(agentUrl);
    await expect(page.getByText("Blocked in this workspace")).toBeVisible();
    await expect(page.getByText(/cannot use it until the rule is lifted/)).toBeVisible();
    await runWrite(page, agentUrl);
    await expect(page.getByText("Completed").first()).toBeVisible();
    await expect(page.getByText(/TOOL RESULT for create_note/)).toHaveCount(0);

    // Lifting the rule gives the author's choice back.
    await setRule(page, settings, "No workspace rule");
    await runWrite(page, agentUrl);
    await expect(page.getByText(/TOOL RESULT for create_note/)).toBeVisible();

    // Every change is on the audit trail.
    await page.goto(`${WEB}/org/${orgId}/audit`);
    await expect(page.getByRole("cell", { name: "tool_policy.set" }).first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "tool_policy.removed" }).first()).toBeVisible();
  });

  test("another account cannot read or change the policy of a workspace it does not belong to", async ({ page, context }) => {
    const run = Date.now().toString(36);
    await signIn(context, `policy-a-${run}@example.com`);
    const { base } = await createWorkspace(page, run);
    await setRule(page, `${base}/settings`, "Blocked");

    await context.clearCookies();
    await signIn(context, `policy-b-${run}@example.com`);
    await page.goto(`${base}/settings`);
    await expect(page.getByLabel("Create note")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Save policy" })).toHaveCount(0);
    await expect(page.getByText(/don.t have access to this workspace|workspace was not found/i)).toBeVisible();
  });
});
