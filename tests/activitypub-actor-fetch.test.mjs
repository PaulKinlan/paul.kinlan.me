// The suite for lib/activitypub/utils/fetchActorInformation.ts: what it refuses to connect to,
// and how much it is allowed to connect at all.
//
// SSRF refusals (never connecting to private/link-local/local/non-HTTPS keyIds) were pinned by a
// co-located lib/activitypub/utils/fetchActorInformation.test.mjs, which nothing ever ran:
// tools/fast-gate.sh dispatches tests/*.test.mjs only, and CHECK_CMD is the site build. They moved
// here so the module's contract is actually exercised on every gate.
//
// Bounds on the one outbound fetch every anonymous /inbox POST can trigger
// (factory finding paul-kinlan-me-m4h1, threat model tm-inbox-pre-auth-fetch-amplification).
//
// A signature cannot be checked without the signer's key, so fetchActorInformation() is on the
// unauthenticated path by necessity. These tests pin the three bounds that stop it being an
// amplifier: a per-keyId cache, in-flight de-duplication, and a per-host plus global fetch budget.
// Everything here is driven through the module's own seams (an injected transport and clock) and
// the module-level state is reset per test, so no case depends on wall-clock time, on a socket, or
// on another test's ordering.
import { strict as assert } from 'node:assert';
import { createServer } from 'node:http';
import { beforeEach, test } from 'node:test';

import {
  ACTOR_CACHE_MAX_ENTRIES,
  ACTOR_CACHE_TTL_MS,
  ACTOR_NEGATIVE_TTL_MS,
  GLOBAL_BUDGET,
  GLOBAL_WINDOW_MS,
  PER_HOST_BUDGET,
  PER_HOST_WINDOW_MS,
  fetchActorInformation,
  resetActorFetchBounds
} from '../lib/activitypub/utils/fetchActorInformation.ts';

let clock;
const now = () => clock;

// A transport stub that records every URL it is asked for.
const transport = (answer = () => ({ status: 200, body: { id: 'https://remote.example/users/alex' } })) => {
  const calls = [];
  const fetch = async (url) => {
    calls.push(url);
    const { status, body } = answer(url);
    return { status, json: async () => body };
  };
  return { fetch, calls };
};

beforeEach(() => {
  resetActorFetchBounds();
  clock = 1_700_000_000_000;
});

test('a repeated keyId is served from the cache and costs one fetch until its TTL expires', async () => {
  const { fetch, calls } = transport();
  const actorUrl = 'https://remote.example/users/alex';

  const first = await fetchActorInformation(actorUrl, { fetch, now: now });
  assert.deepEqual(first, { id: actorUrl });
  const second = await fetchActorInformation(actorUrl, { fetch, now: now });
  assert.deepEqual(second, first);
  assert.deepEqual(calls, [actorUrl], 'the replay of one keyId must not reach the network');

  clock += ACTOR_CACHE_TTL_MS - 1;
  await fetchActorInformation(actorUrl, { fetch, now: now });
  assert.equal(calls.length, 1, 'a cached actor is still fresh just before the TTL');

  clock += 2;
  await fetchActorInformation(actorUrl, { fetch, now: now });
  assert.deepEqual(calls, [actorUrl, actorUrl], 'an expired entry is fetched again');
});

test('a non-actor answer is cached briefly, so a dead keyId is not re-fetched per request', async () => {
  const { fetch, calls } = transport(() => ({ status: 500, body: { error: 'nope' } }));
  const actorUrl = 'https://remote.example/users/gone';

  assert.equal(await fetchActorInformation(actorUrl, { fetch, now: now }), null);
  assert.equal(await fetchActorInformation(actorUrl, { fetch, now: now }), null);
  assert.equal(calls.length, 1, 'a failure is a cached non-answer, not a retry');

  clock += ACTOR_NEGATIVE_TTL_MS + 1;
  assert.equal(await fetchActorInformation(actorUrl, { fetch, now: now }), null);
  assert.equal(calls.length, 2, 'the negative entry expires on the shorter TTL');
});

test('concurrent requests for one keyId share a single fetch', async () => {
  const calls = [];
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const fetch = async (url) => {
    calls.push(url);
    await gate;
    return { status: 200, json: async () => ({ id: url }) };
  };
  const actorUrl = 'https://remote.example/users/alex';

  const pending = [
    fetchActorInformation(actorUrl, { fetch, now: now }),
    fetchActorInformation(actorUrl, { fetch, now: now }),
    fetchActorInformation(actorUrl, { fetch, now: now })
  ];
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls.length, 1, 'three in-flight requests must not open three sockets');

  release();
  const results = await Promise.all(pending);
  assert.deepEqual(results, [{ id: actorUrl }, { id: actorUrl }, { id: actorUrl }]);
  assert.equal(calls.length, 1);
});

test('rotating keyIds inside one host are refused once the host budget is spent', async () => {
  const { fetch, calls } = transport();

  for (let i = 0; i < PER_HOST_BUDGET; i++) {
    const actor = await fetchActorInformation(`https://remote.example/users/${i}`, { fetch, now: now });
    assert.ok(actor, `fetch ${i + 1} of ${PER_HOST_BUDGET} is allowed`);
  }
  assert.equal(calls.length, PER_HOST_BUDGET);

  const refused = await fetchActorInformation('https://remote.example/users/refused', { fetch, now: now });
  assert.equal(refused, null, 'an over-budget keyId is the same null as any other non-answer');
  assert.equal(calls.length, PER_HOST_BUDGET, 'and it costs no network');

  // Another host has its own budget: one attacker cannot starve every peer.
  const other = await fetchActorInformation('https://elsewhere.example/users/alex', { fetch, now: now });
  assert.ok(other, 'a different host still has its own budget');

  // The refusal is not cached: once the window rolls over the same keyId is fetched.
  clock += PER_HOST_WINDOW_MS + 1;
  assert.ok(await fetchActorInformation('https://remote.example/users/refused', { fetch, now: now }));
  assert.equal(calls.filter((url) => url === 'https://remote.example/users/refused').length, 1);
});

test('host churn is capped by the global budget', async () => {
  const { fetch, calls } = transport();

  for (let i = 0; i < GLOBAL_BUDGET; i++) {
    assert.ok(await fetchActorInformation(`https://host-${i}.example/users/alex`, { fetch, now: now }),
      `fetch ${i + 1} of ${GLOBAL_BUDGET} is allowed`);
  }
  assert.equal(calls.length, GLOBAL_BUDGET);

  assert.equal(await fetchActorInformation('https://host-over-budget.example/users/alex', { fetch, now: now }), null);
  assert.equal(calls.length, GLOBAL_BUDGET, 'the global cap is what bounds a caller that rotates hosts');

  clock += GLOBAL_WINDOW_MS + 1;
  assert.ok(await fetchActorInformation('https://host-over-budget.example/users/alex', { fetch, now: now }),
    'the window rolls over');
});

test('the cache is bounded, so a caller rotating keyIds cannot grow it', async () => {
  const { fetch, calls } = transport();
  const total = ACTOR_CACHE_MAX_ENTRIES + 50;

  for (let i = 0; i < total; i++) {
    // Step the clock past each window so the budgets never interfere with this case.
    clock += GLOBAL_WINDOW_MS + 1;
    await fetchActorInformation(`https://host-${i}.example/users/alex`, { fetch, now: now });
  }
  assert.equal(calls.length, total);

  const beforeRecent = calls.length;
  await fetchActorInformation(`https://host-${total - 1}.example/users/alex`, { fetch, now: now });
  assert.equal(calls.length, beforeRecent, 'the most recent entry is still cached');

  await fetchActorInformation('https://host-0.example/users/alex', { fetch, now: now });
  assert.equal(calls.length, beforeRecent + 1, 'the oldest entry was evicted, so it is fetched again');
});

test('a keyId that is not a URL never opens a socket', async () => {
  const { fetch, calls } = transport();
  assert.equal(await fetchActorInformation('not a url', { fetch, now: now }), null);
  assert.deepEqual(calls, []);
});

test('rejects private, link-local, local and non-HTTPS keyIds without connecting', async () => {
  // No injected transport: this is the real guardedFetch() path, refusing before a socket.
  let requests = 0;
  const server = createServer((_req, res) => { requests++; res.end('{}'); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    assert(address && typeof address !== 'string');
    const urls = [
      `http://127.0.0.1:${address.port}/actor#main-key`,
      `https://127.0.0.1:${address.port}/actor#main-key`,
      `https://localhost:${address.port}/actor#main-key`,
      'https://169.254.169.254/latest/meta-data/',
      'https://10.0.0.1/actor', 'https://192.168.1.1/actor',
      'https://[::1]/actor', 'https://[::ffff:127.0.0.1]/actor',
      'https://2130706433/actor', 'https://user:pass@example.com/actor',
      'file:///etc/passwd', 'not a url'
    ];
    for (const url of urls) assert.equal(await fetchActorInformation(url), null, url);
    assert.equal(requests, 0);
  } finally {
    server.close();
  }
});
