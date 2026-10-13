// Browser gate for the palette demo's copy (bead paul-kinlan-me-brm), and the ONLY tier that
// asserts the RENDERED contrast.
//
// Why it exists: tests/palette-demo-legibility.test.mjs is a text read of one rule. It cannot see
// the cascade - the site inlines open-props + open-props-normalize-light + fonts + main into a
// single <style> bubble (layouts/partials/head.html), so a later bundled `:root{--gray-7:...}`
// override changes what renders while a source read still sees `var(--gray-7)`. That is review
// finding paul-kinlan-me-8lg, and this gate is the fix: it measures the computed colour and the
// contrast ratio on the real built page, and it SELF-CHECKS that it can see an override at all
// (case C below) so it cannot pass by measuring the wrong thing.
//
// A. COMPUTED SIZE AND CONTRAST on the real page. `.box p` must compute to >= 12px and >= 4.5:1
//    against the card's own computed background, at a desktop and a mobile viewport. The colours and
//    the ratio are printed, so the claim is auditable rather than asserted.
// B. LAYOUT IS NOT BROKEN. No caption is clipped, the page gains no horizontal overflow, every card
//    still renders, and the colour name and card surface are reported (the change is scoped to the
//    caption). The demo has no interactive element, which is checked too: no tap target exists to
//    break, rather than it being assumed.
// C. THE GATE IS CASCADE-SENSITIVE. The same page is served once more with a LATER
//    `:root{--gray-7:#aaaaaa}` override appended. The gate must then measure the caption colour
//    change and the contrast drop below 4.5 - which is precisely the mutation that a first-match
//    token resolver missed (it reported 8.18:1 while the page rendered 2.32:1). If this case ever
//    stops failing, the assertions in A are not evidence about the deployed cascade.
// D. THE SCHEME PROBE SAYS WHAT IT MEASURED. prefers-color-scheme: dark is emulated and the
//    actual computed colours of the root, body and caption are printed for both schemes, with
//    matchMedia reported, so the dark run is not dressed up as more than it shows.
//
// Run with:  timeout -k 30 300 nice -n 10 node tests/palette-demo.browser.mjs
//            node tests/palette-demo.browser.mjs --before-git origin/main   (also measure the
//            pre-change stylesheet, to show the defect the change fixed)
//            node tests/palette-demo.browser.mjs --out /tmp/my-evidence
// Needs a built site: run `npm run build`, or the fast gate, first. Chrome required, so it is NOT
// part of tools/fast-gate.sh (which dispatches tests/*.test.mjs) and is deliberately unmapped in
// tests/coverage-contract.json.
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const built = join(repoRoot, 'public');
const pagePath = '/material-colour-pallette/';
const pageFile = join(built, 'material-colour-pallette', 'index.html');
if (!existsSync(pageFile)) {
  throw new Error(`no built site at ${pageFile} - run \`npm run build\` (or the fast gate) first`);
}

const args = process.argv.slice(2);
const argValue = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
const outDir = argValue('--out') ?? '/tmp/palette-demo-evidence';
const beforeGit = argValue('--before-git');
mkdirSync(outDir, { recursive: true });

const materialCss = readFileSync(join(repoRoot, 'static/css/material.css'), 'utf8');
const beforeCss = beforeGit
  ? execFileSync('git', ['show', `${beforeGit}:static/css/material.css`], { cwd: repoRoot, encoding: 'utf8' })
  : null;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.xml': 'application/xml', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.webm': 'video/webm'
};

// What the server answers for this ring of the gate. `material` replaces the linked demo stylesheet,
// `override` appends a later custom-property declaration to the head so the gate can prove it sees
// the cascade (case C).
let material = materialCss;
let laterOverride = null;
const server = createServer((req, res) => {
  const path = new URL(req.url, 'http://127.0.0.1').pathname;
  if (path === '/css/material.css') {
    res.setHeader('content-type', 'text/css; charset=utf-8');
    return res.end(material);
  }
  let file = join(built, path);
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    if (laterOverride && file === pageFile) {
      // Later in document order than the inlined bundle, so it wins for the :root declaration.
      const html = readFileSync(file, 'utf8');
      res.setHeader('content-type', type);
      return res.end(html.replace('</head>', `<style>${laterOverride}</style></head>`));
    }
    res.setHeader('content-type', type);
    return res.end(readFileSync(file));
  } catch {
    res.statusCode = 404;
    return res.end('not part of this gate');
  }
});
const port = await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
const base = `http://127.0.0.1:${port}${pagePath}`;

// Runs in the page: computed styles of the card, the WCAG ratio from those computed colours, and the
// layout facts that say whether the caption's size broke anything.
const measure = () => {
  const channels = (value) => (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  const linear = (channel) => {
    const scaled = channel / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  const ratio = (a, b) => {
    const [light, dark] = [luminance(channels(a)), luminance(channels(b))].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
  };
  const cards = [...document.querySelectorAll('.box')];
  const captions = cards.map((card) => card.querySelector('p')).filter(Boolean);
  const caption = getComputedStyle(captions[0]);
  const heading = getComputedStyle(cards[0].querySelector('h1'));
  const card = getComputedStyle(cards[0]);
  const box = cards[0].getBoundingClientRect();
  return {
    rootFontSize: getComputedStyle(document.documentElement).fontSize,
    captionFontSize: caption.fontSize,
    captionColor: caption.color,
    captionContrast: Number(ratio(caption.color, card.backgroundColor).toFixed(2)),
    headingFontSize: heading.fontSize,
    headingColor: heading.color,
    cardBackground: card.backgroundColor,
    cardCount: cards.length,
    firstCardWidth: Math.round(box.width),
    firstCardHeight: Number(box.height.toFixed(1)),
    clippedCaptions: captions.filter((p) => p.scrollWidth > p.clientWidth + 1 || p.scrollHeight > p.clientHeight + 1).length,
    interactiveInCards: cards.reduce((n, c) => n + c.querySelectorAll('a,button,input,select,textarea,[tabindex]').length, 0),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    documentHeight: document.documentElement.scrollHeight,
    schemeProbe: {
      matchesDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      rootBackground: getComputedStyle(document.documentElement).backgroundColor,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      bodyColor: getComputedStyle(document.body).color
    },
    demoClip: (() => {
      const boxes = cards.slice(0, 9).map((c) => c.getBoundingClientRect());
      const left = Math.min(...boxes.map((b) => b.left)) + window.scrollX;
      const top = Math.min(...boxes.map((b) => b.top)) + window.scrollY;
      const right = Math.max(...boxes.map((b) => b.right)) + window.scrollX;
      const bottom = Math.max(...boxes.map((b) => b.bottom)) + window.scrollY;
      return { x: Math.max(0, left - 12), y: Math.max(0, top - 12), width: right - left + 24, height: bottom - top + 24 };
    })()
  };
};

let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${detail ? ` - ${detail}` : ''}`);
};

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const run = async (label, options = {}) => {
  material = options.material ?? materialCss;
  laterOverride = options.laterOverride ?? null;
  const results = {};
  try {
    for (const [viewportName, viewport] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.goto(base, { waitUntil: 'load' });
      const metrics = await page.evaluate(measure);
      if (options.screenshot) {
        await page.screenshot({ path: join(outDir, `${label}-${viewportName}-demo.png`), clip: metrics.demoClip, captureBeyondViewport: true });
      }
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
      const dark = await page.evaluate(measure);
      if (options.screenshot) {
        await page.screenshot({ path: join(outDir, `${label}-${viewportName}-demo-dark.png`), clip: dark.demoClip, captureBeyondViewport: true });
      }
      results[viewportName] = { ...metrics, dark };
      console.log(`  ${label}/${viewportName}: fontSize ${metrics.captionFontSize} (root ${metrics.rootFontSize}), colour ${metrics.captionColor}, `
        + `contrast ${metrics.captionContrast}:1 on ${metrics.cardBackground}, h1 ${metrics.headingFontSize} ${metrics.headingColor}, `
        + `card ${metrics.firstCardWidth}x${metrics.firstCardHeight}, clipped ${metrics.clippedCaptions}, interactive ${metrics.interactiveInCards}, `
        + `hOverflow ${metrics.horizontalOverflow}, docHeight ${metrics.documentHeight}`);
      console.log(`    scheme: light dark-match ${metrics.schemeProbe.matchesDark} (dark emulated ${dark.schemeProbe.matchesDark}), `
        + `root ${metrics.schemeProbe.rootBackground}->${dark.schemeProbe.rootBackground}, body ${metrics.schemeProbe.bodyBackground}->${dark.schemeProbe.bodyBackground}, `
        + `caption ${metrics.captionColor}->${dark.captionColor} (${metrics.captionContrast}:1 -> ${dark.captionContrast}:1)`);
      await page.close();
    }
  } finally {
    laterOverride = null;
    material = materialCss;
  }
  return results;
};

try {
  console.log('--- A/B. the deployed page, as built');
  const now = await run('after', { screenshot: true });
  const desktop = now.desktop;
  const mobile = now.mobile;

  check('the caption computes to at least 12px', parseFloat(desktop.captionFontSize) >= 12, `${desktop.captionFontSize} at a ${desktop.rootFontSize} root`);
  check('the caption computes at 4.5:1 or better on the card', desktop.captionContrast >= 4.5,
    `${desktop.captionContrast}:1, ${desktop.captionColor} on ${desktop.cardBackground}`);
  check('the mobile viewport agrees', parseFloat(mobile.captionFontSize) >= 12 && mobile.captionContrast >= 4.5,
    `${mobile.captionFontSize}, ${mobile.captionContrast}:1`);
  check('no caption is clipped', desktop.clippedCaptions === 0 && mobile.clippedCaptions === 0,
    `desktop ${desktop.clippedCaptions}, mobile ${mobile.clippedCaptions}`);
  check('the page gains no horizontal overflow', desktop.horizontalOverflow === false && mobile.horizontalOverflow === false,
    `desktop ${desktop.horizontalOverflow}, mobile ${mobile.horizontalOverflow}`);
  check('every card still renders', desktop.cardCount > 50 && desktop.cardCount === mobile.cardCount, `${desktop.cardCount} cards`);
  check('the demo contains no interactive element, so it has no tap target to break', desktop.interactiveInCards === 0,
    `${desktop.interactiveInCards} interactive element(s) inside .box`);
  check('the dark-scheme run is reported for what it measures (caption colour unchanged)',
    desktop.dark.schemeProbe.matchesDark === true && desktop.dark.captionColor === desktop.captionColor
      && desktop.dark.captionContrast === desktop.captionContrast,
    `matchMedia dark ${desktop.dark.schemeProbe.matchesDark}, caption ${desktop.captionColor} (${desktop.captionContrast}:1) -> `
    + `${desktop.dark.captionColor} (${desktop.dark.captionContrast}:1)`);
  console.log(`  card height ${desktop.firstCardHeight}px, document height ${desktop.documentHeight}px`);

  console.log('\n--- C. the gate can see a later bundled override (the mutation a source read misses)');
  const overridden = await run('cascade-override', { laterOverride: ':root{--gray-7:#aaaaaa}' });
  check('a later :root override changes the computed caption colour', overridden.desktop.captionColor !== desktop.captionColor,
    `${desktop.captionColor} -> ${overridden.desktop.captionColor}`);
  check('and the gate measures the dropped contrast, instead of reporting the ramp value', overridden.desktop.captionContrast < 4.5,
    `${overridden.desktop.captionContrast}:1 with the override (the ramp value would still read ${desktop.captionContrast}:1)`);

  if (beforeCss) {
    console.log(`\n--- --before-git ${beforeGit}: the stylesheet this bead replaced`);
    const before = await run('before', { material: beforeCss, screenshot: true });
    check(`before ${beforeGit}: the caption really was under the 12px floor`, before.desktop.captionFontSize === '11px',
      `${before.desktop.captionFontSize}`);
    check(`before ${beforeGit}: the caption really was under AA`, before.desktop.captionContrast < 4.5,
      `${before.desktop.captionContrast}:1 on ${before.desktop.cardBackground}`);
  }
} finally {
  await browser.close().catch(() => {});
  server.close();
}

console.log(`\nevidence: ${outDir}`);
console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll palette-demo browser checks passed');
process.exit(failures ? 1 : 0);
