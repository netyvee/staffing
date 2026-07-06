# WS-G — Staffing local performance baseline (2026-07-04)

## Method
Production build (`next build` → `next start -p 3220`), warmed. `tests/perf/lcp-probe.mjs`
drives Playwright chromium (mobile profile 390×844), 5 runs/route, reports medians.

## Build
- 44 pages, ALL Static/SSG (prerendered HTML). No SSR request latency.
- First Load JS: 105 kB (main route), 87.3 kB shared. Within the "good" (<130 kB) band.

## Core Web Vitals (median, warmed production, local)
| Route | LCP | CLS | TTFB | FCP | Budget |
|-------|-----|-----|------|-----|--------|
| `/` | **192 ms** | **0** | 14 ms | 192 ms | LCP<2500 ✅ CLS<0.1 ✅ |
| `/healthcare-assistants` | **132 ms** | **0** | 9 ms | 132 ms | ✅ ✅ |
| `/care-staffing-agency-in-camden` | **136 ms** | **0** | 8 ms | 132 ms | ✅ ✅ |

## Finding — the "3–7s LCP" is isolated
The earlier 3–7s figure was `next dev` **first-compile** (dev compiles routes on demand). The
PRODUCTION build renders these static-prerendered pages in ~130–190 ms locally with zero layout
shift. Server-startup vs first-compile vs warm-render were the variables; production warm-render is
the real user path and it is well inside budget.

## Not measured here (honest boundary)
- **INP < 200 ms** needs field data or a scripted user-flow trace — flagged, not asserted. The pages
  are near-static with minimal JS, so INP risk is low, but this is not proof.
- **Vercel-hosted** LCP (real CDN, network, cold starts, real images/fonts over the wire) is
  preview-deploy-proven only — credential/deploy-dependent, not local.
