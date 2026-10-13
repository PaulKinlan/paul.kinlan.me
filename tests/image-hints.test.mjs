// The image-markup contract for the site's OWN templates (layouts/**/*.html).
//
// Why this exists: every <img> a template emits is a potential layout shift (no
// space reserved until the bytes arrive) and a potential LCP regression (an
// off-screen image fetched eagerly). The fix is mechanical but it has to hold for
// templates that are added later, and the two ways it silently breaks are not
// visible in a diff:
//
//   1. A partial that returns ATTRIBUTES only renders inside a tag when the call
//      is piped through `safeHTMLAttr`; without it the template engine substitutes
//      the literal string `ZgotmplZ`. Emitted before `<img` instead of inside it,
//      the same attributes render as visible text on the page. Both were hit while
//      writing this change; both are asserted below.
//   2. `loadPartialDims` reads .Width/.Height off a Hugo image resource, and those
//      methods DO NOT EXIST on an SVG - asking for them fails the whole build
//      ("this method is only available for raster images"), so one vector image in
//      front matter would take the site down. The raster allowlist is therefore
//      pinned here.
//
// Images written inline in content/ are NOT checked: 293 of them are authored in
// 81 markdown/html content files, and a gate that fails on a post Paul writes by
// hand is a gate that blocks unrelated landings. This covers what the repo owns.
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const layouts = join(repoRoot, 'layouts');

function htmlTemplates(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlTemplates(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

// Template and HTML comments are blanked out (same length, so offsets still line
// up) rather than removed: a documented usage example in a comment is not markup
// the build emits, and without this the examples in image-dims.html's own doc
// block are read as template source.
function stripComments(source) {
  return source.replace(/\{\{-?\s*\/\*[\s\S]*?\*\/\s*-?\}\}|<!--[\s\S]*?-->/g, (comment) =>
    comment.replace(/[^\n]/g, ' ')
  );
}

const files = htmlTemplates(layouts).map((path) => ({
  path,
  rel: path.slice(repoRoot.length),
  source: stripComments(readFileSync(path, 'utf8')),
}));

// Every <img> the templates actually emit, with the offset of its tag.
const tags = files.flatMap((file) =>
  [...file.source.matchAll(/<img\b[^>]*>/g)].map((match) => ({
    file: file.rel,
    text: match[0],
    index: match.index,
  }))
);

test('the template corpus is actually scanned', () => {
  assert.ok(files.length >= 15, `expected the layout templates, found ${files.length} files`);
  assert.ok(tags.length >= 10, `expected the template <img> tags, found ${tags.length}`);
});
test('every template image states a loading hint, so above/below-fold is a decision and not a default', () => {
  // The value may be a literal or a template expression (the slide shortcode
  // picks eager for the first slide, lazy for the rest), so this matches across
  // the attribute's quotes to the end of the tag.
  for (const { file, text } of tags) {
    assert.match(text, /loading=[^>]*(?:\blazy\b|\beager\b)/, `<img> without a lazy/eager loading hint in ${file}: ${text}`);
  }
});

test('every template image decodes off the main thread', () => {
  for (const { file, text } of tags) {
    assert.match(text, /decoding=[^>]*\basync\b/, `<img> without decoding async in ${file}: ${text}`);
  }
});

test('every template image reserves its box before the bytes arrive', () => {
  // Three accepted ways to know the size up front: literal dimensions, the shared
  // lookup that reads them from the file, or a CSS aspect-ratio that fixes the
  // ratio (the listing images use Tailwind's aspect-video).
  for (const { file, text } of tags) {
    const literal = /width="[^"]*"/.test(text) && /height="[^"]*"/.test(text);
    const measured = text.includes('image-dims.html');
    const ratio = /class="[^"]*aspect-/.test(text);
    assert.ok(
      literal || measured || ratio,
      `<img> cannot reserve space (no width/height, no image-dims.html, no aspect-* class) in ${file}: ${text}`
    );
  }
});

test('every template image has an alt attribute', () => {
  for (const { file, text } of tags) {
    assert.ok(/\balt=/.test(text), `<img> without alt in ${file}: ${text}`);
  }
});

test('the LCP candidate is high priority and never lazy', () => {
  // optimize-image-priority (Modern Web Guidance), mandatory: "Always apply
  // fetchpriority="high" to the LCP image" and "DO NOT combine fetchpriority="high"
  // with loading="lazy"". On this site the LCP candidate is the page's header
  // image where there is one (measured in Chrome: the hero IS the largest
  // contentful paint on an article with one, and text where there is not).
  for (const { file, text } of tags) {
    // The hero on a SINGLE page. The same front-matter field is rendered as a
    // card in the listing templates, and there the measured LCP element is the
    // card text, not the image, so those stay plain lazy images.
    const isHero = /single\.html$/.test(file) && /image_header|image\.thumb_path/.test(text);
    if (isHero) {
      assert.match(text, /fetchpriority="high"/, `the header image in ${file} must be fetchpriority="high": ${text}`);
    }
    if (/fetchpriority="high"/.test(text)) {
      assert.doesNotMatch(
        text,
        /loading="lazy"/,
        `fetchpriority="high" must never be paired with loading="lazy" in ${file}: ${text}`
      );
    }
  }
});

test('the figure shortcode still passes a responsive srcset through', () => {
  // No caller uses srcset today, so nothing else would catch its removal.
  const figure = readFileSync(join(layouts, 'shortcodes', 'figure.html'), 'utf8');
  assert.match(figure, /srcset=/, 'figure.html must keep emitting the srcset attribute when a caller passes one');
  assert.match(figure, /\$alt := .*\$.Get "title"/, 'figure.html must source alt from the title when the caller passes no alt');
  // The one finding the independent review raised (P2): `loading`/`decoding` were
  // overridable but `fetchpriority` was not, so a figure authored as an article's
  // LCP image could not satisfy the guidance's mandatory fetchpriority="high".
  assert.match(figure, /\$.Get "fetchpriority"/, 'figure.html must let a caller opt a figure into the LCP priority');
});

test('image-dims.html is only ever interpolated INTO a tag, and always as safeHTMLAttr', () => {
  for (const { file, text } of tags) {
    if (!text.includes('image-dims.html')) continue;
    const call = text.slice(text.indexOf('image-dims.html'));
    assert.ok(
      /\|\s*safeHTMLAttr/.test(call),
      `${file} calls image-dims.html without | safeHTMLAttr, which renders ZgotmplZ: ${text}`
    );
  }
  // A call that is not inside any <img> tag emits attributes as page text.
  for (const file of files) {
    for (const match of file.source.matchAll(/image-dims\.html/g)) {
      const inside = tags.some(
        (tag) =>
          tag.file === file.rel && match.index > tag.index && match.index < tag.index + tag.text.length
      );
      assert.ok(
        inside,
        `${file.rel}: an image-dims.html call is outside every <img> tag, so its attributes render as text`
      );
    }
  }
});

test('image-dims.html only measures raster formats, because .Width on an SVG fails the build', () => {
  const partial = stripComments(readFileSync(join(layouts, 'partials', 'image-dims.html'), 'utf8'));
  const allowlist = partial.match(/slice\s+((?:"[a-z0-9]+"\s*)+)/);
  assert.ok(allowlist, 'image-dims.html must gate .Width/.Height behind a media-subtype allowlist');
  const subtypes = [...allowlist[1].matchAll(/"([a-z0-9]+)"/g)].map((m) => m[1]);
  assert.ok(subtypes.length > 0, 'the allowlist must name at least one raster subtype');
  // Verified by probe: rendering an SVG through the unguarded lookup fails the
  // build with "this method is only available for raster images".
  assert.ok(!subtypes.includes('svg'), 'svg must never be measured: .Width on an SVG aborts the build');
  assert.match(partial, /\.MediaType\.SubType/, 'the allowlist has to be applied to the resource media subtype');
  for (const subtype of subtypes) {
    assert.ok(
      ['png', 'jpg', 'jpeg', 'gif', 'webp', 'tiff', 'bmp'].includes(subtype),
      `${subtype} is not a raster format Hugo can measure`
    );
  }
});
