// Browser check for the WebMention renderer (api/mentions.js).
//
// The unit tests in tests/mentions.test.mjs assert on the generated markup; this
// one drives the real thing: it renders a hostile mention, serves the page with
// production's Content-Security-Policy (which allows 'unsafe-inline' scripts, so
// it does not rescue an injection here), loads it in headless Chrome and fails
// if any injected payload executed.
//
// Not part of tools/fast-gate.sh - it needs a browser - but it is the evidence
// gate for changes to this file. Run with:
//   node tests/mentions.xss.browser.mjs
import { createServer } from 'node:http';
import { writeFile } from 'node:fs/promises';

import puppeteer from 'puppeteer';

import { render } from '../api/mentions.js';

const PAGE_URL = 'https://paul.kinlan.me/some-post/';

// A mention whose every interpolated field carries an executing payload.
const HOSTILE_MENTION = {
  'wm-property': 'in-reply-to',
  url: 'javascript:window.__xss=1',
  author: {
    name: 'x"><img src=x onerror=window.__xss=2>',
    url: 'javascript:window.__xss=3',
    photo: 'data:image/svg+xml,<svg onload=window.__xss=4></svg>',
  },
  content: { text: '<script>window.__xss=5</script><img src=x onerror=window.__xss=6>' },
};

// Same CSP the site serves for every route (vercel.json).
const CSP = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'";

const server = createServer((_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Security-Policy', CSP);
  res.end(currentPage);
});

let currentPage = '';
let browser;

try {
  const output = await render([HOSTILE_MENTION], `${PAGE_URL}"><script>window.__xss=0</script>`);
  currentPage = await new Response(output).text();

  const port = await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0' });

  // 1. Nothing executed. Loaded event handlers fire before networkidle0.
  const xss = await page.evaluate(() => globalThis.__xss);
  if (xss !== undefined) throw new Error(`FAIL: injected payload executed (window.__xss=${xss})`);

  // 2. No element in the rendered DOM carries an event-handler attribute.
  const handlers = await page.evaluate(() =>
    [...document.querySelectorAll('*')].flatMap((el) =>
      [...el.attributes].filter((a) => a.name.startsWith('on')).map((a) => `${el.tagName.toLowerCase()}[${a.name}]`)));
  if (handlers.length) throw new Error(`FAIL: event-handler attributes in the DOM: ${handlers.join(', ')}`);

  // 3. No href/src resolved to a non-http(s) scheme.
  const urls = await page.evaluate(() =>
    [...document.querySelectorAll('[href],[src]')].map((el) => el.getAttribute('href') || el.getAttribute('src')));
  const bad = urls.filter((u) => u && !/^https?:\/\//i.test(u));
  if (bad.length) throw new Error(`FAIL: non-http(s) URLs emitted: ${bad.join(', ')}`);

  // 4. The payload is still on the page, as inert visible text.
  const text = await page.evaluate(() => document.body.innerText);
  if (!text.includes('<script>window.__xss=5</script>')) throw new Error('FAIL: payload text was not rendered as literal text');

  const shot = '/tmp/mentions-xss-after.png';
  await writeFile(shot, await page.screenshot());
  console.log(`PASS: payloads inert, no handler attributes, no javascript:/data: URLs, no execution`);
  console.log(`evidence: ${shot}`);
  console.log(`visible text sample: ${text.replace(/\s+/g, ' ').slice(0, 160)}`);
} finally {
  if (browser) await browser.close();
  server.close();
}
