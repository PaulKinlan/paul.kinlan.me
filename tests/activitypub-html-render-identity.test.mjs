// The federation interactions renderer (api/activitypub-html/render.ts) dual-reads
// each collection under two document ids: the injective encoding (je6t) and the
// legacy '/' -> '_' one for documents written before it landed. The legacy encoding
// is NOT injective, so it is evidence of a KEY, never of an identity: two distinct
// posts - https://paul.kinlan.me/a/b and https://paul.kinlan.me/a_b - share one
// legacy root document and one messages subcollection (paul-kinlan-me-cout, the
// read-side twin of the rule the inbox applies at its write/dedupe/delete sites).
// A cold render of either page must therefore only count rows that actually NAME
// that page, and the field that names it differs per collection because the write
// paths store different things: likes/announces store the activity (object), replies
// store the Create (object.inReplyTo). A blind "compare data.object" filter would
// drop every legitimate reply, which is why the anti-regression case below exists.
//
// The handler is TypeScript and initialises firebase-admin at import time, so it is
// bundled with esbuild and stubbed through globalThis, exactly like
// tests/activitypub-html-render-escape.test.mjs. Nothing here touches the network.
// Run with: node --test tests/activitypub-html-render-identity.test.mjs
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

// The stub answers per collection AND per document id, so a test can put one row
// under the injective id and another under the colliding legacy id - which is the
// whole point. Anything not seeded answers an empty snapshot.
const FIRESTORE_STUB = `
export default {
  apps: [true],
  firestore: () => ({
    collection: (name) => ({
      doc: (id) => ({
        collection: () => ({
          get: async () => {
            globalThis.__renderIdentity?.reads?.push(name + ':' + id);
            const rows = globalThis.__renderIdentity?.rows?.[name]?.[id] ?? [];
            return { size: rows.length, docs: rows.map((data) => ({ data: () => data })) };
          }
        })
      })
    })
  })
};
`;

const STUBS = {
  '@vercel/node': 'export {};',
  // Admission is exercised in tests/activitypub-html-render-admission.test.mjs;
  // every request is admitted here so the render body is what is under test.
  '@vercel/kv': 'export const kv = { eval: async () => [1] };',
  'firebase-admin': FIRESTORE_STUB
};

const buildHandler = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'render-identity-'));
  const built = await build({
    entryPoints: [new URL('../api/activitypub-html/render.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'render-identity-stubs',
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
  return { handler, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

const mockResponse = () => ({
  statusCode: 0,
  headers: {},
  ends: 0,
  setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
  status(code) { this.statusCode = code; return { end: (body) => this.end(body) }; },
  end(body) { this.ends += 1; this.body = body; return this; }
});

// The two encodings the handler reads under, written the way lib/activitypub/utils/docId.ts does.
const injectiveId = (url) => encodeURIComponent(url);
const legacyId = (url) => url.replace(/\//g, '_');

const seed = (rows) => {
  globalThis.__renderIdentity = { rows, reads: [] };
};

const renderPage = async (handler, url) => {
  const res = mockResponse();
  await handler({ query: { url }, method: 'GET' }, res);
  assert.equal(res.statusCode, 200, 'a valid same-site url renders');
  assert.equal(res.ends, 1, 'exactly one response');
  return String(res.body);
};

const counts = (page) => ({
  likes: Number(/<h4>Likes \((\d+)\)<\/h4>/.exec(page)?.[1] ?? NaN),
  announces: Number(/<h4>Announces \((\d+)\)<\/h4>/.exec(page)?.[1] ?? NaN),
  replies: Number(/<h4>Replies \((\d+)\)<\/h4>/.exec(page)?.[1] ?? NaN)
});

const P1 = 'https://paul.kinlan.me/a/b';
const P2 = 'https://paul.kinlan.me/a_b';
const likeRow = (object, id) => ({
  id,
  actor: { name: 'alex', url: 'https://remote.example/users/alex' },
  object
});
const replyRow = (inReplyTo, id) => ({
  id,
  actor: { name: 'alex', url: 'https://remote.example/users/alex' },
  object: { type: 'Note', inReplyTo, content: 'nice' }
});

test('P1 and P2 collide on one legacy key, so each page must only count its own rows (paul-kinlan-me-cout)', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    assert.equal(legacyId(P1), legacyId(P2), 'the two posts really do collide under the legacy encoding');

    // The reviewer's reproduction: the legacy root of the colliding pair carries a
    // like for P1. Rendering P2 used to count and draw it.
    seed({ likes: { [legacyId(P2)]: [likeRow(P1, 'https://remote.example/likes/1')] } });
    let page = await renderPage(handler, P2);
    assert.equal(counts(page).likes, 0, "P1's interaction must not be counted on P2's page");
    assert.ok(!page.includes('alex'), "P1's actor must not be drawn on P2's page");

    // The mirror direction, and a row that really is P2's surviving beside it: the
    // filter is per row, not per document.
    seed({
      likes: {
        [legacyId(P2)]: [
          likeRow(P1, 'https://remote.example/likes/1'),
          likeRow(P2, 'https://remote.example/likes/2')
        ]
      }
    });
    page = await renderPage(handler, P2);
    assert.equal(counts(page).likes, 1, "P2's own like still counts");
    page = await renderPage(handler, P1);
    assert.equal(counts(page).likes, 1, "P1's like counts on P1's page through the shared legacy key");
  } finally {
    cleanup();
    delete globalThis.__renderIdentity;
  }
});

test('replies are matched on object.inReplyTo, and likes/announces on object (string or embedded id)', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    // A reply is stored as the CREATE, so its post is object.inReplyTo. Comparing
    // data.object (the Create) against the page would drop every real reply - the
    // anti-regression this test exists for.
    seed({
      replies: {
        [injectiveId(P2)]: [replyRow(P2, 'https://remote.example/replies/1'), replyRow(P1, 'https://remote.example/replies/2')]
      }
    });
    let page = await renderPage(handler, P2);
    assert.equal(counts(page).replies, 1, 'the reply to this page survives; the reply to the colliding page does not');

    // Some peers embed the post as an object with an id instead of a bare URL.
    seed({
      likes: { [injectiveId(P2)]: [likeRow({ id: P2 }, 'https://remote.example/likes/3')] },
      announces: { [injectiveId(P2)]: [likeRow({ id: P2 }, 'https://remote.example/announces/1')] }
    });
    page = await renderPage(handler, P2);
    assert.deepEqual(counts(page), { likes: 1, announces: 1, replies: 0 }, 'embedded-object targets are recognised');
  } finally {
    cleanup();
    delete globalThis.__renderIdentity;
  }
});

test('the identity filter does not undo the pre-je6t dedupe, and rows it cannot attribute are kept', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    // qal8: one activity re-delivered after the fix exists under both ids; it must
    // still count once, not twice.
    const duplicate = likeRow(P2, 'https://remote.example/likes/9');
    seed({
      likes: {
        [injectiveId(P2)]: [duplicate],
        [legacyId(P2)]: [duplicate]
      }
    });
    let page = await renderPage(handler, P2);
    assert.equal(counts(page).likes, 1, 'the same activity under both encodings counts once');

    // A pre-identity row whose target cannot be read is kept rather than dropped:
    // this dual-read exists for exactly that population, and an interaction we
    // cannot attribute must not be silently removed from a page that earned it.
    seed({
      likes: { [legacyId(P2)]: [{ id: 'https://remote.example/likes/10', actor: 'https://remote.example/users/old' }] }
    });
    page = await renderPage(handler, P2);
    assert.equal(counts(page).likes, 1, 'an unattributable pre-identity row is kept');
  } finally {
    cleanup();
    delete globalThis.__renderIdentity;
  }
});
