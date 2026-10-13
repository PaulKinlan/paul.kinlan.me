// Browser check for the /ask-paul answer renderer (lib/ask-paul-answer.js).
//
// The unit tests assert on the generated markup; this one drives the real thing:
// it renders a hostile answer, serves that markup with the site's production
// Content-Security-Policy (which allows 'unsafe-inline' scripts, so it does not
// rescue an injection here), loads it in headless Chrome and fails if any
// injected payload executed.
//
// Not part of tools/fast-gate.sh - it needs a browser - but it is the evidence
// gate for changes to this renderer. Run with:
//   node tests/ask-paul.xss.browser.mjs
import { createServer } from 'node:http';
import { writeFile } from 'node:fs/promises';

import puppeteer from 'puppeteer';

import { renderAnswer } from '../lib/ask-paul-answer.js';

// An answer whose every interpolated field carries an executing payload.
const HOSTILE_ANSWER = {
  completion: '<script>window.__xss=5</script><img src=x onerror=window.__xss=6>',
  infos: [
    { url: 'javascript:window.__xss=1', title: '"><img src=x onerror=window.__xss=2>' },
    { url: 'data:text/html,<svg onload=window.__xss=3></svg>', title: '<svg onload=window.__xss=4></svg>' },
    { url: 'https://example.com/ok', title: 'A real link' },
  ],
};

// Same CSP the site serves for every route (vercel.json).
const CSP = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self' https://buttondown.email; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.commento.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com; frame-src https://www.youtube-nocookie.com https://www.youtube.com https://buttondown.email; manifest-src 'self'; upgrade-insecure-requests";

const server = createServer((_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Security-Policy', CSP);
  res.end(`<html><body><main>${currentPage}</main></body></html>`);
});

let currentPage = '';
let browser;

try {
  currentPage = renderAnswer(HOSTILE_ANSWER);

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
  if (!text.includes('<script>window.__xss=5</script>')) throw new Error('FAIL: completion text was not rendered as literal text');
  if (!text.includes('<svg onload=window.__xss=4></svg>')) throw new Error('FAIL: link title was not rendered as literal text');

  // 5. The legitimate link still works, so the fix has not disabled the feature.
  const goodLink = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find((el) => el.textContent === 'A real link');
    return a && a.href;
  });
  if (goodLink !== 'https://example.com/ok') throw new Error(`FAIL: legitimate link lost (got ${goodLink})`);

  const shot = '/tmp/ask-paul-xss-after.png';
  await writeFile(shot, await page.screenshot());
  console.log('PASS: payloads inert, no handler attributes, no javascript:/data: URLs, no execution, good link kept');
  console.log(`evidence: ${shot}`);
  console.log(`visible text sample: ${text.replace(/\s+/g, ' ').slice(0, 200)}`);
} finally {
  if (browser) await browser.close();
  server.close();
}
