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

import { pathToRegexp } from 'path-to-regexp';

const layoutsRoot = new URL('../layouts', import.meta.url).pathname;
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

const cspValue = (rule) => rule.headers.find((h) => h.key === 'Content-Security-Policy')?.value;
const cspRules = vercel.headers.filter((h) => h.headers.some((x) => x.key === 'Content-Security-Policy'));

// The federation renderers allow NO script execution at all (no script
// directive + default-src 'none'). /ask-paul (f4y2) renders first-party app
// scripts only: script-src 'self', never 'unsafe-inline', never a third-party
// script host - the page renders third-party model output.
const STRICT_SOURCES = ['/(api/activitypub-html.*|api/mentions.*)'];
// paul-kinlan-me-dp5q: the page is served at TWO URLs. vercel.json rewrites only
// the exact path /ask-paul, and a Vercel api/ file is also reachable at its own
// path (/api/ask-paul), which the middleware matcher deliberately excludes from
// /api. The original '/(ask-paul.*)' matched the first and not the second, so a
// request to /api/ask-paul inherited the catch-all policy ('unsafe-inline' plus
// three third-party script hosts). The rule must therefore cover both, and the
// test below derives the second URL from the rewrite rather than assuming it.
const ASK_PAUL_SOURCE = '/(ask-paul.*|api/ask-paul.*)';

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

test('the strict rules precede the site-wide rule, so the specific paths win', () => {
  const orderedSources = vercel.headers.map((r) => r.source);
  const globalIndex = orderedSources.indexOf('/(.*)');
  assert.ok(globalIndex !== -1, 'the catch-all rule exists');
  for (const source of [...STRICT_SOURCES, ASK_PAUL_SOURCE]) {
    const index = orderedSources.indexOf(source);
    assert.ok(index !== -1, `${source}: rule exists`);
    assert.ok(index < globalIndex, `${source}: strict rule must be defined before the catch-all`);
  }
});

test('the ask-paul model-output page allows only first-party scripts', () => {
  const rule = cspRules.find((r) => r.source === ASK_PAUL_SOURCE);
  assert.ok(rule, 'a dedicated CSP rule must exist for /ask-paul');
  const csp = cspValue(rule);
  assert.match(csp, /script-src 'self'/, '/ask-paul: only same-origin scripts');
  assert.doesNotMatch(/script-src\s+[^;]*/.exec(csp)?.[0] ?? '', /'unsafe-inline'|https:\/\//,
    '/ask-paul: no inline scripts and no third-party script hosts');
});

// paul-kinlan-me-dp5q: the contract asserted the RULE (its contents, its order)
// but never that the rule's pattern MATCHES a URL the page is served at, which is
// how a strict policy sat next to an unprotected path for weeks. The matcher is
// the one Vercel itself uses for `source` (path-to-regexp, pinned by the
// @vercel/routing-utils override), not a hand-written model of it.
test('every URL a model-output page is served at is matched by its strict rule', () => {
  const matches = (source, url) => pathToRegexp(source).test(url);

  // The second URL is DERIVED: whatever vercel.json rewrites /ask-paul to must
  // also be protected, so renaming the function cannot silently reopen the hole.
  const askPaulRewrite = vercel.rewrites.find((r) => r.source === '/ask-paul');
  assert.ok(askPaulRewrite, 'vercel.json rewrites /ask-paul to its function');
  const servedPath = askPaulRewrite.destination.replace(/\.tsx?$/, '');
  assert.match(servedPath, /^\/api\//, `the rewrite points at an api function (got ${servedPath})`);

  for (const [label, source, urls] of [
    ['/ask-paul page', ASK_PAUL_SOURCE, ['/ask-paul', '/ask-paul/', servedPath]],
    ['federation renderers', STRICT_SOURCES[0], ['/api/activitypub-html', '/api/mentions']],
  ]) {
    for (const url of urls) {
      assert.ok(matches(source, url),
        `${label}: ${source} must match ${url} - an unmatched served path inherits the catch-all policy ('unsafe-inline' and third-party script hosts)`);
    }
  }

  // The same check must FAIL for the pattern this bead replaced, so the assertion
  // is known to be able to catch the regression rather than passing vacuously.
  assert.equal(pathToRegexp('/(ask-paul.*)').test(servedPath), false,
    'the pre-dp5q pattern did not match the function path - the regression this test guards');
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
// Frame contract (paul-kinlan-me-l00b): an authored <iframe> whose host is not
// in the site-wide frame-src allowlist is blocked on production with no visible
// error - the demo just never loads. The magic-iframes post's airhorner.com
// embed and the email-summary-service project page's val.town embed were both
// dead that way while the unit suites stayed green. Fenced code samples and
// `inline code` are stripped first: a tutorial can print an <iframe> without
// asking for that host to be frameable.
const contentRoot = new URL('../content', import.meta.url).pathname;

const contentFiles = [];
const walkContent = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkContent(path);
    else if (/\.(md|markdown|html)$/.test(entry.name)) contentFiles.push(path);
  }
};
walkContent(contentRoot);

const stripNonProse = (source) => source
  .replace(/```[\s\S]*?```/g, '')
  .replace(/~~~[\s\S]*?~~~/g, '')
  .replace(/`[^`\n]*`/g, '')
  .replace(/<!--[\s\S]*?-->/g, '');

// Mirror CSP host-source semantics instead of string suffixing
// (paul-kinlan-me-6sd3). A bare host-source matches THAT host only - subdomains
// need an explicit '*.' prefix - and a protocol-relative src ("//host/path") is
// resolved to https by the browser and subject to frame-src like any other URL.
// Both departures were fail-open: the gate stayed green while production blocked
// the embed, which is the silent failure this guard exists to catch.
const parseFrameSources = (csp) => (csp.match(/frame-src\s+([^;]+)/)?.[1] ?? '')
  .split(/\s+/)
  .filter(Boolean)
  .map((token) => {
    if (token.startsWith("'")) return { token: token.toLowerCase(), kind: 'keyword' };
    const scheme = /^([a-z][a-z0-9+.-]*:)/i.exec(token)?.[1]?.toLowerCase();
    // A scheme with no authority ('data:', 'blob:') is a scheme-source, not a host
    // source: it authorises that scheme, not a host (paul-kinlan-me-gu5a).
    if (scheme && !token.slice(scheme.length).startsWith('//')) {
      return { token: scheme, kind: 'keyword' };
    }
    return {
      kind: 'host',
      scheme,
      host: (scheme ? token.slice(scheme.length) : token).replace(/^\/\//, '').replace(/\/$/, '').toLowerCase(),
    };
  });

const hostMatches = (sourceHost, host) => {
  if (sourceHost === '*') return true;
  // '*.example.com' matches subdomains only; CSP does not let it match example.com.
  if (sourceHost.startsWith('*.')) return host.endsWith(`.${sourceHost.slice(2)}`);
  return host === sourceHost;
};

// Whether the browser would let this iframe load under the given frame-src.
const frameSourceAllows = (csp, src) => {
  // 'self' covers same-origin relative sources and unrendered template values;
  // about:blank inherits and srcdoc documents are not network loads at all.
  // '//host/path' is NOT a relative path - it is protocol-relative and must go
  // through the host check, or every protocol-relative embed fails open
  // (paul-kinlan-me-gu5a: /^(\/|...) matched '//evil.example/x').
  if (!src || src.includes('{{') || /^#/.test(src) || /^\.\.?\//.test(src)) return true;
  if (/^\/(?!\/)/.test(src)) return true;
  if (/^about:blank/i.test(src)) return true;
  let url;
  try {
    // Protocol-relative '//host/path' resolves against the page's scheme, i.e. https.
    url = new URL(src, 'https://paul.kinlan.me/');
  } catch {
    return false;
  }
  const scheme = url.protocol.toLowerCase();
  const sources = parseFrameSources(csp);
  if (scheme === 'data:' || scheme === 'blob:' || scheme === 'javascript:') {
    return sources.some((entry) => entry.kind === 'keyword' && entry.token === scheme);
  }
  return sources.some((entry) => entry.kind === 'host'
    && (entry.scheme === undefined || entry.scheme === scheme)
    && hostMatches(entry.host, url.host.toLowerCase()));
};

test('every authored iframe is frameable under the site-wide CSP', () => {
  const globalCsp = cspValue(vercel.headers.find((r) => r.source === '/(.*)'));

  const blocked = [];
  for (const file of [...contentFiles, ...htmlFiles]) {
    const source = stripNonProse(readFileSync(file, 'utf8'));
    for (const match of source.matchAll(/<iframe\b([^>]*)>/gi)) {
      const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(match[1])?.[1] ?? '';
      if (!frameSourceAllows(globalCsp, src.trim())) blocked.push({ file, src });
    }
  }

  assert.deepEqual(blocked, [],
    'these embeds are blocked by the site-wide CSP frame-src on production: ' + JSON.stringify(blocked));
});

test('the frame scan mirrors the browser: exact hosts, wildcards, and protocol-relative srcs (paul-kinlan-me-6sd3)', () => {
  const exact = "default-src 'self'; frame-src https://example.com";
  assert.equal(frameSourceAllows(exact, 'https://example.com/x'), true);
  assert.equal(frameSourceAllows(exact, 'https://www.example.com/x'), false,
    'a bare host-source does not cover subdomains, so this embed would be blocked');
  assert.equal(frameSourceAllows(exact, '//example.com/x'), true,
    'a protocol-relative src is resolved to https and must be checked, not skipped');
  assert.equal(frameSourceAllows(exact, '//evil.example/x'), false,
    'protocol-relative is not a relative path: an unlisted host must be rejected (paul-kinlan-me-gu5a)');
  assert.equal(frameSourceAllows(exact, '//www.example.com/x'), false,
    'protocol-relative to a subdomain of an exact host is blocked by the browser too');

  const wildcard = "default-src 'self'; frame-src https://*.example.com";
  assert.equal(frameSourceAllows(wildcard, 'https://a.example.com/x'), true);
  assert.equal(frameSourceAllows(wildcard, 'https://example.com/x'), false,
    "'*.example.com' does not cover the bare domain");

  const noData = "default-src 'self'; frame-src https://example.com";
  assert.equal(frameSourceAllows(noData, 'data:text/html,<p>hi</p>'), false,
    'a data: frame is blocked unless the policy lists it');
  const withData = "default-src 'none'; frame-src data:";
  assert.equal(frameSourceAllows(withData, 'data:text/html,<p>hi</p>'), true,
    'a listed scheme-source authorises that scheme (paul-kinlan-me-gu5a)');
  assert.equal(frameSourceAllows(withData, 'https://example.com/x'), false,
    'a scheme-source authorises no host');
  assert.equal(frameSourceAllows(noData, 'about:blank'), true, 'about:blank is not a network load');
  assert.equal(frameSourceAllows(noData, '/local/embed.html'), true, "'self' covers same-origin srcs");
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
