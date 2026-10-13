// The alt-text contract for the fourteen single-figure content posts whose images are
// written as raw `<figure><img src=...></figure>` HTML (paul-kinlan-me-toc, the "older
// batch" shard of the audit paul-kinlan-me-2zq).
//
// Why a per-shard file rather than one repo-wide content gate: 100 rendered images
// across 49 published files are in scope for the audit, split into independent shards
// so each lands on its own. A guard over all of content/** would also fail on posts
// Paul writes by hand, which is the reasoning already recorded in
// tests/image-hints.test.mjs (that one covers layouts/** only). The repo-wide content
// guard is its own decision, paul-kinlan-me-oah.
//
// Why the count is pinned: raw content images bypass layouts/shortcodes/figure.html, so
// the build gives them no alt, no width/height and no loading hint. The defect is
// invisible in a diff - an alt-less tag renders exactly like one that never had one -
// so "every rendered image in these files carries a non-empty alt" plus the measured
// per-file count is what makes a later edit that pastes a new image in without alt come
// back here and say what it did.
//
// Scoped to what it reads: the fourteen files named below. No other test's state, no
// machine state, no build output (it runs before the build in tools/fast-gate.sh).
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// file -> the number of <img> tags the page renders, measured in the built site before
// the change (the FILE:TAGS inventory on paul-kinlan-me-toc, 16 of the 18 tags missing
// an alt; 2016-11-29-designing-a-webpush-service already had two described). The count
// is the contract.
const RENDERED_IMAGES = {
  'content/2013-06-11-installing-chrome-for-android-on-an-emulator.markdown': 1,
  'content/2013-06-13-experiments-in-buildin-a-mobile-friendly-table-of-contents.markdown': 3,
  'content/2013-08-20-detecting-critical-above-the-fold-css.markdown': 1,
  'content/2016-11-29-designing-a-webpush-service.markdown': 3,
  'content/2019-02-13-testing-file-share-target-from-camera.markdown': 1,
  'content/2019-02-13-testing-file-share-target.markdown': 1,
  'content/2019-02-17-brexithistory-will-judge-us-all.markdown': 1,
  'content/2019-02-18-the-gdpr-mess.markdown': 1,
  'content/2019-02-27-github-s-web-components.markdown': 1,
  'content/2019-02-27-london-from-kingscross.markdown': 1,
  'content/2019-03-09-browser-bug-searcher.markdown': 1,
  'content/2019-03-09-got-web-performance-problemsjust-wait.markdown': 1,
  'content/2019-03-11-object-detection-and-augmentation.markdown': 1,
  'content/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.markdown': 1,
};

// Fenced blocks and inline code are blanked (same length, so offsets still line up)
// rather than removed: three of the audit's 100 tags are documented `<img>` examples
// inside code, and Hugo never renders those. None of them are in this shard today, but
// 2016-11-29-designing-a-webpush-service is a tutorial with five fenced blocks, so the
// guard that flags a post's own code sample would be a false positive the moment an
// example is added there.
function stripCode(source) {
  return source
    .replace(/(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1/g, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (code) => ' '.repeat(code.length));
}

// The value of a real `alt` attribute, or null when the tag has none.
//
// NOT `/\balt="[^"]+"/`: \b also matches between `-` and `a`, so that pattern matches the
// substring inside `data-alt="..."` - an <img> whose only alt-like attribute is data-alt
// passes green while the page still has a critical axe image-alt violation
// (paul-kinlan-me-a5b). The self-test below pins it so the bug cannot come back with a
// copy-paste.
function altText(tag) {
  const match = /(?<![\w-])alt\s*=\s*"([^"]*)"/.exec(tag);
  return match ? match[1] : null;
}

const files = Object.entries(RENDERED_IMAGES).map(([path, expected]) => {
  const source = stripCode(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
  return {
    path,
    expected,
    images: [...source.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]),
  };
});

test('the alt check is not fooled by a data-alt attribute', () => {
  assert.equal(altText('<img src="/a.png" data-alt="not an alt">'), null, 'data-alt is not alt');
  assert.equal(altText('<img alt="a real one">'), 'a real one');
  assert.equal(altText('<img\x0aalt="second line">'), 'second line');
  assert.equal(altText('<img alt="">'), '', 'an empty alt is present but not descriptive');
});

test('the shard is actually scanned', () => {
  // A vacuous pass would look identical to a green one: an empty scan, or a stripCode
  // that ate the whole file, must not be read as "no defect".
  assert.equal(files.length, 14, `expected the 14 shard files, found ${files.length}`);
  const total = files.reduce((sum, file) => sum + file.images.length, 0);
  assert.equal(total, 18, `expected the shard's 18 rendered images, found ${total}`);
});

test('every rendered image in the shard has a descriptive alt', () => {
  for (const file of files) {
    for (const tag of file.images) {
      const alt = altText(tag);
      assert.ok(alt, `${file.path}: <img> with no alt attribute: ${tag}`);
      assert.ok(
        alt.trim().length > 0,
        `${file.path}: <img> with an empty alt, which claims the image is decorative: ${tag}`
      );
    }
  }
});

test('every file still renders the number of images the audit measured', () => {
  for (const file of files) {
    assert.equal(
      file.images.length,
      file.expected,
      `${file.path}: the page renders ${file.expected} image(s); the file now has ${file.images.length}`
    );
  }
});
