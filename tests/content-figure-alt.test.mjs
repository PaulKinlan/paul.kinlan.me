// The alt-text contract for the eleven content files converted by the figure-shortcode
// sweep (paul-kinlan-me-ryj, from the audit paul-kinlan-me-2zq).
//
// Why this file exists and why it is per-file rather than a site-wide content gate:
// these eleven files are the only content in this shard, and the sweep's two silent
// failure modes are invisible in a diff. Both were reachable during the change:
//
//   1. A raw <figure><img src=...> bypasses layouts/shortcodes/figure.html, so the tag
//      renders with NO alt, NO width/height and NO loading/decoding hint. Converting it
//      to the shortcode fixes all four - but the shortcode takes the VISIBLE caption from
//      `caption` and the accessible name from `title`/`alt`. Passing only `title` renders
//      an image with an alt and silently DROPS the caption that was on the page; passing
//      only `caption` does the reverse. The count and the both-params check below are
//      what make that trade visible instead of silent (the built site's figcaption text
//      is not something a source-level assertion can see; two params is).
//   2. A converted block is easy to "tidy" wrong: an author writing `title=` and leaving
//      the figcaption markup behind produces invalid nested markup, and a later edit that
//      pastes a new image in without alt puts the defect back.
//
// Deliberately NOT a repo-wide gate on content/**. Three of the 100 rendered omissions
// in the audit are outside this shard, and a guard that fails on a post Paul writes by
// hand blocks unrelated landings (the same reasoning as tests/image-hints.test.mjs, which
// covers layouts/** only). The repo-wide content guard is its own decision,
// paul-kinlan-me-oah.
//
// Scoped to what it reads: the eleven files named below. No other test's state, no
// machine state, no build output (it runs before the build in tools/fast-gate.sh).
import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

// file -> the number of <img> tags the page renders, measured in the built site before
// the change (the FILE:TAGS inventory on paul-kinlan-me-ryj, confirmed against built
// public/**/index.html by the audit). The count is the contract: an edit that drops a
// figure, or that adds one, must come here and say what it did.
const RENDERED_IMAGES = {
  'content/2015-02-18-eyedropper-chrome-dev-tools.markdown': 1,
  'content/2015-03-05-detecting-injected-content.markdown': 3,
  'content/2015-09-29-meta-platforms.markdown': 8,
  'content/2016-06-14-serverless-sync-in-web-apps.markdown': 4,
  'content/2016-07-17-the-headless-web.markdown': 4,
  'content/2016-12-12-chrome-on-home.markdown': 3,
  'content/2017-04-06-creating-a-share-button.markdown': 1,
  'content/2017-08-25-reinventing-web-intents.markdown': 6,
  'content/2018-07-26-page-lifecycle-apiphilip-walton.markdown': 1,
  'content/2021-06-14-npm-downloads-dashboard.markdown': 1,
  'content/2022-09-09-what-is-new-on-the-web.markdown': 1,
};

// Fenced blocks and inline code are blanked (same length, so offsets still line up)
// rather than removed: 2017-04-06-creating-a-share-button documents its two <img> usages
// inside a fenced example, and Hugo never renders those. Flagging them is the false
// positive the audit called out.
function stripCode(source) {
  return source
    .replace(/(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1/g, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (code) => ' '.repeat(code.length));
}

// ATTRIBUTE-BOUNDARY-ANCHORED, not \b: paul-kinlan-me-a5b showed the ad-hoc guard in
// tests/progressive-progressive-web-apps-alt.test.mjs passing green on
// `<img data-alt="x">`, because \b matches between `-` and `a`. `(?<![\w-])` is what
// makes this the attribute and not the tail of a different one; the self-test at the
// bottom of this file pins it so the bug cannot come back with a copy-paste.
const ALT_ON_IMG = /(?<![\w-])alt\s*=\s*"([^"]*)"/;
const NAME_ON_SHORTCODE = /(?<![\w-])(?:alt|title)\s*=\s*"([^"]*)"/;

function renderedImages(source) {
  const text = stripCode(source);
  const raw = [...text.matchAll(/<img\b[^>]*>/g)].map((match) => ({
    kind: 'img',
    tag: match[0],
    index: match.index,
  }));
  // A figure shortcode call is an image on the page too - and the only one whose alt
  // comes from `title`/`alt` rather than an attribute on a literal tag.
  const shortcode = [...text.matchAll(/\{\{<\s*figure\b[^}]*\}\}/g)].map((match) => ({
    kind: 'figure',
    tag: match[0],
    index: match.index,
  }));
  return [...raw, ...shortcode].sort((a, b) => a.index - b.index);
}

const files = Object.entries(RENDERED_IMAGES).map(([path, expected]) => ({
  path,
  expected,
  source: readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'),
  images: null,
}));
for (const file of files) file.images = renderedImages(file.source);

test('every rendered image in the sweep is actually scanned', () => {
  // A vacuous pass would look identical to a green one: an empty scan, or a stripCode
  // that ate the whole file, must not be read as "no defect".
  assert.equal(files.length, 11, `expected the 11 sweep files, found ${files.length}`);
  const total = files.reduce((sum, file) => sum + file.images.length, 0);
  assert.equal(total, 33, `expected the sweep's 33 rendered images, found ${total}`);
});

test('every rendered image in the sweep carries an accessible name', () => {
  for (const file of files) {
    for (const { kind, tag } of file.images) {
      if (kind === 'img') {
        const alt = tag.match(ALT_ON_IMG);
        assert.ok(alt, `${file.path}: <img> with no alt attribute: ${tag}`);
        assert.ok(
          alt[1].trim().length > 0,
          `${file.path}: <img> with an empty alt, which claims the image is decorative: ${tag}`
        );
      } else {
        // alt= wins over title= in figure.html; either supplies the alt. An empty
        // value is not accepted for the same reason as above.
        const name = tag.match(NAME_ON_SHORTCODE);
        assert.ok(name, `${file.path}: figure shortcode with no alt/title: ${tag}`);
        assert.ok(
          name[1].trim().length > 0,
          `${file.path}: figure shortcode with an empty alt/title: ${tag}`
        );
      }
    }
  }
});

test('every converted figure still shows the caption it used to render', () => {
  // The conversion moved the visible <figcaption> into the shortcode's `caption` param.
  // Dropping that param leaves a correct alt on an image whose caption vanished from the
  // page - a content regression that no alt check would notice.
  for (const file of files) {
    for (const { kind, tag } of file.images) {
      if (kind !== 'figure') continue;
      const caption = tag.match(/(?<![\w-])caption\s*=\s*"([^"]*)"/);
      assert.ok(caption, `${file.path}: figure shortcode lost its visible caption: ${tag}`);
      assert.ok(caption[1].trim().length > 0, `${file.path}: empty caption param: ${tag}`);
    }
  }
});

test('the raw figure blocks whose caption carries markup keep their markup', () => {
  // Two figures have a caption that is not plain text (a link, and a live
  // <share-button> element), so they stayed raw and took an alt on the <img> instead:
  // the shortcode's caption param is HTML-escaped, so converting them would have
  // printed the markup as literal text. Pinned here so "make it consistent" cannot
  // quietly break them, and so the 2 code-fenced tags stay uncounted.
  const cases = [
    ['content/2017-04-06-creating-a-share-button.markdown', /<figcaption><a href=/],
    ['content/2018-07-26-page-lifecycle-apiphilip-walton.markdown', /<figcaption><a href=/],
  ];
  for (const [path, pattern] of cases) {
    const file = files.find((entry) => entry.path === path);
    assert.match(file.source, pattern, `${path}: the markup caption it renders must not be replaced with plain text`);
    const raw = file.source.match(/<figure>[\s\S]*?<\/figure>/g) ?? [];
    assert.equal(raw.length, 1, `${path}: expected its one raw figure block`);
    assert.match(raw[0], /(?<![\w-])alt\s*=\s*"[^"]+"/, `${path}: its raw <img> must keep an alt`);
  }
});

test('the alt matcher is anchored to the attribute, not to \\b (paul-kinlan-me-a5b)', () => {
  // The defect this replaces: /\balt="[^"]+"/ is true for `data-alt="x"`, so a guard
  // built on it would pass a page that axe still fails for image-alt.
  assert.equal('<img src="/x.png" data-alt="x">'.match(ALT_ON_IMG), null);
  assert.ok('<img src="/x.png" aria-label="x">'.match(ALT_ON_IMG) === null);
  assert.equal('<img alt="described">'.match(ALT_ON_IMG)[1], 'described');
  assert.equal('<img\nalt="second line">'.match(ALT_ON_IMG)[1], 'second line');
});

test('no converted figure repeats its caption as the alt', () => {
  // The doubled announcement this prevents: with alt == caption a screen reader reads the
  // same words twice (once as the image's name, once as the figure's caption). The
  // guidance for complex images is a short description on the img plus the caption
  // carrying the rest, and the sibling fix already landed in this repo for
  // 2017-07-06-progressive-progressive-web-apps (wnk) is written that way.
  for (const file of files) {
    for (const { kind, tag } of file.images) {
      if (kind !== 'figure') continue;
      const alt = tag.match(/(?<![\w-])alt\s*=\s*"([^"]*)"/)?.[1];
      const caption = tag.match(/(?<![\w-])caption\s*=\s*"([^"]*)"/)?.[1];
      if (alt === undefined) continue; // title= is the fallback; the caption check above covers it
      assert.notEqual(
        alt.trim(),
        caption.trim(),
        `${file.path}: alt is the caption verbatim, so it is announced twice: ${tag}`
      );
    }
  }
});

test('every rendered image per file matches the audit inventory', () => {
  for (const file of files) {
    assert.equal(
      file.images.length,
      file.expected,
      `${file.path}: the page renders ${file.expected} image(s); the file now has ${file.images.length}`
    );
  }
});

// Where the image actually comes from (paul-kinlan-me-xwb). The audit's 50-image
// sweep found exactly one picture on the site served from a URL this repo does not
// own - the Page Lifecycle diagram - and by the time it was written that URL
// (developers.google.com/web/updates/images/2018/07/...) 301-redirected to
// developer.chrome.com/blog/ and answered text/html, so Chrome painted the alt
// text and every source-level assertion in this file still passed: an alt is not a
// picture. Nothing in this repo could see it, which is the whole reason the check
// below is a path-and-file test rather than a request: `/images/...` under
// static/ is the one form of image src a gate on this tier can prove resolves, so
// these eleven files are pinned to it. The asset is rehosted as
// static/images/page-lifecycle-api-state-event-flow.svg, and a remote URL here
// fails loudly instead of rotting quietly.
//
// Scope is unchanged: the eleven files above. Paul writing a remote URL into some
// other post is still his call (paul-kinlan-me-oah is the repo-wide decision), and
// a post already in this list cannot gain an image without visiting the inventory
// assertion above anyway.
test('every image the sweep renders resolves to a file this repo serves', () => {
  for (const file of files) {
    for (const { kind, tag } of file.images) {
      const src = tag.match(/(?<![\w-])src\s*=\s*"([^"]+)"/)?.[1];
      assert.ok(src, `${file.path}: ${kind} with no src attribute: ${tag}`);
      assert.match(
        src,
        /^\/images\/[\w./-]+$/,
        `${file.path}: "${src}" is not a root-relative /images/ path, so nothing on this tier proves it resolves`
      );
      assert.ok(
        existsSync(join(repoRoot, 'static', src)),
        `${file.path}: "${src}" is not in this repo (expected static${src}); the image would 404 on the built page`
      );
    }
  }
});
