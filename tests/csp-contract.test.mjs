// CSP contract (paul-kinlan-me-qz62): the site ships ZERO inline executable
// scripts and script-src carries no 'unsafe-inline'. Inline scripts cannot be
// reliably hash-pinned because Hugo's --minify pass rewrites inline script
// content at build time, so the site instead keeps all JavaScript in external
// same-origin assets (script-src 'self') and allowlisted third parties.
//
// This is the drift guard: adding an inline <script> to any layout fails this
// suite, and the browser would block it too, so the build fails first.
// External script tags must only reference hosts the script-src allowlist
// names. Data blocks (<script type="application/ld+json">,
// type="speculationrules") are inert and exempt: CSP script-src does not
// govern them.
// Run with: node --test tests/csp-contract.test.mjs
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const layoutsRoot = new URL('../layouts', import.meta.url).pathname;
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

const cspHeader = vercel.headers
  .find((entry) => entry.headers.some((h) => h.key === 'Content-Security-Policy'))
  ?.headers.find((h) => h.key === 'Content-Security-Policy')?.value;
assert.ok(cspHeader, 'vercel.json must define a Content-Security-Policy header');

const directive = (name) => cspHeader.match(new RegExp(`(?:^|;)\\s*${name}\\s+([^;]+)`))?.[1]?.trim() ?? '';
const scriptSrc = directive('script-src');

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
};
walk(layoutsRoot);

test("script-src carries no 'unsafe-inline' and no inline hashes to maintain", () => {
  assert.match(scriptSrc, /'self'/, 'script-src must keep the same-origin source');
  assert.doesNotMatch(scriptSrc, /'unsafe-inline'/,
    "script-src must not allow inline execution wholesale (paul-kinlan-me-qz62)");
});

test('no layout ships an inline executable script', () => {
  const inline = [];
  for (const file of htmlFiles) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      const attrs = match[1];
      const content = match[2];
      if (/\bsrc\s*=/.test(attrs)) continue;
      const type = /\btype\s*=\s*"([^"]*)"/.exec(attrs)?.[1] ?? '';
      // Data blocks are inert (JSON-LD, speculation rules): not executable JS.
      if (type !== '' && type !== 'text/javascript' && !type.startsWith('module')) continue;
      if (content.trim() === '') continue;
      inline.push({ file, preview: content.trim().slice(0, 60) });
    }
    // Inline event-handler attributes (onsubmit=, onclick=, ...) are executable
    // script too - blocked by script-src-attr once 'unsafe-inline' is gone. The
    // first cut of this guard scanned only <script> elements and missed the
    // newsletter form's onsubmit (review finding tdel); this loop is the fix.
    for (const match of source.matchAll(/<[a-z][^>]*?\son[a-z]+\s*=\s*(["'])[^>]*?>/gi)) {
      inline.push({ file, preview: `inline handler attribute: ${match[0].slice(0, 60)}` });
    }
  }
  assert.deepEqual(inline, [],
    'inline executable scripts and on*= handler attributes are blocked by the CSP - move the code ' +
    'into an external asset (assets/javascripts/*) or a data block: ' + JSON.stringify(inline));
});

test('external script tags only reference hosts the script-src allowlist names', () => {
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
  // Allowlist sources may carry a scheme (https://cdn.commento.io); compare by
  // host so either spelling matches.
  const sources = new Set(scriptSrc.split(/\s+/)
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
