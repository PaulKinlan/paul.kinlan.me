// The alt-text contract for the fourteen content files converted by the S4 shard of
// the raw-image sweep (paul-kinlan-me-6gr, from the audit paul-kinlan-me-2zq).
//
// Every image in these posts is authored as a raw `<figure><img src=...></figure>`,
// which bypasses layouts/shortcodes/figure.html - so nothing in the build supplies an
// alt attribute, and an alt-less <img> is a critical axe `image-alt` violation on a
// published page. These fourteen posts are all published, so each omission was live.
//
// Why the test pins the count as well as the alt: the sweep's failure mode is not a
// wrong description, it is a description that silently disappears - a later edit that
// adds an image to one of these posts, or rewrites a figure, reintroduces the violation
// with no visible change to the diff. Asserting the measured tag count per file means
// such an edit has to come here and say what it did.
//
// Scoped to what it reads: the fourteen files named below. No other test's state, no
// machine state, no build output - it runs before the build in tools/fast-gate.sh.
// Deliberately NOT a repo-wide content gate: a gate that fails on a post Paul writes by
// hand blocks unrelated landings (same reasoning as tests/image-hints.test.mjs); the
// repo-wide content guard is its own decision, paul-kinlan-me-oah.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// file -> the number of <img> tags the page renders. These are the FILE:TAGS counts on
// paul-kinlan-me-6gr, which the audit confirmed against the built site; the two and
// three tag posts also render on the paginated list pages /page/12/ and /page/13/
// through their summaries, so the same tags appear there.
const RENDERED_IMAGES = {
  'content/2019-03-30-quick-logcatdebugging-android-from-the-web.markdown': 1,
  'content/2019-04-05-offline-fallback-page-with-service-woker.markdown': 2,
  'content/2019-04-05-testingblock-image-upload.markdown': 1,
  'content/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os.markdown': 1,
  'content/2019-04-15-sakura.markdown': 1,
  'content/2019-04-22-small-shrine-in-engakuji-temple-near-kamakura.markdown': 1,
  'content/2019-04-22-wood-carving-found-in-engakuji-shrine-near-kamakura.markdown': 1,
  'content/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection.markdown': 3,
  'content/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web.markdown': 1,
  'content/2019-07-14-bookstorellangollen.markdown': 1,
  'content/2019-07-14-liverpool-world-museum.markdown': 1,
  'content/2019-07-23-idle-observationindexing-text-in-images.markdown': 1,
  'content/2019-10-14-addingdark-modeto-my-blog.markdown': 2,
  'content/2021-03-20-ML-to-help-with-developer-experience.markdown': 3,
};

// The value of a real `alt` attribute, or null when the tag has none.
//
// ATTRIBUTE-BOUNDARY-ANCHORED, not \b: paul-kinlan-me-a5b showed the ad-hoc guard in
// tests/progressive-progressive-web-apps-alt.test.mjs passing green on
// `<img data-alt="x">`, because \b matches between `-` and `a`. `(?<![\w-])` is what
// makes this the attribute and not the tail of a different one; the self-test below
// pins that so the bug cannot come back with a copy-paste.
const ALT_ON_IMG = /(?<![\w-])alt\s*=\s*"([^"]*)"/;

function altText(tag) {
  const match = ALT_ON_IMG.exec(tag);
  return match ? match[1].trim() : null;
}

test('the alt check is not fooled by a data-alt attribute', () => {
  assert.equal(altText('<img src="/a.png" data-alt="not an alt">'), null, 'data-alt is not alt');
  assert.equal(altText('<img src="/a.png" x-alt="not an alt either">'), null, 'x-alt is not alt');
  assert.equal(altText('<img src="/a.png" alt="a real one">'), 'a real one');
  assert.equal(altText('<img src="/a.png" alt="">'), '', 'an empty alt is present but not descriptive');
});

const files = Object.entries(RENDERED_IMAGES).map(([path, expected]) => ({
  path,
  expected,
  source: readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'),
}));

test('every image in the S4 sweep is actually scanned', () => {
  // A vacuous pass looks identical to a green one, so an empty scan or an unreadable
  // file must not be read as "no defect".
  assert.equal(files.length, 14, `expected the 14 sweep files, found ${files.length}`);
  const total = files.reduce((sum, file) => sum + [...file.source.matchAll(/<img\b[^>]*>/g)].length, 0);
  assert.equal(total, 20, `expected the sweep's 20 raw content images, found ${total}`);
});

for (const file of files) {
  test(`every raw content image in ${file.path} has descriptive alt text`, () => {
    const images = [...file.source.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
    assert.equal(images.length, file.expected, `expected ${file.expected} raw images in ${file.path}`);
    for (const tag of images) {
      const alt = altText(tag);
      assert.ok(alt, `missing alt attribute for ${file.path}: ${tag}`);
      assert.notEqual(alt, '', `empty alt for ${file.path}: ${tag}`);
    }
  });
}
