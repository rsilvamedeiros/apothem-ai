import { defineConfig, devices } from "@playwright/test";

const WEB_PORT = 3000;
const SITE_PORT = 3100;

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
    {
      command: `npm run start --workspace=apps/web -- --port ${WEB_PORT}`,
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: !process.env.CI,
      env: { APOTHEM_API_URL: "http://localhost:3001" },
    },
    {
      command: `npm run start --workspace=apps/site -- --port ${SITE_PORT}`,
      url: `http://localhost:${SITE_PORT}`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
