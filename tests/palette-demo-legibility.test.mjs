// Source contract for the palette demo's copy in static/css/material.css (bead
// paul-kinlan-me-brm; the 12px/AA defect it fixes).
//
// static/css/material.css is loaded by exactly one post
// (content/2016-11-29-material-color-pallette.markdown, which links /css/material.css) and its
// `.box` card is the demo: a white 128px card carrying a colour name (`.box h1`, 14px) and the hex
// below it. `.box p` was 11px #999999 - under the 12px readability floor the factory's
// illegible-micro-typography rule flags, and 2.85:1 on the card's white, under WCAG AA's 4.5:1.
//
// WHAT THIS TIER MAY CLAIM, and what it may not (review findings paul-kinlan-me-d2j and -8lg):
// this file is read as text, so it can see what THIS rule declares and nothing else. It cannot see
// the cascade - the site inlines open-props + open-props-normalize-light + fonts + main into one
// <style> bubble (layouts/partials/head.html) and main.css may redefine a token after the ramp -
// and the first version of this guard got that wrong twice: first by resolving a token out of a
// stylesheet the page does not bundle, then by taking the FIRST `--gray-7` definition and ignoring
// later overrides (a final `:root{--gray-7:#aaaaaa}` renders 2.32:1 while a first-match resolver
// still reports 8.18:1). So this tier asserts only:
//   1. the caption's size is in rem, not px. The Modern Web Guidance typography guide is explicit
//      ("DON'T use px for font-size. Prefer rem to honor the user's browser font-size preferences"),
//      so the floor is stated as 0.75rem and the unit is asserted - a future `12px` would satisfy
//      the number while losing the property the guide asks for.
//   2. the caption's colour is a design token, not a hand-picked hex. The color guide says to check
//      for an existing token before generating a shade.
// The RESOLVED colour and the RENDERED contrast are deliberately NOT computed here: that is the
// browser gate's job, and it is where a cascade override is actually caught. It lives in
// tests/palette-demo.browser.mjs - manual, needs Chrome and a built site, and is deliberately not
// run by tools/fast-gate.sh (the node suites are `tests/*.test.mjs`), exactly like
// tests/share-button.browser.mjs. Therefore a change to a bundled stylesheet that overrides the
// token passes THIS tier and must be caught there; the fast verdict for material.css says the
// declarations were inspected, not that any rendered pixel was measured.
//
// Reads one committed file, touches no shared state, so it is order-independent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../static/css/material.css', import.meta.url), 'utf8');

// The declarations of `selector { ... }`, comments stripped so a comment cannot satisfy a check.
const declarationsOf = (selector) => {
  const start = css.indexOf(selector);
  assert.ok(start >= 0, `${selector} must exist in static/css/material.css`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  return css.slice(open + 1, close).replace(/\/\*[\s\S]*?\*\//g, '');
};

const declaration = (block, property) => {
  const match = block.match(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`));
  return match ? match[1].trim() : null;
};

test('the palette demo copy is at least the 12px floor, in rem', () => {
  const size = declaration(declarationsOf('.box p'), 'font-size');
  assert.ok(size, '.box p must declare a font-size');
  const rem = size.match(/^([\d.]+)rem$/);
  assert.ok(rem, `the size must be in rem (Modern Web Guidance: "DON'T use px for font-size"), found ${size}`);
  // 0.75rem is 12px at the 16px root the built page has (measured in Chrome by the browser gate).
  assert.ok(Number(rem[1]) >= 0.75, `0.75rem (12px) is the floor, found ${size}`);
});

test('the palette demo copy takes its colour from a design token, not a hex', () => {
  const colour = declaration(declarationsOf('.box p'), 'color');
  assert.ok(colour, '.box p must declare a colour');
  assert.match(colour, /^var\(--[\w-]+\)$/,
    `the colour must come from a design token (Modern Web Guidance: check for an existing token first), found ${colour}`);
});
