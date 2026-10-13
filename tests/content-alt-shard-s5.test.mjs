// Shard S5 of paul-kinlan-me-2zq: the raw <img> tags that sit in running prose
// (not in a <figure>) across eight content files. They bypass
// layouts/shortcodes/figure.html, so nothing in the build gives them an alt
// attribute, and each unlabelled image is a critical axe `image-alt` violation on
// a published page.
//
// This pins the authored descriptions rather than a total count of tags: every
// raw image in the descriptive files must keep a non-empty alt, so a later edit
// that adds an image cannot silently reintroduce the violation. It reads its own
// eight files and nothing else, so it is independent of test order and of any
// other lane's content edits.
//
// (The one deliberate exception is the pair of sprite images inside the
// <air-horner> custom element on the projects/jakehorner page: they are the two
// halves of an animated face, so they are decorative and take alt="" rather than
// a description a screen reader would read out over the animation.)
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// The value of a real `alt` attribute, or null when the tag has none.
//
// NOT `/\balt="[^"]+"/`: \b also matches between `-` and `a`, so that pattern
// matches the substring inside `data-alt="..."` - an <img> whose only alt-like
// attribute is data-alt passes green while the page still has a critical axe
// image-alt violation (paul-kinlan-me-a5b). Leading `\s` is what distinguishes
// the attribute itself.
function altText(tag) {
  const match = /\salt\s*=\s*("([^"]*)"|'([^']*)')/i.exec(tag);
  return match ? (match[2] ?? match[3]).trim() : null;
}

function rawImages(file) {
  const source = readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8');
  return [...source.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
}

test('the alt check is not fooled by a data-alt attribute', () => {
  assert.equal(altText('<img src="/a.png" data-alt="not an alt">'), null, 'data-alt is not alt');
  assert.equal(altText('<img src="/a.png" alt="a real one">'), 'a real one');
  assert.equal(altText('<img src="/a.png" alt="">'), '', 'an empty alt is present but not descriptive');
});

// file -> how many raw <img> the file has, all of which must describe themselves.
const descriptive = {
  '2013-06-20-another-experiment-in-creating-a-mobile-friendly-table-of-contents.markdown': 3,
  '2015-02-14-what-happened-to-web-intents.markdown': 1,
  '2015-03-14-deep-app-linking-on-android-and-chrome.markdown': 1,
  '2015-09-01-the-web-in-india-anecdote-2.markdown': 2,
  '2015-11-11-sharing-natively-on-android.markdown': 3,
  '2017-04-07-css-vars-issues-with-background.markdown': 2,
};

for (const [file, expected] of Object.entries(descriptive)) {
  test(`every raw content image in ${file} has descriptive alt text`, () => {
    const images = rawImages(file);
    assert.equal(images.length, expected, `expected ${expected} raw images in ${file}`);
    for (const tag of images) {
      const alt = altText(tag);
      assert.ok(alt, `missing alt attribute for ${file}: ${tag}`);
      assert.notEqual(alt, '', `empty alt for ${file}: ${tag}`);
    }
  });
}

const decorative = {
  'projects/jakehorner.markdown': 2,
};

for (const [file, expected] of Object.entries(decorative)) {
  test(`every raw content image in ${file} has an alt attribute, empty where decorative`, () => {
    const images = rawImages(file);
    assert.equal(images.length, expected, `expected ${expected} raw images in ${file}`);
    for (const tag of images) {
      assert.notEqual(altText(tag), null, `img with no alt attribute at all in ${file}: ${tag}`);
      assert.equal(altText(tag), '', `these two are decorative animation sprites, so alt stays empty in ${file}: ${tag}`);
    }
  });
}
