// Guard for bead paul-kinlan-me-ajt: the /polymath production chain must never
// float back to wildcard specs or the vulnerable axios/follow-redirects/form-data
// versions. Reads only committed files (package.json, package-lock.json), plus
// node_modules when present, so it is order-independent and never red on a
// machine that has not installed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));

// Floor raised from 1.15.12 to 1.16.2 for bead paul-kinlan-me-93ea:
// GHSA-mrwp-f3q8-3g9p affects everything through 1.16.1, so 1.16.2 is the
// first release patched against BOTH follow-redirects advisories.
//
// Every floor in this file now goes through atLeast (paul-kinlan-me-hv15). It was
// four implementations of the same comparison before, and three of them disagreed
// with the correct one: multiparty's dropped the patch digit, form-data's compared
// version STRINGS (so 4.0.10 < 4.0.6), and axios's was a prefix test.
function isPatchedFollowRedirects(version) {
  return atLeast(version, [1, 16, 2]);
}

function followRedirectsLockEntries(lockfile) {
  const entries = Object.entries(lockfile.packages ?? {})
    .filter(([path]) => path === 'node_modules/follow-redirects' || path.endsWith('/node_modules/follow-redirects'));
  function visit(dependencies, prefix = '') {
    for (const [name, entry] of Object.entries(dependencies ?? {})) {
      const path = `${prefix}${name}`;
      if (name === 'follow-redirects') entries.push([`dependencies.${path}`, entry]);
      visit(entry.dependencies, `${path}.dependencies.`);
    }
  }
  visit(lockfile.dependencies);
  return entries;
}

function assertPatchedFollowRedirectsLock(lockfile) {
  const entries = followRedirectsLockEntries(lockfile);
  assert.ok(entries.some(([path]) => path === 'node_modules/follow-redirects'), 'hoisted follow-redirects in lockfile');
  for (const [path, entry] of entries) {
    assert.ok(isPatchedFollowRedirects(entry.version), `${path}: follow-redirects >= 1.16.2, got ${entry.version}`);
  }
}

test('follow-redirects version boundary rejects the vulnerable lines through 1.16.1 (GHSA-mrwp-f3q8-3g9p)', () => {
  for (const version of ['1.15.2', '^1.15.2', '1.15.11', '1.15.12', '^1.15.12', '1.14.99', '1.15', '1.16.0', '1.16.1', 'not-a-version']) {
    assert.equal(isPatchedFollowRedirects(version), false, version);
  }
  for (const version of ['1.16.2', '^1.16.2', '1.16.3', '2.0.0']) {
    assert.equal(isPatchedFollowRedirects(version), true, version);
  }
});

test('every lockfile follow-redirects copy rejects vulnerable nested and legacy versions', () => {
  for (const variant of [
    { packages: { 'node_modules/openai/node_modules/follow-redirects': { version: '1.15.2' } } },
    { dependencies: { 'follow-redirects': { version: '1.15.2' } } },
    { dependencies: { openai: { dependencies: { 'follow-redirects': { version: '1.15.2' } } } } },
  ]) {
    const fixture = {
      packages: { 'node_modules/follow-redirects': { version: '1.16.1' }, ...variant.packages },
      dependencies: variant.dependencies,
    };
    assert.throws(() => assertPatchedFollowRedirectsLock(fixture), /follow-redirects >= 1\.16\.2/);
  }
  assert.doesNotThrow(() => assertPatchedFollowRedirectsLock({
    packages: { 'node_modules/follow-redirects': { version: '1.16.2' }, 'node_modules/openai/node_modules/follow-redirects': { version: '1.16.2' } },
    dependencies: { 'follow-redirects': { version: '1.16.2' } },
  }));
});

test('@polymath-ai/* direct dependencies are pinned, not wildcards', () => {
  assert.equal(pkg.dependencies['@polymath-ai/client'], '^1.1.2');
  assert.equal(pkg.dependencies['@polymath-ai/host'], '^0.0.2');
  for (const dep of Object.values(pkg.dependencies)) {
    assert.notEqual(dep, '*', 'no wildcard dependency specs allowed');
  }
});

test('overrides force the patched network chain', () => {
  assert.ok(atLeast(pkg.overrides?.axios, [1, 20, 0]), `axios override to >= 1.20.0, got ${pkg.overrides?.axios}`);
  const fr = pkg.overrides?.['follow-redirects'];
  assert.ok(fr, 'follow-redirects override present');
  assert.equal(fr, '^1.16.2', 'follow-redirects override pinned to the GHSA-mrwp-f3q8-3g9p patched floor');
  assert.ok(isPatchedFollowRedirects(fr), `follow-redirects override >= 1.16.2, got ${fr}`);
  assert.ok(atLeast(pkg.overrides?.['form-data'], [4, 0, 6]), `form-data override to >= 4.0.6, got ${pkg.overrides?.['form-data']}`);
});

test('lockfile resolves the patched chain under openai 3.2.1', () => {
  const axios = lock.packages['node_modules/axios'];
  assert.ok(atLeast(axios.version, [1, 20, 0]), `axios in lockfile >= 1.20.0, got ${axios.version}`);
  assertPatchedFollowRedirectsLock(lock);
  const fd = lock.packages['node_modules/form-data'];
  // atLeast, not a string compare (paul-kinlan-me-hv15): '4.0.10' >= '4.0.6' is
  // FALSE in JS, so the old assertion would have failed the first two-digit patch
  // release for being too new.
  assert.ok(atLeast(fd.version, [4, 0, 6]), `form-data >= 4.0.6, got ${fd.version}`);
  // host's wildcard transitive deps stay pinned by the override
  assert.equal(lock.packages['node_modules/@polymath-ai/types'].version, '2.0.0');
  assert.equal(lock.packages['node_modules/@polymath-ai/validation'].version, '2.0.0');
});

test('installed node_modules matches the pins (skipped when not installed)', { skip: !existsSync(new URL('../node_modules/axios', import.meta.url)) }, () => {
  const axios = JSON.parse(readFileSync(new URL('../node_modules/axios/package.json', import.meta.url), 'utf8'));
  assert.ok(atLeast(axios.version, [1, 20, 0]), `installed axios >= 1.20.0, got ${axios.version}`);
  for (const [path] of followRedirectsLockEntries(lock)) {
    if (!path.startsWith('node_modules/')) continue;
    const packageUrl = new URL(`../${path}/package.json`, import.meta.url);
    if (path !== 'node_modules/follow-redirects' && !existsSync(packageUrl)) continue;
    const fr = JSON.parse(readFileSync(packageUrl, 'utf8'));
    assert.ok(isPatchedFollowRedirects(fr.version), `installed ${path}: follow-redirects >= 1.16.2, got ${fr.version}`);
  }
});

// Floor is 1.4.1, not 1.4.0 (paul-kinlan-me-0g04): OSV reports 12 affecting
// advisories for node-forge@1.4.0 and none for 1.4.1 - the 2026-1187xx family
// (RSA PKCS#1 v1.5 signature acceptance, X.509 basicConstraints bypass, AES-GCM
// auth bypass, PKCS#12 MAC forgery) is fixed in 1.4.1. The previous floor
// compared only major/minor and so treated 1.4.0 as patched.
function isPatchedNodeForge(version) {
  return atLeast(version, [1, 4, 1]);
}

// Every copy of a package in the lockfile, whatever its path (paul-kinlan-me-kxog):
// `lock.packages` for the npm 7+ view, and the legacy `dependencies` mirror for
// npm 6 readers. Asserting on the hoisted entry alone leaves a nested copy
// invisible - the same blindness the follow-redirects walker above was written to
// fix after paul-kinlan-me-2eu.
function lockEntriesNamed(lockfile, name) {
  const entries = Object.entries(lockfile.packages ?? {})
    .filter(([path]) => path === `node_modules/${name}` || path.endsWith(`/node_modules/${name}`));
  function visit(dependencies, prefix = '') {
    for (const [entryName, entry] of Object.entries(dependencies ?? {})) {
      const path = `${prefix}${entryName}`;
      if (entryName === name) entries.push([`dependencies.${path}`, entry]);
      visit(entry.dependencies, `${path}.dependencies.`);
    }
  }
  visit(lockfile.dependencies);
  return entries;
}

function nodeForgeLockEntries(lockfile) {
  return lockEntriesNamed(lockfile, 'node-forge');
}

// Guard for bead paul-kinlan-me-x58f: node-forge (transitive via firebase-admin)
// must stay >= 1.4.1 - the advisories aggregated under GHSA-554w-wpv2-vw27 cover
// everything below 1.4.0 (ASN.1 recursion/desync, basicConstraints bypass, Ed25519
// forgery) and the 2026-1187xx family covers 1.4.0 itself. Reachability is dormant
// today; the pin keeps it that way if usage grows.
test('node-forge override pins >= 1.4.1 across package.json, lockfile, and node_modules (GHSA-554w-wpv2-vw27)', () => {
  assert.ok(isPatchedNodeForge(pkg.overrides?.['node-forge']), `package.json node-forge override >= 1.4.1, got ${pkg.overrides?.['node-forge']}`);
  const forgeEntries = nodeForgeLockEntries(lock);
  assert.ok(forgeEntries.some(([path]) => path === 'node_modules/node-forge'), 'hoisted node-forge in lockfile');
  for (const [path, entry] of forgeEntries) {
    assert.ok(isPatchedNodeForge(entry.version), `${path}: node-forge >= 1.4.1, got ${entry.version}`);
  }
  if (existsSync(new URL('../node_modules/node-forge/package.json', import.meta.url))) {
    const installed = JSON.parse(readFileSync(new URL('../node_modules/node-forge/package.json', import.meta.url), 'utf8'));
    assert.ok(isPatchedNodeForge(installed.version), `installed node-forge >= 1.4.1, got ${installed.version}`);
  }
});

test('the node-forge floor rejects 1.4.0 and every copy a nested lock entry could hide', () => {
  // The guard's own stated purpose is to stop a vulnerable downgrade, so the
  // boundary is pinned in both directions (paul-kinlan-me-0g04).
  for (const version of ['1.4.0', '^1.4.0', '1.3.3', '1.4', '0.10.0', '', undefined]) {
    assert.equal(isPatchedNodeForge(version), false, `${version} must not count as patched`);
  }
  for (const version of ['1.4.1', '^1.4.1', '1.4.3', '1.5.0', '2.0.0']) {
    assert.equal(isPatchedNodeForge(version), true, `${version} must count as patched`);
  }

  // A nested vulnerable copy, in packages and in the legacy dependencies mirror,
  // is what paul-kinlan-me-kxog reported: the old assertion never saw it.
  const nested = {
    packages: {
      'node_modules/node-forge': { version: '1.4.3' },
      'node_modules/firebase-admin/node_modules/node-forge': { version: '1.3.1' },
    },
    dependencies: { 'firebase-admin': { dependencies: { 'node-forge': { version: '1.3.1' } } } },
  };
  const paths = nodeForgeLockEntries(nested).map(([path]) => path);
  assert.deepEqual(paths.sort(), [
    'dependencies.firebase-admin.dependencies.node-forge',
    'node_modules/firebase-admin/node_modules/node-forge',
    'node_modules/node-forge',
  ]);
  const unpatched = nodeForgeLockEntries(nested)
    .filter(([, entry]) => !isPatchedNodeForge(entry.version))
    .map(([path]) => path);
  assert.equal(unpatched.length, 2, 'the nested and legacy copies must be seen and rejected');
});

// Guard for bead paul-kinlan-me-fopc: @tootallnate/once 2.0.0 (GHSA-vpq2-c234-7xj6)
// is in the PRODUCTION install set - firebase-admin -> teeny-request 9.0.0 ->
// http-proxy-agent 5.0.0 - and every nightly re-booked the row because the
// override the earlier sweep promised never landed. 2.0.1 is the patched release,
// so the row is pinned here rather than re-triaged each night.
const isPatchedOnce = (version) => atLeast(version, [2, 0, 1]);

test('@tootallnate/once is pinned >= 2.0.1 in the override and in every lockfile copy (GHSA-vpq2-c234-7xj6)', () => {
  assert.ok(isPatchedOnce(pkg.overrides?.['@tootallnate/once']),
    `package.json @tootallnate/once override >= 2.0.1, got ${pkg.overrides?.['@tootallnate/once']}`);
  assert.equal(isPatchedOnce('2.0.0'), false, '2.0.0 is the affected release, not a patched one');

  const onceEntries = lockEntriesNamed(lock, '@tootallnate/once');
  assert.ok(onceEntries.some(([path]) => path === 'node_modules/@tootallnate/once'), 'hoisted @tootallnate/once in lockfile');
  for (const [path, entry] of onceEntries) {
    assert.ok(isPatchedOnce(entry.version), `${path}: @tootallnate/once >= 2.0.1, got ${entry.version}`);
  }
  if (existsSync(new URL('../node_modules/@tootallnate/once/package.json', import.meta.url))) {
    const installed = JSON.parse(readFileSync(new URL('../node_modules/@tootallnate/once/package.json', import.meta.url), 'utf8'));
    assert.ok(isPatchedOnce(installed.version), `installed @tootallnate/once >= 2.0.1, got ${installed.version}`);
  }
});

// Floor 4.3.1, not 4.3.0 (paul-kinlan-me-hv15): package.json pins ^4.3.1, and the
// previous helper parsed the patch digit and then discarded it, so it accepted the
// release one patch BELOW its own pin. It was not a live miss - the npm advisory
// bulk API returns three multiparty advisories, all vulnerable_versions
// '<=4.2.3', so 4.3.0 is not affected either - but the guard is supposed to fail
// before a downgrade, not after one.
function isPatchedMultiparty(version) {
  return atLeast(version, [4, 3, 1]);
}

test('multiparty is pinned >= 4.3.1 across package.json, lockfile, and node_modules (GHSA-65x3-rw7q-gx94)', () => {
  assert.ok(isPatchedMultiparty(pkg.dependencies['multiparty']), `package.json multiparty >= 4.3.1, got ${pkg.dependencies['multiparty']}`);
  const lockMultiparty = lock.packages['node_modules/multiparty'];
  assert.ok(lockMultiparty && isPatchedMultiparty(lockMultiparty.version), `lockfile multiparty >= 4.3.1, got ${lockMultiparty?.version}`);
  if (existsSync(new URL('../node_modules/multiparty/package.json', import.meta.url))) {
    const installed = JSON.parse(readFileSync(new URL('../node_modules/multiparty/package.json', import.meta.url), 'utf8'));
    assert.ok(isPatchedMultiparty(installed.version), `installed multiparty >= 4.3.1, got ${installed.version}`);
  }
});

test('the multiparty floor rejects the patch digit the old helper discarded', () => {
  // The regression this pins: isPatchedMultiparty used to compare only major.minor,
  // so 4.3.0 - the release one patch below the pin - counted as patched.
  for (const version of ['4.3.0', '^4.3.0', '4.2.3', '4.0.0', '3.9.9', '4.3', '', undefined]) {
    assert.equal(isPatchedMultiparty(version), false, `${version} must not count as patched`);
  }
  for (const version of ['4.3.1', '^4.3.1', '4.3.2', '4.4.0', '5.0.0']) {
    assert.equal(isPatchedMultiparty(version), true, `${version} must count as patched`);
  }
});


// Guard for bead paul-kinlan-me-4r16. Three nightly-audit rows - ajv 8.6.3
// (GHSA-2g4f-4pwh-qvx6, $data ReDoS), path-to-regexp 6.1.0 (GHSA-9wv6-86v2-598j,
// backtracking ReDoS) and the unused @vercel/redwood - all arrive through the
// devDependency `vercel` 28.x and are unreachable from a deployed function (the
// site is framework: hugo, built by tailwindcss + hugo). They were re-booked as
// new/regressed on every run, so the fix is a pin rather than a re-triage: this
// test is what stops the override being quietly dropped again.
//
// The overrides are NESTED on purpose. @vercel/routing-utils declares ajv as an
// OPTIONAL ^6.0.0 dependency, so a blanket "ajv": "^8.18.0" override would force
// an API-incompatible major on that path; the pin below only lifts the copy
// @vercel/static-config uses, and asserts routing-utils still resolves its own.
function semverParts(version) {
  const match = /^\^?(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '');
  return match ? match.slice(1).map(Number) : null;
}

function atLeast(version, [floorMajor, floorMinor, floorPatch = 0]) {
  const parts = semverParts(version);
  if (!parts) return false;
  const [major, minor, patch] = parts;
  if (major !== floorMajor) return major > floorMajor;
  if (minor !== floorMinor) return minor > floorMinor;
  return patch >= floorPatch;
}

const lockPathsEndingWith = (name) => Object.entries(lock.packages ?? {})
  .filter(([path]) => path === `node_modules/${name}` || path.endsWith(`/node_modules/${name}`));

// Lockfile resolution for a dependency of `parentPath`, the way npm resolves:
// the nearest nested node_modules wins, walking up the tree, then the root copy.
const resolvedVersionFor = (parentPath, name) => {
  let base = parentPath;
  while (base) {
    const candidate = `${base}/node_modules/${name}`;
    const entry = lock.packages?.[candidate];
    if (entry) return { path: candidate, version: entry.version };
    const index = base.lastIndexOf('/node_modules/');
    base = index === -1 ? '' : base.slice(0, index);
  }
  const root = lock.packages?.[`node_modules/${name}`];
  return root ? { path: `node_modules/${name}`, version: root.version } : null;
};

test('the dev vercel CLI chain resolves patched ajv, path-to-regexp and semver (GHSA-2g4f-4pwh-qvx6, GHSA-9wv6-86v2-598j, GHSA-c2qf-rxjj-qqgw)', () => {
  assert.equal(pkg.overrides?.['@vercel/static-config']?.ajv, '^8.18.0',
    'package.json must keep the nested @vercel/static-config ajv override');
  assert.equal(pkg.overrides?.['@vercel/routing-utils']?.['path-to-regexp'], '^6.3.0',
    'package.json must keep the nested @vercel/routing-utils path-to-regexp override');
  assert.equal(pkg.overrides?.['@vercel/routing-utils']?.ajv, '^6.14.0',
    'package.json must keep the nested @vercel/routing-utils ajv override');

  // ajv 8.18.0 is the first release patched for the $data ReDoS.
  const staticConfig = lockPathsEndingWith('@vercel/static-config');
  assert.ok(staticConfig.length >= 1, 'the lockfile must still carry @vercel/static-config');
  for (const [path] of staticConfig) {
    const resolved = resolvedVersionFor(path, 'ajv');
    assert.ok(resolved, `${path} must resolve an ajv`);
    assert.ok(atLeast(resolved.version, [8, 18, 0]),
      `${path} resolves ${resolved.path}@${resolved.version}, expected ajv >= 8.18.0`);
  }

  // The override is scoped, not blanket: @vercel/routing-utils declares ajv as an
  // optional ^6.0.0, so it is lifted to the patched 6.14.0 within that major rather
  // than forced to 8.x, which would be API-incompatible.
  const routingUtils = lockPathsEndingWith('@vercel/routing-utils');
  assert.ok(routingUtils.length >= 1, 'the lockfile must still carry @vercel/routing-utils');
  for (const [path] of routingUtils) {
    const resolved = resolvedVersionFor(path, 'ajv');
    if (!resolved) continue; // optional dependency omitted
    assert.equal(semverParts(resolved.version)?.[0], 6,
      `${path} must keep its optional ajv 6.x (blanket override regression?), got ${resolved.version}`);
    assert.ok(atLeast(resolved.version, [6, 14, 0]),
      `${path} resolves ${resolved.path}@${resolved.version}, expected ajv >= 6.14.0`);
  }

  // @vercel/redwood pins semver 6.1.1 exactly; the ReDoS is fixed in 6.3.1, and
  // the override lifts it inside the same major (the remaining 5.7.1 copies belong
  // to the hugo-bin install chain and are a separate, already-triaged row).
  assert.equal(pkg.overrides?.['@vercel/redwood']?.semver, '^6.3.1',
    'package.json must keep the nested @vercel/redwood semver override');
  const redwood = lockPathsEndingWith('@vercel/redwood');
  assert.ok(redwood.length >= 1, 'the lockfile must still carry @vercel/redwood');
  for (const [path] of redwood) {
    const resolved = resolvedVersionFor(path, 'semver');
    assert.ok(resolved, `${path} must resolve a semver`);
    assert.ok(atLeast(resolved.version, [6, 3, 1]),
      `${path} resolves ${resolved.path}@${resolved.version}, expected semver >= 6.3.1`);
  }

  // path-to-regexp 6.3.0 is the first patched 6.x, and the override is scoped to
  // routing-utils, so every copy in this tree has to clear it.
  const ptr = lockPathsEndingWith('path-to-regexp');
  assert.ok(ptr.length >= 1, 'the lockfile must still carry path-to-regexp');
  for (const [path, entry] of ptr) {
    assert.ok(atLeast(entry.version, [6, 3, 0]), `lockfile ${path} path-to-regexp >= 6.3.0, got ${entry.version}`);
  }
});

// Lockfile SHAPE guard for bead paul-kinlan-me-3oki (review finding on 4r16).
//
// package-lock.json is lockfileVersion 2: `packages` is the npm 7+ view and the
// legacy `dependencies` map is kept for npm 6 readers. npm writes an override's
// range into the legacy map too (firebase-admin requires node-forge ^1.4.0 there
// while declaring ^1.3.1), so drift between the two is expected - but ONLY for a
// parent the override actually applies to. Regenerating the lockfile for 4r16
// let the nested @vercel/redwood semver override leak onto @mapbox/node-pre-gyp
// (an unrelated package left on ^7.3.5) and turned that entry's nested version
// into a tarball URL instead of a semver.
//
// Both shapes are pinned here rather than the one line that was wrong, so the
// next regeneration cannot reintroduce them somewhere else.
const legacyEntries = (() => {
  const found = [];
  const walk = (deps, prefix) => {
    for (const [name, entry] of Object.entries(deps ?? {})) {
      found.push([`${prefix}node_modules/${name}`, entry]);
      if (entry.dependencies) walk(entry.dependencies, `${prefix}node_modules/${name}/`);
    }
  };
  walk(lock.dependencies ?? {}, '');
  return found;
})();

test('every legacy lockfile entry carries a semver version, never a tarball URL', () => {
  const offenders = legacyEntries
    .filter(([, entry]) => typeof entry.version === 'string' && entry.version.includes('://'))
    .map(([path, entry]) => `${path} -> ${entry.version}`);
  assert.deepEqual(offenders, [], `legacy dependencies map versions that are not a semver: ${offenders.join(', ')}`);
});

// Resolve a legacy entry's dependency the way npm does: a nested entry first,
// then the nearest hoisted one.
//
// The legacy `dependencies` map is keyed by BARE package name, while parentPath is
// a packages-style path (`node_modules/@mapbox/node-pre-gyp`), so indexing it with
// parentPath was always undefined and every nested legacy version was skipped -
// which made the misdescribe check below blind to exactly the corruption it exists
// for (paul-kinlan-me-vyjx). Looking the parent up by its bare name is not enough
// either: two different nested parents can share a name (bin-version's execa is not
// the hoisted execa), so the path is descended segment by segment, the way npm's
// legacy tree nests.
const legacyDependenciesAt = (lockfile, packagesPath) => {
  let node = { dependencies: lockfile.dependencies ?? {} };
  const normalised = packagesPath.replace(/^node_modules\//, '');
  for (const segment of normalised.split('/node_modules/').filter(Boolean)) {
    node = node.dependencies?.[segment];
    if (!node) return undefined;
  }
  return node.dependencies;
};

const resolveLegacy = (parentPath, name, lockfile = lock) => {
  const nested = legacyDependenciesAt(lockfile, parentPath)?.[name]?.version;
  if (typeof nested === 'string' && !nested.includes('://')) return nested;
  let base = parentPath;
  while (base) {
    const candidate = `${base}/node_modules/${name}`;
    const entry = lockfile.packages?.[candidate];
    if (entry?.version) return entry.version;
    const index = base.lastIndexOf('/node_modules/');
    base = index === -1 ? '' : base.slice(0, index);
  }
  return lockfile.packages?.[`node_modules/${name}`]?.version;
};

test('resolveLegacy reads the nested legacy version, so a corrupted one is visible (paul-kinlan-me-vyjx)', () => {
  // This bead's own repro: the nested legacy version drifts to 6.3.1 while the
  // declared range stays ^7.3.5. Before the fix resolveLegacy never looked at the
  // nested entry (the legacy map is keyed by bare name), returned the hoisted
  // 7.3.8 and the misdescribe check above stayed green.
  const corrupted = {
    packages: { 'node_modules/semver': { version: '7.3.8' } },
    dependencies: {
      '@mapbox/node-pre-gyp': {
        version: '1.0.11',
        requires: { semver: '^7.3.5' },
        dependencies: { semver: { version: '6.3.1' } },
      },
    },
  };
  assert.equal(resolveLegacy('node_modules/@mapbox/node-pre-gyp', 'semver', corrupted), '6.3.1',
    'the nested legacy version must win, or the corruption is invisible');

  const hoistedOnly = { packages: { 'node_modules/semver': { version: '7.3.8' } }, dependencies: {} };
  assert.equal(resolveLegacy('node_modules/@mapbox/node-pre-gyp', 'semver', hoistedOnly), '7.3.8',
    'with no nested entry the hoisted version still resolves');

  const notAVersion = {
    packages: { 'node_modules/semver': { version: '7.3.8' } },
    dependencies: { '@mapbox/node-pre-gyp': { dependencies: { semver: { version: 'https://registry.test/semver.tgz' } } } },
  };
  assert.equal(resolveLegacy('node_modules/@mapbox/node-pre-gyp', 'semver', notAVersion), '7.3.8',
    'a tarball URL in the nested entry is not a version and must not be returned');
});

test('every legacy requires range is satisfied by the version it resolves to',
  { skip: !existsSync(new URL('../node_modules/semver/package.json', import.meta.url)) },
  async () => {
    // The reported defect (paul-kinlan-me-3oki) was a range that no longer describes
    // what is installed: node-pre-gyp's legacy entry said ^6.3.1 while its nested
    // semver was 7.3.8. A lockfile may carry a *different* range from the declared
    // one (npm writes an override's range there), but it must still describe the
    // resolution, or an npm 6 reader installs something the lock does not contain.
    const semver = (await import('semver')).default ?? (await import('semver'));
    const unexplained = [];
    for (const [path, entry] of legacyEntries) {
      for (const [name, range] of Object.entries(entry.requires ?? {})) {
        const resolved = resolveLegacy(path, name);
        if (!resolved || typeof range !== 'string' || !semver.valid(resolved)) continue;
        if (typeof range !== 'string' || !semver.validRange(range)) continue;
        if (!semver.satisfies(resolved, range)) {
          unexplained.push(`${path} requires ${name}@${range} but resolves ${resolved}`);
        }
      }
    }
    assert.deepEqual(unexplained, [], `legacy ranges that misdescribe the resolution: ${unexplained.join('; ')}`);
  });

// Guard for bead paul-kinlan-me-xn32. picomatch 2.3.1 is in the PRODUCTION tree,
// not just in dev tooling: @polymath-ai/client 1.1.2 (a direct dependency, used by
// api/polymath.js and api/polymath/ask.ts) declares globby ^13.1.3, which resolves
// fast-glob 3.3.3 -> micromatch 4.0.8 -> picomatch 2.3.1 with no dev flag. 2.3.1 is
// affected by GHSA-3v7f-55p6-f55p (method injection through POSIX character
// classes) and GHSA-c2c7-rcm5-vvqj (ReDoS through extglob quantifiers), both of
// which need the attacker to control the GLOB PATTERN - and here the visitor query
// is always search text, never a glob, so reachability is dormant. That makes the
// pin the whole fix, exactly as the nightly row argued.
//
// The override is deliberately SCOPED to micromatch. tinyglobby (via tailwindcss)
// requires picomatch ^4.0.4, so a blanket "picomatch": "^2.3.2" override would drag
// that copy back across a major; the assertion on pkg.overrides below keeps a later
// "simplification" from doing that.
// Deliberately NOT atLeast (paul-kinlan-me-hv15): picomatch has two patched lines
// with different floors - 2.3.2 for the micromatch copy, 4.0.4 for tinyglobby's -
// so a single floor would either pass 4.0.3 or reject 4.x entirely.
function isPatchedPicomatch(version) {
  const parts = semverParts(version);
  if (!parts) return false;
  const [major, minor, patch] = parts;
  if (major === 2) return minor > 3 || (minor === 3 && patch >= 2);
  if (major === 4) return minor > 0 || patch >= 4;
  return major > 4; // 3.x never shipped; anything higher is patched too
}

test('picomatch in the production chain is pinned >= 2.3.2 without downgrading the 4.x copies (GHSA-3v7f-55p6-f55p)', () => {
  assert.equal(pkg.overrides?.['micromatch']?.picomatch, '^2.3.2',
    'package.json must carry the micromatch-scoped picomatch override at ^2.3.2');
  assert.equal(pkg.overrides?.picomatch, undefined,
    'the picomatch override must stay scoped to micromatch: tinyglobby needs ^4.0.4');

  // micromatch 4.0.8 legitimately declares ^2.3.1 in its own manifest, so the
  // declared range is not the thing to assert on - the resolved version is (below).
  // The pin works by override, which is why the lockfile copy is what matters.

  const picomatchEntries = lockEntriesNamed(lock, 'picomatch');
  assert.ok(picomatchEntries.some(([path]) => path === 'node_modules/picomatch'), 'hoisted picomatch in lockfile');
  for (const [path, entry] of picomatchEntries) {
    assert.ok(isPatchedPicomatch(entry.version), `${path}: picomatch >= 2.3.2 (or >= 4.0.4), got ${entry.version}`);
  }
  if (existsSync(new URL('../node_modules/picomatch/package.json', import.meta.url))) {
    const installed = JSON.parse(readFileSync(new URL('../node_modules/picomatch/package.json', import.meta.url), 'utf8'));
    assert.ok(isPatchedPicomatch(installed.version), `installed picomatch >= 2.3.2, got ${installed.version}`);
  }
});

test('the picomatch floor rejects 2.3.1 and every copy a nested lock entry could hide', () => {
  // Both directions of the boundary: 2.3.2/4.0.4 are the first patched releases in
  // their lines, and 2.3.1 is the affected one this repo actually resolved.
  for (const version of ['2.3.1', '^2.3.1', '2.3.0', '2.2.3', '1.0.0', '4.0.3', '', undefined]) {
    assert.equal(isPatchedPicomatch(version), false, `${version} must not count as patched`);
  }
  for (const version of ['2.3.2', '^2.3.2', '2.3.3', '2.4.0', '4.0.4', '4.1.0', '5.0.0']) {
    assert.equal(isPatchedPicomatch(version), true, `${version} must count as patched`);
  }

  // A nested vulnerable copy is what a future lockfile refresh would hide: the
  // hoisted entry can be patched while micromatch's own copy is not.
  const nested = {
    packages: {
      'node_modules/picomatch': { version: '2.3.2' },
      'node_modules/fast-glob/node_modules/micromatch/node_modules/picomatch': { version: '2.3.1' },
    },
    dependencies: { micromatch: { dependencies: { picomatch: { version: '2.3.1' } } } },
  };
  const paths = lockEntriesNamed(nested, 'picomatch').map(([path]) => path);
  assert.deepEqual(paths.sort(), [
    'dependencies.micromatch.dependencies.picomatch',
    'node_modules/fast-glob/node_modules/micromatch/node_modules/picomatch',
    'node_modules/picomatch',
  ]);
  const unpatched = lockEntriesNamed(nested, 'picomatch')
    .filter(([, entry]) => !isPatchedPicomatch(entry.version))
    .map(([path]) => path);
  assert.equal(unpatched.length, 2, 'the nested and legacy copies must be seen and rejected');
});

test('the axios and form-data floors are version comparisons, not prefix or string tests', () => {
  // The two shapes that were in this file (paul-kinlan-me-hv15): `startsWith('1.')`
  // for axios - which passes for any 1.x, including the vulnerable ones - and a
  // lexicographic `>=` for form-data, which is wrong in both directions once a
  // patch has two digits.
  for (const version of ['1.19.9', '1.0.0', '0.27.2', '1.20', '^1.19.0', '', undefined]) {
    assert.equal(atLeast(version, [1, 20, 0]), false, `${version} must not clear the axios floor`);
  }
  for (const version of ['1.20.0', '^1.20.0', '1.20.1', '1.21.0', '2.0.0']) {
    assert.equal(atLeast(version, [1, 20, 0]), true, `${version} must clear the axios floor`);
  }
  // The lexicographic trap itself: '4.0.10' >= '4.0.6' is false, and '4.0.9' > '4.0.6'
  // is false too, so a string floor rejects two perfectly patched releases.
  assert.equal('4.0.10' >= '4.0.6', false, 'documents the bug the old assertion had');
  assert.equal(atLeast('4.0.10', [4, 0, 6]), true);
  assert.equal(atLeast('4.0.9', [4, 0, 6]), true);
  assert.equal(atLeast('4.0.5', [4, 0, 6]), false);
});

test('the dependency swap still works at runtime: the verifier reads only committed files and runs offline', { skip: !existsSync(new URL('../node_modules/axios', import.meta.url)) }, () => {
  // tools/verify-deps-swap.mjs (bead ajt) is the ONLY functional evidence that the
  // overridden chain behaves: it round-trips openai 3.2.1's createCompletion over the
  // installed axios against a localhost server, then loads api/polymath.js and drives
  // PolymathPinecone.query with a stubbed vector store. Nothing ran it - grep found it
  // only in THREAT_MODEL.md prose (paul-kinlan-me-hv15). A guard nothing executes is
  // worse than no guard, because it reads as coverage. Bounded, no network egress
  // beyond 127.0.0.1, no secrets, no cost: it fails closed rather than hanging.
  const out = execFileSync(process.execPath, [new URL('../tools/verify-deps-swap.mjs', import.meta.url).pathname], {
    cwd: new URL('..', import.meta.url).pathname,
    encoding: 'utf8',
    timeout: 120_000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  assert.match(out, /^OK openai 3\.2\.1 createCompletion round-trip on axios 1\./m, out);
  assert.match(out, /^ALL CHECKS PASSED$/m, `the verifier must reach its end, got:\n${out}`);
});
