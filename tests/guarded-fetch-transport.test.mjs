// The two refusals guardedFetch implements *around* the request it opens - a
// redirect it will not follow, and a body past the cap - plus the reasons it
// never opens one at all: a target that resolves to a private address, and the
// address pin itself. Every test here is offline: no DNS, no socket, no paid
// endpoint.
//
// guardedFetch opens the socket with node:https and resolves the host with
// node:dns/promises, so an offline test has to stand in for both. Bundling the
// module with esbuild, the way tests/activitypub-send-note-auth.test.mjs stands
// in for firebase-admin, lets these tests drive the policy directly: the
// stand-ins record what was asked for and answer with whatever the test wants.
//
// The refusal cases are load-bearing for the own-origin call sites too
// (api/activitypub/sendNote.ts and api/ask-paul.ts, paul-kinlan-me-a74): both now
// read their own endpoint through this boundary, so "a redirect is not followed"
// and "an oversized body fails loudly" are what keeps a same-site fetch honest.
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { build } from 'esbuild';

// Stand-in for node:https - records the request instead of opening one, then
// answers it from whatever the current test put in globalThis.__transport.
const httpsStub = `
import { PassThrough } from 'node:stream';
export function request(url, options, callback) {
  const state = globalThis.__transport;
  state.requests.push({ url: String(url), pinned: typeof options.lookup === 'function', lookup: options.lookup });
  const req = {
    on() { return req; },
    write() {},
    end() {
      const res = new PassThrough();
      res.statusCode = state.status;
      res.statusMessage = 'Stub';
      callback(res);
      if (state.body) res.write(state.body);
      if (state.oversizeBytes) res.write(Buffer.alloc(state.oversizeBytes, 0x61));
      res.end();
    }
  };
  return req;
}
`;

// Stand-in for node:dns/promises: the answer is whatever the test decided, so
// nothing is resolved and no name is looked up.
const dnsStub = `
export async function lookup(host) {
  globalThis.__transport.dns.push(host);
  return globalThis.__transport.answers;
}
`;

const dir = mkdtempSync(join(tmpdir(), 'guarded-fetch-transport-'));
const file = join(dir, 'guardedFetch.mjs');
{
  const built = await build({
    entryPoints: [new URL('../lib/activitypub/utils/guardedFetch.js', import.meta.url).pathname],
    bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent',
    plugins: [{
      name: 'offline-transport',
      setup(plugin) {
        plugin.onResolve({ filter: /^node:https$/ }, () => ({ path: 'https', namespace: 'stub' }));
        plugin.onResolve({ filter: /^node:dns\/promises$/ }, () => ({ path: 'dns', namespace: 'stub' }));
        plugin.onLoad({ filter: /^https$/, namespace: 'stub' }, () => ({ loader: 'js', contents: httpsStub }));
        plugin.onLoad({ filter: /^dns$/, namespace: 'stub' }, () => ({ loader: 'js', contents: dnsStub }));
      }
    }]
  });
  writeFileSync(file, built.outputFiles[0].contents);
}
const { guardedFetch, BlockedRequestError } = await import(`file://${file}`);

const PUBLIC = [{ address: '93.184.216.34', family: 4 }];

function transport({ status = 200, body = '', oversizeBytes = 0, answers = PUBLIC } = {}) {
  globalThis.__transport = { requests: [], dns: [], status, body, oversizeBytes, answers };
  return globalThis.__transport;
}

const reason = (error) => (error instanceof BlockedRequestError ? error.reason : `${error}`);

test.after(() => rmSync(dir, { recursive: true, force: true }));

test('a redirect is refused, and nothing is requested after it', async () => {
  const state = transport({ status: 302, body: 'go somewhere else' });

  const error = await guardedFetch('https://example.com/inbox').then(() => null, (e) => e);

  assert.equal(reason(error), 'redirect-not-followed');
  assert.equal(state.requests.length, 1, 'a public peer must not be able to bounce us somewhere else');
});

test('a body past the cap is refused rather than buffered', async () => {
  const state = transport({ status: 200, oversizeBytes: 33 });

  const error = await guardedFetch('https://example.com/inbox', { maxBytes: 32 }).then(() => null, (e) => e);

  assert.equal(reason(error), 'response-too-large');
  assert.equal(state.requests.length, 1);
});

test('a private address is refused before a socket is opened', async () => {
  const state = transport({ answers: [{ address: '10.0.0.1', family: 4 }] });

  const error = await guardedFetch('https://example.com/inbox').then(() => null, (e) => e);

  assert.equal(reason(error), 'private-address');
  assert.deepEqual(state.dns, ['example.com'], 'the name is resolved');
  assert.deepEqual(state.requests, [], 'and no request is made to the private answer');
});

test('a valid target is fetched with the checked address pinned into the connect', async () => {
  const state = transport({ status: 200, body: JSON.stringify({ ok: true }) });

  const response = await guardedFetch('https://example.com/inbox');

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(state.requests.map(({ url }) => url), ['https://example.com/inbox']);
  assert.ok(state.requests[0].pinned, 'the transport must be given a lookup, not left to resolve again');

  // That lookup is the anti-rebinding part: whatever form Node asks in (one
  // address, or all of them), the answer is the address that was checked.
  const single = await new Promise((resolve) => state.requests[0].lookup('example.com', {}, (err, address, family) => resolve({ err, address, family })));
  assert.equal(single.address, PUBLIC[0].address, 'one-address form');
  assert.equal(single.family, PUBLIC[0].family, 'one-address form');
  const all = await new Promise((resolve) => state.requests[0].lookup('example.com', { all: true }, (err, addresses) => resolve(addresses)));
  assert.deepEqual(all, PUBLIC, 'all-addresses form');
});
