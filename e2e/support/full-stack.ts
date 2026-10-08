import { existsSync } from "node:fs";
import path from "node:path";
import { expect, type BrowserContext, type Page } from "@playwright/test";
import { SignJWT } from "jose";

/**
 * Shared by the specs that run a real browser against the real API (routes,
 * services, migrations on in-memory Postgres, mock model). They are skipped
 * when the sibling apothem-api checkout is not present.
 */
export const API_DIR = process.env.E2E_API_DIR ?? path.resolve(__dirname, "../../../apothem-api");
export const apiAvailable = existsSync(path.join(API_DIR, "package.json"));

// Must match apothem-api/infra/scripts/e2e-api.ts
const SECRET = "e2e-only-secret-e2e-only-secret-0123456789";
const ISSUER = "https://e2e.apothem.test";
const AUDIENCE = "apothem-api";
export const WEB = "http://localhost:3000";

/** Signs in by setting the cookie the web app exchanges for an API token; the account is created on first use. */
export async function signIn(context: BrowserContext, email: string): Promise<void> {
  const token = await new SignJWT({ email, email_verified: true, name: "E2E Owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("30m")
    .sign(new TextEncoder().encode(SECRET));
  await context.addCookies([{ name: "apothem_access_token", value: token, url: WEB, httpOnly: true, sameSite: "Lax" }]);
}

/** Creates an organization and its first workspace through the UI and returns the workspace base URL. */
export async function createWorkspace(page: Page, run: string): Promise<{ orgId: string; base: string }> {
  await page.goto(`${WEB}/`);
  await page.getByLabel("Organization name").fill(`Acme ${run}`);
  await page.getByRole("button", { name: "Create organization" }).click();
  await page.waitForURL(/\/org\/[0-9a-f-]{36}$/);
  const orgId = page.url().split("/org/")[1]!;
  await page.getByPlaceholder("Workspace name").fill("Support");
  await page.getByPlaceholder("workspace-slug").fill(`support-${run}`);
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page.waitForURL(/\/workspace\/[0-9a-f-]{36}\/overview$/);
  await expect(page).toHaveURL(/\/overview$/);
  return { orgId, base: `${WEB}/org/${orgId}/workspace/${page.url().split("/workspace/")[1]!.split("/")[0]}` };
}
