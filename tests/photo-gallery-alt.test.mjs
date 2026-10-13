// These two photo posts are handwritten content: their images are raw
// `<figure><img src=...></figure>` HTML, which bypasses layouts/shortcodes/figure.html,
// so nothing in the build gives them an alt attribute. An alt-less <img> is a critical
// axe `image-alt` violation, and both posts are published.
//
// The test pins the authored descriptions rather than a count of tags: it asserts every
// raw <img> in each post has a non-empty alt, so a later edit that adds an image cannot
// silently reintroduce the violation. It reads its own two files and nothing else, so it
// is independent of test order and of any other lane's content edits.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const posts = {
  '2019-08-17-photos-from-carlisle-castle.markdown': 8,
  '2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya.markdown': 6,
};

for (const [file, expected] of Object.entries(posts)) {
  test(`every raw content image in ${file} has descriptive alt text`, () => {
    const source = readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8');
    const images = [...source.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
    assert.equal(images.length, expected, `expected ${expected} raw images in ${file}`);
    for (const tag of images) {
      assert.match(tag, /\balt="[^"]+"/, `missing descriptive alt for ${file}: ${tag}`);
    }
  });
}
