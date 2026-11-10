// Browser acceptance for the real streamed Edge handler. Run explicitly with:
//   node tests/ask-paul-error.browser.mjs
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import puppeteer from 'puppeteer';

import { evidencePath } from '../tools/browser-gate/evidence.mjs';

const dir = mkdtempSync(join(tmpdir(), 'ask-paul-browser-'));
const bundle = join(dir, 'handler.mjs');
let browser;
let server;
// The /ask-paul page ships under its own strict policy (paul-kinlan-me-f4y2); serving it
// without those headers would let a policy regression pass this spec.
const ASK_PAUL_CSP = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  .headers.find((rule) => rule.source === '/(ask-paul.*)')
  ?.headers.find((header) => header.key === 'Content-Security-Policy')?.value;
assert.ok(ASK_PAUL_CSP, 'vercel.json must carry a dedicated CSP rule for /ask-paul');
const originalFetch = globalThis.fetch;
let requests = 0;

try {
  execFileSync('node_modules/.bin/esbuild', [
    'api/ask-paul.ts', '--bundle', '--format=esm', '--platform=neutral', `--outfile=${bundle}`,
  ]);
  const { default: handler } = await import(bundle);
  globalThis.fetch = async () => {
    requests++;
    if (requests === 1) return new Promise(() => {});
    return Response.json({ completion: 'A working answer', infos: [] });
  };
  server = createServer(async (req, res) => {
    // The handler moved its aria-busy flip into an external asset (paul-kinlan-me-f4y2),
    // so the spec has to serve that asset: a 404 here leaves <main aria-busy="true">
    // forever and the failure looks like a page bug (paul-kinlan-me-rtpy).
    if (req.url === '/javascripts/ask-paul-ready.js') {
      res.writeHead(200, {
        'content-type': 'text/javascript; charset=utf-8',
        ...(ASK_PAUL_CSP ? { 'content-security-policy': ASK_PAUL_CSP } : {}),
      });
      res.end(readFileSync(new URL('../static/javascripts/ask-paul-ready.js', import.meta.url)));
      return;
    }
    if (!req.url.startsWith('/ask-paul')) { res.writeHead(404).end(); return; }
    try {
      const response = await handler(new Request(`http://127.0.0.1${req.url}`));
      res.writeHead(response.status, {
        'content-type': 'text/html; charset=utf-8',
        ...(ASK_PAUL_CSP ? { 'content-security-policy': ASK_PAUL_CSP } : {}),
      });
      Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  });
  const port = await new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const navigation = page.goto(`http://127.0.0.1:${port}/ask-paul?query=hello`, { waitUntil: 'load' });
  await page.waitForSelector('.loader', { visible: true });
  assert.equal(await page.$eval('main', el => el.getAttribute('aria-busy')), 'true');
  assert.equal(await page.$eval('.loader', el => el.getAttribute('role')), 'status');
  assert.equal(await page.$eval('.loader', el => el.getAttribute('aria-live')), 'polite');
  await page.screenshot({ path: evidencePath('ask-paul-error-loading.png') });
  await navigation; // The upstream never settles: the deadline must close the stream.
  assert.equal(await page.$eval('.loader', el => getComputedStyle(el).display), 'none');
  assert.equal(await page.$eval('main', el => el.getAttribute('aria-busy')), 'false');
  assert.match(await page.$eval('[role="alert"]', el => el.innerText), /taking too long.*try again/i);
  assert.equal(await page.$eval('[role="alert"]', el => el.getAttribute('role')), 'alert');
  assert.equal(await page.$eval('[role="alert"] input', el => el.value), 'Try again');
  await page.screenshot({ path: evidencePath('ask-paul-error-after.png') });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('[role="alert"] input'),
  ]);
  assert.match(await page.$eval('.completion', el => el.innerText), /A working answer/);
  assert.equal(await page.$eval('main', el => el.getAttribute('aria-busy')), 'false');
  assert.equal(await page.$eval('.loader', el => getComputedStyle(el).display), 'none');
  await page.screenshot({ path: evidencePath('ask-paul-error-retry.png') });
  console.log('PASS: loader during hung upstream; alert after timeout; answer after retry; aria-busy cleared');
  console.log(`Evidence: ${evidencePath('ask-paul-error-loading.png')} ${evidencePath('ask-paul-error-after.png')} ${evidencePath('ask-paul-error-retry.png')}`);
} finally {
  globalThis.fetch = originalFetch;
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  rmSync(dir, { recursive: true, force: true });
}
