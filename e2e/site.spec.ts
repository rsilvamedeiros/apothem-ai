import { expect, test } from "@playwright/test";

const SITE = "http://localhost:3100";

test.describe("public site", () => {
  test("home renders a primary heading", async ({ page }) => {
    await page.goto(SITE);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  for (const path of ["/produto", "/seguranca", "/precos", "/qualidade", "/roadmap"]) {
    test(`${path} responds successfully`, async ({ page }) => {
      const response = await page.goto(`${SITE}${path}`);
      expect(response?.status()).toBe(200);
    });
  }

  test("serves robots.txt and sitemap.xml", async ({ request }) => {
    expect((await request.get(`${SITE}/robots.txt`)).ok()).toBe(true);
    expect((await request.get(`${SITE}/sitemap.xml`)).ok()).toBe(true);
  });
});
