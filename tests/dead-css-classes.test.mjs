// Guard for bead paul-kinlan-me-5cb: a class no page can emit must not be
// styled in main.css.
//
// assets/css/main.css carried a whole `.article-prose` palette - font, colours,
// code/pre/blockquote/img treatment - that no template, content file or script
// ever put on an element. Every rendered article is
// `<article class="article-content prose prose-lg max-w-none">`, so the block
// changed no pixel; its `--article-*` custom properties existed only to feed it.
// That was not harmless. The factory's colour-drift scan reads main.css as the
// source of truth for the article palette, so a lane refactored exactly those
// dead declarations - swapping six hex values for Open Props tokens, moving
// colours nobody sees - while the palette readers DO see (Tailwind Typography's
// `prose`, themed in tailwind.config.cjs) was never looked at. A dead rule is a
// false positive generator for every future sweep, and the cheapest way to stop
// it producing findings is to keep the rules out.
//
// So this pins the invariant on the file rather than on the one class: every
// class selector main.css writes must be a class something can actually put on
// an element. The "can emit" set is the same one the Tailwind build uses -
// `config.safelist` (the class attributes in layouts/ and content/, read by
// tailwind.config.cjs) plus the classes shipped JavaScript adds at runtime. A
// class a template builds at build time ({{ ... }}) cannot be seen by the
// extractor; such a class belongs in the safelist by hand, which is what the
// failure message below tells the author to do.
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

/**
 * The rules a stylesheet writes, i.e. the text before each `{` that is not an
 * at-rule prelude. Braces are tracked rather than pattern-matched so a rule
 * nested in `@media` is found too - that is where the dead reduced-motion rule
 * for `.article-prose a` lived. Declarations are dropped at `;` and `}`, so a
 * `color: red` value can never be read as a selector.
 */
export function selectorsIn(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors = [];
  let buf = '';
  for (const ch of src) {
    if (ch === '{') {
      const prelude = buf.trim();
      buf = '';
      if (prelude && !prelude.startsWith('@')) selectors.push(prelude);
    } else if (ch === '}' || ch === ';') {
      buf = '';
    } else {
      buf += ch;
    }
  }
  return selectors;
}

/** Every `.class` named by a list of selectors, in first-seen order. */
export function classesIn(selectors) {
  const classes = new Set();
  for (const selector of selectors) {
    for (const m of selector.matchAll(/\.(-?[A-Za-z_][-\w]*)/g)) classes.add(m[1]);
  }
  return [...classes];
}

/**
 * Classes shipped JavaScript can add to an element: `classList.add/remove/
 * toggle`, a `classList.contains` check, or a `className` assignment. Scoped to
 * the served script trees, and never to the generated stylesheet (a name's
 * presence in there says nothing about whether an element can carry it).
 */
export function runtimeClasses(root = ROOT, dirs = ['assets', 'static', 'api', 'lib']) {
  const classes = new Set();
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
        walk(path);
      } else if (/\.(js|mjs|cjs|ts|html)$/.test(entry.name) && entry.name !== 'tailwind.css') {
        const text = readFileSync(path, 'utf8');
        for (const m of text.matchAll(/classList\s*\.\s*(?:add|remove|toggle|contains)\s*\(\s*["'`]([^"'`]+)["'`]/g)) {
          for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
        }
        for (const m of text.matchAll(/className\s*[:=]\s*["'`]([^"'`]+)["'`]/g)) {
          for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
        }
      }
    }
  };
  for (const dir of dirs) walk(join(root, dir));
  return classes;
}

/** Every class the site can put on an element, from markup and from scripts. */
function emittableClasses() {
  return new Set([...config.safelist, ...runtimeClasses()]);
}

test('main.css styles no class the site cannot emit', () => {
  const css = readFileSync(join(ROOT, MAIN_CSS), 'utf8');
  const styled = classesIn(selectorsIn(css));
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

test('the selector reader finds rules at any nesting depth and only real selectors', () => {
  const css = `
    /* .in-a-comment { color: red } */
    :root { --custom-property: 1; }
    .plain { color: var(--custom-property); }
    .two, .three:hover { color: blue; }
    .widget .icon { color: green; }
    @media (min-width: 40em) { .inside-media { color: black; } }
    @view-transition { navigation: auto; }
  `;
  assert.deepEqual(classesIn(selectorsIn(css)), [
    'plain',
    'two',
    'three',
    'widget',
    'icon',
    'inside-media',
  ]);
});

test('a class a script adds at runtime counts as emittable', () => {
  // static/javascripts/air-horner.js adds this one; nothing in markup names it.
  assert.ok(
    runtimeClasses().has('horning'),
    'runtimeClasses() must read the classes shipped JavaScript adds with classList',
  );
});
