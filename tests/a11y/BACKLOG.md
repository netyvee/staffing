# §14 Staffing WCAG 2.2 AA — deterministic journey backlog

Each cycle implements exactly the FIRST unchecked journey below: create the spec
under `tests/a11y/`, make it pass (`npx playwright test <file> --project=<proj>`),
commit, push to the safe branch, tick the box, then exit. One journey per cycle.

- [x] J1 skip-link + landmarks + heading order + Axe-clean (homepage, desktop) — `skip-link-landmarks.spec.ts`
- [x] J2 keyboard-only primary nav — Tab order reaches every primary link + phone + CTA; visible focus ring; no keyboard trap (homepage, desktop) — `keyboard-nav.spec.ts`
- [x] J3 mobile menu — open via keyboard (Enter on ☰), focus moves into the dialog, ESC closes it, focus is restored to the toggle (mobile) — `mobile-menu-focus.spec.ts`
- [x] J4 focus order + visible focus across an interior service page — `service-page-focus.spec.ts`
- [x] J5 320px reflow — no horizontal scroll at 320px width, all content reachable — `reflow-320.spec.ts`
- [x] J6 200% zoom — content usable, no clipping at 200% (1280→640 css px) — `zoom-200.spec.ts`
- [x] J8 reduced-motion honored (prefers-reduced-motion) — `reduced-motion.spec.ts`
- [x] J10 landmarks + heading order + Axe-clean on a location page + an article — `interior-axe.spec.ts`
- [x] J7 enquiry-funnel a11y — labelled radiogroup + named options, keyboard-only selection, focus moves to the new step heading, progress announced via aria-valuenow (0→100), funnel-region Axe-clean — `enquiry-form-a11y.spec.ts`. NOTE: the staffing funnel is a CHOICE funnel that hands off to the CRM `/enquire/staffing`; it has no free-text field, so "error summary/invalid-field announcement" has no target here — validation is by construction. No framework fix needed (funnel already meets 1.3.1/3.3.2/2.1.1/4.1.2/4.1.3).
- [x] J9 touch-target minimum 24x24 (WCAG 2.2 2.5.8) on nav + CTAs (mobile) — `touch-targets.spec.ts` (framework v0.4.4)

## Source-fix items (framework — need a web-framework release, §18)
- [x] J-FW1 WCAG 2.2 §2.5.8 target-size — FIXED at source in `@vigil/web-framework` Shell (footer
      tel/email/column/legal links get a ≥24px inline tap box; ☰ toggle 44×44). Released v0.4.4;
      staffing re-pinned v0.4.4; guard test in framework `shellv2.test.tsx`; J1 gate re-tightened
      (no exclusion). Care unaffected (pinned v0.3.2).
