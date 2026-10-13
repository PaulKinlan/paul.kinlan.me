// Guard for bead paul-kinlan-me-brm: the palette demo's copy has to be readable.
//
// static/css/material.css is loaded by exactly one post
// (content/2016-11-29-material-color-pallette.markdown, which links /css/material.css) and its
// `.box` card is the demo: a white 128px card carrying a colour name (`.box h1`, 14px) and the
// hex below it. `.box p` was 11px #999999 - under the 12px readability floor the factory's
// illegible-micro-typography rule flags, and 2.85:1 on the card's white, under WCAG AA's 4.5:1.
//
// What this pins, and why it reads two files:
//   1. the size is expressed in rem, not px. The Modern Web Guidance typography guide is explicit
//      ("DON'T use px for font-size. Prefer rem to honor the user's browser font-size
//      preferences"), so the floor is stated as 0.75rem and the unit is asserted - a future
//      `12px` would satisfy the number while losing the property the guide asks for.
//   2. the colour is a design token, not a hand-picked hex. The color guide says to check for an
//      existing token before generating a shade, and the token is RESOLVED FROM ITS DEFINITION in
//      assets/css/open-props.css so that editing the ramp cannot quietly drop the demo under 4.5:1.
//      --gray-7 rather than --text-2 is deliberate: the card's background is hardcoded #FFFFFF, and
//      --text-2 flips to --gray-4 (#ced4da, ~1.6:1 on white) under prefers-color-scheme: dark, while
//      --gray-7 is #495057 in both schemes.
//   3. the numbers are not vacuous: the old pair is asserted to FAIL the ratio, so a test that
//      silently stopped measuring contrast could not pass by accident.
//
// Computed rendering (font-size in px, contrast on the real card, layout, no vertical clipping) is
// measured in Chrome by /tmp/hhn-evidence/palette-legibility.mjs - this tier only makes sure a
// future edit cannot reintroduce either defect and still be reported as covered by a green fast
// gate. Reads two committed files, touches no shared state, so it is order-independent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../static/css/material.css', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('../assets/css/open-props.css', import.meta.url), 'utf8');
const normalize = readFileSync(new URL('../assets/css/open-props-normalize.css', import.meta.url), 'utf8');

// The declarations of `selector { ... }`, comments stripped so a comment cannot satisfy a check.
// The opening brace is searched for rather than assumed, because material.css is hand-written
// (`selector {`) while open-props.css is minified (`selector{`).
const declarationsOf = (selector, source = css) => {
  const start = source.indexOf(selector);
  assert.ok(start >= 0, `${selector} must exist in the source under test`);
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open);
  return source.slice(open + 1, close).replace(/\/\*[\s\S]*?\*\//g, '');
};

const declaration = (block, property) => {
  const match = block.match(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`));
  return match ? match[1].trim() : null;
};

// WCAG 2.1 relative luminance and contrast ratio.
const srgbToLinear = (channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
const luminance = (hex) => {
  const value = hex.replace('#', '');
  const parts = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
  const [r, g, b] = parts.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrastRatio = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

// Resolve `var(--token)` against the ramp the site loads, so the assertion is about the colour a
// reader actually gets rather than about the string in this file.
const resolveColour = (value) => {
  const token = value.match(/^var\((--[\w-]+)\)$/);
  if (!token) return value;
  const defined = tokens.match(new RegExp(`${token[1]}\\s*:\\s*(#[0-9a-fA-F]{3,8})`));
  assert.ok(defined, `${token[1]} must be defined in assets/css/open-props.css, the ramp this page `
    + 'loads: a semantic token like --text-2 lives in open-props-normalize.css and is deliberately not '
    + 'resolved here, because it is scheme-dependent (see the last test) while this card is not');
  return defined[1];
};

test('the palette demo copy is at least the 12px floor, in rem', () => {
  const size = declaration(declarationsOf('.box p'), 'font-size');
  assert.ok(size, '.box p must declare a font-size');
  const rem = size.match(/^([\d.]+)rem$/);
  assert.ok(rem, `the size must be in rem (Modern Web Guidance: "DON'T use px for font-size"), found ${size}`);
  // 0.75rem is 12px at the 16px root the built page has (measured in Chrome, see the browser gate).
  assert.ok(Number(rem[1]) >= 0.75, `0.75rem (12px) is the floor, found ${size}`);
});

test('the palette demo copy holds AA contrast on the card, from a design token', () => {
  const block = declarationsOf('.box p');
  const colour = declaration(block, 'color');
  assert.match(colour, /^var\(--[\w-]+\)$/, `the colour must come from a design token, found ${colour}`);
  const background = resolveColour(declaration(declarationsOf('.box'), 'background-color'));
  const ratio = contrastRatio(resolveColour(colour), background);
  assert.ok(ratio >= 4.5, `${colour} on ${background} is ${ratio.toFixed(2)}:1, below WCAG AA's 4.5:1`);
});

test('the ratio check is live: the pair this bead replaced really did fail it', () => {
  const background = resolveColour(declaration(declarationsOf('.box'), 'background-color'));
  const old = contrastRatio('#999999', background);
  assert.ok(old < 4.5, `the pre-change #999999 on ${background} must measure under 4.5:1, got ${old.toFixed(2)}:1`);
});

test('the token is the scheme-stable one, not the semantic secondary-text token', () => {
  // --text-2 is the tempting choice (it is literally the site's secondary text colour), but it is
  // scheme-dependent: light is --gray-7, dark is --gray-4 (#ced4da, ~1.6:1 on white) - and this
  // card's background is hardcoded #FFFFFF, so it does not follow the scheme.
  assert.match(normalize, /--text-2:\s*var\(--gray-7\)/, 'light-mode --text-2 resolves to --gray-7');
  assert.match(normalize, /prefers-color-scheme:\s*dark\)[\s\S]*?--text-2:\s*var\(--gray-4\)/,
    'dark-mode --text-2 resolves to --gray-4, which is why the rule must not use it');
  // --gray-7 itself is not redefined per scheme: every dark block in the ramp file touches shadows only.
  const darkBlocks = tokens.split(/@media\s*\(prefers-color-scheme:\s*dark\)/).slice(1);
  assert.ok(darkBlocks.length > 0, 'the ramp file has a dark-mode block, so the loop below is not vacuous');
  for (const block of darkBlocks) {
    assert.doesNotMatch(block, /--gray-7\s*:/, '--gray-7 must stay #495057 in both schemes');
  }
});
