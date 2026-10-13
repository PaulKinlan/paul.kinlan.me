// Guard for bead paul-kinlan-me-wng: layouts/** must not be scanned as prose.
//
// assets/css/tailwind.css is generated but committed (Vercel builds the site
// with `hugo -D --gc`, which never runs `npm run build:css`), so whatever words
// Tailwind treats as class candidates are what production serves. While
// `layouts/**/*.html` was scanned as raw text, every English word in a template
// or template comment that is also a utility name compiled into that file:
// `.static` (from the word "static/" in a doc comment), `.truncate` (from Hugo's
// `| truncate 160` in layouts/_default/home.llms_txt.txt:7), `.absolute` (from
// `style="position: absolute"` in layouts/shortcodes/fast-youtube.html:4) and
// more. Because the stylesheet is committed, that also rewrote the tracked file
// and turned the fast gate red for whoever next touched a layout - a change
// they never made.
//
// The config reads layout classes out of `class="..."` attributes instead, so
// these tests pin what the config hands Tailwind: a layout never reaches the
// prose extractor (test 1), the classes it really writes still reach the
// compiler (test 2), and the words around them do not (test 3). Read the
// candidate set off `config.safelist`, which is what actually reaches the
// compiler - not the input files, which say nothing about what Tailwind saw.
//
// The end-to-end half of this guard is already in tools/fast-gate.sh: it builds
// the stylesheet and refuses to run if the build rewrote the tracked copy, so a
// stale or prose-derived stylesheet cannot be committed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const config = require('../tailwind.config.cjs');

// A synthetic template, so the property is tested on prose nobody wrote for this
// repo: a Hugo comment and an HTML comment that name real utilities, an inline
// style that names one, and the three shapes of real class the extractor has to
// keep. Every word it must ignore below is a Tailwind utility a page could use
// (`static`, `table`, `contents`, ...), so a regression that reads the file as
// text puts them straight back into the shipped stylesheet.
const FIXTURE = `{{/* Layout note: the table of contents here is static, invisible,
   and uses ring, blur, collapse and truncate. */}}
<!-- An HTML comment is prose as well: table, contents, truncate. -->
<div class="p-4 rounded-2xl">
  <div style="position: absolute; inset: 0">
  <div class=unquoted-class>
  <div class='single-quoted-class'>
  <div class="{{ if .Params.image_header }}relative overflow-hidden{{end}}">
  <div class="pb-section-padding {{.Type}}">
  <div class="{{ .Params.extra }} widgets">
`;

const IGNORED_WORDS = [
  'static',
  'table',
  'contents',
  'invisible',
  'ring',
  'blur',
  'collapse',
  'truncate',
  'absolute',
  'note',
  'comment',
];
const KEPT_WORDS = [
  'p-4',
  'rounded-2xl',
  'unquoted-class',
  'single-quoted-class',
  'relative',
  'overflow-hidden',
  // The literal half of a class value a template builds: a class concatenated
  // with a Hugo expression is still a class the markup writes.
  'pb-section-padding',
  'widgets',
];

function scanFixture() {
  const dir = mkdtempSync(join(tmpdir(), 'tailwind-layout-scan-'));
  try {
    // One level down, so the walk is exercised rather than just the read.
    mkdirSync(join(dir, 'partials'));
    writeFileSync(join(dir, 'partials', 'fixture.html'), FIXTURE);
    const found = config.extractors.classesInClassAttributes(dir, (name) => name.endsWith('.html'));
    return new Set(found);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('no layout tree is scanned as raw text', () => {
  // The root cause, asserted directly: any glob that hands a template to the
  // prose extractor re-opens the bug for every word in it, including the words
  // in comments and inline styles. Layout classes belong in the safelist, read
  // from their markup by classesInLayoutMarkup().
  const proseScanned = config.content.filter((glob) => /layouts/.test(glob));
  assert.deepEqual(
    proseScanned,
    [],
    'a layouts/themes glob scans every word in a template as a Tailwind class candidate; ' +
      'move that tree into the safelist side (classesInLayoutMarkup in tailwind.config.cjs)',
  );
});

test('classes a layout writes are candidates, wherever they are written', () => {
  // A class inside a Hugo action: layouts/shortcodes/list.html:18
  //   class="{{ if .Params.image_header }}with-background{{end}}"
  // Stripping the actions and splitting the literal text around them is what
  // keeps this; splitting the raw value instead yields the single token
  // `}}with-background{{end}}`, which Tailwind ignores - the site loses CSS
  // silently, which is the failure mode this fix had to avoid.
  assert.ok(config.safelist.includes('with-background'), 'class inside a {{ if }} action was lost');

  // Arbitrary-value and variant candidates, which no bare word can produce:
  // layouts/partials/moi.html:1 (`max-w-[720px]`, `pb-section-padding`) and
  // layouts/taxonomy/tag.html:17 (`group-hover:scale-[1.02]`).
  assert.ok(config.safelist.includes('max-w-[720px]'), 'arbitrary-value utility was lost');
  assert.ok(config.safelist.includes('group-hover:scale-[1.02]'), 'variant + arbitrary-value utility was lost');

  // An unquoted attribute: layouts/shortcodes/slide.html:2 (`<div class=slide>`).
  assert.ok(config.safelist.includes('slide'), 'unquoted class attribute was lost');

  // A class concatenated with a Hugo expression (the one site that does it):
  // layouts/entry/single.html:8 `class="pb-section-padding {{.Type}}"`. The
  // literal half must survive; {{.Type}} itself is a page type, not a class.
  assert.ok(config.safelist.includes('pb-section-padding'), 'the literal half of a dynamic class value was lost');
  assert.ok(!config.safelist.includes('.Type'), 'a Hugo expression reached the safelist as a class');

  // Post markup still reaches the compiler, so this is a union and not a swap:
  // content/ writes `class="inline"` (CodeRay-highlighted code blocks).
  assert.ok(config.safelist.includes('inline'), 'content/ markup classes were lost');
});

test('the reported prose leak stays out of the candidate set', () => {
  // The concrete regression from the bead, with its source. If one of these
  // words ever becomes a class a layout writes in markup, its line here is the
  // thing to delete - the assertion pins these three occurrences, not the words.
  assert.ok(!config.safelist.includes('static'), 'the word "static" in a template comment reached the safelist');
  assert.ok(!config.safelist.includes('truncate'), "Hugo's `| truncate 160` reached the safelist");
  assert.ok(!config.safelist.includes('absolute'), 'a `style="position: absolute"` value reached the safelist');

  // Nor any fragment of a Hugo action: `{{`, `.Params.x`, `}}end` are not
  // classes, and a token carrying one of those characters could only come from
  // scanning an action rather than its markup.
  assert.deepEqual(
    config.safelist.filter((candidate) => /[{}]/.test(candidate)),
    [],
    'a Hugo action or its braces reached the safelist - actions must be stripped out of the attribute value',
  );
});

test('class sources that are not markup attributes are still scanned', () => {
  // Only layouts/ and content/ are read through their class attributes. A class
  // written somewhere else - in a JS string, in a data file, in a hand-written
  // static page - has no class attribute to be read from, so those trees have to
  // stay in `content` scanned as text. Nothing in this repo generates a class
  // that way today (no classList/className/dict "class" in layouts/, no class
  // key in data/), but the glob is what keeps that true for whoever adds one.
  const globs = config.content.join(' ');
  for (const glob of [
    './assets/**/*.js',
    './static/**/*.html',
    './data/**/*.{toml,yaml,yml,json}',
  ]) {
    assert.ok(globs.includes(glob), `${glob} left content - classes written there would silently stop compiling`);
  }
});

test('prose, comments and inline styles are ignored in a template', () => {
  const found = scanFixture();
  for (const word of IGNORED_WORDS) {
    assert.ok(
      !found.has(word),
      `"${word}" is only prose, a comment or a style value in the fixture and must not be a class candidate`,
    );
  }
  assert.deepEqual(
    [...found].filter((candidate) => /[{}]/.test(candidate) || candidate.includes('Params')),
    [],
    'a Hugo action leaked into the candidate set as a token',
  );
});

test('the classes a template writes are kept, in every shape it writes them', () => {
  const found = scanFixture();
  for (const word of KEPT_WORDS) {
    assert.ok(found.has(word), `the fixture writes "${word}" as a class and the extractor lost it`);
  }
  // The action-nested pair specifically: splitting the attribute value on
  // whitespace instead of stripping the action yields the single token
  // `}}relative`/`overflow-hidden{{end}}` and drops both.
  assert.ok(found.has('relative') && found.has('overflow-hidden'), 'a class inside a {{ if }} action was lost');
});
