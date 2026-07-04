import { defineConfig, devices } from '@playwright/test';

/**
 * §14 WCAG 2.2 AA journey harness for Vigil Care Staffing.
 *
 * The 10 a11y journeys now live in the framework (`@vigil/web-framework/a11y`, promoted
 * EOS Q1.P1 §18) so Care + every future site inherit ONE harness. This config is the thin
 * consumer wrapper: it declares THIS site's interior routes (the specs are route-agnostic)
 * and points the desktop+mobile projects at the pinned framework copy. Staffing-local specs
 * (audience routing) stay under ./tests/routing.
 *
 * Boots `next dev` via webServer and runs against a real render of the framework Shell.
 */

// This site's interior render paths — supplied to the route-agnostic framework a11y suite
// (see node_modules/@vigil/web-framework/a11y/_routes.ts). Overridable via the environment.
process.env.A11Y_SERVICE_PATH ??= '/healthcare-assistants';
process.env.A11Y_LOCATION_PATH ??= '/care-staffing-agency-in-camden';
process.env.A11Y_ARTICLE_PATH ??= '/care-home-cpd';

const FRAMEWORK_A11Y = './node_modules/@vigil/web-framework/a11y';
const desktop = { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } };
const mobile = { ...devices['Pixel 5'] };

export default defineConfig({
  testDir: './tests',
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
    // Shared framework §14 a11y suite (43 journeys) — desktop + mobile = the 86/86 gate.
    { name: 'desktop', testDir: FRAMEWORK_A11Y, use: desktop },
    { name: 'mobile', testDir: FRAMEWORK_A11Y, use: mobile },
    // Staffing-local specs (audience-split routing QA gate).
    { name: 'routing-desktop', testDir: './tests/routing', use: desktop },
    { name: 'routing-mobile', testDir: './tests/routing', use: mobile },
  ],
  webServer: {
    // Dedicated port so the harness never collides with another local app on :3000.
    command: 'npm run dev -- -p 3210',
    url: 'http://localhost:3210',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
