import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const article = readFileSync(new URL('../content/2017-07-06-progressive-progressive-web-apps.markdown', import.meta.url), 'utf8');

test('the article describes each raw HTML figure image', () => {
  const images = [...article.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  assert.equal(images.length, 3, 'expected all three raw article images to be checked');
  for (const tag of images) {
    assert.match(tag, /\balt="[^"]+"/, `missing descriptive alt: ${tag}`);
  }
});
