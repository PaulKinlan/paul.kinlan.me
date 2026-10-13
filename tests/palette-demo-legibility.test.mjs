// Guard for bead paul-kinlan-me-brm: the palette demo's copy has to be readable.
//
// static/css/material.css is loaded by exactly one post
// (content/2016-11-29-material-color-pallette.markdown, which links /css/material.css) and its
// `.box` card is the demo: a white 128px card carrying a colour name (`.box h1`, 14px) and the
// hex below it. `.box p` was 11px #999999 - under the 12px readability floor the factory's
// illegible-micro-typography rule flags, and 2.85:1 on the card's white, under WCAG AA's 4.5:1.
//
// What this pins, and which stylesheets it is allowed to read (review finding
// paul-kinlan-me-d2j): the first version of this guard asserted a dark-mode override from
// assets/css/open-props-normalize.css, but the deployed bundle is built from
// open-props-normalize-LIGHT.css (layouts/partials/head.html concatenates open-props.css +
// open-props-normalize-light.css + open-props-fonts.css + main.css into css/bundle.css), which
// has no dark-mode rule at all. An assertion about a stylesheet the page never loads can fail on
// an unrelated edit while the demo is untouched, and it is not evidence about what ships. So the
// token set below is DERIVED FROM THE HEAD PARTIAL, and every colour assertion is resolved from
// those files only:
//   1. the size is expressed in rem, not px. The Modern Web Guidance typography guide is explicit
//      ("DON'T use px for font-size. Prefer rem to honor the user's browser font-size
//      preferences"), so the floor is stated as 0.75rem and the unit is asserted - a future
//      `12px` would satisfy the number while losing the property the guide asks for.
//   2. the colour is a design token, not a hand-picked hex, and it holds 4.5:1 on the card. The
//      color guide says to check for an existing token before generating a shade, and the token is
//      RESOLVED FROM ITS DEFINITION in the deployed bundle so that editing the ramp cannot quietly
//      drop the demo under AA.
//   3. the token is scheme-stable IN THE DEPLOYED CSS: no stylesheet the page loads redefines it
//      inside a prefers-color-scheme: dark block, which is what the browser measurement confirms
//      (computed 8.18:1 in both schemes). In the light-normalize bundle --text-2 resolves to
//      --gray-7 as well, so the ramp token is chosen to keep this guard independent of the semantic
//      layer rather than because of a dark-mode difference that this bundle does not have.
//   4. the numbers are not vacuous: the old pair is asserted to FAIL the ratio, and the dark-block
//      scan asserts it found dark blocks in the bundle at all, so neither check can pass by silence.
//
// Computed rendering (px size, contrast on the real card, layout, no clipping) is measured in Chrome
// by /tmp/brm-evidence/palette-legibility.mjs - this tier only makes sure a future edit cannot
// reintroduce either defect and still be reported as covered by a green fast gate. Reads committed
// files, touches no shared state, so it is order-independent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../static/css/material.css', import.meta.url), 'utf8');
const head = readFileSync(new URL('../layouts/partials/head.html', import.meta.url), 'utf8');

// The stylesheets the page actually ships, taken from the partial that concatenates them.
const bundledStylesheets = [...head.matchAll(/resources\.Get\s+"css\/([\w.-]+)"/g)]
  .map(([, name]) => name)
  .map((name) => ({ name, text: readFileSync(new URL(`../assets/css/${name}`, import.meta.url), 'utf8') }));

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

// Resolve `var(--token)` against the stylesheets the page actually loads, so the assertion is about
// the colour a reader gets rather than about the string in this file (or about an unused variant).
const resolveColour = (value, depth = 0) => {
  assert.ok(depth < 8, `token chain too deep or cyclic at ${value}`);
  const token = value.match(/^var\((--[\w-]+)\)$/);
  if (!token) return value;
  for (const { name, text } of bundledStylesheets) {
    const defined = text.match(new RegExp(`${token[1]}\\s*:\\s*(var\\(--[\\w-]+\\)|#[0-9a-fA-F]{3,8})`));
    if (defined) return defined[1].startsWith('var(') ? resolveColour(defined[1], depth + 1) : defined[1];
  }
  assert.fail(`${token[1]} is not defined by any stylesheet the page bundles: `
    + `${bundledStylesheets.map((sheet) => sheet.name).join(', ')}`);
};

// Every custom property redefined inside a prefers-color-scheme: dark block, per bundled file, with
// the block found by brace matching so tokens after the block are not swept in.
const darkSchemeTokens = () => {
  const found = new Map();
  for (const { name, text } of bundledStylesheets) {
    const pattern = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{/g;
    for (const match of text.matchAll(pattern)) {
      let depth = 1;
      let index = match.index + match[0].length;
      while (depth > 0 && index < text.length) {
        if (text[index] === '{') depth += 1;
        else if (text[index] === '}') depth -= 1;
        index += 1;
      }
      const block = text.slice(match.index + match[0].length, index - 1);
      for (const [, property] of block.matchAll(/(--[\w-]+)\s*:/g)) {
        if (!found.has(property)) found.set(property, name);
      }
    }
  }
  return found;
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

test('the bundled stylesheets are the ones the head partial builds, and one has a dark block', () => {
  const names = bundledStylesheets.map((sheet) => sheet.name);
  assert.ok(names.length >= 3, `expected the head partial to bundle several stylesheets, got ${names.join(', ')}`);
  // The variant matters: open-props-normalize.css carries a dark-mode block that the deployed
  // light variant does not, so reading the wrong one is how the first version of this guard went
  // wrong (paul-kinlan-me-d2j).
  assert.ok(names.includes('open-props-normalize-light.css'),
    `the palette page must bundle the light normalize variant, got ${names.join(', ')}`);
  assert.ok(darkSchemeTokens().size > 0,
    'the dark-block scan must find at least one redefined property, else the scheme-stability check below is vacuous');
});

test('the demo colour token is not redefined under a dark scheme in the deployed bundle', () => {
  const colour = declaration(declarationsOf('.box p'), 'color');
  const token = colour.match(/^var\((--[\w-]+)\)$/)[1];
  const darkTokens = darkSchemeTokens();
  assert.ok(!darkTokens.has(token),
    `${token} is redefined by ${darkTokens.get(token)} under prefers-color-scheme: dark, so the white card would `
    + 'change colour with the scheme; the browser measurement must be re-taken with that in mind');
});
