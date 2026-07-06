#!/usr/bin/env node
/**
 * content-seo-check.mjs — CRM-driven content SEO integrity gate (SEO-04 item 2).
 *
 * The CRM auto-publishes each rendered page as content/pages/<slug>.json; the
 * catch-all app/[[...slug]] route renders them. There is no per-route app/**
 * metadata to lint, so this gate scans the COMMITTED content JSON instead — it is
 * the SEO analogue of the static sites' seo-integrity-check.mjs (which lints
 * the app-router page files). Same reporting shape: HARD blocks (H_*) fail the build,
 * SOFT warnings (S_*) report but never fail on their own.
 *
 * HARD BLOCKS (exit 1 — deploy must not proceed):
 *   H_MISSING_TITLE        indexable page has no / empty seo.title
 *   H_MISSING_DESCRIPTION  indexable page has no / empty seo.description
 *
 *   Fail-safe: the HARD title/description rules only enforce when EVERY current
 *   indexable page already has both. If any committed page is missing one, the
 *   rule self-downgrades to a SOFT warning for this run so the gate can never
 *   break a build over pre-existing content — it reports the gap instead of
 *   blocking. (Today all pages have both, so the HARD rules are active.)
 *
 * SOFT WARNINGS (reported; exit 0 on their own):
 *   S_MISSING_TITLE        (downgraded H_MISSING_TITLE — see fail-safe above)
 *   S_MISSING_DESCRIPTION  (downgraded H_MISSING_DESCRIPTION)
 *   S_TITLE_LENGTH         seo.title length outside ~30-60 chars
 *   S_DESC_LENGTH          seo.description length outside ~120-160 chars
 *   S_NO_FOCUS_KEYWORD     seo.focus_keyword missing / empty
 *   S_NO_SCHEMA_TYPE       seo.schema_type missing / empty
 *   S_NO_HERO_H1           no hero / heading-bearing section (no on-page H1)
 *   S_BLOG_SCHEMA          page_type=blog without seo.schema_type='Article'
 *   S_SERVICE_SCHEMA       page_type=service without seo.schema_type='Service'
 *
 * Indexable = not flagged noindex (seo.noindex / seo.robots index:false /
 * page.noindex / robots string containing "noindex"). noindex pages are skipped
 * entirely (they carry no SEO obligation).
 *
 * USAGE:
 *   node scripts/content-seo-check.mjs [--report-only]
 *        --report-only   print findings, always exit 0
 *
 * No dependencies beyond the Node stdlib (node:fs, node:path).
 */

import fs from 'node:fs';
import path from 'node:path';

// ───────────────────────────── args ───────────────────────────────────────
const args = process.argv.slice(2);
const REPORT_ONLY = args.includes('--report-only');

const ROOT = process.cwd();
const CONTENT_DIR = path.resolve(ROOT, 'content', 'pages');

// thresholds (approximate SERP guidance — soft only)
const TITLE_MIN = 30, TITLE_MAX = 60;
const DESC_MIN = 120, DESC_MAX = 160;

const C = { red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m', dim: '\x1b[2m', reset: '\x1b[0m' };

if (!fs.existsSync(CONTENT_DIR)) {
  console.error(`FATAL: content directory not found: ${CONTENT_DIR}`);
  process.exit(2);
}

// ───────────────────────────── helpers ────────────────────────────────────
const findings = { hard: [], soft: [] };
const addHard = (rule, page, message, fix) => findings.hard.push({ rule, page, message, fix });
const addSoft = (rule, page, message, fix) => findings.soft.push({ rule, page, message, fix });

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

/** A page is noindex if any of the common robots flags are set. */
function isNoindex(page) {
  const seo = page.seo || {};
  if (seo.noindex === true || page.noindex === true || page.no_index === true) return true;
  if (seo.index === false) return true;
  const robots = seo.robots ?? page.robots;
  if (robots && typeof robots === 'object' && robots.index === false) return true;
  if (typeof robots === 'string' && /noindex/i.test(robots)) return true;
  return false;
}

/** Does the page render an on-page H1? The catch-all renders a hero heading as the
 *  H1; treat a hero section OR any section carrying a heading/h1 field as H1-bearing. */
function hasHeroOrH1(page) {
  const sections = Array.isArray(page.sections) ? page.sections : [];
  return sections.some((s) => {
    if (!s || typeof s !== 'object') return false;
    if (s.type === 'hero') return true;
    const f = s.fields || {};
    return nonEmpty(f.heading) || nonEmpty(f.h1) || nonEmpty(f.title);
  });
}

// ───────────────────────── collect pages ──────────────────────────────────
const files = fs.readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort();

const pages = [];
for (const file of files) {
  const rel = `content/pages/${file}`;
  let json;
  try {
    json = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'));
  } catch (e) {
    // Unparseable committed content is a real integrity failure — block.
    addHard('H_MISSING_TITLE', rel, `Invalid JSON: ${e.message}`, 'Fix the malformed content JSON');
    continue;
  }
  pages.push({ file: rel, json, seo: json.seo || {}, noindex: isNoindex(json) });
}

const indexable = pages.filter((p) => !p.noindex);

// Fail-safe gate: only enforce the HARD title/description rules when EVERY current
// indexable page already satisfies them. Otherwise self-downgrade to soft so the
// gate never breaks a build over pre-existing content.
const enforceHard = indexable.every((p) => nonEmpty(p.seo.title) && nonEmpty(p.seo.description));

// ───────────────────────────── CHECKS ─────────────────────────────────────
for (const p of indexable) {
  const seo = p.seo;
  const pageType = p.json.page_type || null;

  // HARD (or self-downgraded soft): missing title / description
  if (!nonEmpty(seo.title)) {
    if (enforceHard) addHard('H_MISSING_TITLE', p.file, 'Missing / empty seo.title on an indexable page', 'Add a seo.title (~30-60 chars)');
    else addSoft('S_MISSING_TITLE', p.file, 'Missing / empty seo.title (downgraded: other pages also incomplete)', 'Add a seo.title (~30-60 chars)');
  }
  if (!nonEmpty(seo.description)) {
    if (enforceHard) addHard('H_MISSING_DESCRIPTION', p.file, 'Missing / empty seo.description on an indexable page', 'Add a seo.description (~120-160 chars)');
    else addSoft('S_MISSING_DESCRIPTION', p.file, 'Missing / empty seo.description (downgraded: other pages also incomplete)', 'Add a seo.description (~120-160 chars)');
  }

  // SOFT: title length
  if (nonEmpty(seo.title)) {
    const n = seo.title.trim().length;
    if (n < TITLE_MIN || n > TITLE_MAX) {
      addSoft('S_TITLE_LENGTH', p.file, `seo.title is ${n} chars (target ${TITLE_MIN}-${TITLE_MAX})`, 'Tune the title toward the target length');
    }
  }
  // SOFT: description length
  if (nonEmpty(seo.description)) {
    const n = seo.description.trim().length;
    if (n < DESC_MIN || n > DESC_MAX) {
      addSoft('S_DESC_LENGTH', p.file, `seo.description is ${n} chars (target ${DESC_MIN}-${DESC_MAX})`, 'Tune the description toward the target length');
    }
  }
  // SOFT: focus keyword
  if (!nonEmpty(seo.focus_keyword)) {
    addSoft('S_NO_FOCUS_KEYWORD', p.file, 'Missing seo.focus_keyword', 'Add a focus_keyword to anchor the page intent');
  }
  // SOFT: schema type
  if (!nonEmpty(seo.schema_type)) {
    addSoft('S_NO_SCHEMA_TYPE', p.file, 'Missing seo.schema_type', 'Add a schema_type (e.g. Service, Article, WebPage)');
  }
  // SOFT: no hero / H1
  if (!hasHeroOrH1(p.json)) {
    addSoft('S_NO_HERO_H1', p.file, 'No hero / heading-bearing section (page renders no H1)', 'Add a hero (or a heading) section');
  }
  // SOFT: page-type ↔ schema-type expectations
  if (pageType === 'blog' && seo.schema_type !== 'Article') {
    addSoft('S_BLOG_SCHEMA', p.file, `page_type=blog but schema_type='${seo.schema_type || 'none'}' (expected 'Article')`, "Set seo.schema_type='Article' for blog articles");
  }
  if (pageType === 'service' && seo.schema_type !== 'Service') {
    addSoft('S_SERVICE_SCHEMA', p.file, `page_type=service but schema_type='${seo.schema_type || 'none'}' (expected 'Service')`, "Set seo.schema_type='Service' for service pages");
  }
}

// ───────────────────────────── OUTPUT ─────────────────────────────────────
console.log(`\n=== Content SEO Integrity Check — dir=content/pages | pages=${pages.length} | ` +
  `indexable=${indexable.length} | noindex=${pages.length - indexable.length} | ` +
  `hard-rules=${enforceHard ? 'ENFORCING' : 'SELF-DOWNGRADED'}${REPORT_ONLY ? ' | mode=REPORT-ONLY' : ''} ===`);

if (findings.hard.length) {
  console.log(`\n${C.red}HARD BLOCKS (${findings.hard.length}):${C.reset}`);
  for (const f of findings.hard) {
    console.log(`  ${C.red}✗${C.reset} [${f.rule}] ${f.page}`);
    console.log(`      ${f.message}`);
    console.log(`      ${C.dim}fix: ${f.fix}${C.reset}`);
  }
} else {
  console.log(`\n${C.green}✓ No hard blocks.${C.reset}`);
}

if (findings.soft.length) {
  console.log(`\n${C.yellow}SOFT WARNINGS (${findings.soft.length}):${C.reset}`);
  for (const f of findings.soft) {
    console.log(`  ${C.yellow}!${C.reset} [${f.rule}] ${f.page} — ${f.message}`);
  }
} else {
  console.log(`\n${C.green}✓ No soft warnings.${C.reset}`);
}

// counts summary by rule
const byRule = {};
for (const f of [...findings.hard, ...findings.soft]) byRule[f.rule] = (byRule[f.rule] || 0) + 1;
const ruleSummary = Object.entries(byRule).sort().map(([r, n]) => `${r}=${n}`).join(', ') || 'none';
console.log(`\nRule counts: ${ruleSummary}`);
console.log(`Totals: ${findings.hard.length} hard, ${findings.soft.length} soft across ${indexable.length} indexable page(s).`);

// exit
if (REPORT_ONLY) { console.log(`\n${C.dim}REPORT-ONLY: exit 0.${C.reset}`); process.exit(0); }
if (findings.hard.length) { console.log(`\n${C.red}DEPLOY BLOCKED: ${findings.hard.length} hard block(s).${C.reset}`); process.exit(1); }
console.log(`\n${C.green}PASS.${C.reset}`); process.exit(0);
