import { defineConfig, devices } from '@playwright/test';

/**
 * §14 WCAG 2.2 AA journey harness for Vigil Care Staffing.
 * Deterministic keyboard + semantic browser journeys (Axe-0 alone is NOT sufficient).
 * Boots `next dev` via webServer and runs against a real render of the framework Shell.
 */
export default defineConfig({
  testDir: './tests/a11y',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'tests/a11y/.results.json' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3210',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile',  use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    // Dedicated port so the harness never collides with another local app on :3000.
    command: 'npm run dev -- -p 3210',
    url: 'http://localhost:3210',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
