import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const article = readFileSync(new URL('../content/2017-07-06-progressive-progressive-web-apps.markdown', import.meta.url), 'utf8');

// The value of a real `alt` attribute, or null when the tag has none.
//
// NOT `/\balt="[^"]+"/`: \b also matches between `-` and `a`, so that pattern matches the
// substring inside `data-alt="..."` - an <img> whose only alt-like attribute is data-alt
// passed this guard green while the page still had a critical axe image-alt violation
// (paul-kinlan-me-a5b). Leading `\s` is what distinguishes the attribute itself.
function altText(tag) {
  const match = /\salt\s*=\s*("([^"]*)"|'([^']*)')/i.exec(tag);
  return match ? (match[2] ?? match[3]).trim() : null;
}

test('the alt check is not fooled by a data-alt attribute', () => {
  assert.equal(altText('<img src="/a.png" data-alt="not an alt">'), null, 'data-alt is not alt');
  assert.equal(altText('<img src="/a.png" alt="a real one">'), 'a real one');
});

test('the article describes each raw HTML figure image', () => {
  const images = [...article.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  assert.equal(images.length, 3, 'expected all three raw article images to be checked');
  for (const tag of images) {
    const alt = altText(tag);
    assert.ok(alt, `missing descriptive alt: ${tag}`);
    assert.notEqual(alt, '', `empty alt: ${tag}`);
  }
});
