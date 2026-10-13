// Focused test for the cron's own-outbox read.
//
// api/activitypub/sendNote.ts is the hourly fan-out cron, and the first thing it
// does after the credential check is fetch its own outbox. That read must go
// through guardedFetch (ADR paul-kinlan-me-9oi) like every other outbound call on
// this surface, and its caps must be the raised ones: the module defaults are 5s
// and 1 MiB, which are the wrong shape for a build-time collection that grows with
// every post and is served by another cold serverless function. A body over the cap
// would reject the fetch and the cron would stop sending, silently.
//
// Offline: the transport and firebase-admin are both esbuild-aliased, the way
// tests/activitypub-send-note-auth.test.mjs stands in for firebase-admin. No
// network, no Firestore, no paid endpoint. This is also the positive control that
// test file lacks (paul-kinlan-me-12w): an always-401 regression fails here.
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { build } from 'esbuild';

const recorder = { name: 'guarded-fetch-recorder', setup(plugin) {
  plugin.onResolve({ filter: /guardedFetch\.js$/ }, () => ({ path: 'guarded', namespace: 'recorder' }));
  plugin.onLoad({ filter: /^guarded$/, namespace: 'recorder' }, () => ({ loader: 'js', contents: `
    export class BlockedRequestError extends Error {}
    export function isSafeFederationUrl(value) { return String(value).startsWith('https://'); }
    export async function guardedFetch(target, init = {}) {
      globalThis.__sendNoteOutboxTest.calls.push({ target: String(target), init });
      return new Response(JSON.stringify({ orderedItems: [] }), {
        status: 200, headers: { 'content-type': 'application/activity+json' }
      });
    }
  ` }));
} };

// No followers and no stored config: the handler must still reach the outbox read
// and answer, so the assertion below is about the call, not about fan-out.
const firestore = { name: 'firestore', setup(plugin) {
  plugin.onResolve({ filter: /^firebase-admin$/ }, () => ({ path: 'firebase', namespace: 'test' }));
  plugin.onLoad({ filter: /^firebase$/, namespace: 'test' }, () => ({ loader: 'js', contents: `
    export default { apps: [true], firestore: () => ({ collection: () => ({
      doc: () => ({ get: async () => ({ exists: false, data: () => undefined }), set: () => {} }),
      get: async () => ({ docs: [] })
    }) }) };
  ` }));
} };

test('the cron reads its own outbox through guardedFetch, with the raised caps', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'activitypub-send-note-outbox-'));
  const originalSecret = process.env.CRON_SECRET;
  globalThis.__sendNoteOutboxTest = { calls: [] };
  process.env.CRON_SECRET = 'outbox-test-secret';
  try {
    const built = await build({
      entryPoints: [new URL('../api/activitypub/sendNote.ts', import.meta.url).pathname],
      bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent',
      plugins: [recorder, firestore]
    });
    const file = join(dir, 'handler.mjs');
    writeFileSync(file, built.outputFiles[0].contents);
    const { default: sendNote } = await import(`file://${file}`);

    const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, end(value) { this.body = value; return this; } };
    await sendNote({ headers: { authorization: 'Bearer outbox-test-secret' } }, res);

    assert.equal(res.statusCode, 200, 'the authorized cron run answers');
    assert.equal(res.body, 'ok');

    const calls = globalThis.__sendNoteOutboxTest.calls;
    assert.equal(calls.length, 1, 'exactly one outbound call: the outbox read');
    assert.equal(calls[0].target, 'https://paul.kinlan.me/outbox');
    assert.ok(calls[0].init.timeoutMs > 5000, `timeout raised past the 5s default, got ${calls[0].init.timeoutMs}`);
    assert.ok(calls[0].init.maxBytes > 1024 * 1024, `cap raised past the 1 MiB default, got ${calls[0].init.maxBytes}`);
  } finally {
    if (originalSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = originalSecret;
    delete globalThis.__sendNoteOutboxTest;
    rmSync(dir, { recursive: true, force: true });
  }
});
