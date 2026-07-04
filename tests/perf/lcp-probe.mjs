// Local Core Web Vitals probe against the PRODUCTION build (next start).
// Uses the already-installed Playwright chromium. Measures TTFB/FCP/LCP/CLS on a
// cold then warm load of key routes, and prints medians. INP needs field data /
// a user-flow trace — flagged, not synthesised.
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:3220';
const ROUTES = ['/', '/healthcare-assistants', '/care-staffing-agency-in-camden'];

function vitalsScript() {
  return new Promise((resolve) => {
    const out = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) out.lcp = e.startTime; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    let cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
      .observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0;
      out.cls = cls; out.ttfb = nav.responseStart || 0; out.fcp = fcp;
      out.domContentLoaded = nav.domContentLoadedEventEnd || 0;
      resolve(out);
    }, 2500);
  });
}

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const b = await chromium.launch();
const results = {};
for (const route of ROUTES) {
  const runs = [];
  for (let i = 0; i < 5; i++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); // mobile profile
    const p = await ctx.newPage();
    await p.goto(BASE + route, { waitUntil: 'load' });
    const v = await p.evaluate(vitalsScript);
    runs.push(v);
    await ctx.close();
  }
  results[route] = {
    lcp_ms: Math.round(median(runs.map((r) => r.lcp))),
    fcp_ms: Math.round(median(runs.map((r) => r.fcp))),
    ttfb_ms: Math.round(median(runs.map((r) => r.ttfb))),
    cls: +median(runs.map((r) => r.cls)).toFixed(3),
  };
}
await b.close();
console.log(JSON.stringify(results, null, 2));
// Budgets: LCP < 2500ms, CLS < 0.1. (INP < 200ms needs field/user-flow data — not measured here.)
for (const [r, m] of Object.entries(results)) {
  const lcpOk = m.lcp_ms < 2500, clsOk = m.cls < 0.1;
  console.log(`${r}: LCP ${m.lcp_ms}ms ${lcpOk ? 'PASS' : 'FAIL'} | CLS ${m.cls} ${clsOk ? 'PASS' : 'FAIL'}`);
}
