# §14 Staffing WCAG 2.2 AA — deterministic journey backlog

Each cycle implements exactly the FIRST unchecked journey below: create the spec
under `tests/a11y/`, make it pass (`npx playwright test <file> --project=<proj>`),
commit, push to the safe branch, tick the box, then exit. One journey per cycle.

- [x] J1 skip-link + landmarks + heading order + Axe-clean (homepage, desktop) — `skip-link-landmarks.spec.ts`
- [ ] J2 keyboard-only primary nav — Tab order reaches every primary link + phone + CTA; visible focus ring; no keyboard trap (homepage, desktop) — `keyboard-nav.spec.ts`
- [ ] J3 mobile menu — open via keyboard (Enter on ☰), focus moves into the dialog, ESC closes it, focus is restored to the toggle (mobile) — `mobile-menu-focus.spec.ts`
- [ ] J4 focus order + visible focus across an interior service page — `service-page-focus.spec.ts`
- [ ] J5 320px reflow — no horizontal scroll at 320px width, all content reachable — `reflow-320.spec.ts`
- [ ] J6 200% zoom — content usable, no clipping at 200% (1280→640 css px) — `zoom-200.spec.ts`
- [ ] J7 form labels + error summary + invalid-field announcement on the enquiry funnel — `enquiry-form-a11y.spec.ts`
- [ ] J8 reduced-motion honored (prefers-reduced-motion) — `reduced-motion.spec.ts`
- [ ] J9 touch-target minimum 24x24 (WCAG 2.2 2.5.8) on nav + CTAs (mobile) — `touch-targets.spec.ts`
- [ ] J10 landmarks + heading order + Axe-clean on a location page + an article — `interior-axe.spec.ts`

## Source-fix items (framework — need a web-framework release, §18)
- [ ] J-FW1 WCAG 2.2 §2.5.8 target-size — footer tel/email (and social) contact links in the
      shared framework footer render < 24×24 CSS px. Fix at source in `@vigil/web-framework`
      Shell footer (inline-block + vertical padding to ≥24px), release, re-pin staffing + Care.
      Tracked-excluded in `skip-link-landmarks.spec.ts` until the release lands (NOT hidden).
