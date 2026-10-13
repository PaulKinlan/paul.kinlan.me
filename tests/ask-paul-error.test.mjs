// Regression for the streamed /ask-paul page: every upstream outcome must
// finish the stream, clear its loading state and offer a working retry control.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'ask-paul-error-'));
const bundle = join(dir, 'handler.mjs');
try {
  execFileSync('node_modules/.bin/esbuild', [
    'api/ask-paul.ts', '--bundle', '--format=esm', '--platform=neutral', `--outfile=${bundle}`,
  ]);
  const { default: handler, fetchPolymathAnswer } = await import(bundle);
  const originalFetch = globalThis.fetch;

  for (const [name, upstream] of [
    ['rejected fetch', () => Promise.reject(new Error('upstream down'))],
    ['non-ok response', () => Promise.resolve(new Response('bad gateway', { status: 502 }))],
    ['invalid JSON', () => Promise.resolve(new Response('{', { status: 200 }))],
  ]) {
    await test(name, { timeout: 5000 }, async () => {
      globalThis.fetch = upstream;
      try {
        const response = await handler(new Request('https://example.com/ask-paul?query=hello'));
        const html = await response.text(); // Would hang if whatwg-flora never closed.
        assert.match(html, /<main id="ask-paul-main" aria-busy="true">/);
        assert.match(html, /class="loader" role="status" aria-live="polite"/);
        assert.match(html, /class="error" role="alert"/);
        assert.match(html, /form="ask-paul-form" value="Try again"/);
        assert.match(html, /\.loader \{ display: none; \}/);
        assert.match(html, /setAttribute\('aria-busy', 'false'\)/);
        assert.doesNotMatch(html, /<article class="completion">/);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  }

  for (const [name, upstream] of [
    ['headers never arrive', () => new Promise(() => {})],
    ['response body never completes', () => Promise.resolve({ ok: true, json: () => new Promise(() => {}) })],
  ]) {
    await test(name, { timeout: 2000 }, async () => {
      let upstreamSignal;
      globalThis.fetch = (url, { signal }) => {
        upstreamSignal = signal;
        return upstream(url, { signal });
      };
      try {
        await assert.rejects(fetchPolymathAnswer('https://example.com/api/polymath.js', 30), /timed out/);
        assert.equal(upstreamSignal.aborted, true);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  }

  await test('successful response also clears the loader and busy state', { timeout: 5000 }, async () => {
    globalThis.fetch = async () => Response.json({ completion: 'Answer', infos: [] });
    try {
      const html = await (await handler(new Request('https://example.com/ask-paul'))).text();
      assert.match(html, /<article class="completion">Answer<\/article>/);
      assert.doesNotMatch(html, /class="error" role="alert"/);
      assert.match(html, /\.loader \{ display: none; \}/);
      assert.match(html, /setAttribute\('aria-busy', 'false'\)/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
