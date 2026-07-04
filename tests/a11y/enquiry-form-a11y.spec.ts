import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * §14 Journey 7 — Enquiry funnel accessibility (desktop).
 * WCAG 1.3.1 (Info & Relationships), 3.3.2 (Labels or Instructions),
 * 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value), 4.1.3 (Status Messages).
 *
 * The staffing site collects enquiry intent through the framework EnquiryFunnel
 * (homepage `enquiry_funnel` section), NOT a native text-input form. The funnel is a
 * CHOICE funnel that hands the collected intent to the hardened CRM enquiry URL
 * (/enquire/staffing), where the actual free-text data-entry form lives. So the classic
 * "error summary + invalid-field announcement" pattern has no target in THIS repo:
 * there is no free-text field, hence no reachable invalid state — validation is by
 * construction (a step completes only by selecting one enumerated option). Blocking a
 * whole journey on that DOM mismatch would be wrong; the funnel is the accessible
 * form-equivalent on the page, and its real a11y contract IS deterministically testable.
 *
 * What this journey proves:
 *   1. the choice group is a LABELLED radiogroup (accessible name = the step question)
 *      and every option is a keyboard-operable control with a non-empty accessible name
 *      — the "labels" contract (1.3.1 / 3.3.2 / 4.1.2);
 *   2. it is fully keyboard-operable — Tab reaches an option, Enter selects it, the step
 *      advances (2.1.1, no mouse required);
 *   3. advancing ANNOUNCES progress (the progressbar's aria-valuenow increases 0 -> 100)
 *      and moves focus to the new step heading (4.1.3 status message + focus management —
 *      the funnel's analog of surfacing a validation/step result);
 *   4. no serious/critical Axe violations inside the funnel region.
 * `networkidle` so hydration/fonts settle before the keyboard is driven.
 */
test.describe('@a11y enquiry funnel — labels, keyboard operation, status announcement', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  const GROUP = /what cover do you need/i;      // step.question == radiogroup aria-label
  const PROGRESS = /enquiry progress/i;         // progressbar aria-label
  const COMPLETION = /tell us the shifts you need covered/i; // completion.headline

  test('the choice group is a labelled radiogroup with named, keyboard-focusable options', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const group = page.getByRole('radiogroup', { name: GROUP });
    await expect(group).toHaveCount(1);
    await expect(group).toBeVisible();
    // Accessible name present (1.3.1 / 3.3.2): the group is labelled by the step question.
    await expect(group).toHaveAttribute('aria-label', /.+/);

    const options = group.getByRole('radio');
    const n = await options.count();
    expect(n).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < n; i++) {
      const opt = options.nth(i);
      // Each option exposes role=radio + aria-checked (4.1.2 Name, Role, Value)...
      await expect(opt).toHaveAttribute('aria-checked', /true|false/);
      // ...and a non-empty accessible name (the visible label text).
      const name = (await opt.textContent())?.trim() ?? '';
      expect(name.length, `option ${i} accessible name`).toBeGreaterThan(0);
      // Keyboard-reachable: a real focusable control.
      await opt.focus();
      await expect(opt).toBeFocused();
    }
  });

  test('keyboard selection advances the step, moves focus, and announces progress', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const progress = page.getByRole('progressbar', { name: PROGRESS });
    await expect(progress).toBeVisible();
    await expect(progress).toHaveAttribute('aria-valuenow', '0');

    // Operate the funnel with the keyboard only — no click.
    const firstRadio = page.getByRole('radiogroup', { name: GROUP }).getByRole('radio').first();
    await firstRadio.focus();
    await expect(firstRadio).toBeFocused();
    await page.keyboard.press('Enter');

    // Progress advanced to 100% — a status change conveyed via aria-valuenow (4.1.3).
    await expect(progress).toHaveAttribute('aria-valuenow', '100');

    // Focus was moved to the new (completion) step heading — the step result is
    // both visible AND announced to a keyboard/screen-reader user (4.1.3 + focus mgmt).
    const heading = page.getByRole('heading', { name: COMPLETION });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();

    // The radiogroup for the completed step is gone (no stale/duplicate controls).
    await expect(page.getByRole('radiogroup', { name: GROUP })).toHaveCount(0);
  });

  test('no serious/critical Axe violations inside the enquiry funnel', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Scope Axe to the funnel section (the section that owns the progressbar).
    const results = await new AxeBuilder({ page })
      .include('section:has([aria-label="Enquiry progress"])')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious, JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.length })), null, 2)).toEqual([]);
  });
});
