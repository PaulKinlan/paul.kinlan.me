// Regression tests for the OpenGraph card route's request input (api/card.tsx)
// and its rendering budget (lib/card-admission.js, paul-kinlan-me-7wgy).
//
// The route hands its query string to @vercel/og's ImageResponse, which the edge
// image pipeline rasterises: width/height are the canvas it allocates and the
// title is text it lays out. Nothing validated either, so a hand-crafted URL could
// ask for a 100000x100000 canvas, an unparsable ('abc', 'NaN') or negative
// dimension, or a title of any length (paul-kinlan-me-84w).
//
// Even a bounded render is unauthenticated CPU with no other quota
// (middleware.ts's matcher excludes /api), so the route now also admits through
// a global per-minute KV budget before it rasterises: over budget is a 429 with
// no-store, a KV outage is a fail-closed 503 with no-store, and a 200 is
// publicly cacheable (browser via the @vercel/og default, kept; Vercel edge CDN
// via s-maxage, added) so a repeat fetch of the same card URL never re-renders.
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

import { FakeRedis, LAST_MS_OF_A_MINUTE, freezeClock, luaToJs } from './helpers/lua-redis.mjs';
import { ADMISSION_SCRIPT, MAX_CARDS_PER_MINUTE, budgetKey } from '../lib/card-admission.js';

// The 200's cache contract, pinned verbatim: browsers cache via the @vercel/og
// default (kept as-is) and Vercel's edge CDN caches a function response on
// s-maxage (added, 7wgy) - the CDN tier is what serves a social crawler's
// repeat fetch without invoking the function at all.
const CARD_CACHE_CONTROL = 'public, immutable, no-transform, max-age=31536000, s-maxage=86400';

// Records every ImageResponse it is constructed with, then behaves like the real
// one at the response boundary: a 200 with an image content type. The real
// ImageResponse builds its init as headers: { 'content-type': 'image/png',
// 'cache-control': <pkg default, lower-case>, ...options.headers } — and the
// KEY CASING is the whole point of modelling it (paul-kinlan-me-h1gp): an
// object spread does not dedupe keys differing only in case, and the WHATWG
// Headers constructor then comma-joins the two values into ONE header. A stub
// that declared a capital-C 'Content-Type' and no cache-control default never
// collided with a caller's 'Cache-Control', so a duplicated directive list
// shipped green. The default value below is the package's own production
// default (dist/index.edge.js:23638); dev-mode's no-store is not modelled
// because the edge runtime serves with NODE_ENV=production.
const OG_STUB = `
export class ImageResponse extends Response {
  constructor(element, options = {}) {
    super('stub-image', {
      status: 200,
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, immutable, no-transform, max-age=31536000',
        ...(options.headers ?? {})
      }
    });
    globalThis.__card.calls.push({ element, options });
  }
}
`;

const buildHandler = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'card-route-'));
  const built = await build({
    entryPoints: [new URL('../api/card.tsx', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    // api/card.tsx compiles its JSX with the local `h` factory (the per-file
    // pragma); pin the same transform here so the harness is deterministic
    // whatever tsconfig.json says.
    jsx: 'transform',
    jsxFactory: 'h',
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
  globalThis.__cardAdmissionKv = new FakeRedis();
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
    assert.deepEqual(card.options, { width: 800, height: 418, headers: { 'cache-control': CARD_CACHE_CONTROL } });
    assert.equal(titleIn(card.call.element), '');

    // ...and a title the caller sends is rendered as sent.
    card = await run('?title=Hello%20world');
    assert.deepEqual(card.options, { width: 800, height: 418, headers: { 'cache-control': CARD_CACHE_CONTROL } });
    assert.equal(titleIn(card.call.element), 'Hello world');

    // A size inside the range is honoured, so this is a bound and not a fixed size.
    card = await run('?width=1200&height=630');
    assert.deepEqual(card.options, { width: 1200, height: 630, headers: { 'cache-control': CARD_CACHE_CONTROL } });

    // Huge dimensions are clamped: the renderer never sees a canvas nobody asked
    // to rasterise, and the request still produces a card.
    card = await run('?width=100000&height=100000');
    assert.equal(card.res.status, 200);
    assert.deepEqual(card.options, { width: 2400, height: 2400, headers: { 'cache-control': CARD_CACHE_CONTROL } });

    // Absurdly small ones clamp up, so a "card" is still a card.
    card = await run('?width=10&height=10');
    assert.deepEqual(card.options, { width: 200, height: 200, headers: { 'cache-control': CARD_CACHE_CONTROL } });

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
    delete globalThis.__cardAdmissionKv;
  }
});

// --- the rendering budget (lib/card-admission.js, paul-kinlan-me-7wgy) -------

const buildRig = async ({ kv } = { kv: new FakeRedis() }) => {
  globalThis.__card = { calls: [] };
  globalThis.__cardAdmissionKv = kv;
  // The clock freeze needs the fake's TTL clock; a hand-rolled failing store
  // (below) never admits, so its clock is irrelevant.
  const frozen = typeof kv.frozen === 'function';
  const clock = frozen ? freezeClock(kv, LAST_MS_OF_A_MINUTE) : null;
  const { handler, cleanup } = await buildHandler();
  const renderCalls = () => globalThis.__card.calls.length;
  const run = async (query = '') => {
    globalThis.__card.calls.length = 0;
    const res = await handler(new Request(`https://paul.kinlan.me/api/card${query}`));
    return { res, rendered: globalThis.__card.calls.length > 0, body: await res.text() };
  };
  return {
    kv, clock, run, renderCalls,
    restore: () => {
      cleanup();
      delete globalThis.__card;
      delete globalThis.__cardAdmissionKv;
      if (clock) clock.restore();
    },
  };
};

// The finding's lever, closed: a global per-minute cap on rasterisation. Over
// budget is a 429 with no-store and ZERO renderer calls; the next minute admits
// again (the budget is a rate, not a ban).
test('the per-minute budget caps rasterisation: 60 served, then 429 with no render', async () => {
  const rig = await buildRig();
  try {
    for (let i = 0; i < MAX_CARDS_PER_MINUTE; i++) {
      const { res } = await rig.run(`?title=card%20${i}`);
      assert.equal(res.status, 200, `card ${i} inside the budget`);
      assert.equal(res.headers.get('cache-control'), CARD_CACHE_CONTROL,
        'a 200 is publicly cacheable, browser AND edge CDN - ONE directive list; '
        + 'a repeated one would mean the spread kept the package default alongside ours (h1gp)');
    }

    const refused = await rig.run('?title=one%20too%20many');
    assert.equal(refused.res.status, 429, 'over the budget is a 429');
    assert.equal(refused.res.headers.get('cache-control'), 'no-store',
      'a 429 must never be edge-cached - a cached one would deny the card after the minute rolls over');
    assert.equal(refused.res.headers.get('retry-after'), '60');
    assert.equal(refused.res.headers.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(refused.rendered, false, 'a refused request never reaches the renderer');
    assert.ok(!refused.body.includes('one too many'), 'the refusal does not reflect the query back');
    assert.ok(!refused.body.includes('<'), 'the refusal is inert text, never markup');

    // The next minute gets a fresh budget.
    rig.clock.advanceMs(60_000);
    const next = await rig.run('?title=a%20fresh%20minute');
    assert.equal(next.res.status, 200, 'the next minute admits again');
  } finally {
    rig.restore();
  }
});

// Fail-closed on KV failure (the 6xr contract): an outage must not silently
// restore the unbounded rasterisation lever, and the 503 must leave nothing
// storable.
test('a KV failure is a 503 with no-store and zero renders; recovery restores rendering', async () => {
  let evalCalls = 0;
  const rig = await buildRig({ kv: { eval: async () => { evalCalls += 1; throw new Error('kv unavailable'); } } });
  try {
    const refused = await rig.run('?title=Hi');
    assert.equal(refused.res.status, 503, 'KV down fails closed');
    assert.equal(refused.res.headers.get('cache-control'), 'no-store', 'the 503 is not storable');
    assert.equal(evalCalls, 1, 'one admission attempt, no retry loop');
    assert.equal(refused.rendered, false, 'a KV failure renders nothing');
    assert.ok(!refused.body.includes('<'), 'the 503 body is inert text');

    // Recovery: the seam delegates per call, so restoring the store is what a
    // recovered KV looks like to the next request.
    globalThis.__cardAdmissionKv = new FakeRedis();
    const recovered = await rig.run('?title=Hi');
    assert.equal(recovered.res.status, 200, 'rendering resumes when KV recovers');
    assert.equal(rig.renderCalls(), 1);
  } finally {
    rig.restore();
  }
});

// A spray of invalid requests must not spend admission round-trips or budget
// (the 400s sit ahead of admission), and the cu3 lesson applied to the fix
// itself: admission mints one bounded key per minute and stays one round-trip
// per request, with the shipped script text the only thing that ran.
test('invalid input costs zero KV calls; a refused spray mints one bounded key per minute', async () => {
  const rig = await buildRig();
  try {
    for (let i = 0; i < 50; i++) {
      const { res } = await rig.run(`?width=abc&spray=${i}`);
      assert.equal(res.status, 400, `invalid spray ${i} is a cheap 400`);
    }
    assert.equal(rig.kv.evalCalls, 0, 'a 400 never consults admission');
    assert.equal(rig.renderCalls(), 0, 'a 400 never renders');

    for (let i = 0; i < MAX_CARDS_PER_MINUTE; i++) await rig.run(`?title=spray%20${i}`);
    const refused = await rig.run();
    assert.equal(refused.res.status, 429);
    assert.equal(rig.kv.evalCalls, MAX_CARDS_PER_MINUTE + 1,
      'one KV round-trip per request once input is valid, no scans');
    const key = budgetKey(rig.clock.minute());
    assert.deepEqual([...rig.kv.values.keys()], [key],
      'exactly one key for the minute - nothing keyed by caller input');
    assert.equal(rig.kv.script, ADMISSION_SCRIPT, 'the script the module ships is the script that ran');
    assert.deepEqual(rig.kv.lastKeys, [key]);
    assert.deepEqual(rig.kv.lastArgs, [String(MAX_CARDS_PER_MINUTE), '120']);

    // Every non-comment line of the shipped script translated - a skipped line
    // would be behaviour this suite never observes (paul-kinlan-me-3s4).
    const meaningfulLines = ADMISSION_SCRIPT.split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('--'));
    assert.equal(luaToJs(ADMISSION_SCRIPT).split('\n').length, meaningfulLines.length,
      'every script line is translated, none skipped');

    // The key lives exactly its TTL, so nothing accumulates across minutes.
    const ttl = rig.kv.ttl(key);
    assert.ok(ttl > 0 && ttl <= 120, `budget key TTL within its window (got ${ttl})`);
    rig.clock.advanceMs(121_000);
    assert.equal(rig.kv.values.has(key), false, 'the budget key expires on its TTL');
  } finally {
    rig.restore();
  }
});
