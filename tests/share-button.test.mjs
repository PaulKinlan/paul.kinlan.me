// Source contract for static/javascripts/share-button.js, the minified Web
// Component the 2017 share-button posts load (factory-delta paul-kinlan-me-il8).
//
// The asset is minified, generated from PaulKinlan/share-button and committed
// here, so the two habits this pins can only come back through a hand edit of the
// shipped file:
//
//   1. NO STYLE READ PER CONNECT. connectedCallback used to call
//      getComputedStyle() twice per instance to copy the button's native
//      background into --share-button-background-color, and called
//      document.queryCommandSupported('copy') - a deprecated call that forces a
//      style flush - so every connect forced a style recalculation (~2 per
//      instance) and wrote two inline styles. The shadow stylesheet now supplies
//      the background default and the support check is cached on the class.
//      Behavioural evidence lives in tests/share-button.browser.mjs (50
//      instances, zero calls and zero forced recalcs in Chrome) - this tier only
//      makes sure a future edit cannot quietly reintroduce either read and still
//      be reported as covered by a green fast gate.
//   2. NO UA-STRING SNIFFING. The Android intent:// fallback is gated on
//      navigator.userAgentData.platform (UA-CH), with exactly one cached
//      navigator.userAgent read as the fallback for browsers without UA-CH - so
//      a reduced UA string cannot change what renders, and the read happens once
//      per page rather than once per instance.
//   3. THE COPY PATH PREFERS THE CLIPBOARD API (factory-delta paul-kinlan-me-hhn).
//      copyUrl() used to be the deprecated pair - document.execCommand('copy')
//      after selecting the input, with document.queryCommandSupported('copy')
//      deciding visibility. It now writes with navigator.clipboard.writeText()
//      and keeps the selection + execCommand path as the fallback for an insecure
//      context or a rejected write, which is also what keeps the button visible
//      where the Clipboard API does not exist. The checks still short-circuit and
//      stay cached, so a modern browser never reaches the deprecated call.
//
// The browser gate is deliberately not run from tools/fast-gate.sh (it needs
// Chrome); this is the part that runs on every gate. Reads one committed file,
// touches no shared state, so it is order-independent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const raw = readFileSync(new URL('../static/javascripts/share-button.js', import.meta.url), 'utf8');
// Comments are stripped before the absence checks: the file documents both
// behaviours in a header comment, and prose is not a reintroduced call. Only
// `//` that does not follow a colon is stripped, because the asset's SVG XML
// namespaces (http://www.w3.org/2000/svg) must survive.
const code = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

test('the shipped asset still defines the share-button element', () => {
  assert.match(code, /class ShareButton extends HTMLElement/, 'the element class is what tests/share-button.browser.mjs drives');
  assert.match(code, /customElements\.define\('share-button'/, 'the minified asset must still register the element');
});

test('connectedCallback does no style read: the background default lives in the shadow stylesheet', () => {
  assert.doesNotMatch(code, /getComputedStyle/, 'getComputedStyle per connect is a forced style recalculation per instance; '
    + 'use var(--share-button-background-color,buttonface) in the #share-btn rule instead');
  assert.match(code, /#share-btn\{[^}]*background-color:var\(--share-button-background-color,buttonface\)/,
    '#share-btn must take its background from the custom property with a buttonface fallback');
  assert.match(code, /:host\{[^}]*--share-button-background-color:initial/,
    'the :host default is what makes the var() fallback apply');
  assert.equal((code.match(/--share-button-background-color/g) ?? []).length, 2,
    'the custom property belongs in the :host default and the #share-btn rule only: no inline setProperty from JS');
  assert.doesNotMatch(code, /setProperty/, 'no inline custom-property write from connectedCallback');
});

test('the copy button is decided by a cached capability check that prefers the Clipboard API', () => {
  const checks = code.match(/queryCommandSupported\('copy'\)/g) ?? [];
  assert.equal(checks.length, 1, `expected exactly one queryCommandSupported('copy') call (the cached legacy fallback), found ${checks.length}`);
  // document.queryCommandSupported forces a style recalculation, so it must sit
  // behind a static getter whose value is reused - the same shape as isAndroid -
  // and it must be the second arm of the ||, so a browser with the Clipboard API
  // short-circuits past it and never calls the deprecated command at all.
  assert.match(code,
    /static get canCopy\(\)\{return void 0===this\.copySupport&&\(this\.copySupport=!!\(navigator\.clipboard&&'function'==typeof navigator\.clipboard\.writeText\)\|\|!!\(document\.queryCommandSupported&&document\.queryCommandSupported\('copy'\)\)\),this\.copySupport\}/,
    'the copy-support check must cache its result, prefer navigator.clipboard.writeText, and fall back to queryCommandSupported');
  assert.match(code, /ShareButton\.canCopy&&this\.copy\.classList\.toggle\('visible'\)/,
    'connectedCallback must read the cached capability');
});

test('copying prefers navigator.clipboard.writeText and keeps execCommand as the fallback', () => {
  // paul-kinlan-me-hhn: the deprecated pair is now the fallback, not the path.
  assert.match(code, /navigator\.clipboard\.writeText\(this\.url\.value\)/,
    'the copied text must be the url input value the user sees, written through the Clipboard API');
  const execs = code.match(/document\.execCommand\('copy'\)/g) ?? [];
  assert.equal(execs.length, 1, `the selection + execCommand fallback must exist exactly once, found ${execs.length}`);
  // The async path's rejection handler is the fallback: a denied permission or an
  // insecure context must not leave the user with a button that silently does
  // nothing. Both the write and its rejection route through the same completion.
  assert.match(code,
    /copyUrl\(\)\{return navigator\.clipboard&&'function'==typeof navigator\.clipboard\.writeText\?navigator\.clipboard\.writeText\(this\.url\.value\)\.then\(\(\)=>this\.didCopy\(!0\),\(\)=>this\.copyUrlFallback\(\)\):this\.copyUrlFallback\(\)\}/,
    'copyUrl must try the Clipboard API first and route both a rejection and a missing API to the fallback');
  assert.match(code, /copyUrlFallback\(\)\{window\.getSelection\(\)\.removeAllRanges\(\)/,
    'the fallback is the legacy selection + execCommand path');
  assert.match(code, /didCopy\(a\)\{return a&&\(this\.toggleOverlay\(\),this\.dispatchEvent\(new Event\('copy-url',\{bubbles:!0,composed:!0\}\)\)\),a\}/,
    'both paths must complete through the same overlay toggle and copy-url event');
});

test('a failed copy reports failure instead of announcing a copy (paul-kinlan-me-9c9)', () => {
  // The completion is gated on the path's own result: copy-url and the overlay close only happen for
  // a copy that reported success. ExecCommand returning false (or throwing) and a rejected writeText
  // whose fallback also fails must therefore stay a visible failure, not a false success.
  assert.match(code, /didCopy\(a\)\{return a&&\(/,
    'didCopy must short-circuit before the overlay toggle and the event when the copy did not happen');
  assert.match(code, /copyUrlFallback\(\)\{[\s\S]*?const b=document\.execCommand\('copy'\);return window\.getSelection\(\)\.removeAllRanges\(\),this\.didCopy\(b\)/,
    'the fallback must pass execCommand\'s own result to didCopy, not assume success');
  assert.match(code, /catch\(b\)\{console\.error\(b\)\}return!1/,
    'a throwing execCommand must be contained and report false without touching the overlay or the event');
});

test('Android gating uses UA-CH with a single cached UA fallback, not a UA string test', () => {
  assert.doesNotMatch(code, /userAgent\.indexOf/, 'navigator.userAgent.indexOf is the sniffing this change removed');
  const uaReads = code.match(/navigator\.userAgent(?!Data)/g) ?? [];
  assert.equal(uaReads.length, 1, `expected exactly one navigator.userAgent read (the cached fallback), found ${uaReads.length}`);
  // One regex, so the shape is pinned as a whole: a static getter, a cache guard,
  // UA-CH preferred, the single UA read inside it, and the cache returned.
  assert.match(code,
    /static get isAndroid\(\)\{if\(void 0===this\.androidPlatform\)\{[\s\S]*?navigator\.userAgentData[\s\S]*?navigator\.userAgent[\s\S]*?\}return this\.androidPlatform\}/,
    'the Android decision must be a static getter that prefers navigator.userAgentData and caches the UA fallback');
  assert.match(code, /ShareButton\.isAndroid&&this\.android\.classList\.add\('visible'\)/,
    'connectedCallback must gate the Android fallback on the capability decision');
});

test('the native share path is gated on the capability, not on truthiness', () => {
  assert.match(code, /if\('function'==typeof navigator\.share\)/,
    "navigator.share must be called only when typeof navigator.share === 'function', so a non-callable value falls through to the intent:// fallback");
  assert.doesNotMatch(code, /if\(!!navigator\.share\)/, 'truthiness is not a capability check');
});

test('the shadow buttons expose accessible names and the keyboard toggles the overlay once', () => {
  // paul-kinlan-me-zn6: `aria-lable` is not an ARIA attribute, so it was ignored and
  // the two buttons fell back to their slotted content (an SVG) for a name.
  assert.doesNotMatch(code, /aria-lable/, 'aria-lable is the typo; the attribute must be aria-label');
  for (const name of ['Share URL', 'Mail to', 'Share on Android', 'Copy to clipboard']) {
    assert.ok(code.includes(name), `expected the accessible name ${JSON.stringify(name)} in the asset`);
  }
  // paul-kinlan-me-snr: Enter/Space on the focused shadow button already produce a
  // click, so a host keypress handler toggled a second time and the overlay closed
  // again immediately. Only the url input keeps a keypress handler.
  assert.equal((code.match(/addEventListener\('keypress'/g) ?? []).length, 1,
    'the host keypress toggle must stay removed (only the url input keeps a keypress handler)');
  assert.doesNotMatch(code, /addEventListener\('keypress',\(\)=>this\.toggleOverlay\(\)\)/,
    'no keypress handler may toggle the overlay');
});
