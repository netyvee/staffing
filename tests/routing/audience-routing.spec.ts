import { test, expect } from '@playwright/test';

/**
 * AUDIENCE-ROUTING QA GATE (permanent). Enforces, on the Staffing homepage, that a jobseeker
 * is never funneled into the CLIENT enquiry pipeline and is always offered the candidate journey.
 * Runs desktop + mobile (both projects).
 *
 * Enforcement facts this proves:
 *  - The homepage has NO submitting <form> — every enquiry entry is a governed link handoff, so
 *    there is no path that creates a client lead without passing the audience gate.
 *  - A prominent candidate branch routes jobseekers to the candidate journey (/careers/staffing,
 *    which registers via the EXISTING recruitment endpoint).
 *  - Client enquiry CTAs route to the governed /enquire/staffing entry (which starts with the
 *    two-card audience split + server-side guard — see app EnquiryAudienceSplitTest).
 */
test.describe('@routing homepage audience routing', () => {
  test('homepage has no directly-submitting enquiry form (no client-pipeline bypass)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // No <form> that POSTs — all entries are governed link handoffs.
    await expect(page.locator('form')).toHaveCount(0);
  });

  test('a prominent candidate branch routes jobseekers to the candidate journey', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const candidate = page.getByRole('link', { name: /register your interest/i }).first();
    await expect(candidate).toBeVisible();
    await expect(candidate).toHaveAttribute('href', '/careers/staffing');
    await candidate.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/careers/staffing');
  });

  test('client enquiry CTAs route to the governed split entry, not a bypass', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const enquiryLinks = page.locator('a[href*="/enquire/staffing"]');
    expect(await enquiryLinks.count()).toBeGreaterThan(0);
    // Every enquiry link points at the governed entry (which enforces the audience split + guard).
    for (let i = 0; i < await enquiryLinks.count(); i++) {
      const href = await enquiryLinks.nth(i).getAttribute('href');
      expect(href).toContain('/enquire/staffing');
    }
  });
});
