// Admission-budget tests for the federation interactions renderer
// (api/activitypub-html/render.ts, paul-kinlan-me-stn4).
//
// The finding: `?url=` accepts any page of this site, the Firestore document id
// derives from the caller's raw value, and the edge cache key is the request
// URL - so an anonymous caller who VARIES the URL (any path, query param or
// fragment) gets a guaranteed cache miss and 3 uncached Firestore collection
// reads per request, forever. s-maxage only collapses requests that repeat the
// SAME query string. The bead's named remedy is the ADR 7wx admission pattern:
// a KV-budgeted admission check before the reads.
//
// What render.ts ships: one atomic Redis EVAL per request that reaches the
// function (a CDN hit never gets here), incrementing a global per-minute
// budget `aphtml:budget:<minute>` and a per-URL counter
// `aphtml:url:<id>:<minute>`, both EX120; over either budget the answer is 429
// with Cache-Control: no-store and ZERO Firestore reads; a KV failure is a
// fail-closed 503 with no-store (the paul-kinlan-me-6xr contract).
//
// The handler is bundled with esbuild exactly as tests/activitypub-html-render-
// escape.test.mjs does it; '@vercel/kv' is stubbed with a FakeRedis that
// EXECUTES the shipped script text through the shared luaToJs harness
// (tests/helpers/lua-redis.mjs) - never a hand-written model of it
// (paul-kinlan-me-3s4). Fast tier: no browser, no network, no shared state.
// Run with: node --test tests/activitypub-html-render-admission.test.mjs
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

import { FakeRedis, LAST_MS_OF_A_MINUTE, freezeClock, luaToJs } from './helpers/lua-redis.mjs';

// The Firestore client the handler sees: every collection read is recorded, so
// "a refused request reads nothing" is asserted, not assumed. Each render dual-
// reads every collection - the injective doc-id encoding and the legacy one
// (paul-kinlan-me-je6t) - so the snapshot hook is keyed by (name, id).
const FIRESTORE_STUB = `
export default {
  apps: [true],
  firestore: () => ({
    collection: (name) => ({
      doc: (id) => ({
        collection: () => ({
          get: async () => {
            globalThis.__aphtml.reads.push(name + '/' + id);
            return globalThis.__aphtml.snapshot(name, id);
          }
        })
      })
    })
  })
};
`;

// The kv binding is read at module-eval (createRenderHandler(kv)), so the stub
// delegates per call and the fake can be swapped between requests.
const KV_STUB = 'export const kv = { eval: (...args) => globalThis.__aphtmlKv.eval(...args) };';

const STUBS = {
  '@vercel/node': 'export {};',
  '@vercel/kv': KV_STUB,
  'firebase-admin': FIRESTORE_STUB
};

// Fake redis with the render-admission assertion helpers.
class FakeKV extends FakeRedis {
  get liveUrlKeys() {
    this.purge();
    return [...this.values.keys()].filter((key) => key.startsWith('aphtml:url:'));
  }

  get liveBudgetKeys() {
    this.purge();
    return [...this.values.keys()].filter((key) => key.startsWith('aphtml:budget:'));
  }
}

const buildHandler = async (fakeKv) => {
  globalThis.__aphtmlKv = fakeKv;
  globalThis.__aphtml = { reads: [], snapshot: (name, id) => ({ size: 0, docs: [] }) };
  const dir = mkdtempSync(join(tmpdir(), 'render-admission-'));
  const built = await build({
    entryPoints: [new URL('../api/activitypub-html/render.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'render-admission-stubs',
      setup(plugin) {
        plugin.onResolve({ filter: /^(@vercel\/node|@vercel\/kv|firebase-admin)$/ }, (args) => (
          { path: args.path, namespace: 'stub' }
        ));
        plugin.onLoad({ filter: /.*/, namespace: 'stub' },
          ({ path }) => ({ loader: 'js', contents: STUBS[path] }));
      }
    }]
  });
  const file = join(dir, 'handler.mjs');
  writeFileSync(file, built.outputFiles[0].contents);
  const { default: handler } = await import(`file://${file}`);
  return {
    handler,
    cleanup: () => {
      rmSync(dir, { recursive: true, force: true });
      delete globalThis.__aphtml;
      delete globalThis.__aphtmlKv;
    }
  };
};

const mockResponse = () => ({
  statusCode: 0,
  headers: {},
  ends: 0,
  setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
  status(code) { this.statusCode = code; return { end: (body) => this.end(body) }; },
  end(body) { this.ends += 1; this.body = body; return this; }
});

const get = (handler, url) => {
  const res = mockResponse();
  return handler({ query: { url }, method: 'GET' }, res).then(() => res);
};

// The reviewer's repro, closed: distinct same-site URLs each used to be a
// guaranteed cache miss with 3 uncached reads, without limit. Now the GLOBAL
// per-minute budget caps cold renders at 60 (360 reads: 3 collections, each
// dual-read under both doc-id encodings, paul-kinlan-me-je6t), and every
// request past the budget is a 429 that reads nothing and stores nothing.
test('a caller varying the URL is bounded by the global per-minute budget: 60 renders, then 429 with zero reads', async () => {
  const kv = new FakeKV();
  const { handler, cleanup } = await buildHandler(kv);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    // Distinct same-site URLs - exactly the finding's lever (?url=/a, /b?r=1,
    // /c?r=2, /post/?utm=x, ...). All inside the budget: they render.
    for (let i = 0; i < 60; i++) {
      const res = await get(handler, `https://paul.kinlan.me/p${i}?r=${i}#f${i}`);
      assert.equal(res.statusCode, 200, `render ${i} inside the budget`);
      assert.equal(res.headers['cache-control'], 'public, s-maxage=300, stale-while-revalidate=600');
    }
    assert.equal(globalThis.__aphtml.reads.length, 360,
      '60 admitted renders read 3 collections under both doc-id encodings each (je6t dual-read)');

    // Request 61 in the same minute - a URL that has never been asked for:
    // refused BEFORE any read, and nothing about it is storable at the edge.
    const refused = await get(handler, 'https://paul.kinlan.me/one-too-many');
    assert.equal(refused.statusCode, 429, 'over the global budget is a 429');
    assert.equal(refused.headers['cache-control'], 'no-store',
      'a 429 must never be edge-cached - a cached one would deny the page its render after the minute rolls over');
    assert.equal(refused.headers['retry-after'], '60');
    assert.equal(refused.ends, 1, 'exactly one response');
    assert.equal(globalThis.__aphtml.reads.length, 360, 'a refused request reads nothing');

    // The next minute admits again: the budget is a rate, not a ban.
    clock.advanceMs(60_000);
    const nextMinute = await get(handler, 'https://paul.kinlan.me/one-too-many');
    assert.equal(nextMinute.statusCode, 200, 'the next minute gets a fresh budget');
    assert.equal(globalThis.__aphtml.reads.length, 366);
  } finally {
    clock.restore();
    cleanup();
  }
});

// The second lever the global budget alone would leave open: ONE page hammered
// past its own edge-cache entry (junk outer query params bust the CDN key but
// not the ?url=). The per-URL counter caps it at 12 cold renders a minute
// while other pages keep rendering.
test('a single URL hammered past its edge-cache entry is capped per-URL; other URLs are unaffected', async () => {
  const kv = new FakeKV();
  const { handler, cleanup } = await buildHandler(kv);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    const hot = 'https://paul.kinlan.me/hot-post/';
    for (let i = 0; i < 12; i++) {
      const res = await get(handler, hot);
      assert.equal(res.statusCode, 200, `render ${i} of the hot URL inside its per-URL budget`);
    }
    assert.equal(globalThis.__aphtml.reads.length, 72);

    const thirteenth = await get(handler, hot);
    assert.equal(thirteenth.statusCode, 429, 'the 13th cold render of one URL in a minute is refused');
    assert.equal(thirteenth.headers['cache-control'], 'no-store');
    assert.equal(globalThis.__aphtml.reads.length, 72, 'a per-URL refusal reads nothing');

    // The refusal is per-URL, not global: a different page still renders.
    const other = await get(handler, 'https://paul.kinlan.me/another-post/');
    assert.equal(other.statusCode, 200, 'one hot URL must not starve the others');
    assert.equal(globalThis.__aphtml.reads.length, 78);

    // And the hot URL renders again once the minute rolls over.
    clock.advanceMs(60_000);
    const after = await get(handler, hot);
    assert.equal(after.statusCode, 200, 'the next minute restores the hot URL too');
  } finally {
    clock.restore();
    cleanup();
  }
});

// The cu3 lesson applied to the fix itself: admission must not mint unbounded
// KV keys. The global budget is checked BEFORE the per-URL key is created, so
// a spray of distinct URLs over the budget leaves at most 60 per-URL keys, all
// on a 120s TTL.
test('refused requests mint no KV keys: key cardinality and TTLs stay bounded under a spray', async () => {
  const kv = new FakeKV();
  const { handler, cleanup } = await buildHandler(kv);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    for (let i = 0; i < 200; i++) {
      await get(handler, `https://paul.kinlan.me/spray-${i}`);
    }
    assert.equal(kv.liveUrlKeys.length, 60,
      'only admitted renders mint a per-URL key (the 140 refused ones must not)');
    assert.equal(kv.liveBudgetKeys.length, 1, 'one global budget key for the minute');
    assert.equal(globalThis.__aphtml.reads.length, 360, 'read volume is flat once the budget is spent');

    // Wire shape, read off the LAST eval: the script is the shipped text, the
    // keys are the two budgets, the args are the exported caps and TTL.
    assert.match(kv.script, /redis\.call\('INCR', KEYS\[1\]\)/, 'the global budget is incremented first');
    assert.match(kv.script, /EXPIRE/, 'every key gets a bounded lifetime');
    // Every non-comment line of the shipped script translated - a skipped line
    // would be behaviour this suite never observes (paul-kinlan-me-3s4).
    const meaningfulLines = kv.script.split('\n').map((line) => line.trim()).filter((line) => line !== '' && !line.startsWith('--'));
    assert.equal(luaToJs(kv.script).split('\n').length, meaningfulLines.length, 'every script line is translated, none skipped');
    const minute = Math.floor(Date.now() / 60000);
    assert.deepEqual(kv.lastKeys, [`aphtml:budget:${minute}`, `aphtml:url:https:__paul.kinlan.me_spray-199:${minute}`]);
    assert.deepEqual(kv.lastArgs, ['60', '12', '120']);
    assert.equal(kv.evalCalls, 200, 'one KV round-trip per request, no scans');

    // Both keys live exactly their TTL: gone 120s after the last touch, so
    // nothing accumulates across minutes.
    const budgetKey = kv.liveBudgetKeys[0];
    assert.ok(kv.ttl(budgetKey) > 0 && kv.ttl(budgetKey) <= 120, `budget key TTL within its window (got ${kv.ttl(budgetKey)})`);
    clock.advanceMs(121_000);
    assert.equal(kv.liveUrlKeys.length, 0, 'per-URL keys expire on their TTL');
    assert.equal(kv.liveBudgetKeys.length, 0, 'the budget key expires on its TTL');
  } finally {
    clock.restore();
    cleanup();
  }
});

// Fail-closed on KV failure (the 6xr contract): a KV outage must not silently
// restore the unbounded read lever, and the 503 must leave nothing storable.
test('a KV failure is a 503 with no-store and zero reads; recovery restores renders', async () => {
  const kv = new FakeKV();
  const failing = {
    evalCalls: 0,
    eval: async () => { failing.evalCalls += 1; throw new Error('kv unavailable'); }
  };
  const { handler, cleanup } = await buildHandler(failing);
  try {
    const res = await get(handler, 'https://paul.kinlan.me/post/');
    assert.equal(res.statusCode, 503, 'KV down fails closed');
    assert.equal(res.headers['cache-control'], 'no-store', 'the 503 is not storable');
    assert.equal(res.ends, 1, 'exactly one response');
    assert.equal(globalThis.__aphtml.reads.length, 0, 'a KV failure reads nothing');

    // Recovery: swap in a working fake (the stub delegates per call, so the
    // swap is what a restored KV looks like to the next request).
    globalThis.__aphtmlKv = kv;
    const recovered = await get(handler, 'https://paul.kinlan.me/post/');
    assert.equal(recovered.statusCode, 200, 'renders resume when KV recovers');
    assert.equal(globalThis.__aphtml.reads.length, 6);
  } finally {
    cleanup();
  }
});

// Admission is for renders, not for rejections: requests that can never be a
// page (missing/unusable/foreign ?url=, non-GET) are answered before KV, so an
// attacker spraying garbage cannot burn the budget real pages need.
test('400/404/non-GET answers never touch KV', async () => {
  const kv = new FakeKV();
  const { handler, cleanup } = await buildHandler(kv);
  try {
    for (const [request, expected] of [
      [{ query: {}, method: 'GET' }, 404],
      [{ query: { url: '' }, method: 'GET' }, 404],
      [{ query: { url: 'not-a-url' }, method: 'GET' }, 400],
      [{ query: { url: 'javascript:alert(1)' }, method: 'GET' }, 400],
      [{ query: { url: 'https://evil.example/post/' }, method: 'GET' }, 400],
      [{ query: { url: 'https://paul.kinlan.me/post/' }, method: 'POST' }, 404]
    ]) {
      const res = mockResponse();
      await handler(request, res);
      assert.equal(res.statusCode, expected, JSON.stringify(request.query));
    }
    assert.equal(kv.evalCalls, 0, 'a request that is not a render attempt must not consume budget');
    assert.equal(globalThis.__aphtml.reads.length, 0, 'and must not read Firestore');
  } finally {
    cleanup();
  }
});

// paul-kinlan-me-je6t: the Firestore document id for a ?url= page used to be
// the non-injective slash->underscore encoding. New writes use the injective
// encodeURIComponent encoding (lib/activitypub/utils/docId.ts); the renderer
// must dual-read so interactions stored under the legacy encoding still count.
test('a render dual-reads both doc-id encodings and merges the two snapshots', async () => {
  const kv = new FakeKV();
  const { handler, cleanup } = await buildHandler(kv);
  try {
    const url = 'https://paul.kinlan.me/a-post';
    const injectiveId = encodeURIComponent(url);
    const legacyId = url.replace(/\//g, '_');
    const likeFrom = (actorUrl) => ({ data: () => ({ actor: actorUrl }) });
    globalThis.__aphtml.snapshot = (name, id) => {
      if (name === 'likes' && id === legacyId) {
        return { size: 2, docs: [likeFrom('https://a.example/users/1'), likeFrom('https://b.example/users/2')] };
      }
      if (name === 'likes' && id === injectiveId) {
        return { size: 1, docs: [likeFrom('https://c.example/users/3')] };
      }
      return { size: 0, docs: [] };
    };

    const res = await get(handler, url);
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.includes('Likes (3)'),
      `the count merges both encodings (got ${res.body.match(/Likes \(\d+\)/)?.[0]})`);
    for (const actorUrl of ['https://a.example/users/1', 'https://b.example/users/2', 'https://c.example/users/3']) {
      assert.ok(res.body.includes(actorUrl), `${actorUrl} renders`);
    }
    assert.ok(globalThis.__aphtml.reads.includes(`likes/${injectiveId}`)
      && globalThis.__aphtml.reads.includes(`likes/${legacyId}`),
      `both encodings are read (got ${JSON.stringify(globalThis.__aphtml.reads)})`);
  } finally {
    cleanup();
  }
});
