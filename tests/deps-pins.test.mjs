// Guard for bead paul-kinlan-me-ajt: the /polymath production chain must never
// float back to wildcard specs or the vulnerable axios/follow-redirects/form-data
// versions. Reads only committed files (package.json, package-lock.json), plus
// node_modules when present, so it is order-independent and never red on a
// machine that has not installed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));

// Floor raised from 1.15.12 to 1.16.2 for bead paul-kinlan-me-93ea:
// GHSA-mrwp-f3q8-3g9p affects everything through 1.16.1, so 1.16.2 is the
// first release patched against BOTH follow-redirects advisories.
function isPatchedFollowRedirects(version) {
  const match = /^\^?(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '');
  if (!match) return false;
  const [major, minor, patch] = match.slice(1).map(Number);
  return major > 1 || (major === 1 && (minor > 16 || (minor === 16 && patch >= 2)));
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
  assert.ok(pkg.overrides?.axios?.startsWith('^1.'), 'axios override to ^1.x');
  const fr = pkg.overrides?.['follow-redirects'];
  assert.ok(fr, 'follow-redirects override present');
  assert.equal(fr, '^1.16.2', 'follow-redirects override pinned to the GHSA-mrwp-f3q8-3g9p patched floor');
  assert.ok(isPatchedFollowRedirects(fr), `follow-redirects override >= 1.16.2, got ${fr}`);
  assert.ok(pkg.overrides?.['form-data']?.startsWith('^4.'), 'form-data override to patched 4.x');
});

test('lockfile resolves the patched chain under openai 3.2.1', () => {
  const axios = lock.packages['node_modules/axios'];
  assert.ok(axios.version.startsWith('1.'), `axios in lockfile is 1.x, got ${axios.version}`);
  assertPatchedFollowRedirectsLock(lock);
  const fd = lock.packages['node_modules/form-data'];
  assert.ok(fd.version >= '4.0.6', `form-data >= 4.0.6, got ${fd.version}`);
  // host's wildcard transitive deps stay pinned by the override
  assert.equal(lock.packages['node_modules/@polymath-ai/types'].version, '2.0.0');
  assert.equal(lock.packages['node_modules/@polymath-ai/validation'].version, '2.0.0');
});

test('installed node_modules matches the pins (skipped when not installed)', { skip: !existsSync(new URL('../node_modules/axios', import.meta.url)) }, () => {
  const axios = JSON.parse(readFileSync(new URL('../node_modules/axios/package.json', import.meta.url), 'utf8'));
  assert.ok(axios.version.startsWith('1.'), `installed axios is 1.x, got ${axios.version}`);
  for (const [path] of followRedirectsLockEntries(lock)) {
    if (!path.startsWith('node_modules/')) continue;
    const packageUrl = new URL(`../${path}/package.json`, import.meta.url);
    if (path !== 'node_modules/follow-redirects' && !existsSync(packageUrl)) continue;
    const fr = JSON.parse(readFileSync(packageUrl, 'utf8'));
    assert.ok(isPatchedFollowRedirects(fr.version), `installed ${path}: follow-redirects >= 1.16.2, got ${fr.version}`);
  }
});

function isPatchedNodeForge(version) {
  const match = /^\^?(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '');
  if (!match) return false;
  const [major, minor] = match.slice(1).map(Number);
  return major > 1 || (major === 1 && minor >= 4);
}

// Guard for bead paul-kinlan-me-x58f: node-forge (transitive via firebase-admin)
// must stay >= 1.4.0 - the advisories aggregated under GHSA-554w-wpv2-vw27 cover
// everything below it (ASN.1 recursion/desync, basicConstraints bypass, Ed25519
// forgery). Reachability is dormant today; the pin keeps it that way if usage grows.
test('node-forge override pins >= 1.4.0 across package.json, lockfile, and node_modules (GHSA-554w-wpv2-vw27)', () => {
  assert.ok(isPatchedNodeForge(pkg.overrides?.['node-forge']), `package.json node-forge override >= 1.4.0, got ${pkg.overrides?.['node-forge']}`);
  const lockForge = lock.packages['node_modules/node-forge'];
  assert.ok(lockForge && isPatchedNodeForge(lockForge.version), `lockfile node-forge >= 1.4.0, got ${lockForge?.version}`);
  if (existsSync(new URL('../node_modules/node-forge/package.json', import.meta.url))) {
    const installed = JSON.parse(readFileSync(new URL('../node_modules/node-forge/package.json', import.meta.url), 'utf8'));
    assert.ok(isPatchedNodeForge(installed.version), `installed node-forge >= 1.4.0, got ${installed.version}`);
  }
});

function isPatchedMultiparty(version) {
  const match = /^\^?(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '');
  if (!match) return false;
  const [major, minor] = match.slice(1).map(Number);
  return major > 4 || (major === 4 && minor >= 3);
}

test('multiparty is pinned >= 4.3.0 across package.json, lockfile, and node_modules (GHSA-65x3-rw7q-gx94)', () => {
  assert.ok(isPatchedMultiparty(pkg.dependencies['multiparty']), `package.json multiparty >= 4.3.0, got ${pkg.dependencies['multiparty']}`);
  const lockMultiparty = lock.packages['node_modules/multiparty'];
  assert.ok(lockMultiparty && isPatchedMultiparty(lockMultiparty.version), `lockfile multiparty >= 4.3.0, got ${lockMultiparty?.version}`);
  if (existsSync(new URL('../node_modules/multiparty/package.json', import.meta.url))) {
    const installed = JSON.parse(readFileSync(new URL('../node_modules/multiparty/package.json', import.meta.url), 'utf8'));
    assert.ok(isPatchedMultiparty(installed.version), `installed multiparty >= 4.3.0, got ${installed.version}`);
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
const packageNameOf = (lockPath) => lockPath.split('/node_modules/').pop();

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
const resolveLegacy = (parentPath, name) => {
  const nested = lock.dependencies?.[parentPath]?.dependencies?.[name]?.version;
  if (typeof nested === 'string' && !nested.includes('://')) return nested;
  let base = parentPath;
  while (base) {
    const candidate = `${base}/node_modules/${name}`;
    const entry = lock.packages?.[candidate];
    if (entry?.version) return entry.version;
    const index = base.lastIndexOf('/node_modules/');
    base = index === -1 ? '' : base.slice(0, index);
  }
  return lock.packages?.[`node_modules/${name}`]?.version;
};

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
