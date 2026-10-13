// Guard for bead paul-kinlan-me-5cb: the contract assets/css/main.css has to
// keep with the article page.
//
// main.css carried a whole `.article-prose` palette - font, colours, code/pre/
// blockquote/img treatment, and the `--article-*` custom properties that fed it.
// No template, content file or script ever put that class on an element: every
// rendered article is `<article class="article-content prose prose-lg
// max-w-none">`. So the block changed no pixel, and that was not harmless. The
// factory's colour-drift scan reads this file as the source of truth for the
// article palette, so a lane refactored exactly those dead declarations -
// swapping six hex values for Open Props tokens, moving colours nobody sees -
// while the palette readers DO see (Tailwind Typography's `prose`, themed in
// tailwind.config.cjs) went unexamined.
//
// The obvious repair - re-point `.article-prose` at `.article-content` - is
// worse than the bug. That palette was written for a dark surface, and the
// tokens it holds are the pale end of the Open Props ramps: --article-accent
// was indigo-2 (#bac8ff, 1.64:1 on white) and --article-highlight sand-2
// (#d5cfbd, 1.56:1). Applied to the light article they would drop link text
// from 5.17:1 to 1.64:1, so the two rules below pin both halves of the real
// fix: the class main.css styles has to be one a template emits (test 1), and
// the tokens the article link actually reads have to stay readable on the
// light background (tests 2 and 3). Test 3 also holds the focus ring to the
// `outline` + `outline-offset` shape, which is what the accessibility guidance
// asks for and what a box-shadow ring would silently break in forced colors.
//
// "Can emit" is the same set the Tailwind build works from - `config.safelist`
// (the class attributes in layouts/ and content/, read by tailwind.config.cjs) -
// widened with every class this repository writes in a `class="..."` attribute
// anywhere it ships files, Hugo actions and script-built markup included, and
// the classes scripts add with `classList`. Widening only ever adds, so it can
// turn a false "dead rule" failure into a pass; it cannot hide a rule that
// names a class nothing writes. A class a template builds in a way no scan can
// see belongs in the safelist by hand, which the failure message says.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const config = require('../tailwind.config.cjs');

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MAIN_CSS = 'assets/css/main.css';
const OPEN_PROPS = 'assets/css/open-props.css';
// The article body renders on white; measured in the browser on
// /progressive-progressive-web-apps/ (body background-color rgb(255, 255, 255)).
const ARTICLE_BACKGROUND = '#ffffff';
const AA_NORMAL_TEXT = 4.5;
const AA_NON_TEXT = 3;

/**
 * The rules a stylesheet writes, as { selector, body }, for rules at any
 * nesting depth - a rule inside `@media` is found, and an at-rule's own prelude
 * is not mistaken for a selector. Braces are tracked rather than
 * pattern-matched; declarations are collected at `;` and at the closing brace,
 * so a `color: red` value can never be read as a selector.
 */
export function rulesIn(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const stack = [];
  const rules = [];
  let buf = '';
  for (const ch of src) {
    if (ch === '{') {
      const prelude = buf.trim();
      buf = '';
      stack.push({ selector: prelude && !prelude.startsWith('@') ? prelude : null, body: '' });
    } else if (ch === '}') {
      const frame = stack.pop();
      if (frame) {
        frame.body += buf.trim();
        buf = '';
        if (frame.selector) rules.push({ selector: frame.selector, body: frame.body });
      }
      buf = '';
    } else if (ch === ';') {
      const frame = stack[stack.length - 1];
      if (frame) frame.body += buf.trim() + ';';
      buf = '';
    } else {
      buf += ch;
    }
  }
  return rules;
}

/** Every `.class` named by a list of selectors, in first-seen order. */
export function classesIn(selectors) {
  const classes = new Set();
  for (const selector of selectors) {
    for (const m of selector.matchAll(/\.(-?[A-Za-z_][-\w]*)/g)) classes.add(m[1]);
  }
  return [...classes];
}

/** The `prop: value` pairs of one rule body, later declarations winning. */
function declarationsIn(body) {
  const out = {};
  for (const decl of body.split(';')) {
    const at = decl.indexOf(':');
    if (at > 0) out[decl.slice(0, at).trim()] = decl.slice(at + 1).trim();
  }
  return out;
}

/** Custom properties declared by one selector, as { name: value }. */
function customPropertiesOf(rules, selector) {
  const out = {};
  for (const rule of rules) {
    if (rule.selector !== selector) continue;
    for (const [prop, value] of Object.entries(declarationsIn(rule.body))) {
      if (prop.startsWith('--')) out[prop] = value;
    }
  }
  return out;
}

/** Follow `var(--a)` / `var(--a, fallback)` references to a literal value. */
function resolveToken(value, literals, seen = new Set()) {
  const m = value && value.match(/^var\(\s*(--[-\w]+)\s*(?:,([\s\S]*))?\)$/);
  if (!m) return value;
  const [, name, fallback] = m;
  if (seen.has(name)) return null; // a cycle: report, do not guess
  seen.add(name);
  const next = literals[name];
  if (next === undefined) return fallback === undefined ? null : resolveToken(fallback.trim(), literals, seen);
  return resolveToken(next.trim(), literals, seen);
}

/** An sRGB colour as [r, g, b], or null if the value is not one we can check. */
function rgbOf(value) {
  if (!value) return null;
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const fn = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (fn) return [1, 2, 3].map((i) => Number(fn[i]));
  return null;
}

/** WCAG 2.1 relative luminance. */
function luminance([r, g, b]) {
  const lin = (c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG 2.1 contrast ratio, rounded to 2dp. */
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2));
}

/** The literal token values main.css can reach: Open Props, then main.css. */
function tokenLiterals() {
  const literals = {};
  for (const [file, selector] of [
    [OPEN_PROPS, ':where(html)'],
    [MAIN_CSS, ':root'],
  ]) {
    Object.assign(literals, customPropertiesOf(rulesIn(readFileSync(join(ROOT, file), 'utf8')), selector));
  }
  return literals;
}

/**
 * The classes this repository writes into a `class="..."` attribute anywhere it
 * ships markup, plus the ones scripts add to an element.
 *
 * Scanned: layouts/, content/, static/ and the script trees, and every word of
 * the attribute value, Hugo actions included -
 * `class="{{ if .Params.image_header }}relative overflow-hidden{{end}}"` really
 * does put `relative` on the element, while tailwind.config.cjs's extractor
 * cannot see it because it strips the action (which is what keeps template
 * prose out of the stylesheet). The template keywords that come along for the
 * ride (`if`, `end`, `Params`) only widen the set. Only markup is scanned -
 * never the generated stylesheet, whose contents say nothing about whether an
 * element can carry a class.
 */
export function markupClasses(root = ROOT, dirs = ['layouts', 'content', 'static', 'assets', 'api', 'lib']) {
  const classes = new Set();
  const scannable = /\.(html?|md|markdown|js|mjs|cjs|ts|ajson|xml|txt)$/i;
  const add = (text) => {
    for (const m of text.matchAll(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
      for (const token of (m[1] ?? m[2]).split(/[^\w-]+/)) if (/^-?[A-Za-z_]/.test(token)) classes.add(token);
    }
    for (const m of text.matchAll(/classList\s*\.\s*(?:add|remove|toggle|contains)\s*\(\s*["'`]([^"'`]+)["'`]/g)) {
      for (const token of m[1].split(/\s+/)) if (token) classes.add(token);
    }
    for (const m of text.matchAll(/className\s*[:=]\s*["'`]([^"'`]+)["'`]/g)) {
      for (const token of m[1].split(/\s+/)) if (token) classes.add(token);
    }
  };
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') walk(path);
      } else if (scannable.test(entry.name)) {
        add(readFileSync(path, 'utf8'));
      }
    }
  };
  for (const dir of dirs) walk(join(root, dir));
  return classes;
}

/** Every class the site can put on an element, from markup and from scripts. */
function emittableClasses() {
  return new Set([...config.safelist, ...markupClasses()]);
}

/** The rules that style an article link, i.e. any selector naming both. */
function articleLinkRules(css) {
  return rulesIn(css).filter((r) => /\.article-content\b/.test(r.selector) && /\ba\b|^a\b|:is\([^)]*\ba\b/.test(r.selector));
}

const mainCss = () => readFileSync(join(ROOT, MAIN_CSS), 'utf8');

test('main.css styles no class the site cannot emit', () => {
  const styled = classesIn(rulesIn(mainCss()).map((r) => r.selector));
  const emittable = emittableClasses();
  const dead = styled.filter((c) => !emittable.has(c));

  assert.deepEqual(
    dead,
    [],
    `${MAIN_CSS} styles ${dead.join(', ')}, which no layout, content file or shipped ` +
      `script puts on an element - the rule cannot apply and a sweep reading this file ` +
      `will report it as live design. Delete the rule, or, if a template builds the ` +
      `class at build time, add the class to safelist in tailwind.config.cjs.`,
  );
});

test('the article link colour tokens stay readable on the light article background', () => {
  const literals = tokenLiterals();
  const root = customPropertiesOf(rulesIn(mainCss()), ':root');
  const background = rgbOf(ARTICLE_BACKGROUND);

  for (const token of ['--article-accent', '--article-highlight']) {
    assert.ok(root[token], `${MAIN_CSS} must define ${token} on :root`);
    const resolved = resolveToken(root[token], literals);
    const rgb = rgbOf(resolved);
    assert.ok(
      rgb,
      `${token} resolves to ${JSON.stringify(resolved)}, which this guard cannot measure. ` +
        `Keep it a hex or rgb() value reachable from a token in ${OPEN_PROPS}.`,
    );
    const ratio = contrast(rgb, background);
    assert.ok(
      ratio >= AA_NORMAL_TEXT,
      `${token} (${resolved}) has ${ratio}:1 contrast on ${ARTICLE_BACKGROUND}, below the ` +
        `${AA_NORMAL_TEXT}:1 WCAG AA minimum for link text. The pale ends of the Open Props ` +
        `ramps (indigo-2 #bac8ff is 1.64:1, sand-2 #d5cfbd 1.56:1) look fine on the dark theme ` +
        `this palette was written for and are unreadable here - pick a colour from the same ` +
        `ramp that keeps the link readable.`,
    );
  }
});

test('article links take their colour and focus ring from those tokens', () => {
  const rules = articleLinkRules(mainCss());
  const colour = rules.map((r) => declarationsIn(r.body).color).find((v) => v?.includes('--article-accent'));
  assert.ok(
    colour,
    'an .article-content a rule must set color: var(--article-accent) - the point of the tokens ' +
      'is that the article link really reads them, not a dead selector that nothing matches.',
  );

  const hover = rules.find((r) => /:hover/.test(r.selector));
  assert.match(
    hover ? declarationsIn(hover.body).color || '' : '',
    /var\(--article-highlight\)/,
    'the article link hover/focus colour must come from var(--article-highlight)',
  );

  const focus = rules.filter((r) => r.selector.includes(':focus-visible'));
  const ring = focus.map((r) => declarationsIn(r.body)).find((d) => d.outline);
  assert.ok(
    ring,
    'the article link needs an explicit :focus-visible `outline` ring; the accessibility ' +
      'guidance asks for outline rather than box-shadow, which forced-colors strips.',
  );
  assert.match(ring.outline, /solid|auto/, `outline must be a visible style, got ${ring.outline}`);
  assert.ok(
    ring['outline-offset'],
    'pair the focus outline with outline-offset so the ring does not sit on the text',
  );
  assert.match(ring.outline, /var\(--article-highlight\)/, 'the focus ring colour must be a token too');
});

test('the rule reader finds rules at any nesting depth and only real selectors', () => {
  const css = `
    /* .in-a-comment { color: red } */
    :root { --custom-property: 1; }
    .plain { color: var(--custom-property); }
    .two, .three:hover { color: blue; }
    @media (min-width: 40em) { .inside-media { color: black; } }
    @view-transition { navigation: auto; }
  `;
  assert.deepEqual(
    rulesIn(css).map((r) => [r.selector, declarationsIn(r.body).color || null]),
    [
      [':root', null],
      ['.plain', 'var(--custom-property)'],
      ['.two, .three:hover', 'blue'],
      ['.inside-media', 'black'],
    ],
  );
});

test('classes a script adds, and the literals a template builds, count as emittable', () => {
  const emittable = markupClasses();
  // static/javascripts/air-horner.js adds this one; nothing in markup names it.
  assert.ok(
    emittable.has('horning'),
    'markupClasses() must read the classes shipped JavaScript adds with classList',
  );
  // layouts write classes inside Hugo actions, e.g.
  // `class="{{ if .Params.image_header }}relative overflow-hidden{{end}}"`
  // (layouts/_default/list.html:47) and the `entry-content`/`entry-summary` pair
  // at layouts/_default/list.html:59; the Tailwind extractor strips the action to
  // keep template prose out, so the scan here has to read the words inside it.
  assert.ok(
    emittable.has('overflow-hidden'),
    'markupClasses() must read classes written inside Hugo actions in a class attribute',
  );
});
