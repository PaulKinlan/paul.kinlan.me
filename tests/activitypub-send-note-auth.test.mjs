import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { build } from 'esbuild';

test('sendNote rejects missing or incorrect cron credentials before any fan-out', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'activitypub-send-note-'));
  const originalSecret = process.env.CRON_SECRET;
  const calls = [];
  globalThis.__sendNoteAuthTest = { calls };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { calls.push('fetch'); throw new Error('unauthorized network request'); };
  try {
    const built = await build({
      entryPoints: [new URL('../api/activitypub/sendNote.ts', import.meta.url).pathname],
      bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent',
      plugins: [{ name: 'send-note-auth-test-dependencies', setup(plugin) {
        plugin.onResolve({ filter: /^firebase-admin$/ }, () => ({ path: 'firebase', namespace: 'test' }));
        plugin.onLoad({ filter: /^firebase$/, namespace: 'test' }, () => ({ loader: 'js', contents: `
          export default { apps: [true], firestore: () => ({ collection: () => {
            globalThis.__sendNoteAuthTest.calls.push('firestore');
            throw new Error('unauthorized Firestore access');
          } }) };`
        }));
      } }]
    });
    const file = join(dir, 'handler.mjs');
    writeFileSync(file, built.outputFiles[0].contents);
    const { default: sendNote } = await import(`file://${file}`);

    async function assertUnauthorized(secret, authorization) {
      if (secret === undefined) delete process.env.CRON_SECRET;
      else process.env.CRON_SECRET = secret;
      const res = { statusCode: 200, status(code) { this.statusCode = code; return this; },
        end(value) { this.body = value; return this; } };
      await sendNote({ headers: authorization === undefined ? {} : { authorization } }, res);
      assert.equal(res.statusCode, 401);
      assert.equal(res.body, 'Unauthorized');
      assert.deepEqual(calls, [], 'unauthorized request must not access Firestore or the network');
    }

    await assertUnauthorized(undefined, 'Bearer undefined');
    await assertUnauthorized('', 'Bearer ');
    await assertUnauthorized('configured-secret', undefined);
    await assertUnauthorized('configured-secret', 'Bearer wrong-secret');
  } finally {
    if (originalSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = originalSecret;
    globalThis.fetch = originalFetch;
    delete globalThis.__sendNoteAuthTest;
    rmSync(dir, { recursive: true, force: true });
  }
});
