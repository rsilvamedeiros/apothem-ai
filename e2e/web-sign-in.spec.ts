import { expect, test } from "@playwright/test";

test.describe("web sign-in (dev bootstrap)", () => {
  test("shows the sign-in form with required fields", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByRole("heading", { name: "Enter your workspace" })).toBeVisible();
    await expect(page.getByLabel("Principal ID")).toBeVisible();
    await expect(page.getByLabel("Organization ID")).toBeVisible();
  });

  test("does not expose the API base URL to the browser", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    const html = await page.content();
    expect(html).not.toContain("localhost:3001");
  });
});
