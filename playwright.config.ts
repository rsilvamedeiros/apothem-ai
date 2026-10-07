import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

const WEB_PORT = 3000;
const SITE_PORT = 3100;
const API_PORT = 3001;

// The full-stack journey needs the sibling apothem-api checkout (ADR-008). Without it
// only the web and site smoke tests run.
const API_DIR = process.env.E2E_API_DIR ?? path.resolve(__dirname, "../apothem-api");
const apiAvailable = existsSync(path.join(API_DIR, "package.json"));
const API_URL = `http://127.0.0.1:${API_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Production builds are faster to serve than `next dev` and match what ships.
  webServer: [
    ...(apiAvailable
      ? [
          {
            // Real routes and services on in-memory Postgres with the mock model: no Docker, no secrets.
            command: `npm --prefix "${API_DIR}" run e2e:api`,
            url: `${API_URL}/health`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
        ]
      : []),
    {
      command: `npm run start --workspace=apps/web -- --port ${WEB_PORT}`,
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: !process.env.CI,
      env: { APOTHEM_API_URL: apiAvailable ? API_URL : `http://localhost:${API_PORT}` },
    },
    {
      command: `npm run start --workspace=apps/site -- --port ${SITE_PORT}`,
      url: `http://localhost:${SITE_PORT}`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
