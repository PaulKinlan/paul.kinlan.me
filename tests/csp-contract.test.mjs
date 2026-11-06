// CSP contract (paul-kinlan-me-qz62, scoped after review finding on the first
// cut): the strict policy protects exactly the API-rendered third-party-content
// pages - /api/activitypub-html and /api/mentions - whose bodies come from
// remote federation data. Those pages get a CSP whose default-src is 'none'
// with no script-src directive at all, so NO script can execute on them under
// any browser interpretation.
//
// The site-wide policy stays permissive ON PURPOSE: authored posts embed demo
// <script> through goldmark unsafe=true (9 pages at review time) and the
// ask-paul edge page renders its own inline scripts - a blanket
// no-unsafe-inline CSP blocked Paul's authored content and the ask-paul UI
// (review FAIL on b0d7e164). 'unsafe-inline' there is a documented accepted
// risk for first-party authored content; the injection surface the audit row
// targets (third-party federation HTML) is covered by the strict path rule.
//
// Hygiene contract kept: layouts/ ship no inline executable scripts and no
// on*= handler attributes (all site chrome lives in external assets), and
// every external script host stays allowlisted.
// Run with: node --test tests/csp-contract.test.mjs
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const layoutsRoot = new URL('../layouts', import.meta.url).pathname;
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

const cspValue = (rule) => rule.headers.find((h) => h.key === 'Content-Security-Policy')?.value;
const cspRules = vercel.headers.filter((h) => h.headers.some((x) => x.key === 'Content-Security-Policy'));

const STRICT_SOURCES = ['/(api/activitypub-html.*|api/mentions.*)'];

test('the third-party-content renderers get a CSP that forbids all script execution', () => {
  for (const source of STRICT_SOURCES) {
    const rule = cspRules.find((r) => r.source === source);
    assert.ok(rule, `a dedicated CSP rule must exist for ${source}`);
    const csp = cspValue(rule);
    assert.match(csp, /default-src 'none'/, `${source}: default-src must be 'none'`);
    assert.doesNotMatch(csp, /script-src|script-src-elem|script-src-attr/, `${source}: no script directive of any kind - combined with default-src 'none', no script can execute`);
    // style-src 'unsafe-inline' is deliberately present (the page's <style>
    // block): style injection cannot execute script, and script execution is
    // what the audit row targets.
  }
});

test('the strict rule precedes the site-wide rule, so the specific path wins', () => {
  const orderedSources = vercel.headers.map((r) => r.source);
  const strictIndex = orderedSources.indexOf(STRICT_SOURCES[0]);
  const globalIndex = orderedSources.indexOf('/(.*)');
  assert.ok(strictIndex !== -1 && globalIndex !== -1, 'both rules exist');
  assert.ok(strictIndex < globalIndex, 'the strict API rule must be defined before the catch-all');
});

test('the site-wide rule stays usable for authored content', () => {
  const globalCsp = cspValue(vercel.headers.find((r) => r.source === '/(.*)'));
  assert.match(globalCsp, /script-src 'self' 'unsafe-inline'/,
    'authored posts embed demo scripts (goldmark unsafe=true), so the global rule keeps inline execution for first-party content');
  assert.match(globalCsp, /'inline-speculation-rules'/, 'speculation rules stay authorised');
  assert.match(globalCsp, /script-src 'self' 'unsafe-inline' 'inline-speculation-rules' https:\/\/www\.googletagmanager\.com/,
    'the third-party analytics/commento hosts stay explicitly allowlisted');
});

// ---------------------------------------------------------------------------
// Hygiene inventory over layouts/ (site chrome is external; data blocks are
// inert and exempt).
const htmlFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
};
walk(layoutsRoot);

test('layouts ship no inline executable scripts and no on*= handler attributes', () => {
  const inline = [];
  for (const file of htmlFiles) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      const attrs = match[1];
      const content = match[2];
      if (/\bsrc\s*=/.test(attrs)) continue;
      const type = /\btype\s*=\s*"([^"]*)"/.exec(attrs)?.[1] ?? '';
      if (type !== '' && type !== 'text/javascript' && !type.startsWith('module')) continue;
      if (content.trim() === '') continue;
      inline.push({ file, preview: content.trim().slice(0, 60) });
    }
    for (const match of source.matchAll(/<[a-z][^>]*?\son[a-z]+\s*=\s*(["'])[^>]*?>/gi)) {
      inline.push({ file, preview: `inline handler attribute: ${match[0].slice(0, 60)}` });
    }
  }
  assert.deepEqual(inline, [],
    'site chrome stays in external assets (assets/javascripts/*) - inline scripts in layouts are ' +
    'blocked on the strict API pages and would silently split behaviour: ' + JSON.stringify(inline));
});

test('external script tags only reference hosts the global script-src allowlist names', () => {
  const globalCsp = cspValue(vercel.headers.find((r) => r.source === '/(.*)'));
  const external = [];
  for (const file of htmlFiles) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/<script\b([^>]*)>/g)) {
      const attrs = match[1];
      if (!/\bsrc\s*=/.test(attrs)) continue;
      external.push({ file, src: /\bsrc\s*=\s*"([^"]*)"/.exec(attrs)?.[1] ?? '' });
    }
  }
  assert.ok(external.length >= 1, 'the inventory found the external scripts');
  const sources = new Set((globalCsp.match(/script-src\s+([^;]+)/)?.[1] ?? '')
    .split(/\s+/)
    .filter((s) => !s.startsWith("'"))
    .map((s) => s.replace(/^https?:\/\//, '')));
  for (const script of external) {
    if (script.src.startsWith('/') || script.src.includes('{{')) {
      // Same-origin assets (e.g. a Hugo-piped, minified resource) or an
      // unrendered Hugo template value: both covered by 'self' at runtime.
      continue;
    }
    const host = new URL(script.src).host;
    const allowed = [...sources].some(
      (source) => host === source || host.endsWith(`.${source}`)
    );
    assert.ok(allowed, `${script.file}: external script host "${host}" is not in script-src`);
  }
});
