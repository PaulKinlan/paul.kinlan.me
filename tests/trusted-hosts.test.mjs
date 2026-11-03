// Direct contract tests for the shared trusted-host assembly
// (lib/activitypub/utils/trustedHosts.js) - the one allowlist both federation
// surfaces consume: api/activitypub/inbox.ts validates the request host with
// it, api/activitypub-html/render.ts restricts the ?url= document key with it
// (paul-kinlan-me-stn4, paul-kinlan-me-tvqu). Environment is saved/restored
// per case so the tests are independent of the machine they run on.
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { isTrustedActivityHost, trustedActivityHosts } from '../lib/activitypub/utils/trustedHosts.js';

const withEnv = (env, fn) => {
  const saved = {};
  for (const key of ['PUBLIC_ORIGIN', 'VERCEL_URL']) {
    saved[key] = process.env[key];
    if (env[key] === undefined) delete process.env[key];
    else process.env[key] = env[key];
  }
  try {
    fn();
  } finally {
    for (const key of ['PUBLIC_ORIGIN', 'VERCEL_URL']) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
};

test('the assembly is paul.kinlan.me plus PUBLIC_ORIGIN and VERCEL_URL, read lazily', () => {
  withEnv({ PUBLIC_ORIGIN: undefined, VERCEL_URL: undefined }, () => {
    assert.deepEqual([...trustedActivityHosts()].sort(), ['paul.kinlan.me'],
      'with no env, only the canonical host is trusted');
    assert.equal(isTrustedActivityHost('paul.kinlan.me'), true);
    assert.equal(isTrustedActivityHost('preview-branch.vercel.app'), false,
      'a deployment host is untrusted unless VERCEL_URL/PUBLIC_ORIGIN names it');
  });

  withEnv({ PUBLIC_ORIGIN: undefined, VERCEL_URL: 'preview-branch.vercel.app' }, () => {
    assert.deepEqual([...trustedActivityHosts()].sort(), ['paul.kinlan.me', 'preview-branch.vercel.app'],
      'the deployment host is trusted (a preview serves its own pages, tvqu)');
    assert.equal(isTrustedActivityHost('PREVIEW-BRANCH.vercel.app'), true,
      'host matching is case-insensitive');
    assert.equal(isTrustedActivityHost('preview-branch.vercel.app:443'), true,
      'a default port on the candidate host is ignored');
  });

  withEnv({ PUBLIC_ORIGIN: 'https://paulkinlan.me:8443', VERCEL_URL: undefined }, () => {
    // Exactly the inbox's assembly: only DEFAULT ports (80/443) are stripped
    // from entries; a custom port stays in the set verbatim.
    assert.deepEqual([...trustedActivityHosts()].sort(), ['paul.kinlan.me', 'paulkinlan.me:8443']);
    // Inherited inbox behaviour, asserted here so the helper cannot drift from
    // it: only DEFAULT ports are stripped on either side, so a bare Host/
    // hostname does NOT match a custom-port entry (getTrustedHost checks the
    // verbatim entry and the default-port-stripped entry, nothing else).
    assert.equal(isTrustedActivityHost('paulkinlan.me'), false,
      'a bare host does not match a custom-port entry, exactly like the inbox');
    assert.equal(isTrustedActivityHost('paulkinlan.me:8443'), true,
      'the verbatim port-bearing entry matches');
  });

  withEnv({ PUBLIC_ORIGIN: 'not-a-url', VERCEL_URL: undefined }, () => {
    assert.deepEqual([...trustedActivityHosts()].sort(), ['paul.kinlan.me'],
      'an unparsable PUBLIC_ORIGIN is ignored, not a crash');
  });
});

test('untrusted hosts and malformed inputs are rejected', () => {
  withEnv({ PUBLIC_ORIGIN: undefined, VERCEL_URL: undefined }, () => {
    for (const host of ['evil.example', '', 'paulkinlan.me', 'www.paul.kinlan.me',
      'paul.kinlan.me.evil.example', 'localhost']) {
      assert.equal(isTrustedActivityHost(host), false, `${JSON.stringify(host)} must be untrusted`);
    }
    for (const host of [undefined, null, 123, {}]) {
      assert.equal(isTrustedActivityHost(host), false, `${typeof host} input must be untrusted, not a crash`);
    }
    // Boundary honesty: a SUFFIX match must not let a sibling domain through.
    assert.equal(isTrustedActivityHost('not-paul.kinlan.me'), false);
  });
});
