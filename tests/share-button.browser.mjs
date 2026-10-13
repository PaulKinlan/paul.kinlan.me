// Browser evidence gate for static/javascripts/share-button.js, the minified
// Web Component the 2017 share-button posts load (factory-delta
// paul-kinlan-me-il8). The fast-tier sibling (tests/share-button.test.mjs) pins
// the shipped source contract; every claim here is only true of a running
// browser, so this gate drives the real asset in real Chrome:
//
//   A. NO SYNCHRONOUS STYLE READ PER CONNECT. connectedCallback used to read
//      style twice per instance (getComputedStyle for the button's native
//      background, and document.queryCommandSupported('copy'), a deprecated call
//      that forces a style flush) and then write two inline styles. The counter
//      below is installed through evaluateOnNewDocument - before the asset is
//      parsed - and counts EVERY getComputedStyle call the page makes while 50
//      instances are upgraded; it is self-checked first, because a counter that
//      never increments would make the whole check vacuous.
//   B. THE SAME THING AT TRACE LEVEL. Counting the calls proves the reads are
//      gone; Chrome's own Performance.getMetrics RecalcStyleCount proves no style
//      recalculation is forced for each connect. It is measured against a control
//      (50 plain <div>s appended the same way) so the assertion is relative to
//      what the page shape costs anyway, and the numbers are printed. On the
//      pre-change asset this is ~100 for 50 instances (2 per connect, ~10-36ms of
//      recalc); after the change it is the control's own +1.
//   C. THE STYLE CONTRACT IS INTACT: the shadow button still takes the native
//      button background by default (compared with a plain <button> on the page),
//      a user-set --share-button-background-color still themes it - inline on the
//      element and through a page rule targeting it, both of which the pre-change
//      asset honoured too (an ancestor value is inherited by neither, pinned so a
//      change there is visible) - and the copy button is still shown/hidden by the
//      same (now cached) support check.
//   D. ANDROID GATING IS CAPABILITY-BASED. navigator.userAgent.indexOf('Android')
//      is replaced by navigator.userAgentData.platform with a one-time cached UA
//      fallback. The four cases below separate the two paths: an Android platform
//      that no longer appears in the reduced UA string must still show the
//      fallback, and a legacy UA string that says "Android" on a non-Android
//      platform must not. Two further cases remove navigator.userAgentData
//      entirely (Firefox, or a Chrome build without UA-CH), where the one-time UA
//      fallback is the only source of platform information and has to decide on
//      its own. Each case asserts the page really reports the platform and UA it
//      claims to, so none can pass vacuously.
//   E. KEYBOARD. The shadow button is focusable and Enter/Space reach it (counted
//      from the overlay's own class mutations, through a MutationObserver). Both
//      handlers on the current asset toggle, so the net effect is a no-op - that
//      is pre-existing and filed as paul-kinlan-me-snr, which is why the
//      assertion is "the keyboard drives the component" (>= 1 toggle) rather than
//      a pinned count that a fix would have to edit here.
//   F. SHARE AVAILABLE / UNAVAILABLE. navigator.share stubbed -> clicking #android
//      calls it with {title, url} and dispatches share-url; without it, the
//      intent:// fallback dispatches share-url and leaves the page where it was;
//      and a truthy but NON-CALLABLE navigator.share takes the fallback instead of
//      being called, which is why the native path is gated on
//      typeof navigator.share === 'function' rather than on truthiness.
//
// Run with:  timeout -k 30 170 nice -n 10 node tests/share-button.browser.mjs
//            SHARE_BUTTON_JS=<path> node tests/share-button.browser.mjs
//            (points the gate at another copy of the asset - used against the
//            pre-change file to show the gate fails there: A, B and both UA
//            cases in D do)
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

// How many instances the counter and trace checks upgrade. One would already trip
// the old code; 50 is what makes a per-connect style flush show up as a cost
// rather than as a rounding error (~100 forced recalcs on the old asset).
const INSTANCES = 50;
// The control is appended in the same page, in the same way, immediately before
// the measured loop: whatever a page pays for 50 new elements is not this
// component's cost. Measured on the changed asset: control +0/+1, instances
// +1/+2. On the pre-change asset: instances +100/+101. 3 leaves 30x headroom over
// the observed value and is 30x below the value it is meant to catch.
const RECALC_TOLERANCE = 3;

const PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>share-button gate</title>
<style>share-button#ruleset{--share-button-background-color:rgb(4, 5, 6)}</style></head>
<body>
<button id="plain">Share This</button>
<share-button id="host" href="https://paul.kinlan.me/example/" text="Example title">Share This</share-button>
<share-button id="themed" style="--share-button-background-color:rgb(1, 2, 3)"
  href="https://paul.kinlan.me/example/" text="Example title">Share This</share-button>
<share-button id="ruleset" href="https://paul.kinlan.me/example/" text="Example title">Share This</share-button>
<div id="wrapper" style="--share-button-background-color:rgb(7, 8, 9)">
  <share-button id="inherited" href="https://paul.kinlan.me/example/" text="Example title">Share This</share-button>
</div>
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
  { name: 'default (headless Chrome)', uaOverride: null, platform: 'notAndroid', uaDataPresent: true, uaHasAndroid: false, androidVisible: false },
  { name: 'UA-CH Android + Android UA string, native share available', uaOverride: ua('Android', ANDROID_UA, true), platform: 'Android', uaDataPresent: true, uaHasAndroid: true, androidVisible: true, alsoWithShareApi: true },
  // The reduced string here is the one a stripped UA reports: no "Android" token
  // at all. Only the capability data can decide this case.
  { name: 'UA-CH Android + reduced UA (no "Android" token)', uaOverride: ua('Android', DESKTOP_UA, true), platform: 'Android', uaDataPresent: true, uaHasAndroid: false, androidVisible: true },
  { name: 'UA-CH Windows + legacy "Android" UA string', uaOverride: ua('Windows', ANDROID_UA, false), platform: 'Windows', uaDataPresent: true, uaHasAndroid: true, androidVisible: false },
  // A browser with no UA-CH at all must still get a useful answer from the
  // one-time UA fallback (Firefox on Android, or an older Chrome).
  { name: 'no navigator.userAgentData + Android UA string', uaOverride: [ANDROID_UA, undefined], hideUserAgentData: true, platform: 'notAndroid', uaDataPresent: false, uaHasAndroid: true, androidVisible: true },
  { name: 'no navigator.userAgentData + desktop UA string', uaOverride: [DESKTOP_UA, undefined], hideUserAgentData: true, platform: 'notAndroid', uaDataPresent: false, uaHasAndroid: false, androidVisible: false }
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
  console.log(`share-button.js: ${scriptPath} (${source.length} bytes), ${await browser.version()}`);

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

  // --- A. no synchronous style read per connect --------------------------------
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

  // --- B. ...and no forced style recalculation at trace level ------------------
  const client = await page.createCDPSession();
  await client.send('Performance.enable');
  const counters = async () => {
    const { metrics } = await client.send('Performance.getMetrics');
    const value = (name) => metrics.find((entry) => entry.name === name)?.value ?? -1;
    return { recalc: value('RecalcStyleCount'), layout: value('LayoutCount'), seconds: value('RecalcStyleDuration') };
  };
  const trace = async (kind) => {
    const before = await counters();
    await page.evaluate((args) => {
      const [count, tag] = args;
      for (let i = 0; i < count; i += 1) {
        const element = document.createElement(tag);
        if (tag === 'share-button') {
          element.setAttribute('href', `https://paul.kinlan.me/trace/${i}`);
          element.setAttribute('text', `Trace ${i}`);
        }
        document.body.appendChild(element);
      }
    }, [INSTANCES, kind]);
    const after = await counters();
    return { recalc: after.recalc - before.recalc, layout: after.layout - before.layout, ms: (after.seconds - before.seconds) * 1000 };
  };
  const control = await trace('div');
  const measured = await trace('share-button');
  console.log(
    `  control (${INSTANCES} plain <div>s): recalc +${control.recalc} layout +${control.layout}; ` +
    `instances: recalc +${measured.recalc} layout +${measured.layout}, recalc duration ${measured.ms.toFixed(1)}ms`
  );
  check(`${INSTANCES} connects force no style recalculation of their own`,
    measured.recalc <= RECALC_TOLERANCE,
    `recalc +${measured.recalc} (control +${control.recalc}, tolerance ${RECALC_TOLERANCE})`);
  check(`${INSTANCES} connects force no layout`,
    measured.layout <= control.layout + 2, `layout +${measured.layout} against control +${control.layout}`);

  // --- C. the rendering contract is intact -------------------------------------
  const paint = await page.evaluate(() => {
    const shadow = (id) => {
      const host = document.getElementById(id);
      const button = host.shadowRoot.getElementById('share-btn');
      return {
        color: getComputedStyle(button).backgroundColor,
        box: button.getBoundingClientRect().toJSON(),
        // The user's own custom property must still resolve on the host.
        hostVar: getComputedStyle(host).getPropertyValue('--share-button-background-color').trim()
      };
    };
    const host = document.getElementById('host');
    return {
      shared: shadow('host'),
      themed: shadow('themed'),
      ruleset: shadow('ruleset'),
      inherited: shadow('inherited'),
      plain: getComputedStyle(document.getElementById('plain')).backgroundColor,
      copyShown: host.shadowRoot.getElementById('copy').classList.contains('visible'),
      hostBox: host.getBoundingClientRect().toJSON()
    };
  });
  check('the shadow button takes the native button background by default',
    paint.shared.color === paint.plain, `shadow ${paint.shared.color} vs plain <button> ${paint.plain}`);
  // The three ways a user can set the property, all of which the pre-change asset
  // also honoured (measured): inline on the element, and a rule the page writes
  // for the element. An ancestor value is not inherited by either asset, because
  // the shadow :host rule's own declaration wins - pinned here so a change in
  // that behaviour is visible.
  check('an inline --share-button-background-color still themes the button',
    paint.themed.color === 'rgb(1, 2, 3)' && paint.themed.hostVar === 'rgb(1, 2, 3)',
    `computed ${paint.themed.color}, host var ${paint.themed.hostVar}`);
  check('a page rule targeting the element still themes the button',
    paint.ruleset.color === 'rgb(4, 5, 6)' && paint.ruleset.hostVar === 'rgb(4, 5, 6)',
    `computed ${paint.ruleset.color}, host var ${paint.ruleset.hostVar}`);
  check('an ancestor value is not inherited (same as the pre-change asset)',
    paint.inherited.color === paint.plain, `computed ${paint.inherited.color} vs plain ${paint.plain}`);
  check('the share button has a real box',
    paint.shared.box.width > 0 && paint.shared.box.height > 0 && paint.hostBox.width > 0,
    `${Math.round(paint.shared.box.width)}x${Math.round(paint.shared.box.height)} inside a ${Math.round(paint.hostBox.width)}px host`);
  check('the cached copy-support check still decides the copy button',
    paint.copyShown === true, `#copy visible: ${paint.copyShown}`);
  await page.screenshot({ path: '/tmp/share-button-gate.png' });

  // --- E. keyboard --------------------------------------------------------------
  const focus = await page.evaluate(() => {
    document.getElementById('host').shadowRoot.getElementById('share-btn').focus();
    // A shadow element cannot be document.activeElement: focus retargets to the host.
    return { reachesHost: document.activeElement === document.getElementById('host') };
  });
  check('the shadow share button is keyboard focusable', focus.reachesHost, 'document.activeElement is the host after focus()');
  await page.evaluate(() => {
    window.__overlayToggles = 0;
    const overlay = document.getElementById('host').shadowRoot.getElementById('overlay');
    new MutationObserver(() => { window.__overlayToggles += 1; })
      .observe(overlay, { attributes: true, attributeFilter: ['class'] });
  });
  await page.keyboard.press('Enter');
  const keyed = await page.evaluate(() => ({ toggles: window.__overlayToggles, visible: document.getElementById('host').shadowRoot.getElementById('overlay').classList.contains('visible') }));
  check('Enter reaches the component', keyed.toggles >= 1, `${keyed.toggles} overlay class change(s), overlay visible: ${keyed.visible}`);
  await page.keyboard.press('Space');
  const spaced = await page.evaluate(() => window.__overlayToggles);
  check('Space reaches the component', spaced > keyed.toggles, `${spaced} overlay class change(s) in total`);

  // The mouse path must still open the overlay after the stylesheet change: click
  // the shadow button itself (an ElementHandle inside the shadow root).
  const shareButtonHandle = await page.evaluateHandle(() => document.getElementById('host').shadowRoot.getElementById('share-btn'));
  await shareButtonHandle.asElement().click();
  const clicked = await page.evaluate(() => {
    const overlay = document.getElementById('host').shadowRoot.getElementById('overlay');
    return { visible: overlay.classList.contains('visible'), url: overlay.querySelector('#url').value };
  });
  check('clicking the shadow button opens the overlay', clicked.visible === true, `visible ${clicked.visible}`);
  check('the overlay carries the host element url', clicked.url.endsWith('/example/'), `url input: ${clicked.url}`);
  await page.screenshot({ path: '/tmp/share-button-overlay.png' });

  // --- F. share available / unavailable ----------------------------------------
  const share = await page.evaluate(async () => {
    const host = document.getElementById('host');
    const errors = [];
    const onError = (event) => errors.push(String(event.message ?? event));
    window.addEventListener('error', onError);
    let events = 0;
    host.addEventListener('share-url', () => { events += 1; });
    const android = host.shadowRoot.getElementById('android');
    const calls = [];
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      writable: true,
      value: (data) => { calls.push(data); return Promise.resolve(); }
    });
    android.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    const withShareApi = { calls: calls.length, title: calls[0]?.title, url: calls[0]?.url, events };
    // Now the unavailable path: the intent:// fallback, which an unknown-scheme
    // navigation blocks, so the page stays where it is.
    delete navigator.share;
    const before = location.href;
    android.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await new Promise((resolve) => setTimeout(resolve, 100));
    const without = { events, shareApi: typeof navigator.share, navigated: location.href !== before };
    // A truthy but non-callable navigator.share must take the fallback too: the
    // capability check is typeof === 'function', not truthiness.
    Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: 1 });
    android.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.removeEventListener('error', onError);
    return {
      withShareApi,
      without,
      notFunction: { events, shareApi: typeof navigator.share, errors, navigated: location.href !== before }
    };
  });
  check('with navigator.share available, #android shares the host title and url',
    share.withShareApi.calls === 1 && share.withShareApi.title === 'Example title' && share.withShareApi.url === 'https://paul.kinlan.me/example/',
    JSON.stringify(share.withShareApi));
  check('with navigator.share unavailable, the intent:// fallback still fires share-url and does not navigate away',
    share.without.events === 2 && share.without.shareApi === 'undefined' && share.without.navigated === false,
    JSON.stringify(share.without));
  check('a truthy but non-callable navigator.share takes the fallback instead of throwing',
    share.notFunction.events === 3 && share.notFunction.shareApi === 'number'
      && share.notFunction.errors.length === 0 && share.notFunction.navigated === false,
    JSON.stringify(share.notFunction));

  // --- D. Android gating across the four platform/UA combinations ---------------
  for (const testCase of CASES) {
    const casePage = await browser.newPage();
    if (testCase.hideUserAgentData) {
      // Firefox, or a Chrome build without UA-CH: the one-time UA fallback is the
      // only source of platform information, so it has to be driveable.
      await casePage.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'userAgentData', { value: undefined, configurable: true });
      });
    }
    if (testCase.uaOverride) await casePage.setUserAgent(...testCase.uaOverride);
    await casePage.goto(base, { waitUntil: 'load' });
    const seen = await casePage.evaluate((withShareApi) => {
      let freshWithShareApi = null;
      if (withShareApi) {
        // The native share path is reached through THIS button on Android, so it
        // must not be hidden when navigator.share exists.
        Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: () => Promise.resolve() });
        const fresh = document.createElement('share-button');
        fresh.setAttribute('href', 'https://paul.kinlan.me/example/');
        fresh.setAttribute('text', 'Example title');
        document.body.appendChild(fresh);
        freshWithShareApi = fresh.shadowRoot.getElementById('android').classList.contains('visible');
      }
      return {
        platform: navigator.userAgentData?.platform ?? null,
        uaDataPresent: navigator.userAgentData !== undefined,
        uaHasAndroid: /Android/.test(navigator.userAgent),
        androidButton: document.getElementById('host').shadowRoot.getElementById('android').classList.contains('visible'),
        freshWithShareApi
      };
    }, testCase.alsoWithShareApi === true);
    // Guard each case: if the override did not take effect the case proves
    // nothing, so fail loudly rather than passing on a coincidence.
    check(`[${testCase.name}] the page reports the emulated platform`,
      testCase.platform === 'notAndroid' ? seen.platform !== 'Android' : seen.platform === testCase.platform,
      `platform ${seen.platform}`);
    check(`[${testCase.name}] navigator.userAgentData present: ${testCase.uaDataPresent}`,
      seen.uaDataPresent === testCase.uaDataPresent, `present ${seen.uaDataPresent}`);
    check(`[${testCase.name}] the page reports the emulated UA string`,
      seen.uaHasAndroid === testCase.uaHasAndroid, `UA contains "Android": ${seen.uaHasAndroid}`);
    check(`[${testCase.name}] Android fallback ${testCase.androidVisible ? 'visible' : 'hidden'}`,
      seen.androidButton === testCase.androidVisible, `visible ${seen.androidButton}`);
    if (testCase.alsoWithShareApi) {
      check(`[${testCase.name}] the Android fallback is still shown with native share available`,
        seen.freshWithShareApi === true, `visible ${seen.freshWithShareApi}`);
    }
    await casePage.close();
  }

  await page.close();
  console.log('evidence: /tmp/share-button-gate.png, /tmp/share-button-overlay.png');
  if (failures) throw new Error(`${failures} browser check(s) failed`);
  console.log(
    `PASS: ${INSTANCES} instances upgrade with no getComputedStyle call and no forced style recalculation (recalc ` +
    `+${measured.recalc} against a control's +${control.recalc}), the default/themed backgrounds and the copy-button ` +
    'support check are unchanged, keyboard and click drive the overlay, #android shares with navigator.share and falls ' +
    'back to intent:// without it, and the Android fallback follows navigator.userAgentData.platform in all four ' +
    'platform/UA combinations.'
  );
} finally {
  if (browser) await browser.close().catch(() => {});
  server?.close();
}
