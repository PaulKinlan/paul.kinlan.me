// Contract for the syntax-highlighting palette the article code blocks render
// with (factory-delta paul-kinlan-me-6jd).
//
// The code blocks are dark, and the palette they use is not authored here: Hugo
// writes the token colours as inline styles, so nothing in assets/css could
// correct a dim token. The palette was also not configured, even though
// config.toml said it was. The three `pygments*` keys were written after the
// `[pagination]` table header, so TOML filed them under `pagination` and Hugo
// ignored them - `hugo config` showed `pagination = map[... pygmentsstyle:monokai
// ...]`. The site was therefore rendering Hugo's *default* monokai palette, and
// three of its tokens fail WCAG 2.1 AA (4.5:1) against the colour each is read on,
// for the article's code text (measured in Chrome at 14.2px/10.7pt, so normal text
// and not the 3:1 large-text case):
//
//   .err      #960050  2.27:1 on its own #1e0010 chip  (120 spans; 80 carry a
//                                                       visible '$' on
//                                                       /adding-activity-pub-to-your-static-site/)
//                       (1.71:1 if measured against the #272822 block instead,
//                        which is not what is painted behind that glyph)
//   .c/.ch/.. #75715e  3.02:1 on the #272822 block      (506 comment spans)
//   .o/.kn/.. #f92672  3.92:1 on the #272822 block      (2,322 operator spans)
//
// axe-core found 26 of those nodes on the bead's page and 11 on another; the same
// three colours are written by 2,948 spans across the built site, and .err's
// dark-on-dark chip is why the guard below measures a token against the background
// *that token* paints, not only against the block.
//
// The palette now lives in `[markup.highlight] style`, where Hugo documents it,
// and is github-dark. This test pins the property that mattered, rather than the
// hex values: whichever style config.toml selects, every token colour that can
// carry a visible glyph must be >= 4.5:1 on the background the same style paints
// behind it. Switching styles to re-theme the site is fine; switching to a style
// with unreadable comments is not, and would otherwise only be caught by a
// browser a11y run nobody asked for.
//
// The palette is read from the style, not from the shipped HTML, so this stays a
// few hundred milliseconds with no build and no browser, and it cannot pass
// vacuously: a style that fails to generate CSS, or that has no wrapper
// background to measure against, fails outright.
//
// Each token is measured against the background that token actually paints - its
// own `background-color` when the style gives it one (monokai's .err is #960050 on
// a #1e0010 chip: 2.27:1, the least readable colour the old palette shipped), and
// the .chroma wrapper background otherwise. Measuring every token against the
// wrapper alone would let exactly that token through.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONFIG = join(ROOT, 'config.toml');
// The binary the gate's own build step uses (npm run build -> hugo).
const HUGO = join(ROOT, 'node_modules', '.bin', 'hugo');

const AA_NORMAL_TEXT = 4.5;

// Tokens whose colour is never painted as text, so no contrast ratio applies.
// Named individually, with the reason, so this cannot quietly grow into "ignore
// whatever fails":
//   .hl  - the background of a highlighted *line* (not a glyph).
//   .ln  - line-number gutter, and .ln/.lnt are only emitted when line numbering
//          is on, which this site does not configure.
//   .w   - whitespace. 136 spans sitewide carry github-dark's #6e7681 (4.12:1),
//          and every one of them contains only spaces (checked against the built
//          HTML); a space renders no glyph, so there is nothing to read. axe-core
//          agrees - it skips whitespace-only text nodes.
const NON_TEXT_TOKENS = new Set(['.hl', '.ln', '.lnt', '.w']);

/** The body of a `[section]` table, up to the next table header. */
function sectionBody(toml, section) {
  const lines = toml.split('\n');
  const start = lines.findIndex((line) => line.trim() === `[${section}]`);
  if (start === -1) return null;
  const body = [];
  for (let i = start + 1; i < lines.length && !/^\s*\[/.test(lines[i]); i += 1) body.push(lines[i]);
  return body.join('\n');
}

/**
 * The style config.toml actually selects. Read from `[markup.highlight]` because
 * that is the only location Hugo applies: the legacy top-level `pygmentsStyle`
 * alias is not consulted when it is nested inside another table (which is exactly
 * how the site ended up rendering an unconfigured palette), so a stray legacy key
 * must not be able to look like configuration.
 */
function configuredStyle(toml) {
  assert.doesNotMatch(
    toml,
    /^\s*pygmentsStyle\s*=/m,
    'pygmentsStyle is the legacy alias for markup.highlight.style and is a second, easily-nested-away source of truth; set [markup.highlight] style instead',
  );
  const body = sectionBody(toml, 'markup.highlight');
  assert.ok(body !== null, 'config.toml must declare a [markup.highlight] table');
  const m = /^\s*style\s*=\s*"([^"]+)"/m.exec(body);
  assert.ok(m, '[markup.highlight] must set style = "<chroma style>"');
  return m[1];
}

function sRGB(hex) {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
}

function luminance(hex) {
  const [r, g, b] = sRGB(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)];
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** The style's stylesheet, as Hugo generates it for `hugo gen chromastyles`. */
function styleSheet(style) {
  return execFileSync(HUGO, ['gen', 'chromastyles', `--style=${style}`], {
    cwd: ROOT,
    encoding: 'utf8',
    // A style Hugo does not know falls back to a default instead of erroring, so
    // the caller cannot tell a typo from a real style by exit status alone.
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/** { background, tokens: [{ selector, color, background }] } for a generated stylesheet. */
function palette(css) {
  const wrapper = /\/\* PreWrapper \*\/ \.chroma \{([^}]*)\}/.exec(css);
  assert.ok(wrapper, 'generated stylesheet has no .chroma (PreWrapper) rule');
  const bg = /background-color:\s*(#[0-9a-fA-F]{6})/.exec(wrapper[1]);
  assert.ok(bg, 'the .chroma wrapper declares no background-color to measure against');
  const tokens = [];
  for (const [, selector, decls] of css.matchAll(/\/\* [^*]* \*\/ \.chroma (\.\w+) \{([^}]*)\}/g)) {
    if (NON_TEXT_TOKENS.has(selector)) continue;
    const color = /(?<!background-)\bcolor:\s*(#[0-9a-fA-F]{6})/.exec(decls);
    if (!color) continue;
    // A token may paint a chip behind its own text; that chip, not the block, is
    // what the glyph is read against.
    const own = /\bbackground-color:\s*(#[0-9a-fA-F]{6})/.exec(decls);
    tokens.push({ selector, color: color[1], background: own ? own[1] : null });
  }
  return { background: bg[1], tokens };
}

const toml = readFileSync(CONFIG, 'utf8');
const style = configuredStyle(toml);
const { background, tokens } = palette(styleSheet(style));

test('the article code-block palette is declared in [markup.highlight]', () => {
  assert.ok(sectionBody(toml, 'markup.highlight').includes(`"${style}"`));
  assert.ok(/^[a-z0-9-]+$/i.test(style), `unexpected chroma style name: ${style}`);
});

test('every token colour the code-block style can paint meets WCAG AA (4.5:1)', () => {
  // A parse that silently found nothing would make every assertion below vacuous.
  assert.ok(tokens.length >= 30, `only ${tokens.length} token colours parsed out of the ${style} stylesheet`);
  const failures = tokens
    .map(({ selector, color, background: own }) => ({
      selector,
      color,
      on: own ?? background,
      ratio: contrast(color, own ?? background),
    }))
    .filter(({ ratio }) => ratio < AA_NORMAL_TEXT);
  assert.deepEqual(
    failures.map(({ selector, color, on, ratio }) => `${selector} ${color} ${ratio.toFixed(2)}:1 on ${on}`),
    [],
    `style "${style}" has code-block token colours below ${AA_NORMAL_TEXT}:1 against the colour they are read on; pick a style whose whole palette passes (the article's code text measures 14.2px/10.7pt, so the 3:1 large-text allowance does not apply)`,
  );
});
