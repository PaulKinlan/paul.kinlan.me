// Browser acceptance for the real streamed Edge handler. Run explicitly with:
//   node tests/ask-paul-error.browser.mjs
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import puppeteer from 'puppeteer';

const dir = mkdtempSync(join(tmpdir(), 'ask-paul-browser-'));
const bundle = join(dir, 'handler.mjs');
let browser;
let server;
const originalFetch = globalThis.fetch;
let failUpstream;
let requests = 0;

try {
  execFileSync('node_modules/.bin/esbuild', [
    'api/ask-paul.ts', '--bundle', '--format=esm', '--platform=neutral', `--outfile=${bundle}`,
  ]);
  const { default: handler } = await import(bundle);
  globalThis.fetch = async () => {
    requests++;
    if (requests === 1) return new Promise((_resolve, reject) => { failUpstream = reject; });
    return Response.json({ completion: 'A working answer', infos: [] });
  };
  server = createServer(async (req, res) => {
    if (!req.url.startsWith('/ask-paul')) { res.writeHead(404).end(); return; }
    try {
      const response = await handler(new Request(`http://127.0.0.1${req.url}`));
      res.writeHead(response.status, { 'content-type': 'text/html; charset=utf-8' });
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
  await page.screenshot({ path: '/tmp/ask-paul-error-loading.png' });
  failUpstream(new Error('upstream down'));
  await navigation;
  assert.equal(await page.$eval('.loader', el => getComputedStyle(el).display), 'none');
  assert.equal(await page.$eval('main', el => el.getAttribute('aria-busy')), 'false');
  assert.match(await page.$eval('[role="alert"]', el => el.innerText), /could not answer/);
  assert.equal(await page.$eval('[role="alert"] input', el => el.value), 'Try again');
  await page.screenshot({ path: '/tmp/ask-paul-error-after.png' });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('[role="alert"] input'),
  ]);
  assert.match(await page.$eval('.completion', el => el.innerText), /A working answer/);
  assert.equal(await page.$eval('main', el => el.getAttribute('aria-busy')), 'false');
  assert.equal(await page.$eval('.loader', el => getComputedStyle(el).display), 'none');
  await page.screenshot({ path: '/tmp/ask-paul-error-retry.png' });
  console.log('PASS: loader before settlement; alert and retry after failure; answer after retry; aria-busy cleared');
  console.log('Evidence: /tmp/ask-paul-error-loading.png /tmp/ask-paul-error-after.png /tmp/ask-paul-error-retry.png');
} finally {
  globalThis.fetch = originalFetch;
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  rmSync(dir, { recursive: true, force: true });
}
