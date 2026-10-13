// Browser evidence gate for the image loading hints + intrinsic dimensions sweep
// (paul-kinlan-me-e6c): built templates, in real Chrome, on real pages.
//
// The fast-gate sibling (tests/image-hints.test.mjs) pins the source contract on
// layouts/**. This one drives the BUILT site, because the contract is only worth
// anything if the output keeps it: the dimensions come from a resource lookup that
// can silently return nothing (a path that is not under static/, a format Hugo
// cannot measure), and a measured dimension is only useful if the browser reserves
// the box from it.
//
// Three things are checked per page:
//
//   A. GEOMETRY. The page is loaded with every image request aborted, then loaded
//      again normally, and each image near the fold must occupy the same box in
//      both. That second box is the one the reader gets; a box that grows when the
//      bytes arrive IS the layout shift, measured rather than inferred. Checking
//      only for a non-zero box is not enough: an image with no size information is
//      still given the CSS default 300x150, so it "reserves" space while shifting
//      hundreds of pixels. (Confirmed against the pre-change build.)
//   B. HINTS. Every image in the DOM carries loading and decoding, and knows its
//      size (width/height attributes or a CSS aspect-ratio).
//   C. LAZINESS. An image well below the fold must be marked lazy AND not have
//      been fetched - "the attribute is set" is not "the browser did not download
//      it".
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
// figure shortcode. `first` is the above-fold decision the template is supposed to
// have made - the home feed's only image is a decorative, hidden avatar.
const PAGES = [
  { path: '/', what: 'home feed', first: 'lazy' },
  { path: '/tags/web-development/', what: 'tag listing', first: 'lazy' },
  { path: '/telecom-fraud-detection/', what: 'content figures', first: 'eager' },
  { path: '/future-of-web-on-mobile-coldfront-conf/', what: 'slide deck', first: 'eager' },
  { path: '/whither-flash/', what: 'figure shortcode', first: 'eager' },
];

const VIEWPORT = { width: 412, height: 823 };
// How far down the page the geometry comparison reaches, in viewports. Anything
// beyond this is usually still lazy and unloaded in the second pass, which the
// `loaded` flag below skips anyway.
const GEOMETRY_REACH = 2;
// Within a pixel: sub-pixel rounding must not make this flap, but a box that
// changed size by anything a reader could see must.
const PIXEL_TOLERANCE = 1;

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

// The box every image occupies right now, in document coordinates, plus whether
// its bytes have arrived.
async function geometry(page) {
  return page.evaluate(() =>
    [...document.images].map((img) => {
      const rect = img.getBoundingClientRect();
      return {
        src: img.getAttribute('src'),
        rendered: img.getClientRects().length > 0,
        top: Math.round(rect.top + scrollY),
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        loaded: img.naturalWidth > 0,
      };
    })
  );
}

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
  let geometryChecked = 0;
  let imagesSeen = 0;

  for (const { path, what, first } of PAGES) {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    page.setDefaultTimeout(30_000);
    let blockImages = true;
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (blockImages && request.resourceType() === 'image') request.abort();
      else request.continue();
    });

    // --- Pass A: images blocked. Which boxes are already reserved? ---------------
    await page.goto(`${origin}${path}`, { waitUntil: 'networkidle0' });
    const reserved = await geometry(page);
    const unreserved = reserved
      .filter((img) => img.rendered && (img.width <= 0 || img.height <= 0))
      .map((img) => `${img.src}: no box at all with the image blocked`);

    // --- Pass B: normal load. Same boxes, plus the hints and laziness -------------
    blockImages = false;
    await page.goto(`${origin}${path}`, { waitUntil: 'load' });
    const loaded = await geometry(page);
    const found = await page.evaluate(
      ({ expectedFirst, reachMultiplier }) => {
        const problems = [];
        const images = [...document.images];
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
          // prefetches a little further on fast connections), so a fetch down here
          // means the hint was ignored rather than that the threshold reached it.
          const top = img.getBoundingClientRect().top + scrollY;
          if (loading === 'lazy' && top > innerHeight * reachMultiplier && img.naturalWidth > 0) {
            problems.push(`${src}: loading="lazy" but already fetched ${Math.round(top)}px down the page`);
          }
        });
        return {
          problems,
          images: images.length,
          lazy: images.filter((img) => img.getAttribute('loading') === 'lazy').length,
        };
      },
      { expectedFirst: first, reachMultiplier: 3 }
    );

    // --- The shift itself: reserved box vs the box the reader ends up with -------
    const shiftProblems = [];
    let checked = 0;
    reserved.forEach((before, index) => {
      const after = loaded[index];
      if (!before.rendered || !after?.loaded) return; // nothing to compare
      if (before.top > VIEWPORT.height * GEOMETRY_REACH) return; // below the reach, likely still lazy
      checked += 1;
      if (
        Math.abs(before.height - after.height) > PIXEL_TOLERANCE ||
        Math.abs(before.width - after.width) > PIXEL_TOLERANCE
      ) {
        shiftProblems.push(
          `${before.src}: reserved ${before.width}x${before.height} before loading, occupies ${after.width}x${after.height} after - that difference is layout shift`
        );
      }
    });

    geometryChecked += checked;
    imagesSeen += found.images;
    const forPage = [...unreserved, ...shiftProblems, ...found.problems];
    if (forPage.length) errors.push(`${path} (${what}):\n    - ${forPage.join('\n    - ')}`);
    console.log(
      `  ${path.padEnd(46)} ${String(found.images).padStart(3)} images, ${String(found.lazy).padStart(3)} lazy, ` +
        `${String(checked).padStart(2)} boxes compared before/after load`
    );
    await page.close();
  }

  // Guard against a vacuous pass: pages with no images, or a comparison that never
  // ran because nothing was ever loaded, would otherwise look green.
  assert.ok(imagesSeen >= 100, `only ${imagesSeen} images were examined`);
  assert.ok(geometryChecked >= 3, `only ${geometryChecked} images had their reserved box compared with the loaded one`);
  if (errors.length) throw new Error(`image hints missing in the built site:\n  ${errors.join('\n  ')}`);

  console.log(
    `\nPASS in ${browserVersion}: ${imagesSeen} images across ${PAGES.length} pages carry loading/decoding + a known ` +
      `size, ${geometryChecked} near-fold images reserve exactly the box they end up occupying, and below-fold images ` +
      'are not fetched.'
  );
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.close();
}
