// Browser evidence gate for static/javascripts/air-horner.js, the <air-horner>
// custom element the projects/airhorner-customelement and projects/jakehorner
// pages load (paul-kinlan-me-lk2).
//
// The element used to be pointer-only: a bare host listening for
// mousedown/touchstart, with no role, no accessible name, no tab stop and no
// keyboard behaviour, so it could not be reached or named without a pointing
// device. The fix moves the interaction onto a real <button> inside the shadow
// root. Source-level pins live in tests/air-horner.test.mjs; every claim below is
// only true of a running browser, so this gate drives the BUILT site (the label
// attribute has to survive Hugo) in real Chrome:
//
//   A. ACCESSIBLE NAME / ROLE, from Chrome's own accessibility tree rather than
//      from the markup: the control is a button with the name the page gave it.
//      The label attribute on the host is only useful if it ends up on the node a
//      screen reader announces.
//   B. SEQUENTIAL FOCUS. Tab from the top of the document reaches the control -
//      this is the "unreachable by keyboard" half of the bug, and a shadow button
//      is not automatically in the page's tab order for every browser, so it is
//      measured rather than assumed.
//   C. HOLD AND RELEASE, per key. Space and Enter both have to start the horn
//      while held and stop it on release. The native click a button also fires for
//      the same key press must not be taken as a second activation: the audio
//      graph records every source start, so a double activation is a counted
//      source, not an opinion.
//   D. FOCUS INDICATION. `:focus-visible` matches and the outline is real, for a
//      keyboard focus; it is a second, silent failure if the ring is only in the
//      source.
//   E. MOUSE AND TOUCH still do what they did (down/start, up/stop).
//   F. A DISCRETE ACTIVATION (an assistive-technology click, detail 0) plays one
//      horn and ends; a second click while it is sounding does not stack sources.
//   G. THE AUDIO GRAPH IS REAL. Each activation starts an AudioBufferSourceNode,
//      the context is running (autoplay policy is set to require a gesture, so a
//      suspended context means silence in production) and the shipped
//      /audio/airhorn.mp3 is fetched with a 200 - the old page-relative default
//      resolved to a 404 and the plain demo had no media at all.
//   H. THE ART IS UNCHANGED. The fallback circle still fills the plain host; on
//      the slotted jakehorner page the button is transparent and the fallback is
//      not rendered, so the wrap cannot have put a red circle behind Jake's face.
//
// Run with:  timeout -k 30 170 node tests/air-horner.browser.mjs
//            SITE_DIR=<dir> node tests/air-horner.browser.mjs   (serve an
//            already-built site instead of building one)
//            AIR_HORNER_JS=<path> node tests/air-horner.browser.mjs   (point the
//            gate at another copy of the asset - used against the pre-change file
//            to show this gate fails there: A, B, C, D and F do)
// Not part of tools/fast-gate.sh: it needs Chrome and a full Hugo build.
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

import { evidencePath } from '../tools/browser-gate/evidence.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const siteDir = process.env.SITE_DIR ?? join(repoRoot, 'public');
const assetPath = process.env.AIR_HORNER_JS ?? join(repoRoot, 'static/javascripts/air-horner.js');
const asset = readFileSync(assetPath, 'utf8');
// AIR_HORNER_JS points the gate at another copy of the asset (used against the
// pre-change file to show the gate fails there). Otherwise the built site's own
// copy is served, and it has to be the file under test - a stale build would
// quietly test something else.
const assetOverride = process.env.AIR_HORNER_JS ? asset : null;
// A silence-breaking tone, so a one-shot activation can be observed to finish.
// The real demos use the shipped mp3s; this is served only to the element the
// gate appends for the discrete-activation case.
const toneWav = (() => {
  const sampleRate = 8000;
  const samples = Math.floor(0.12 * sampleRate);
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i += 1) buffer.writeInt16LE(Math.round(Math.sin(i / 8) * 12000), 44 + i * 2);
  return buffer;
})();

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

// The two published pages, the name each element must expose, and the audio the
// page should load for it.
const DEMOS = [
  { path: '/projects/airhorner-custom-element/', what: 'plain air-horner', name: 'Play air horn', audio: '/audio/airhorn.mp3', fallbackRendered: true },
  { path: '/projects/jakehorner/', what: 'slotted jakehorner', name: 'Play the Jake horner', audio: '/audio/yo.mp3', fallbackRendered: false },
];

let browser;
let server;
let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${detail ? ` - ${detail}` : ''}`);
};

// The box, the audio-graph counters and the focus state of the page's element.
// Defensive about a missing #horn-button: the pre-change asset has none, and the
// checks below should report that rather than throw.
const state = (page, selector = 'air-horner') => page.evaluate(`(() => {
  const host = document.querySelector(${JSON.stringify(selector)});
  const button = host.shadowRoot.querySelector('#horn-button');
  const fallback = host.shadowRoot.querySelector('.horn');
  const style = button ? getComputedStyle(button) : null;
  const hostBox = host.getBoundingClientRect();
  const buttonBox = button ? button.getBoundingClientRect() : { width: 0, height: 0 };
  const fallbackBox = fallback.getBoundingClientRect();
  const media = window.__media;
  const context = media.contexts[0];
  const head = host.querySelector('.head');
  return {
    hasButton: !!button,
    role: button ? button.tagName : null,
    type: button ? button.type : null,
    name: button ? button.getAttribute('aria-label') : null,
    tabIndex: button ? button.tabIndex : -1,
    horning: host.classList.contains('horning'),
    fallbackRects: fallback.getClientRects().length,
    fallbackBox: { width: Math.round(fallbackBox.width), height: Math.round(fallbackBox.height) },
    hostBox: { width: Math.round(hostBox.width), height: Math.round(hostBox.height) },
    buttonBox: { width: Math.round(buttonBox.width), height: Math.round(buttonBox.height) },
    buttonBackground: style ? style.backgroundColor : null,
    focusVisible: button ? button.matches(':focus-visible') : false,
    outline: style ? style.outline : null,
    contextState: context ? context.state : 'no context',
    starts: media.starts,
    lastLoop: media.lastSource ? media.lastSource.loop : null,
    liveSources: media.live ? media.live.size : -1,
    loopingSources: media.live ? [...media.live].filter((s) => s.loop === true).length : -1,
    slotted: !!head && head.getClientRects().length > 0,
  };
})()`);

async function media(page) {
  return page.evaluate('window.__media');
}

// Tab forward from the top of the document until the element itself holds focus.
async function tabUntilFocused(page, maxTabs) {
  await page.evaluate(() => { document.body.setAttribute('tabindex', '-1'); document.body.focus(); });
  for (let i = 1; i <= maxTabs; i += 1) {
    await page.keyboard.press('Tab');
    const onHost = await page.evaluate(() => document.activeElement && document.activeElement.tagName === 'AIR-HORNER');
    if (onHost) return i;
  }
  return 0;
}

// Chrome's own accessibility tree: the nodes a screen reader would get.
async function namedButtons(page) {
  const client = await page.createCDPSession();
  await client.send('Accessibility.enable');
  const { nodes } = await client.send('Accessibility.getFullAXTree');
  await client.detach();
  return nodes
    .filter((node) => node.role && node.role.value === 'button' && node.ignored !== true)
    .map((node) => (node.name ? node.name.value : ''));
}

async function audioStatus(page, name) {
  return page.evaluate((wanted) => {
    const entry = performance.getEntriesByType('resource').find((e) => e.name.endsWith(wanted));
    return entry ? { fetched: true, status: entry.responseStatus ?? null } : { fetched: false, status: null };
  }, name);
}

try {
  const hugo = join(repoRoot, 'node_modules', '.bin', 'hugo');
  assert.ok(existsSync(hugo), `the repo's pinned hugo is missing: ${hugo}`);
  if (!process.env.SITE_DIR) {
    const build = spawnSync(hugo, ['--quiet', '--destination', siteDir], { cwd: repoRoot, encoding: 'utf8', timeout: 180_000 });
    assert.equal(build.status, 0, `hugo build failed (status ${build.status}):\n${build.stdout}${build.stderr}`);
  }
  assert.ok(existsSync(join(siteDir, 'index.html')), `no index.html in ${siteDir}`);
  if (!assetOverride) {
    const built = readFileSync(join(siteDir, 'javascripts', 'air-horner.js'), 'utf8');
    assert.equal(built, asset, `the built site serves a different air-horner.js than ${assetPath}; rebuild (SITE_DIR unset) or delete ${siteDir}`);
  }

  server = createServer((req, res) => {
    const path = new URL(req.url, 'http://x').pathname;
    // Overlay: the shipped-asset gate has to drive the real site, and the real
    // site has no tone.wav. AIR_HORNER_JS additionally replaces the element under
    // test.
    if (path === '/tone.wav') {
      res.setHeader('content-type', 'audio/wav');
      return res.end(toneWav);
    }
    // A delayed audio response, so a release that arrives before the first fetch
    // resolves is a real case rather than a stubbed one.
    if (path === '/slow-airhorn.wav') {
      res.setHeader('content-type', 'audio/wav');
      setTimeout(() => res.end(toneWav), 700);
      return;
    }
    if (assetOverride !== null && path.endsWith('/javascripts/air-horner.js')) {
      res.setHeader('content-type', 'text/javascript; charset=utf-8');
      return res.end(assetOverride);
    }
    const requested = normalize(decodeURIComponent(path)).replace(/^([/\\])+/, '');
    let file = join(siteDir, requested);
    try {
      if (statSync(file).isDirectory()) file = join(file, 'index.html');
    } catch {
      res.statusCode = 404;
      return res.end('not found');
    }
    if (!file.startsWith(siteDir)) {
      res.statusCode = 403;
      return res.end('forbidden');
    }
    res.setHeader('content-type', TYPES[extname(file)] ?? 'application/octet-stream');
    if (path.endsWith('.js') && requested.endsWith('javascripts/air-horner.js')) {
      res.setHeader('content-type', 'text/javascript; charset=utf-8');
    }
    return createReadStream(file).pipe(res);
  });
  const port = await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
  const base = `http://127.0.0.1:${port}`;

  browser = await puppeteer.launch({
    headless: true,
    // A gesture is required for audio: if the horn does not resume its context on
    // activation it is silent in production, and this is what makes that visible.
    args: ['--no-sandbox', '--autoplay-policy=user-gesture-required'],
  });
  console.log(`air-horner.js: ${assetPath} (${asset.length} bytes), ${await browser.version()}`);

  for (const demo of DEMOS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 823, hasTouch: true });
    // Built pages pull third-party subresources (webfonts, analytics, embeds);
    // the 30s default navigation timeout measured flaky under VM load
    // (paul-kinlan-me-1i3 verification). Raises only the load wait, not what
    // is measured; the tier's per-file bound still caps the total.
    page.setDefaultNavigationTimeout(120_000);
    await page.evaluateOnNewDocument(() => {
      window.__media = { contexts: [], starts: 0, lastSource: null, live: new Set() };
      // A log of the press/release events the page saw, so a cancelled touch or a
      // compatibility mouse event is visible in the failure detail rather than
      // inferred.
      window.__events = [];
      for (const type of ['touchstart', 'touchend', 'touchcancel', 'mousedown', 'mouseup', 'pointercancel', 'click']) {
        document.addEventListener(type, () => { window.__events.push(`${type}@${Math.round(performance.now())}`); }, true);
      }
      window.__classLog = [];
      addEventListener('DOMContentLoaded', () => {
        for (const host of document.querySelectorAll('air-horner')) {
          new MutationObserver(() => window.__classLog.push(`${host.id || 'air-horner'}.${host.className}@${Math.round(performance.now())}`))
            .observe(host, { attributes: true, attributeFilter: ['class'] });
        }
      });
      const Native = window.AudioContext || window.webkitAudioContext;
      if (Native) {
        const Wrapped = function (...args) {
          const context = new Native(...args);
          window.__media.contexts.push(context);
          return context;
        };
        Wrapped.prototype = Native.prototype;
        window.AudioContext = Wrapped;
        window.webkitAudioContext = Wrapped;
      }
      const proto = window.AudioBufferSourceNode && window.AudioBufferSourceNode.prototype;
      if (proto && proto.start) {
        const originalStart = proto.start;
        const originalStop = proto.stop;
        // The live set is what makes a leaked source observable: a source that is
        // started and never stopped, or never reaches 'ended', stays in it, and
        // its loop flag says whether it is still sounding (paul-kinlan-me-6vy).
        proto.start = function (...args) {
          window.__media.starts += 1;
          window.__media.lastSource = this;
          window.__media.live.add(this);
          this.addEventListener('ended', () => window.__media.live.delete(this));
          return originalStart.apply(this, args);
        };
        proto.stop = function (...args) {
          window.__media.live.delete(this);
          return originalStop.apply(this, args);
        };
      }
    });
    await page.goto(`${base}${demo.path}`, { waitUntil: 'load' });
    await page.waitForSelector('air-horner');
    // The Horn preloads its buffer on connect; let that settle so an activation
    // starts a source synchronously and the counters are deterministic.
    await page.waitForFunction('window.__media.contexts.length > 0', { timeout: 5000 });
    await page.waitForFunction(() => performance.getEntriesByType('resource').some((e) => e.name.endsWith('.mp3')), { timeout: 5000 });
    await new Promise((resolve) => setTimeout(resolve, 400));

    const before = await state(page);
    check(`[${demo.what}] the control is a native type=button with the page's name`, before.role === 'BUTTON' && before.type === 'button' && before.name === demo.name,
      `<${(before.role || 'no button').toLowerCase()} type=${before.type} aria-label=${JSON.stringify(before.name)}>`);
    check(`[${demo.what}] the button is the tab stop and fills the 300px host`, before.tabIndex === 0
      && before.buttonBox.width === before.hostBox.width && before.buttonBox.height === before.hostBox.height,
      `tabIndex=${before.tabIndex} button=${JSON.stringify(before.buttonBox)} host=${JSON.stringify(before.hostBox)}`);
    check(`[${demo.what}] the art is unchanged (fallback ${demo.fallbackRendered ? 'fills the host' : 'is not rendered'})`,
      demo.fallbackRendered
        ? before.fallbackRects === 1 && before.fallbackBox.height > 200 && before.fallbackBox.width > 200
        : before.fallbackRects === 0 && before.buttonBackground === 'rgba(0, 0, 0, 0)' && before.slotted === true,
      `fallbackRects=${before.fallbackRects} fallback=${JSON.stringify(before.fallbackBox)} background=${before.buttonBackground} slotted=${before.slotted}`);
    const audio = await audioStatus(page, demo.audio);
    const relative404 = await page.evaluate(() => performance.getEntriesByType('resource').filter((e) => e.name.includes('/sounds/')).map((e) => [new URL(e.name).pathname, e.responseStatus ?? null]));
    check(`[${demo.what}] the audio the page loads is the shipped asset, fetched with a 200`, audio.status === 200,
      `${demo.audio} -> ${JSON.stringify(audio)}; requests under /sounds/: ${JSON.stringify(relative404)}`);

    // Evidence for a human: the two real pages as rendered. SHOT_SUFFIX keeps a
    // run's screenshots apart, so a before/after pair can be compared. Taken
    // before the interaction checks so a failing run still leaves the picture.
    const shot = evidencePath(`air-horner-${demo.what.replace(/\W+/g, '-')}${process.env.SHOT_SUFFIX ?? ''}.png`);
    const host = await page.$('air-horner');
    await host.screenshot({ path: shot });
    console.log(`evidence: ${shot}`);

    // --- A. accessible name/role, from Chrome's accessibility tree ------------
    const buttons = await namedButtons(page);
    check(`[${demo.what}] the accessibility tree exposes a button named ${JSON.stringify(demo.name)}`,
      buttons.filter((name) => name === demo.name).length === 1, JSON.stringify(buttons));

    // --- B. sequential focus -------------------------------------------------
    const tabs = await tabUntilFocused(page, 400);
    check(`[${demo.what}] Tab from the top of the document reaches the control`, tabs > 0, tabs > 0 ? `after ${tabs} tab(s)` : 'never focused');

    // --- D. focus indication -------------------------------------------------
    const focused = await state(page);
    check(`[${demo.what}] the keyboard focus is visible (:focus-visible with a 3px outline)`,
      focused.focusVisible === true && /3px/.test(focused.outline), `:focus-visible=${focused.focusVisible} outline=${focused.outline}`);

    // Focus delegated to the shadow button when the host is focused (the host
    // carries no role, so delegatesFocus is the documented shape for a component
    // wrapping a focusable control).
    const delegated = await page.$eval('air-horner', (host) => {
      host.focus();
      return { active: document.activeElement === host, inner: host.shadowRoot.activeElement ? host.shadowRoot.activeElement.id : null };
    });
    check(`[${demo.what}] focusing the host forwards focus to the shadow button`,
      delegated.active === true && delegated.inner === 'horn-button', JSON.stringify(delegated));

    // --- C. Space, then Enter: hold starts and loops, release stops ----------
    for (const key of ['Space', 'Enter']) {
      const beforeKey = (await media(page)).starts;
      await page.keyboard.down(key);
      await new Promise((resolve) => setTimeout(resolve, 150));
      const held = await state(page);
      const starts = (await media(page)).starts;
      check(`[${demo.what}] holding ${key} sounds the horn (one looping source, context running)`,
        held.horning === true && starts === beforeKey + 1 && held.lastLoop === true && held.contextState === 'running',
        `horning=${held.horning} starts=${starts - beforeKey} loop=${held.lastLoop} context=${held.contextState}`);
      await page.keyboard.up(key);
      await new Promise((resolve) => setTimeout(resolve, 350));
      const released = await state(page);
      check(`[${demo.what}] releasing ${key} stops it, with no second activation from the click the key also fires`,
        released.horning === false && released.lastLoop === false && released.loopingSources === 0 && (await media(page)).starts === starts,
        `horning=${released.horning} loop=${released.lastLoop} looping=${released.loopingSources} extraStarts=${(await media(page)).starts - starts}`);
    }

    // --- E. mouse and touch --------------------------------------------------
    // Scroll it into the viewport first and move the pointer to its centre (the
    // keyboard checks above move focus, and a coordinate outside the viewport
    // would send the pointer at the page instead of the control). hover() uses
    // scrollIntoViewIfNeeded, which is instant - scrollIntoView is animated
    // because the site styles smooth scrolling.
    const element = await page.$('air-horner');
    await element.hover();
    const box = await page.$eval('air-horner', (host) => {
      const rect = host.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, top: Math.round(rect.top), viewport: [innerWidth, innerHeight] };
    });
    check(`[${demo.what}] the control is inside the viewport where the pointer tests aim`, box.y > 0 && box.y < box.viewport[1], JSON.stringify(box));
    const beforeMouse = (await media(page)).starts;
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await new Promise((resolve) => setTimeout(resolve, 120));
    const mouseHeld = await state(page);
    await page.mouse.up();
    await new Promise((resolve) => setTimeout(resolve, 300));
    const mouseUp = await state(page);
    check(`[${demo.what}] mouse down starts and mouse up stops`,
      mouseHeld.horning === true && mouseUp.horning === false && mouseUp.lastLoop === false
      && (await media(page)).starts === beforeMouse + 1,
      `down=${mouseHeld.horning} up=${mouseUp.horning} starts=${(await media(page)).starts - beforeMouse} at=${JSON.stringify(box)}`);

    const beforeTouch = (await media(page)).starts;
    await page.evaluate('window.__events.length = 0');
    await page.touchscreen.touchStart(box.x, box.y);
    await new Promise((resolve) => setTimeout(resolve, 120));
    const touchHeld = await state(page);
    await page.touchscreen.touchEnd();
    await new Promise((resolve) => setTimeout(resolve, 300));
    const touchUp = await state(page);
    check(`[${demo.what}] touch start starts and touch end stops`,
      touchHeld.horning === true && touchUp.horning === false && (await media(page)).starts === beforeTouch + 1,
      `start=${touchHeld.horning} end=${touchUp.horning} starts=${(await media(page)).starts - beforeTouch} at=${JSON.stringify(box)} events=${JSON.stringify(await page.evaluate('window.__events'))} classes=${JSON.stringify(await page.evaluate('window.__classLog'))}`);

    // A gesture the platform cancels, and a window that loses focus mid-press,
    // both have to stop the horn: no release event is coming for either.
    const beforeCancel = (await media(page)).starts;
    await page.touchscreen.touchStart(box.x, box.y);
    await new Promise((resolve) => setTimeout(resolve, 120));
    const cancelHeld = await state(page);
    await page.evaluate(`(() => {
      const button = document.querySelector('air-horner').shadowRoot.querySelector('#horn-button');
      return button.dispatchEvent(new TouchEvent('touchcancel', { bubbles: true, composed: true }));
    })()`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const cancelStopped = await state(page);
    check(`[${demo.what}] a cancelled touch stops the horn`,
      cancelHeld.horning === true && cancelStopped.horning === false, `held=${cancelHeld.horning} after=${cancelStopped.horning}`);

    await page.keyboard.down('Space');
    await new Promise((resolve) => setTimeout(resolve, 120));
    const keyHeld = await state(page);
    await page.evaluate(`window.dispatchEvent(new Event('blur'))`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const blurStopped = await state(page);
    check(`[${demo.what}] the window losing focus mid-press stops the horn`,
      keyHeld.horning === true && blurStopped.horning === false, `held=${keyHeld.horning} afterBlur=${blurStopped.horning}`);
    await page.keyboard.up('Space');
    await new Promise((resolve) => setTimeout(resolve, 150));
    const afterRelease = await state(page);
    check(`[${demo.what}] the release that arrives after a cancel does not re-start anything`,
      afterRelease.horning === false && (await media(page)).starts === beforeCancel + 2,
      `horning=${afterRelease.horning} starts=${(await media(page)).starts - beforeCancel} (expected 2: the cancelled touch and the key press)`);

    // Overlapping presses must sound ONE source, and the LAST release must stop
    // it: each press used to start its own source and overwrite the single
    // source slot, so the older one kept looping for ever after both releases
    // (paul-kinlan-me-6vy).
    const beforeOverlap = (await media(page)).starts;
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await new Promise((resolve) => setTimeout(resolve, 120));
    const mouseOnly = await state(page);
    await page.keyboard.down('Space');
    await new Promise((resolve) => setTimeout(resolve, 120));
    const overlapped = await state(page);
    await page.keyboard.up('Space');
    await new Promise((resolve) => setTimeout(resolve, 120));
    const keyReleased = await state(page);
    await page.mouse.up();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allReleased = await state(page);
    check(`[${demo.what}] overlapping mouse and Space sound ONE source, and the last release stops it`,
      mouseOnly.horning === true && overlapped.horning === true && keyReleased.horning === true
      && allReleased.horning === false && allReleased.loopingSources === 0
      && (await media(page)).starts === beforeOverlap + 1,
      `mouse=${mouseOnly.horning} overlap=${overlapped.horning} keyUp=${keyReleased.horning} allUp=${allReleased.horning} starts=${(await media(page)).starts - beforeOverlap} looping=${allReleased.loopingSources}`);
    const drained = await page.waitForFunction('window.__media.live.size === 0', { timeout: 2500 }).then(() => true).catch(() => false);
    const settled = await state(page);
    check(`[${demo.what}] the released source is not leaked: it stops looping and drains`,
      allReleased.loopingSources === 0 && drained === true && settled.liveSources === 0,
      `loopingAtRelease=${allReleased.loopingSources} drained=${drained} liveAfter=${settled.liveSources}`);

    // A release before the first audio fetch resolves must not create a source
    // afterwards: the fetch callback used to start a looping source for a press
    // that was already over (paul-kinlan-me-6vy). /slow-airhorn.wav answers after
    // 700ms.
    await page.evaluate(() => {
      const host = document.createElement('air-horner');
      host.id = 'cold-horn';
      host.setAttribute('src', '/slow-airhorn.wav');
      host.setAttribute('label', 'Cold horn');
      document.body.appendChild(host);
      return true;
    });
    await page.$eval('#cold-horn', (host) => { host.focus(); return true; });
    const beforeCold = (await media(page)).starts;
    await page.keyboard.down('Space');
    await new Promise((resolve) => setTimeout(resolve, 150));
    const coldHeld = await state(page, '#cold-horn');
    await page.keyboard.up('Space');
    await new Promise((resolve) => setTimeout(resolve, 900)); // past the delayed response
    const coldReleased = await state(page, '#cold-horn');
    check(`[${demo.what}] a release before the audio load resolves creates no source at all`,
      coldHeld.horning === true && coldReleased.horning === false && coldReleased.liveSources === 0
      && (await media(page)).starts === beforeCold,
      `held=${coldHeld.horning} after=${coldReleased.horning} starts=${(await media(page)).starts - beforeCold} live=${coldReleased.liveSources} looping=${coldReleased.loopingSources}`);

    // --- F/G. a discrete activation plays exactly one horn -------------------
    const added = await page.evaluate(() => {
      const host = document.createElement('air-horner');
      host.setAttribute('src', '/tone.wav');
      host.setAttribute('label', 'Short horn');
      host.id = 'one-shot';
      document.body.appendChild(host);
      return true;
    });
    assert.ok(added);
    await page.waitForFunction(() => performance.getEntriesByType('resource').some((e) => e.name.endsWith('/tone.wav')), { timeout: 5000 });
    await new Promise((resolve) => setTimeout(resolve, 400));
    const beforeClick = (await media(page)).starts;
    const clicked = await page.evaluate(`(() => {
      const host = document.querySelector('#one-shot');
      const button = host.shadowRoot.querySelector('#horn-button');
      if (!button) return { hasButton: false, horning: host.classList.contains('horning') };
      button.click();
      button.click(); // a second activation while the first is still sounding
      return { hasButton: true, horning: host.classList.contains('horning') };
    })()`);
    const oneShotStarts = (await media(page)).starts;
    check(`[${demo.what}] an assistive-technology click plays one non-looping horn (a second click does not stack sources)`,
      clicked.hasButton === true && clicked.horning === true && oneShotStarts === beforeClick + 1,
      `hasButton=${clicked.hasButton} horning=${clicked.horning} starts=${oneShotStarts - beforeClick}`);
    const stopped = await page.waitForFunction(`!document.querySelector('#one-shot').classList.contains('horning')`, { timeout: 2000 })
      .then(() => true).catch(() => false);
    const afterOneShot = await page.evaluate(`(() => {
      const media = window.__media;
      const host = document.querySelector('#one-shot');
      return { loop: media.lastSource ? media.lastSource.loop : null, horning: host.classList.contains('horning'), starts: media.starts };
    })()`);
    check(`[${demo.what}] the one horn ends by itself and clears the sounding state`,
      stopped === true && afterOneShot.horning === false && afterOneShot.loop === false && afterOneShot.starts === oneShotStarts,
      `stopped=${stopped} horning=${afterOneShot.horning} loop=${afterOneShot.loop} starts=${afterOneShot.starts}`);

    await page.close();
  }
} catch (error) {
  failures += 1;
  console.error(`FAIL: the gate could not run: ${error && error.stack ? error.stack : error}`);
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
}

console.log(failures === 0 ? 'air-horner browser gate: PASS' : `air-horner browser gate: FAIL (${failures})`);
process.exit(failures === 0 ? 0 : 1);
