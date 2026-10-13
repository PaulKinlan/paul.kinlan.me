// Browser check for the WebMention endpoint's request handling (api/mentions.js).
//
// tests/mentions.test.mjs asserts the rules against the handler with a stubbed
// transport; this one drives the same handler over real HTTP in headless Chrome:
// a valid request renders the mentions, and a crafted `url`/`count` is answered
// 400 in the browser without any request reaching webmention.io. The transport is
// stubbed so the run is offline and deterministic, but the request path, the
// response statuses and the rendered page are production's.
//
// Not part of tools/fast-gate.sh - it needs a browser - but it is the evidence
// gate for changes to this file. Run it bounded, and from the repo root:
//   timeout -k 30 170 nice -n 10 node tests/mentions-input.browser.mjs
import { createServer } from 'node:http';
import { writeFile } from 'node:fs/promises';

import puppeteer from 'puppeteer';

import { createMentionsHandler } from '../api/mentions.js';

// One like (rendered as an <img> whose author is its alt text) and one reply
// (rendered as a link and a blockquote), so both render paths are exercised.
const MENTIONS = [
  { 'wm-property': 'like-of', url: 'https://example.com/like/1',
    author: { name: 'Browser Evidence', url: 'https://example.com/@evidence', photo: 'https://example.com/e.png' } },
  { 'wm-property': 'in-reply-to', url: 'https://example.com/reply/1',
    author: { name: 'Reply Author', url: 'https://example.com/@reply', photo: 'https://example.com/r.png' },
    content: { text: 'the renderer still works' } }
];

// Every URL the handler asks the transport for. Nothing else may reach it.
const upstream = [];
const handler = createMentionsHandler(async (url) => {
  upstream.push(String(url));
  return new Response(JSON.stringify({ children: MENTIONS }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname !== '/api/mentions') {
    res.statusCode = 404;
    return res.end('not the endpoint under test');
  }
  await handler({ query: Object.fromEntries(url.searchParams), headers: req.headers }, res);
});

let browser;
let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${detail ? ` - ${detail}` : ''}`);
};

try {
  const port = await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
  const base = `http://127.0.0.1:${port}/api/mentions`;
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // 1. A valid request renders both mentions.
  const valid = await page.goto(`${base}?url=https://paul.kinlan.me/post/&count=25`, { waitUntil: 'domcontentloaded' });
  const text = await page.evaluate(() => document.body.innerText);
  const html = await page.content();
  check('a valid request is 200 and renders the mentions',
    valid.status() === 200 && html.includes('alt="Browser Evidence"')
      && text.includes('Reply Author') && text.includes('the renderer still works'),
    `status ${valid.status()}`);

  const sent = new URL(upstream[0]);
  check('the upstream query carries exactly one target and one page size',
    sent.origin + sent.pathname === 'https://webmention.io/api/mentions.jf2'
      && sent.searchParams.getAll('target').length === 1
      && sent.searchParams.get('target') === 'https://paul.kinlan.me/post/'
      && sent.searchParams.get('per-page') === '25', upstream[0]);

  check('every emitted link is a real http(s) URL',
    [...html.matchAll(/(?:href|src)="([^"]+)"/g)].every(([, value]) => /^https?:\/\//.test(value)));
  await writeFile('/tmp/mentions-input-valid.png', await page.screenshot({ fullPage: true }));

  // 2. A crafted target is refused in the browser and never reaches webmention.io.
  const before = upstream.length;
  const craftedTarget = await page.goto(`${base}?url=javascript:alert(1)`, { waitUntil: 'domcontentloaded' });
  check('a javascript: target answers 400 in the browser', craftedTarget.status() === 400, `status ${craftedTarget.status()}`);

  // 3. A crafted count, encoded so it would have been a second upstream parameter.
  const craftedCount = await page.goto(`${base}?url=https://paul.kinlan.me/post/&count=1%26per-page%3D100000`,
    { waitUntil: 'domcontentloaded' });
  check('a crafted count answers 400 in the browser', craftedCount.status() === 400, `status ${craftedCount.status()}`);
  check('a refused request never reaches webmention.io', upstream.length === before,
    `upstream calls: ${upstream.length - before}`);

  // 4. A bare request keeps its documented default instead of failing.
  const bare = await page.goto(base, { waitUntil: 'domcontentloaded' });
  check('a bare request is 200 and uses the default target', bare.status() === 200
    && new URL(upstream[upstream.length - 1]).searchParams.get('target') === 'https://paul.kinlan.me/',
    `status ${bare.status()}`);

  console.log(`evidence: /tmp/mentions-input-valid.png; upstream URLs: ${JSON.stringify(upstream)}`);
  if (failures) throw new Error(`${failures} browser check(s) failed`);
  console.log('PASS: valid requests render, crafted requests are 400, webmention.io only ever sees the endpoint path');
} finally {
  if (browser) await browser.close();
  server.close();
}
