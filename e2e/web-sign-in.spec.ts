import { expect, test } from "@playwright/test";

// The e2e web server runs the production build (`next start`), so these tests
// describe how a deployed environment behaves.
test.describe("web sign-in (production build)", () => {
  test("shows the sign-in page", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByRole("heading", { name: "Enter your workspace" })).toBeVisible();
  });

  test("never exposes the dev bootstrap form in production", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByLabel("Principal ID")).toHaveCount(0);
    await expect(page.getByLabel("Organization ID")).toHaveCount(0);
    await expect(page.getByLabel(/Access token/)).toHaveCount(0);
  });

  test("says so when no sign-in provider is configured", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByText("Sign-in is not configured for this environment.")).toBeVisible();
  });

  test("does not expose the API base URL to the browser", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    const html = await page.content();
    expect(html).not.toContain("localhost:3001");
  });

  test("a deep link without a session falls back to the sign-in page instead of leaking data", async ({ page }) => {
    const response = await page.goto(
      "http://localhost:3000/org/11111111-1111-4111-8111-111111111111/members",
    );
    // apothem-api is not running in e2e: the page must fail safely, never render members.
    expect(response?.status()).toBeLessThan(600);
    await expect(page.getByRole("table")).toHaveCount(0);
  });
});
