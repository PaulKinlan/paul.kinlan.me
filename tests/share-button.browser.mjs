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
//   H. THE COPY PATH (paul-kinlan-me-hhn). #copy used to be the deprecated pair:
//      document.queryCommandSupported('copy') for visibility and
//      document.execCommand('copy') after selecting the input. It now writes with
//      navigator.clipboard.writeText() and keeps selection + execCommand as the
//      fallback for an insecure context or a rejected write. The cases below
//      separate a granted write, a write the page rejects with NotAllowedError
//      (readable clipboard, so the fallback's copy is proved rather than assumed),
//      a real Chrome denial through CDP, no Clipboard API at all, neither path, and
//      the regression itself - API present while the deprecated command reports
//      unsupported, where the old asset hid the copy button. On the pre-change
//      asset H1, H2, H3 and H6 fail.
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
//   E. KEYBOARD (paul-kinlan-me-snr). The shadow button is focusable, and Enter and
//      Space must OPEN the overlay and a second press close it. Before the fix a host
//      keypress handler toggled a second time, so each press opened and closed the
//      overlay and the keyboard could not open it at all.
//   G. ACCESSIBLE NAMES (paul-kinlan-me-zn6). Read from Chrome's accessibility tree,
//      not from the source: `aria-lable` was ignored, so #share-btn and #mailto had no
//      name - the source-level check in tests/share-button.test.mjs cannot tell an
//      ignored attribute from a working one.
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

import { evidencePath } from '../tools/browser-gate/evidence.mjs';

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

// Section H's instrumentation and environment overrides. Module-level functions
// with no closure over anything: page.evaluateOnNewDocument and page.evaluate
// serialise the function source into the page.
const installCopyProbe = () => {
  window.__copyProbe = { write: 0, writeArgs: [], exec: 0, execResult: null, events: 0, errors: [] };
  const exec = document.execCommand.bind(document);
  document.execCommand = (...args) => {
    if (args[0] !== 'copy') return false;
    window.__copyProbe.exec += 1;
    const result = exec(...args);
    window.__copyProbe.execResult = result;
    return result;
  };
  window.addEventListener('unhandledrejection', (event) => window.__copyProbe.errors.push(String(event.reason?.name ?? event.reason)));
  window.addEventListener('error', (event) => window.__copyProbe.errors.push(String(event.message)));
};
const spyClipboardWrite = () => {
  const original = navigator.clipboard.writeText.bind(navigator.clipboard);
  navigator.clipboard.writeText = (...args) => {
    window.__copyProbe.write += 1;
    window.__copyProbe.writeArgs.push(args[0]);
    return original(...args);
  };
};
const rejectClipboardWrite = () => {
  navigator.clipboard.writeText = (...args) => {
    window.__copyProbe.write += 1;
    window.__copyProbe.writeArgs.push(args[0]);
    return Promise.reject(new DOMException('Write permission denied.', 'NotAllowedError'));
  };
};
const hideClipboardApi = () => Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
const reportCommandUnsupported = () => { document.queryCommandSupported = () => false; };
// The legacy path failing in the two ways the platform can fail: execCommand reports the copy did
// not happen, or it throws. paul-kinlan-me-9c9: the copy-url event used to fire on both.
const legacyCopyReportsFailure = () => {
  window.__legacyCalls = 0;
  document.execCommand = () => { window.__legacyCalls += 1; return false; };
};
const legacyCopyThrows = () => {
  window.__legacyCalls = 0;
  document.execCommand = () => { window.__legacyCalls += 1; throw new Error('copy blocked'); };
};
const CLIPBOARD_PERMISSIONS = ['clipboardReadWrite', 'clipboardSanitizedWrite'];

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
  await page.screenshot({ path: evidencePath('share-button-gate.png') });

  // --- E. keyboard (snr) -------------------------------------------------------
  const focus = await page.evaluate(() => {
    document.getElementById('host').shadowRoot.getElementById('share-btn').focus();
    // A shadow element cannot be document.activeElement: focus retargets to the host.
    return { reachesHost: document.activeElement === document.getElementById('host') };
  });
  check('the shadow share button is keyboard focusable', focus.reachesHost, 'document.activeElement is the host after focus()');
  const overlayVisible = () => page.evaluate(() => document.getElementById('host').shadowRoot.getElementById('overlay').classList.contains('visible'));
  check('the overlay starts closed', (await overlayVisible()) === false);
  // Enter on the focused shadow button fires a click, which is composed and bubbles
  // to the host's click listener. A host keypress listener used to toggle as well, so
  // the overlay opened and closed again and the keyboard could never open it.
  await page.keyboard.press('Enter');
  check('Enter opens the overlay', (await overlayVisible()) === true, 'keyboard activation must open it, not open-and-close');
  await page.keyboard.press('Enter');
  check('a second Enter closes it again', (await overlayVisible()) === false);
  await page.keyboard.press('Space');
  check('Space opens the overlay too', (await overlayVisible()) === true);
  await page.keyboard.press('Space');
  check('a second Space closes it again (a toggle, not a one-way latch)', (await overlayVisible()) === false);

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
  await page.screenshot({ path: evidencePath('share-button-overlay.png') });

  // --- G. accessible names, from the accessibility tree (zn6) ------------------
  await client.send('Accessibility.enable');
  const ax = await client.send('Accessibility.getFullAXTree');
  // Deduplicated: earlier sections left ~100 extra share-buttons on this page.
  const buttonNames = [...new Set(ax.nodes
    .filter((node) => node.role?.value === 'button')
    // The shadow buttons are flattened into this tree, which is what a screen
    // reader reads. #android is display:none on this page (desktop), so it is
    // correctly absent - its name is asserted on the Android page in section D.
    .map((node) => node.name?.value ?? ''))];
  const expectedNames = ['Share URL', 'Mail to', 'Copy to clipboard'];
  const unnamed = expectedNames.filter((name) => !buttonNames.includes(name));
  check('every visible shadow button exposes its accessible name in the AX tree', unnamed.length === 0,
    unnamed.length ? `missing ${JSON.stringify(unnamed)} from ${JSON.stringify(buttonNames)}` : `buttons: ${JSON.stringify(buttonNames)}`);

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

  // --- H. the copy path (hhn) --------------------------------------------------
  // The Clipboard API is the path and the deprecated selection + execCommand pair is
  // the fallback. Read permission is granted here (the component never reads) so a
  // check can assert what actually landed on the clipboard, and H3's denial is a
  // real Chrome permission decision through CDP rather than a stub.
  const copyCase = async ({ grant = [], deny = null, beforeLoad = [], afterLoad = [] }) => {
    const target = await browser.newPage();
    const origin = base.replace(/\/$/, '');
    // Start from no clipboard permission at all: puppeteer's override REPLACES the
    // allowed list, so granting first would hide a denial that never happened.
    await browser.defaultBrowserContext().overridePermissions(origin, []);
    await target.evaluateOnNewDocument(installCopyProbe);
    for (const fn of beforeLoad) await target.evaluateOnNewDocument(fn);
    const cdp = await target.createCDPSession();
    if (deny) await cdp.send('Browser.setPermission', { permission: { name: deny }, setting: 'denied', origin });
    if (grant.length) await cdp.send('Browser.grantPermissions', { origin, permissions: grant });
    await target.goto(base, { waitUntil: 'load' });
    for (const fn of afterLoad) await target.evaluate(fn);
    return target;
  };
  const clickShadow = async (target, id) => {
    const handle = await target.evaluateHandle((elementId) => document.getElementById('host').shadowRoot.getElementById(elementId), id);
    try {
      await handle.asElement().click();
      return true;
    } catch {
      // The element exists but is not clickable, which is the observable state of a
      // hidden #copy button (display:none). Report it and keep the gate running, so a
      // regression states its checks instead of aborting every section after it.
      return false;
    }
  };
  const readCopyState = (target) => target.evaluate(async () => {
    const host = document.getElementById('host');
    return {
      url: host.shadowRoot.getElementById('url').value,
      visible: host.shadowRoot.getElementById('copy').classList.contains('visible'),
      overlay: host.shadowRoot.getElementById('overlay').classList.contains('visible'),
      probe: window.__copyProbe,
      // "no-api" when there is no Clipboard API to read with; "ERR:<name>" when the
      // read itself is denied, which is the case for H3.
      clipboard: await navigator.clipboard?.readText?.().then((text) => text, (error) => `ERR:${error.name}`) ?? 'no-api'
    };
  });
  const copyRun = async (options) => {
    const target = await copyCase(options);
    await clickShadow(target, 'share-btn');
    const opened = await target.evaluate(() => document.getElementById('host').shadowRoot.getElementById('overlay').classList.contains('visible'));
    await target.evaluate(() => {
      window.__copyProbe.events = 0;
      document.getElementById('host').addEventListener('copy-url', () => { window.__copyProbe.events += 1; });
    });
    const clicked = await clickShadow(target, 'copy');
    await new Promise((resolve) => setTimeout(resolve, 250));
    const state = await readCopyState(target);
    return { target, opened, clicked, state };
  };
  {
    const { target, opened, state } = await copyRun({ grant: CLIPBOARD_PERMISSIONS, afterLoad: [spyClipboardWrite] });
    check('[H1 granted] the copy button is shown when the Clipboard API exists', state.visible === true, `visible ${state.visible}`);
    check('[H1 granted] copy writes the visible url through navigator.clipboard.writeText, not execCommand',
      state.probe.write === 1 && state.probe.writeArgs[0] === state.url && state.probe.exec === 0,
      `writeText ${state.probe.write} ${JSON.stringify(state.probe.writeArgs)}, execCommand ${state.probe.exec}`);
    check('[H1 granted] the clipboard really holds the url', state.clipboard === state.url, `clipboard ${JSON.stringify(state.clipboard)}`);
    check('[H1 granted] the copy fires copy-url once and closes the overlay it was opened from',
      state.probe.events === 1 && opened === true && state.overlay === false,
      `events ${state.probe.events}, overlay ${opened} -> ${state.overlay}`);
    await target.close();
  }

  {
    const { target, state } = await copyRun({ grant: CLIPBOARD_PERMISSIONS, afterLoad: [rejectClipboardWrite] });
    check('[H2 rejected write] a write the browser rejects routes to the execCommand fallback',
      state.probe.write === 1 && state.probe.exec === 1 && state.probe.execResult === true,
      `writeText ${state.probe.write}, execCommand ${state.probe.exec} (${state.probe.execResult})`);
    // The legacy path copies the selected input, and Chrome appends a newline to a
    // selection copy - a real difference between the two paths, pinned as trimmed
    // equality rather than pretending they are byte-identical.
    check('[H2 rejected write] the fallback still copies the url', state.clipboard.trim() === state.url,
      `clipboard ${JSON.stringify(state.clipboard)}`);
    check('[H2 rejected write] the user still gets copy-url, with no unhandled rejection',
      state.probe.events === 1 && state.probe.errors.length === 0,
      `events ${state.probe.events}, errors ${JSON.stringify(state.probe.errors)}`);
    await target.close();
  }

  {
    const { target, state } = await copyRun({ deny: 'clipboard-write', afterLoad: [spyClipboardWrite] });
    check('[H3 denied] a real denied clipboard-write is attempted and routes to the fallback',
      state.probe.write === 1 && state.probe.exec === 1,
      `writeText ${state.probe.write}, execCommand ${state.probe.exec}`);
    // execResult, not just the call count (paul-kinlan-me-9c9): an event that fires while the
    // legacy command reported failure is a false success, which this case used to wave through.
    check('[H3 denied] the fallback reports success, so the copy-url event is justified',
      state.probe.execResult === true && state.probe.events === 1 && state.probe.errors.length === 0,
      `execCommand ${state.probe.execResult}, events ${state.probe.events}, errors ${JSON.stringify(state.probe.errors)}, clipboard read ${JSON.stringify(state.clipboard)}`);
    await target.close();
  }

  {
    const { target, state } = await copyRun({ beforeLoad: [hideClipboardApi] });
    check('[H4 no Clipboard API] the button stays visible on the legacy capability', state.visible === true, `visible ${state.visible}`);
    check('[H4 no Clipboard API] copy uses the selection + execCommand path and reports copy-url',
      state.probe.write === 0 && state.probe.exec === 1 && state.probe.execResult === true && state.probe.events === 1,
      `writeText ${state.probe.write}, execCommand ${state.probe.exec} (${state.probe.execResult}), events ${state.probe.events}`);
    await target.close();
  }

  {
    const target = await copyCase({ beforeLoad: [hideClipboardApi, reportCommandUnsupported] });
    const state = await readCopyState(target);
    check('[H5 neither path] the copy button is hidden', state.visible === false, `visible ${state.visible}`);
    await target.close();
  }

  {
    // The regression this bead is about: a browser (or a future Chrome) where the
    // Clipboard API works but the deprecated command reports unsupported. The old
    // asset hid the copy button here; this one must show it and copy with the API.
    const { target, clicked, state } = await copyRun({
      grant: CLIPBOARD_PERMISSIONS, beforeLoad: [reportCommandUnsupported], afterLoad: [spyClipboardWrite]
    });
    check('[H6 regression] the button is visible and clickable although the deprecated command reports unsupported',
      state.visible === true && clicked === true, `visible ${state.visible}, clicked ${clicked}`);
    check('[H6 regression] copy writes through the Clipboard API',
      state.probe.write === 1 && state.probe.writeArgs[0] === state.url && state.probe.exec === 0,
      `writeText ${state.probe.write} ${JSON.stringify(state.probe.writeArgs)}, execCommand ${state.probe.exec}`);
    check('[H6 regression] the clipboard holds the url', state.clipboard === state.url, `clipboard ${JSON.stringify(state.clipboard)}`);
    await target.close();
  }

  // paul-kinlan-me-9c9: BOTH copy paths failing must NOT look like a copy. execCommand can report
  // failure (returns false) or throw; either way there is no copy-url event and the overlay the user
  // opened stays open, so the failure is visible rather than announced as success.
  {
    const { target, opened, state } = await copyRun({ beforeLoad: [hideClipboardApi], afterLoad: [legacyCopyReportsFailure] });
    const legacyCalls = await target.evaluate(() => window.__legacyCalls);
    check('[H7 both fail] the legacy path was tried and reported failure',
      state.probe.write === 0 && legacyCalls === 1, `writeText ${state.probe.write}, execCommand calls ${legacyCalls}`);
    check('[H7 both fail] a failed copy emits NO copy-url and leaves the overlay open',
      state.probe.events === 0 && opened === true && state.overlay === true,
      `events ${state.probe.events}, overlay ${opened} -> ${state.overlay}`);
    check('[H7 both fail] the failure throws nothing and keeps the button usable',
      state.probe.errors.length === 0 && state.visible === true,
      `errors ${JSON.stringify(state.probe.errors)}, visible ${state.visible}`);
    await target.close();
  }

  {
    const { target, opened, state } = await copyRun({ beforeLoad: [hideClipboardApi], afterLoad: [legacyCopyThrows] });
    const legacyCalls = await target.evaluate(() => window.__legacyCalls);
    check('[H8 fallback throws] the throwing copy emits NO copy-url and leaves the overlay open',
      legacyCalls === 1 && state.probe.events === 0 && opened === true && state.overlay === true,
      `execCommand calls ${legacyCalls}, events ${state.probe.events}, overlay ${opened} -> ${state.overlay}`);
    check('[H8 fallback throws] the exception is contained (no unhandled error)',
      state.probe.errors.length === 0, `errors ${JSON.stringify(state.probe.errors)}`);
    await target.close();
  }

  {
    // The same shape through the async path: the Clipboard API rejects AND the fallback reports
    // failure. The pre-change asset fired copy-url here too (the reviewer's exact repro).
    const { target, opened, state } = await copyRun({
      grant: CLIPBOARD_PERMISSIONS, afterLoad: [rejectClipboardWrite, legacyCopyReportsFailure]
    });
    const legacyCalls = await target.evaluate(() => window.__legacyCalls);
    check('[H9 async reject + legacy fail] the failed copy emits NO copy-url and leaves the overlay open',
      state.probe.write === 1 && legacyCalls === 1 && state.probe.events === 0 && opened === true && state.overlay === true,
      `writeText ${state.probe.write}, execCommand calls ${legacyCalls}, events ${state.probe.events}, overlay ${opened} -> ${state.overlay}`);
    await target.close();
  }

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
    // The Android button's accessible name is only observable where it renders:
    // display:none removes a button from the accessibility tree, and every button
    // in the overlay is hidden until the overlay is opened - so open it first.
    await casePage.evaluate(() => {
      const host = document.getElementById('host');
      host.shadowRoot.getElementById('share-btn')
        .dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    });
    const axClient = await casePage.createCDPSession();
    await axClient.send('Accessibility.enable');
    const caseAx = await axClient.send('Accessibility.getFullAXTree');
    const caseButtons = new Set(caseAx.nodes.filter((node) => node.role?.value === 'button').map((node) => node.name?.value ?? ''));
    check(`[${testCase.name}] the Android button ${testCase.androidVisible ? 'is' : 'is not'} exposed in the AX tree`,
      caseButtons.has('Share on Android') === testCase.androidVisible,
      `buttons: ${JSON.stringify([...caseButtons])}`);
    await casePage.close();
  }

  await page.close();
  console.log(`evidence: ${evidencePath('share-button-gate.png')}, ${evidencePath('share-button-overlay.png')}`);
  if (failures) throw new Error(`${failures} browser check(s) failed`);
  console.log(
    `PASS: ${INSTANCES} instances upgrade with no getComputedStyle call and no forced style recalculation (recalc ` +
    `+${measured.recalc} against a control's +${control.recalc}), the default/themed backgrounds and the copy-button ` +
    'support check are unchanged, the copy path uses navigator.clipboard.writeText with the deprecated selection + ' +
    'execCommand path as the granted/rejected/denied/unsupported fallback, keyboard and click drive the overlay, ' +
    '#android shares with navigator.share and falls back to intent:// without it, and the Android fallback follows ' +
    'navigator.userAgentData.platform in all four platform/UA combinations.'
  );
} finally {
  if (browser) await browser.close().catch(() => {});
  server?.close();
}
