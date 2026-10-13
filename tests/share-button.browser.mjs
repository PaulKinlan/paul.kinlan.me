// Browser evidence gate for static/javascripts/share-button.js, the minified
// Web Component the 2017 share-button posts load (factory-delta
// paul-kinlan-me-il8). The fast-tier sibling (tests/share-button.test.mjs) pins
// the shipped source contract; this one drives the real asset in real Chrome,
// because both claims under review are only true of a running browser:
//
//   A. NO PER-CONNECT STYLE READ. connectedCallback used to call
//      getComputedStyle() twice per instance to copy the button's native
//      background into --share-button-background-color. Once a page has more
//      than one instance, each connect reads style after the previous instance's
//      write, which forces a style recalculation per connect. The counter below
//      is installed through evaluateOnNewDocument, so it is in place before the
//      asset is parsed, and it counts EVERY getComputedStyle call the page makes
//      while 50 instances are upgraded. It is self-checked first: a counter that
//      never increments would make the whole check vacuous.
//
//   B. THE BUTTON STILL RENDERS. Removing the JS read is only safe if the
//      shadow stylesheet now supplies the same default, so the default case
//      compares the shadow button's computed background-color against a plain
//      <button> on the same page, and the themed case pins the documented
//      inline --share-button-background-color override.
//
//   C. ANDROID GATING IS CAPABILITY-BASED. navigator.userAgent.indexOf('Android')
//      is replaced by navigator.userAgentData.platform (UA-CH) with a one-time
//      cached UA fallback. The four cases below separate the two paths: an
//      Android platform that no longer appears in the reduced UA string must
//      still show the fallback, and a legacy UA string that says "Android" on a
//      non-Android platform must not. Each case asserts the page really reports
//      the platform and UA it claims to, so no case can pass vacuously.
//
// Run with:  timeout -k 30 170 nice -n 10 node tests/share-button.browser.mjs
//            SHARE_BUTTON_JS=<path> node tests/share-button.browser.mjs
//            (used to point this gate at a pre-change copy of the asset, to show
//            that it fails there - the counter and cases C/D do)
// Not part of tools/fast-gate.sh: it needs Chrome, so it is run by hand when the
// asset changes.
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const scriptPath = process.env.SHARE_BUTTON_JS ?? join(repoRoot, 'static/javascripts/share-button.js');
const source = readFileSync(scriptPath, 'utf8');

// How many instances the counter check upgrades. One would already trip the old
// code (it read the style even for a single instance); 50 is what makes the
// read-after-write flush show up as an actual cost rather than a rounding error.
const INSTANCES = 50;

const PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>share-button gate</title></head>
<body>
<button id="plain">Share This</button>
<share-button id="host" href="https://paul.kinlan.me/example/" text="Example title">Share This</share-button>
<share-button id="themed" style="--share-button-background-color:rgb(1, 2, 3)"
  href="https://paul.kinlan.me/example/" text="Example title">Share This</share-button>
<script src="/share-button.js"></script>
</body></html>`;

// UA-CH metadata is what navigator.userAgentData.platform reports, and it is
// deliberately decoupled from the UA string in cases C and D.
const ua = (platform, uaString, mobile) => [
  uaString,
  {
    brands: [{ brand: 'Chromium', version: '140' }, { brand: 'Google Chrome', version: '140' }],
    fullVersion: '140.0.7339.0',
    platform,
    platformVersion: '14.0.0',
    architecture: '',
    model: mobile ? 'Pixel 7' : '',
    mobile
  }
];

const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.0 Mobile Safari/537.36';
// Chrome's reduced UA string on Android is deliberately less specific; a build
// that dropped the "Android" token entirely is what this case models.
const REDUCED_UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.0 Mobile Safari/537.36';
const DESKTOP_UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.0 Safari/537.36';

const CASES = [
  { name: 'default (headless Chrome)', uaOverride: null, platformIsAndroid: false, uaHasAndroid: false, androidVisible: false },
  { name: 'UA-CH Android + Android UA string', uaOverride: ua('Android', ANDROID_UA, true), platformIsAndroid: true, uaHasAndroid: true, androidVisible: true },
  // The reduced string here is the one a stripped UA reports: no "Android" token
  // at all. Only the capability data can decide this case.
  { name: 'UA-CH Android + reduced UA (no "Android" token)', uaOverride: ua('Android', DESKTOP_UA, true), platformIsAndroid: true, uaHasAndroid: false, androidVisible: true },
  { name: 'UA-CH Windows + legacy "Android" UA string', uaOverride: ua('Windows', ANDROID_UA, false), platformIsAndroid: false, uaHasAndroid: true, androidVisible: false }
];

let browser;
let server;
let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${detail ? ` - ${detail}` : ''}`);
};

try {
  server = createServer((req, res) => {
    const path = new URL(req.url, 'http://127.0.0.1').pathname;
    if (path === '/share-button.js') {
      res.setHeader('content-type', 'text/javascript; charset=utf-8');
      return res.end(source);
    }
    if (path === '/') {
      res.setHeader('content-type', 'text/html; charset=utf-8');
      return res.end(PAGE);
    }
    res.statusCode = 404;
    res.end('not part of this gate');
  });
  const port = await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
  const base = `http://127.0.0.1:${port}/`;

  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  console.log(`share-button.js: ${scriptPath} (${source.length} bytes), ${(await browser.version())}`);

  // --- A. one page, upgraded with the getComputedStyle counter in place --------
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    const original = window.getComputedStyle.bind(window);
    window.__computedStyleCalls = 0;
    window.getComputedStyle = function (...args) {
      window.__computedStyleCalls += 1;
      return original(...args);
    };
  });
  await page.goto(base, { waitUntil: 'load' });

  const counterWorks = await page.evaluate(() => {
    const before = window.__computedStyleCalls;
    getComputedStyle(document.body).color;
    return window.__computedStyleCalls === before + 1;
  });
  check('the getComputedStyle counter is live (else the check below is vacuous)', counterWorks);

  const connect = await page.evaluate((count) => {
    const before = window.__computedStyleCalls;
    const hosts = [];
    for (let i = 0; i < count; i += 1) {
      const host = document.createElement('share-button');
      host.setAttribute('href', `https://paul.kinlan.me/example/${i}`);
      host.setAttribute('text', `Example ${i}`);
      document.body.appendChild(host);
      hosts.push(host);
    }
    // Upgrade is synchronous inside appendChild for a defined element, so the
    // counter can be read straight away - and it must still be readable before
    // any interaction, which is exactly the property under test.
    const upgraded = hosts.filter((h) => h.shadowRoot?.getElementById('share-btn')).length;
    return { calls: window.__computedStyleCalls - before, upgraded };
  }, INSTANCES);
  check(`${INSTANCES} instances upgrade`, connect.upgraded === INSTANCES, `${connect.upgraded} of ${INSTANCES} rendered a shadow button`);
  check('upgrading instances makes no getComputedStyle call', connect.calls === 0, `${connect.calls} call(s) during ${INSTANCES} connects`);

  // --- B. the button still renders, default and themed -------------------------
  const paint = await page.evaluate(() => {
    const shadowBackground = (host) => {
      const button = host.shadowRoot.getElementById('share-btn');
      return { color: getComputedStyle(button).backgroundColor, box: button.getBoundingClientRect().toJSON() };
    };
    const host = document.getElementById('host');
    const themed = document.getElementById('themed');
    return {
      shared: shadowBackground(host),
      themed: shadowBackground(themed),
      plain: getComputedStyle(document.getElementById('plain')).backgroundColor,
      hostBox: host.getBoundingClientRect().toJSON()
    };
  });
  check('the shadow button takes the native button background by default',
    paint.shared.color === paint.plain, `shadow ${paint.shared.color} vs plain <button> ${paint.plain}`);
  check('an inline --share-button-background-color still themes the button',
    paint.themed.color === 'rgb(1, 2, 3)', `computed ${paint.themed.color}`);
  check('the share button has a real box',
    paint.shared.box.width > 0 && paint.shared.box.height > 0 && paint.hostBox.width > 0,
    `${Math.round(paint.shared.box.width)}x${Math.round(paint.shared.box.height)} inside a ${Math.round(paint.hostBox.width)}px host`);
  await page.screenshot({ path: '/tmp/share-button-gate.png' });

  // --- C. Android gating across the four platform/UA combinations ---------------
  for (const testCase of CASES) {
    const casePage = await browser.newPage();
    if (testCase.uaOverride) await casePage.setUserAgent(...testCase.uaOverride);
    await casePage.goto(base, { waitUntil: 'load' });
    const seen = await casePage.evaluate(() => ({
      platform: navigator.userAgentData?.platform ?? null,
      uaHasAndroid: /Android/.test(navigator.userAgent),
      androidButton: document.getElementById('host').shadowRoot.getElementById('android').classList.contains('visible'),
      shareApi: typeof navigator.share
    }));
    // Guard each case: if the override did not take effect the case proves
    // nothing, so fail loudly rather than passing on a coincidence.
    check(`[${testCase.name}] the page reports the emulated platform`,
      (seen.platform === 'Android') === testCase.platformIsAndroid, `platform ${seen.platform} (UA-CH present: ${seen.platform !== null})`);
    check(`[${testCase.name}] the page reports the emulated UA string`,
      seen.uaHasAndroid === testCase.uaHasAndroid, `UA contains "Android": ${seen.uaHasAndroid}`);
    check(`[${testCase.name}] Android fallback ${testCase.androidVisible ? 'visible' : 'hidden'}`,
      seen.androidButton === testCase.androidVisible, `visible ${seen.androidButton}`);
    await casePage.close();
  }

  await page.close();
  console.log('evidence: /tmp/share-button-gate.png');
  if (failures) throw new Error(`${failures} browser check(s) failed`);
  console.log(
    `PASS: ${INSTANCES} share-button instances upgrade with no getComputedStyle call, the default and themed ` +
    'backgrounds match a plain <button>, and the Android fallback follows navigator.userAgentData.platform ' +
    'in all four platform/UA combinations.'
  );
} finally {
  if (browser) await browser.close().catch(() => {});
  server?.close();
}
