// Browser evidence gate for the image loading hints + intrinsic dimensions sweep
// (paul-kinlan-me-e6c): built templates, in real Chrome, on real pages.
//
// The fast-gate sibling (tests/image-hints.test.mjs) pins the source contract on
// layouts/**. This one drives the BUILT site, because the contract is only worth
// anything if the output keeps it: the dimensions depend on a resource lookup that
// can silently return nothing (a path that is not under static/, a format Hugo
// cannot measure), and a resolved dimension is only useful if the browser reserves
// the box from it.
//
// Two passes per page:
//
//   A. Images BLOCKED. If every rendered image still occupies a non-zero box, no
//      image can ever shift the layout when its bytes arrive. Before this change an
//      article hero (`w-full h-auto`) had zero height here; now it has the ratio
//      from its width/height attributes. This is the CLS question asked directly,
//      instead of measuring a noisy CLS score.
//   B. Normal load. Every image must carry the hints, and an image well below the
//      fold must be marked lazy AND not have been fetched - "we set the attribute"
//      is not the same as "the browser did not download it".
//
// Run with:  node tests/image-hints.browser.mjs
//            SITE_DIR=<dir> node tests/image-hints.browser.mjs   (serve an
//            already-built site instead of building one - used to show this gate
//            discriminating: pointed at a pre-change build it fails)
// Not part of tools/fast-gate.sh: it needs Chrome and a full Hugo build (~15s).
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
// Built into the repo's own gitignored output directory rather than a temp copy:
// the site is ~800MB of images, and a second copy per run filled this VM's disk
// while this change was being written. `public/` is what tools/fast-gate.sh
// produces anyway, and each lane has its own worktree.
const siteDir = process.env.SITE_DIR ?? join(repoRoot, 'public');

// Pages chosen to exercise every template that emits an <img>: the home feed, a
// tag listing (aspect-video cards), an article whose 60 figures are hand-written
// content, a slide deck (two images per slide, first one above the fold) and the
// figure shortcode. The `expect.first` is the above-fold decision the template is
// supposed to have made.
const PAGES = [
  { path: '/', what: 'home feed', expect: { first: 'lazy' } },
  { path: '/tags/web-development/', what: 'tag listing', expect: { first: 'lazy' } },
  { path: '/telecom-fraud-detection/', what: 'content figures', expect: { first: 'eager' } },
  { path: '/future-of-web-on-mobile-coldfront-conf/', what: 'slide deck', expect: { first: 'eager' } },
  { path: '/whither-flash/', what: 'figure shortcode', expect: { first: 'eager' } },
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

let server;
let browser;
let browserVersion;

try {
  // 1. Build the site the way the gate does (hugo, not `npm run build`: the
  //    committed Tailwind output must not be rewritten here).
  const hugo = join(repoRoot, 'node_modules', '.bin', 'hugo');
  assert.ok(existsSync(hugo), `the repo's pinned hugo is missing: ${hugo}`);
  if (!process.env.SITE_DIR) {
    const build = spawnSync(hugo, ['--quiet', '--destination', siteDir], {
      cwd: repoRoot,
      encoding: 'utf8',
      timeout: 180_000,
    });
    assert.equal(build.status, 0, `hugo build failed (status ${build.status}):\n${build.stdout}${build.stderr}`);
  }
  assert.ok(existsSync(join(siteDir, 'index.html')), `no index.html in ${siteDir}`);

  // 2. Serve it.
  server = createServer((req, res) => {
    const requested = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    let file = join(siteDir, requested);
    try {
      if (statSync(file).isDirectory()) file = join(file, 'index.html');
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
      return;
    }
    // Never serve outside the build directory.
    if (!file.startsWith(siteDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('forbidden');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  const port = await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
  const origin = `http://127.0.0.1:${port}`;

  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  browserVersion = await browser.version();
  const errors = [];

  for (const { path, what, expect } of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 823 }); // a phone: the listing cards are above the fold here
    page.setDefaultTimeout(30_000);

    // --- Pass A: with images blocked, is every box already reserved? -------------
    let blockImages = true;
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (blockImages && request.resourceType() === 'image') request.abort();
      else request.continue();
    });
    await page.goto(`${origin}${path}`, { waitUntil: 'networkidle0' });
    const unreserved = await page.evaluate(() =>
      [...document.images]
        .filter((img) => img.getClientRects().length > 0) // rendered at all
        .map((img) => {
          const rect = img.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0
            ? null
            : `${img.getAttribute('src')} reserves no box with the image blocked (${Math.round(rect.width)}x${Math.round(rect.height)})`;
        })
        .filter(Boolean)
    );

    // --- Pass B: normal load, hints present and below-fold images not fetched ----
    blockImages = false;
    await page.goto(`${origin}${path}`, { waitUntil: 'load' });
    const found = await page.evaluate((expectedFirst) => {
      const problems = [];
      const images = [...document.images];
      const lazy = images.filter((img) => img.getAttribute('loading') === 'lazy').length;
      images.forEach((img, index) => {
        const src = img.getAttribute('src');
        const loading = img.getAttribute('loading');
        if (!loading) problems.push(`${src}: no loading attribute`);
        if (index === 0 && loading !== expectedFirst) {
          problems.push(`${src}: first image is loading="${loading}", expected "${expectedFirst}"`);
        }
        if (img.getAttribute('decoding') !== 'async') {
          problems.push(`${src}: decoding="${img.getAttribute('decoding')}", expected "async"`);
        }
        const dimensioned =
          (img.hasAttribute('width') && img.hasAttribute('height')) ||
          getComputedStyle(img).aspectRatio !== 'auto';
        if (!dimensioned) problems.push(`${src}: neither width/height attributes nor a CSS aspect-ratio`);
        // Well past the widest lazy-loading margin Chrome uses (~1250px, and it
        // pre-fetches a little further on fast connections), so a fetch here means
        // the hint was ignored rather than that the threshold reached it.
        const top = img.getBoundingClientRect().top + scrollY;
        if (loading === 'lazy' && top > innerHeight * 3 && img.naturalWidth > 0) {
          problems.push(`${src}: loading="lazy" but already fetched at ${Math.round(top)}px down the page`);
        }
      });
      return { problems, images: images.length, lazy };
    }, expect.first);

    const forPage = [...unreserved, ...found.problems];
    if (forPage.length) errors.push(`${path} (${what}):\n    - ${forPage.join('\n    - ')}`);
    console.log(
      `  ${path.padEnd(46)} ${String(found.images).padStart(3)} images, ${String(found.lazy).padStart(3)} lazy, ` +
        `${unreserved.length === 0 ? 'all boxes reserved' : `${unreserved.length} UNRESERVED`}`
    );
    await page.close();
  }

  // A page with no images would pass vacuously; make sure the sample still has some.
  assert.ok(PAGES.length === 5, 'the page sample shrank');
  if (errors.length) throw new Error(`image hints missing in the built site:\n  ${errors.join('\n  ')}`);

  console.log(`\nPASS: 5 pages in ${browserVersion}, every rendered image reserves its box with images blocked, ` +
    'every image carries loading/decoding + a known size, and below-fold images are not fetched.');
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.close();
}
