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
import { runInNewContext } from 'node:vm';

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

// 5. THE ANDROID INTENT IS BUILT FROM ENCODED PARTS (factory-delta
//    paul-kinlan-me-hy1i). The intent:// payload is a ';'-delimited field list, so
//    a value interpolated raw can close its own field and add extras. Titles here
//    are site-authored, so this was defence in depth rather than an exploit - but
//    the asset is minified and hand-edited, so the two habits are pinned: the
//    intent is built by one method, and every part of it is encoded.
test('the Android intent is built by one method from encoded parts', () => {
  assert.match(code, /static androidIntent\(url,title\)\{/, 'the intent must be built by ShareButton.androidIntent');
  assert.match(code, /window\.location=ShareButton\.androidIntent\(this\.url\.value,document\.title\)/,
    'the fallback path must call it with the share URL and the document title');
  assert.doesNotMatch(code, /S\.android\.intent\.extra\.SUBJECT=\$\{document\.title\}/,
    'document.title must never be interpolated into the intent unencoded');
  // Every interpolation inside the intent template goes through encodeURIComponent.
  const body = code.slice(code.indexOf('static androidIntent('), code.indexOf('constructor(){'));
  const interpolations = body.match(/\$\{[^}]*\}/g) ?? [];
  assert.ok(interpolations.length >= 3, `expected the intent's parts to be interpolated (found ${interpolations.length})`);
  for (const interpolation of interpolations) {
    assert.match(interpolation, /^\$\{encodeURIComponent\(/, `unencoded interpolation in the intent: ${interpolation}`);
  }
});

// Behavioural evidence for the same habit, on the shipped bytes: the asset is a
// classic script, so it is evaluated in a vm context with the two globals it
// touches at load time and the class it registers is captured. Everything below
// then runs the real androidIntent() the browser runs.
const loadAsset = () => {
  let registered = null;
  runInNewContext(code, {
    HTMLElement: class {},
    customElements: { define: (name, cls) => { registered = { name, cls }; } },
    // navigationUrl() parses with new URL() - a host object the vm context does
    // not provide on its own, so the behavioural test below supplies it.
    URL,
  });
  assert.ok(registered, 'the asset did not register an element');
  return registered.cls;
};

const intentFields = (intent) => {
  assert.ok(intent.startsWith('intent:#Intent;'), 'an Android intent URI');
  assert.ok(intent.endsWith(';end'), 'the intent is terminated once');
  const body = intent.slice('intent:#Intent;'.length, -';end'.length);
  return body.split(';');
};

for (const title of [
  'Web intents; there is more',
  'x; S.evil=1; end',
  'x#Intent;S.evil=2;end',
  'quote " and ampersand & and equals =',
]) {
  test(`a title cannot restructure the intent: ${JSON.stringify(title)}`, () => {
    const ShareButton = loadAsset();
    const url = 'https://paul.kinlan.me/example/?a=1&b=2';
    const intent = ShareButton.androidIntent(url, title);
    const fields = intentFields(intent);

    // Exactly the five fields the intent defines - nothing the title said.
    assert.deepEqual(
      fields.map((field) => field.slice(0, field.indexOf('='))),
      ['action', 'type', 'S.android.intent.extra.TEXT', 'S.android.intent.extra.SUBJECT', 'S.browser_fallback_url'],
      `a title injected a field: ${JSON.stringify(fields)}`,
    );
    const value = (name) => decodeURIComponent(fields.find((field) => field.startsWith(`${name}=`)).slice(name.length + 1));
    assert.equal(value('S.android.intent.extra.TEXT'), url, 'the shared URL round-trips');
    assert.equal(value('S.android.intent.extra.SUBJECT'), title, 'the title round-trips exactly, encoded');
    if (/[;=#]/.test(title)) {
      // The hostile characters live inside the SUBJECT value, percent-encoded,
      // which is the only reason the field list above stayed five long.
      const subjectField = fields.find((field) => field.startsWith('S.android.intent.extra.SUBJECT='));
      assert.ok(!/[;=#]/.test(subjectField.slice('S.android.intent.extra.SUBJECT='.length)),
        'no raw field separator, separator-pair or intent fragment survives inside the encoded value');
    }

    // The fallback is ONE parameter whose own query is intact, not a bare '&'
    // gluing the page location on with no name.
    const fallback = new URL(value('S.browser_fallback_url'));
    assert.equal(fallback.origin + fallback.pathname, 'https://twitter.com/intent/tweet');
    assert.deepEqual([...fallback.searchParams.keys()], ['text', 'url'], 'the fallback names both parameters');
    assert.equal(fallback.searchParams.get('text'), title);
    assert.equal(fallback.searchParams.get('url'), url, 'the fallback points at the URL being shared');
  });
}

// 6. THE URL INPUT'S ENTER NAVIGATION IS SCHEME-GATED (paul-kinlan-me-zhsb).
//    The keypress handler used to assign the raw typed value to window.location,
//    so a javascript: or data: value went straight to the navigation sink. The
//    raw-value assignment must be gone, the guard must be the handler's path,
//    and navigationUrl() itself is driven on the shipped bytes below.
test('the url input Enter navigation accepts only http(s) (paul-kinlan-me-zhsb)', () => {
  assert.doesNotMatch(code, /window\.location=f\.currentTarget\.value/,
    'the raw typed value must never be assigned to window.location');
  assert.match(code, /13==f\.charCode&&this\.navigateToUrl\(f\.currentTarget\.value\)/,
    'Enter on the url input must route through the scheme gate');
  assert.match(code, /navigateToUrl\(a\)\{const b=ShareButton\.navigationUrl\(a\);b&&\(window\.location=b\)\}/,
    'only a value the gate accepts may reach window.location');

  // The real navigationUrl(), off the shipped bytes: two accepted schemes, and
  // the rejection set the bead named plus the parse failures.
  const ShareButton = loadAsset();
  for (const [value, expected] of [
    ['https://paul.kinlan.me/example/', 'https://paul.kinlan.me/example/'],
    ['http://127.0.0.1:8080/x', 'http://127.0.0.1:8080/x'],
    ['javascript:alert(1)', null],
    ['data:text/html,x', null],
    ['file:///etc/passwd', null],
    ['intent:#Intent;end', null],
    ['not-a-url', null],
    ['', null],
  ]) {
    assert.equal(ShareButton.navigationUrl(value), expected, `navigationUrl(${JSON.stringify(value)})`);
  }
});
