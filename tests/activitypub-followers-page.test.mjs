// /followers is a public, unauthenticated rewrite (vercel.json:49) with no
// middleware in front of it - middleware.ts's matcher excludes /api - so the
// read it performs on the followers collection is paid for by whoever asks.
// It used to read the whole collection per request and publish every actor in
// one page with no Cache-Control (paul-kinlan-me-40ak, nightly factory row
// tm-unbounded-follower-collection-read). This pins the three properties that
// fix depends on, against the handler's real behaviour rather than its shape:
//   1. the read is bounded - the page comes from offset/limit, so a reversion
//      to an unbounded get() returns all 50 stub docs and fails the count;
//   2. totalItems stays honest without reading the collection, from a count
//      aggregation, and `next` appears exactly while another page exists;
//   3. the response is edge-cacheable, and only after the reads succeeded - a
//      storage failure answers 503 no-store and never advertises a cacheable
//      200 (the fail-closed ordering of api/activitypub-html/render.ts).
// The handler is TypeScript and initialises firebase-admin at import time, so
// it is bundled with esbuild and stubbed through a module stub, the same way
// tests/activitypub-html-render-escape.test.mjs drives the renderer. Nothing
// here touches the network. Run with:
//   node --test tests/activitypub-followers-page.test.mjs
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

// A tiny Firestore with the two query shapes the handler is allowed to use.
// Every call is recorded, and `fail` makes one of the two reads throw so the
// fail-closed path is exercised for real.
const FIRESTORE_STUB = `
const state = () => (globalThis.__followersPage ??= { docs: [], calls: [], fail: null });
export default {
  apps: [true],
  firestore: () => ({
    collection: (name) => {
      const s = state();
      s.calls.push(['collection', name]);
      let offset = 0;
      let limit = Infinity;
      const query = {
        select(what) { s.calls.push(['select', what]); return query; },
        offset(n) { s.calls.push(['offset', n]); offset = n; return query; },
        limit(n) { s.calls.push(['limit', n]); limit = n; return query; },
        async get() {
          s.calls.push(['get']);
          if (s.fail === 'page') throw new Error('transient firestore failure');
          const slice = s.docs.slice(offset, offset + limit);
          return { size: slice.length, docs: slice.map((data) => ({ get: (key) => data[key] })) };
        },
        count() {
          return {
            async get() {
              s.calls.push(['count']);
              if (s.fail === 'count') throw new Error('transient firestore failure');
              return { data: () => ({ count: s.docs.length }) };
            }
          };
        }
      };
      return query;
    }
  })
};
`;

const STUBS = {
  '@vercel/node': 'export {};',
  'firebase-admin': FIRESTORE_STUB
};

const buildHandler = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'followers-page-'));
  const built = await build({
    entryPoints: [new URL('../api/activitypub/followers.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'followers-page-stubs',
      setup(plugin) {
        plugin.onResolve({ filter: /^(@vercel\/node|firebase-admin)$/ }, (args) => (
          { path: args.path, namespace: 'stub' }
        ));
        plugin.onLoad({ filter: /.*/, namespace: 'stub' },
          ({ path }) => ({ loader: 'js', contents: STUBS[path] }));
      }
    }]
  });
  const file = join(dir, 'handler.mjs');
  writeFileSync(file, built.outputFiles[0].contents);
  const mod = await import(`file://${file}`);
  return { handler: mod.default, mod, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

const mockResponse = () => ({
  statusCode: 0,
  headers: {},
  setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
  json(body) { this.body = body; return this; }
});

const followers = (n) => Array.from({ length: n }, (_, i) => ({ actor: `https://remote.example/users/${i + 1}` }));

const useDocs = (docs, fail = null) => {
  globalThis.__followersPage = { docs, calls: [], fail };
};

const request = async (handler, query = {}) => {
  const res = mockResponse();
  await handler({ query, method: 'GET' }, res);
  return res;
};

test('the read is bounded: a 50-follower collection answers one 20-item page with a next link, cached at the edge', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs(followers(50));
    const res = await request(handler);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['cache-control'], 'public, s-maxage=300, stale-while-revalidate=600',
      'a 200 must be edge-cacheable so repeat requests never reach Firestore');
    assert.equal(res.headers['content-type'], 'application/activity+json');

    assert.equal(res.body.type, 'OrderedCollectionPage');
    assert.equal(res.body.totalItems, 50, 'totalItems is the collection size, from the count aggregation');
    assert.equal(res.body.orderedItems.length, 20,
      'the page must be bounded - an unbounded get() would publish all 50');
    assert.equal(res.body.orderedItems[0], 'https://remote.example/users/1');
    assert.equal(res.body.next, 'https://status.kinlan.me/users/paul/following?page=2');

    // The bound is real, not incidental: the handler asked for exactly one page.
    const calls = globalThis.__followersPage.calls;
    assert.ok(calls.some(([k, v]) => k === 'limit' && v === 20), `expected limit(20), got ${JSON.stringify(calls)}`);
    assert.ok(calls.some(([k, v]) => k === 'offset' && v === 0), `expected offset(0), got ${JSON.stringify(calls)}`);
    assert.ok(calls.some(([k]) => k === 'count'), 'totalItems must come from the count aggregation');
  } finally {
    cleanup();
    delete globalThis.__followersPage;
  }
});

test('?page= walks the collection with offset, and the last page carries no next', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs(followers(50));

    const second = await request(handler, { page: '2' });
    assert.equal(second.statusCode, 200);
    assert.equal(second.body.orderedItems.length, 20);
    assert.equal(second.body.orderedItems[0], 'https://remote.example/users/21');
    assert.ok(globalThis.__followersPage.calls.some(([k, v]) => k === 'offset' && v === 20));

    globalThis.__followersPage.calls = [];
    const last = await request(handler, { page: '3' });
    assert.equal(last.statusCode, 200);
    assert.equal(last.body.orderedItems.length, 10);
    assert.equal(last.body.totalItems, 50);
    assert.equal(last.body.next, undefined, 'the final page must not advertise a next page');
  } finally {
    cleanup();
    delete globalThis.__followersPage;
  }
});

test('the paged walk ends on the last page it will serve, even past the page bound', async () => {
  // paul-kinlan-me-q9bx (review finding on this change): with 2,100 followers,
  // page 100 used to answer 200 with next=?page=101, which this same handler
  // rejects with 400 - a dead link on the one page that has more data. `next` is
  // now suppressed at MAX_PAGE, so following the links never lands on a 400.
  const { mod, handler, cleanup } = await buildHandler();
  try {
    useDocs(followers(2100));

    let page = 1;
    let res;
    let pages = 0;
    let followed = 0;
    do {
      res = await request(handler, page === 1 ? {} : { page: String(page) });
      assert.equal(res.statusCode, 200, `every page of the walk must be servable (page ${page})`);
      assert.equal(res.body.orderedItems.length, mod.PAGE_SIZE, `page ${page} is full`);
      pages += 1;
      followed += res.body.orderedItems.length;
      if (res.body.next === undefined) break;
      const next = new URL(res.body.next).searchParams.get('page');
      assert.ok(Number(next) <= mod.MAX_PAGE, `next must stay inside the bound, got page ${next}`);
      page = Number(next);
      assert.ok(pages <= mod.MAX_PAGE + 1, 'the walk terminates');
    } while (pages <= mod.MAX_PAGE);

    assert.equal(pages, mod.MAX_PAGE, 'the walk stops after MAX_PAGE pages');
    assert.equal(followed, mod.PAGE_SIZE * mod.MAX_PAGE);
    assert.equal(res.body.next, undefined, 'the last served page advertises no next page');
    assert.equal(res.body.totalItems, 2100, 'totalItems stays honest beyond the bound');
  } finally {
    cleanup();
    delete globalThis.__followersPage;
  }
});

test('an empty collection is a cached 200 with no items and no next page', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs([]);
    const res = await request(handler);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.totalItems, 0);
    assert.deepEqual(res.body.orderedItems, []);
    assert.equal(res.body.next, undefined);
    assert.ok(res.headers['cache-control'].includes('s-maxage=300'));
  } finally {
    cleanup();
    delete globalThis.__followersPage;
  }
});

test('a page number that is not a bounded positive integer is a 400 and reads nothing', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    for (const page of ['0', '-1', 'abc', '1.5', '01', ' 1', '1e2', '1000', '1000000']) {
      useDocs(followers(3));
      const res = await request(handler, { page });
      assert.equal(res.statusCode, 400, `?page=${JSON.stringify(page)} must be rejected`);
      assert.equal(res.headers['cache-control'], undefined, 'a 4xx must not be cacheable');
      assert.deepEqual(globalThis.__followersPage.calls, [],
        `?page=${JSON.stringify(page)} must not reach Firestore`);
    }
  } finally {
    cleanup();
    delete globalThis.__followersPage;
  }
});

test('a storage failure is a 503 no-store, never a cacheable 200', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    for (const fail of ['page', 'count']) {
      useDocs(followers(5), fail);
      const res = await request(handler);
      assert.equal(res.statusCode, 503, `a ${fail} read failure must not answer 200`);
      assert.equal(res.headers['cache-control'], 'no-store',
        'the failure must not be storable by the CDN');
      assert.equal(res.body.orderedItems, undefined, 'a failed read must publish no follower data');
    }
  } finally {
    cleanup();
    delete globalThis.__followersPage;
  }
});

test('parsePage is the exported contract: 1 is implied, only bounded positive integers pass', async () => {
  const { mod, cleanup } = await buildHandler();
  try {
    assert.equal(mod.PAGE_SIZE, 20);
    assert.equal(mod.MAX_PAGE, 100);
    assert.equal(mod.parsePage(undefined), 1);
    assert.equal(mod.parsePage(null), 1);
    assert.equal(mod.parsePage(''), 1);
    assert.equal(mod.parsePage('1'), 1);
    assert.equal(mod.parsePage('100'), 100);
    assert.equal(mod.parsePage('101'), null);
    assert.equal(mod.parsePage(['7']), 7);
    for (const bad of ['0', '-1', '1.5', '01', 'abc', ' 1', '1e2', 1, true, {}]) {
      assert.equal(mod.parsePage(bad), null, `${JSON.stringify(bad)} must not parse as a page`);
    }
  } finally {
    cleanup();
    delete globalThis.__followersPage;
  }
});
