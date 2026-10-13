// Source contract for static/javascripts/air-horner.js, the <air-horner> Web
// Component the airhorner-customelement and jakehorner project pages load
// (paul-kinlan-me-lk2).
//
// The control was pointer-only: a bare custom element that listened for
// mousedown/touchstart, with no role, no accessible name, no tab stop and no
// keyboard behaviour - so it was unreachable and unnameable for anyone not using
// a mouse, and the two decorative jakehead/jakemouth sprites were the only thing
// near it that could have been mistaken for the control.
//
// These are the habits that can only come back through a hand edit, so they are
// pinned here rather than left to prose:
//
//   1. THE CONTROL IS A NATIVE BUTTON in the shadow root. It carries the role,
//      the tab stop, the accessible name and Enter/Space for free, and the
//      stylesheet reset is what keeps the art (the fallback .horn, or slotted
//      content) as all that shows. A bare <div> with ARIA patched on is exactly
//      what was there before.
//   2. HOLD / RELEASE. The horn is press-and-hold, so keydown starts it and keyup
//      stops it. A button also produces a click for that same key press (Enter on
//      keydown, Space on keyup), so the click path has to tell a keyboard click
//      apart from an assistive-technology one or the horn would double-activate -
//      the same duplicate that was removed from share-button
//      (paul-kinlan-me-snr).
//   3. ONE HORN PER DISCRETE ACTIVATION. A click with no release to wait for
//      plays a single horn (loop: false); a held press loops.
//   4. THE DEFAULT AUDIO IS THE ASSET THIS SITE SHIPS. The old relative
//      './sounds/airhorn.mp3' resolved against the page, so on
//      /projects/airhorner-customelement/ it 404'd and the plain <air-horner> had
//      no media at all - no sound on any input.
//
// Behavioural evidence lives in tests/air-horner.browser.mjs (real Chrome:
// accessibility tree, Tab reachability, Space/Enter hold and release, mouse,
// touch, an AT click, focus indication and the audio graph). This tier only
// keeps a future green fast gate from re-reporting the regression as covered.
// Reads one committed file and touches no shared state, so it is order-independent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const raw = readFileSync(new URL('../static/javascripts/air-horner.js', import.meta.url), 'utf8');
// Comments are stripped before the checks: the file documents the old default
// path and the double-activation history in prose, and prose is not a
// reintroduced call. Only `//` that does not follow a colon is stripped, because
// the asset's XML namespaces (http://www.w3.org/2000/svg) must survive.
const code = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

test('the asset still defines the air-horner element', () => {
  assert.match(code, /class AirHorner extends HTMLElement/, 'the element class is what tests/air-horner.browser.mjs drives');
  assert.match(code, /customElements\.define\('air-horner'/, 'the asset must still register the element');
});

test('the control is a native shadow button layered over the art', () => {
  assert.match(code, /<button id='horn-button' type='button'><\/button>/,
    'the interactive surface must be a real (empty) <button type="button"> inside the shadow root');
  assert.match(code, /root\.querySelector\("#horn-button"\)/,
    'the keyboard, click and blur handlers have to be attached to that button');
  // The art keeps its own place in the DOM: wrapping the slot moved the slotted
  // jakehorner art by ~200px in Chrome, which centres a button's content box.
  assert.doesNotMatch(code, /<button[^>]*>\s*<slot>/, 'the button must not wrap the slot');
  assert.match(code, /<slot>\s*<div class='horn'>/, 'the fallback art stays a direct child of the slot');
  assert.match(code, /#horn-button\s*\{[^}]*position: absolute/, 'the button overlays the art rather than containing it');
  // type="button" matters: inside a <form> a submit button would submit it.
  assert.doesNotMatch(code, /<button id='horn-button'(?! type='button')/, 'the button must be type="button"');
});

test('the shadow stylesheet resets the button and gives it a focus indication', () => {
  assert.match(code, /#horn-button\s*\{[^}]*appearance: none/,
    'the UA button look must be reset so the art is all that shows');
  assert.match(code, /#horn-button:focus-visible\s*\{[^}]*outline:/,
    'keyboard focus needs a visible indicator (:focus-visible, so a mouse click does not flash a ring)');
});

test('the button carries the accessible name, defaulted and settable', () => {
  assert.match(code, /static get observedAttributes\(\)\s*\{\s*return \['label'\]/,
    'the label attribute must be observed so a renamed control stays named in the accessibility tree');
  assert.match(code, /getAttribute\('label'\) \|\| 'Air horn'/,
    'the element needs a default accessible name, not an empty one');
  assert.match(code, /this\._button\.setAttribute\('aria-label', this\.label\)/,
    "the name belongs on the shadow button: the host carries no role, and aria-labelledby cannot cross the shadow boundary");
});

test('keyboard activation is press-and-hold on Enter and Space', () => {
  assert.match(code, /_button\.addEventListener\('keydown'/, 'keydown must start the horn');
  assert.match(code, /_button\.addEventListener\('keyup'/, 'keyup must stop the horn');
  assert.match(code, /e\.key === ' ' \|\| e\.key === 'Enter' \|\| e\.key === 'Spacebar'/,
    'Enter and Space are the two activations a button must support');
  assert.match(code, /if\(e\.repeat === true\) return;/,
    'key auto-repeat must not restart the horn on every repeat keydown');
  // Space would scroll the page, and preventDefault is also what keeps the
  // browser from firing a click on top of the press this handler already started.
  assert.ok((code.match(/e\.preventDefault\(\)/g) ?? []).length >= 2,
    'both the keydown and keyup handlers must preventDefault');
});

test('a keyboard click is not treated as a second activation', () => {
  assert.match(code, /_keyboardActivated = true/, 'keydown must record that this press owns the click it may produce');
  assert.match(code, /if\(this\._keyboardActivated === true\)\s*\{\s*this\._keyboardActivated = false;/,
    'the click produced by the same key press must be consumed, not treated as a discrete activation');
});

test('a discrete activation plays one horn, a held press loops', () => {
  assert.match(code, /hornOptions\(false\)/, 'an assistive-technology click has no release to wait for, so it plays one horn');
  assert.match(code, /hornOptions\(true\)/, 'a pointer or key press loops while it is held');
  assert.match(code, /if\(e\.detail > 0\) return;/,
    'a real mouse click already ran mousedown/mouseup and must not be handled again as an AT click');
  assert.match(code, /if\(this\.classList\.contains\('horning'\)\) return;/,
    'a second activation while the one-shot is still sounding must not stack sources');
});

test('the default audio path is the asset this site ships, not a page-relative 404', () => {
  assert.doesNotMatch(code, /'\.\/sounds\/airhorn\.mp3'/, "the relative './sounds/airhorn.mp3' 404s on every page that loads this element");
  const defaults = code.match(/'\/audio\/airhorn\.mp3'/g) ?? [];
  assert.equal(defaults.length, 2, `expected the default source at both the preload and the play site, found ${defaults.length}`);
});

test('the shadow root delegates focus to the button', () => {
  // The host wraps a focusable control, so focusing the host must forward focus
  // to it (accessible-web-components: delegatesFocus on a component whose
  // internal control owns the semantics, with no role/state on the host).
  assert.match(code, /attachShadow\(\{mode:'open', delegatesFocus: true\}\)/,
    'the shadow root must delegate focus to the button');
  assert.doesNotMatch(code, /this\.setAttribute\('role'/, 'the host carries no role of its own to combine with delegatesFocus');
});

test('a press with no release cannot leave the horn running', () => {
  assert.match(code, /addEventListener\('touchcancel', stopHandler\)/, 'a cancelled touch must stop the horn');
  assert.match(code, /window\.addEventListener\('blur'/, 'the window losing focus mid-press must stop the horn');
  assert.match(code, /_cancelHeld\(\)\s*\{[^}]*this\._pointerHeld = false;[^}]*this\._keyHeld = false;/,
    'the cancel must forget the held press, not just stop the sound');
});

test('a released source cannot cut off a horn that starts afterwards', () => {
  // The audio source is a single slot per element and its onended fires when a
  // released source reaches the end of its loop or buffer. Unguarded, that
  // handler stopped whatever was playing by then, so a tap shortly after a
  // release was cut off (found by the mouse-then-touch sequence in
  // tests/air-horner.browser.mjs).
  assert.match(code, /const playingSource = source;/, 'the source that owns the onended must be captured');
  assert.match(code, /if \(source === playingSource\) self\.stop\(\);/,
    'onended must only stop the horn while it is still that source that is current');
});

test('the document-level release only stops a horn this instance is holding', () => {
  assert.match(code, /this\._pointerHeld = true;/, 'the press has to be tracked per instance');
  assert.match(code, /if\(this\._pointerHeld !== true\) return;/,
    'every instance listens for the document mouseup, so an unheld instance must not stop a horn');
});

// The two published pages that load the element must name it: the default is a
// fallback, not the description a reader hears. The name reaches the control from
// the host attribute, so a page that drops it silently goes back to "Air horn".
const demos = {
  'projects/airhorner-customelement.markdown': 'Play air horn',
  'projects/jakehorner.markdown': 'Play the Jake horner',
};

for (const [file, label] of Object.entries(demos)) {
  test(`${file} embeds <air-horner> with an accessible name`, () => {
    const source = readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8');
    // Only tags that stand on their own line: the backticked `<air-horner>` in
    // the frontmatter summary is prose, not an element the page renders.
    const tags = [...source.matchAll(/^\s*<air-horner\b[^>]*>/gm)].map(([tag]) => tag.trim());
    assert.ok(tags.length > 0, `${file} must still embed <air-horner>`);
    for (const tag of tags) {
      assert.ok(tag.includes(`label="${label}"`), `expected label="${label}" on ${tag} in ${file}`);
    }
  });
}
