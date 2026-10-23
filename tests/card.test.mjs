// Regression tests for the OpenGraph card route's request input (api/card.ts).
//
// The route hands its query string to @vercel/og's ImageResponse, which the edge
// image pipeline rasterises: width/height are the canvas it allocates and the
// title is text it lays out. Nothing validated either, so a hand-crafted URL could
// ask for a 100000x100000 canvas, an unparsable ('abc', 'NaN') or negative
// dimension, or a title of any length (paul-kinlan-me-84w).
//
// The real renderer cannot run here - @vercel/og's resvg wasm fails to load in
// this Node ("Cannot find package 'wbg'"), so no PNG can be produced offline - so
// the module is bundled with esbuild and '@vercel/og' is stubbed by an
// ImageResponse that records the options it was constructed with and answers with
// a Response the route returns untouched. That boundary is exactly the defect: the
// renderer's input is what has to be bounded, and the stub records it verbatim.
//
// Run with: node --test tests/card.test.mjs
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

// Records every ImageResponse it is constructed with, then behaves like the real
// one at the response boundary: a 200 with an image content type.
const OG_STUB = `
export class ImageResponse extends Response {
  constructor(element, options = {}) {
    super('stub-image', { status: 200, headers: { 'Content-Type': 'image/png' } });
    globalThis.__card.calls.push({ element, options });
  }
}
`;

const buildHandler = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'card-route-'));
  const built = await build({
    entryPoints: [new URL('../api/card.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'og-stub',
      setup(plugin) {
        plugin.onResolve({ filter: /^@vercel\/og$/ }, () => ({ path: 'og', namespace: 'stub' }));
        plugin.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ loader: 'js', contents: OG_STUB }));
      }
    }]
  });
  const file = join(dir, 'card.mjs');
  writeFileSync(file, built.outputFiles[0].contents);
  const { default: handler } = await import(`file://${file}`);
  return { handler, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

// The card element is a plain object tree; the title is the one string the caller
// controls inside it, so it is read back from there rather than assumed.
const titleIn = (element) => {
  const texts = [];
  const walk = (node) => {
    if (typeof node === 'string') { texts.push(node); return; }
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node && typeof node === 'object' && 'props' in node) walk(node.props.children);
  };
  walk(element);
  return texts.find((text) => text !== 'paul.kinlan.me') ?? null;
};

test('the card canvas and title are bounded, whatever the query string asks for', async () => {
  globalThis.__card = { calls: [] };
  const { handler, cleanup } = await buildHandler();
  try {
    const run = async (query = '') => {
      globalThis.__card.calls.length = 0;
      const res = await handler(new Request(`https://paul.kinlan.me/api/card${query}`));
      const call = globalThis.__card.calls[0];
      return { res, call, options: call && call.options };
    };

    // Control: the documented shape still renders, at the historical default size.
    let card = await run('');
    assert.equal(card.res.status, 200);
    assert.equal(card.res.headers.get('content-type'), 'image/png',
      'the renderer response is returned untouched');
    assert.deepEqual(card.options, { width: 800, height: 418 });
    assert.equal(titleIn(card.call.element), '');

    // ...and a title the caller sends is rendered as sent.
    card = await run('?title=Hello%20world');
    assert.deepEqual(card.options, { width: 800, height: 418 });
    assert.equal(titleIn(card.call.element), 'Hello world');

    // A size inside the range is honoured, so this is a bound and not a fixed size.
    card = await run('?width=1200&height=630');
    assert.deepEqual(card.options, { width: 1200, height: 630 });

    // Huge dimensions are clamped: the renderer never sees a canvas nobody asked
    // to rasterise, and the request still produces a card.
    card = await run('?width=100000&height=100000');
    assert.equal(card.res.status, 200);
    assert.deepEqual(card.options, { width: 2400, height: 2400 });

    // Absurdly small ones clamp up, so a "card" is still a card.
    card = await run('?width=10&height=10');
    assert.deepEqual(card.options, { width: 200, height: 200 });

    // An unbounded title is truncated rather than laid out.
    const long = 'A'.repeat(5000);
    card = await run(`?title=${long}`);
    assert.equal(card.res.status, 200);
    assert.equal(titleIn(card.call.element).length, 200,
      'the title is capped at 200 characters');

    // A value that cannot be a canvas size is the caller's error, and it never
    // reaches the renderer as NaN/negative: those used to be rasteriser errors
    // (a 500) or an unbounded allocation.
    for (const value of ['abc', 'NaN', 'Infinity', '-100', '0', '1e5', ' 500', '0x10',
      '99.5', '999999999999', '', ' ', 'null']) {
      for (const parameter of ['width', 'height']) {
        const { res, call } = await run(`?${parameter}=${encodeURIComponent(value)}`);
        // An empty value is the documented absence, not an error.
        if (value === '') {
          assert.equal(res.status, 200, `${parameter}=${value} is the default`);
          continue;
        }
        assert.equal(res.status, 400, `${parameter}=${value} must be a 400, not a renderer error`);
        assert.equal(await res.text(), `invalid ${parameter}`);
        assert.equal(call, undefined,
          `${parameter}=${value} must not reach the renderer`);
      }
    }
  } finally {
    cleanup();
    delete globalThis.__card;
  }
});
