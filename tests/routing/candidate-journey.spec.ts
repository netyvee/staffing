import { test, expect } from '@playwright/test';

/**
 * CANDIDATE-JOURNEY CLOSURE (permanent). Complements audience-routing.spec.ts (homepage)
 * by proving the rest of the jobseeker journey end-to-end: the careers hub and each
 * recruitment role page render, and every apply/candidate CTA routes to Vigil Care
 * Staffing's OWN recruitment endpoint (https://app.vigilservices.co.uk/careers/staffing).
 *
 * Fails closed: a candidate page that stops rendering, drops its apply CTA, or links to
 * another division breaks the gate.
 */

const RECRUITMENT = 'https://app.vigilservices.co.uk/careers/staffing';
// Cross-division endpoints that must NEVER appear on the staffing site (four-businesses rule).
const FOREIGN = ['/enquire/care', '/enquire/cleaning', '/enquire/security', '/careers/care', '/careers/cleaning', '/careers/security'];

const CANDIDATE_PAGES = ['/careers/staffing', '/healthcare-assistant-jobs', '/colleagues-support'];

for (const path of CANDIDATE_PAGES) {
  test(`candidate page ${path} renders and routes apply CTAs to the staffing recruitment endpoint`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const apply = page.locator(`a[href="${RECRUITMENT}"]`);
    expect(await apply.count()).toBeGreaterThan(0);

    // No cross-division links anywhere on a candidate page.
    for (const foreign of FOREIGN) {
      expect(await page.locator(`a[href*="${foreign}"]`).count()).toBe(0);
    }
  });
}

test('careers hub is reachable from the homepage candidate branch and lands on /careers/staffing', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const candidate = page.getByRole('link', { name: /register your interest/i }).first();
  await expect(candidate).toBeVisible();
  await candidate.click();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('/careers/staffing');
  // On the hub, the apply CTA continues to the recruitment endpoint.
  expect(await page.locator(`a[href="${RECRUITMENT}"]`).count()).toBeGreaterThan(0);
});
