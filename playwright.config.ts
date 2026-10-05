import { defineConfig, devices } from "@playwright/test";

// Not 3000, so the suite never talks to a dev server someone has open.
const port = Number(process.env.E2E_PORT ?? 3187);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    // Own build directory: Next.js allows one `next dev` per distDir.
    env: { NEXT_DIST_DIR: ".next-e2e" },
  },
});
