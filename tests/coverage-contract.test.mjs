// tests/coverage-contract.json is the independent oracle `fleet-check --fast` uses to
// attribute a changed file to the suite that exercises it. ~/fleet/remote/check-coverage.py
// reads it (tests/coverage-contract.json is one of the paths it probes) BEFORE falling
// back to its stem/import heuristics, so a mapping here is the only way a module whose
// test file does not match its stem is ever credited - and a mapping that names a suite
// which does not exist, or the wrong suite, silently credits coverage that never ran.
//
// The contract had no test, so it drifted: four federation/API modules modified in the
// weekly range a7f42d4b..4c72f7b2 (render.ts, http-signature/index.js, guardedFetch.js,
// logSafe.js) were all exercised by the fast gate and none of them were placed
// (paul-kinlan-me-l7f). These tests pin the shape and integrity of the file so the next
// edit cannot leave it pointing at nothing, and the last test pins the federation
// mappings to the suites that actually import those modules, so the pair cannot drift
// apart. Structural only - it reads files, runs nothing, and takes milliseconds.
import { strict as assert } from 'node:assert';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const contractFile = join(repoRoot, 'tests', 'coverage-contract.json');
const contract = JSON.parse(readFileSync(contractFile, 'utf8'));

const entries = Object.entries(contract);
const isGlob = (key) => key.includes('*') || key.includes('?');
const explicitKeys = entries.filter(([key]) => !isGlob(key));

// Module -> the fast-gate suite that exercises it, for the federation/API modules the
// weekly review found unplaced. Every one of these is imported by its mapped suite (the
// test below proves it from the imports, not from this table), and none of them shares a
// stem with its test file, so heuristics can never recover the pairing.
const federationMappings = {
  'api/activitypub-html/render.ts': [
    'tests/handler-input-hardening.test.mjs',
    'tests/activitypub-html-render-escape.test.mjs',
    'tests/activitypub-html-render-admission.test.mjs',
    'tests/activitypub-html-render-identity.test.mjs',
  ],
  'lib/http-signature/index.js': ['tests/activitypub-inbox-signature.test.mjs'],
  'lib/activitypub/utils/verifyInboxActivity.ts': ['tests/activitypub-inbox-signature.test.mjs'],
  'lib/activitypub/utils/guardedFetch.js': ['tests/activitypub-ssrf.test.mjs'],
  'lib/activitypub/utils/logSafe.js': ['tests/log-hygiene.test.mjs'],
};

// Import specifiers a suite uses for local modules: `from './x'`, bare `import './x'`,
// and dynamic `import('./x')`. The extractor's own heuristics only read import
// statements, so this mirrors what the gate can see.
function importSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /\bfrom\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /^\s*import\s*['"]([^'"]+)['"]/gm,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) specifiers.add(match[1]);
  }
  return [...specifiers];
}

// Whether a suite reaches a repo-relative module: an import/dynamic-import that resolves
// to that exact file, or a quoted path naming it. The second form is how the edge-handler
// suites load their module - tests/handler-input-hardening.test.mjs calls
// `buildHandler('../api/activitypub-html/render.ts')` (suite-relative), and the esbuild
// bundles name it REPO-relative ('api/ask-paul.ts' as an argv entry, `entryPoints:
// ['api/polymath/ask.ts']`, `new URL('../api/...', import.meta.url)`). Before
// paul-kinlan-me-msqw only the suite-relative spelling was recognised, so four perfectly
// good mappings looked unreferenced - the detector was blind, not the contract wrong.
function referencesModule(suitePath, modulePath) {
  const source = readFileSync(join(repoRoot, suitePath), 'utf8');
  const target = resolve(repoRoot, modulePath);
  const imported = importSpecifiers(source).some(
    (specifier) => specifier.startsWith('.') && resolve(dirname(join(repoRoot, suitePath)), specifier) === target,
  );
  if (imported) return true;
  const relativeSpecifier = relative(dirname(suitePath), modulePath).split(sep).join('/');
  return [`'${relativeSpecifier}'`, `"${relativeSpecifier}"`, `'${modulePath}'`, `"${modulePath}"`].some((literal) => source.includes(literal));
}

// Assets the fast gate cannot name. The contract may only point at `tests/*.test.mjs`
// (asserted above), so an asset whose behaviour is exercised only by a browser spec has
// no honest fast-gate home - and a FALSE mapping is worse than none, because it credits a
// suite that does not execute the file (paul-kinlan-me-msqw). Each entry here is asserted
// to be absent from the contract, so nobody can quietly re-add the placeholder, and the
// spec that does exercise it is named so the coverage claim stays checkable.
const browserGateAssets = {
  'static/javascripts/ask-paul-ready.js': 'tests/ask-paul-error.browser.mjs',
};

test('coverage contract maps paths to non-empty lists of node test suites', () => {
  assert.ok(entries.length > 0, 'the contract must not be empty');
  for (const [key, suites] of entries) {
    assert.ok(key.length > 0, 'an empty path key is not a mapping');
    assert.ok(Array.isArray(suites), `${key} must map to an array of suite paths`);
    assert.ok(suites.length > 0, `${key} maps to an empty suite list`);
    assert.equal(new Set(suites).size, suites.length, `${key} lists the same suite twice`);
    for (const suite of suites) {
      assert.equal(typeof suite, 'string', `${key} maps to a non-string suite`);
      // The gate dispatches `tests/*.test.mjs`; a browser gate (tests/*.browser.mjs) is
      // never run by it, so mapping to one would credit a suite that did not execute.
      assert.match(suite, /^tests\/[^/]+\.test\.mjs$/, `${key} maps to ${suite}, not a fast-gate suite`);
    }
  }
});

test('every explicitly mapped path exists in the repository', () => {
  const missing = explicitKeys.map(([key]) => key).filter((key) => !existsSync(join(repoRoot, key)));
  assert.deepEqual(missing, [], `contract keys that are not files: ${missing.join(', ')}`);
});

test('every mapped suite exists', () => {
  const missing = entries
    .flatMap(([, suites]) => suites)
    .filter((suite, index, all) => all.indexOf(suite) === index)
    .filter((suite) => !existsSync(join(repoRoot, suite)));
  assert.deepEqual(missing, [], `contract suites that do not exist: ${missing.join(', ')}`);
});

test('a glob mapping still matches a populated directory', () => {
  // The extractor matches globs with fnmatch; this prevents a mapping whose directory was
  // renamed away from sitting in the file looking authoritative.
  for (const [key] of entries.filter(([key]) => isGlob(key))) {
    const prefix = key.slice(0, key.search(/[*?]/));
    const base = join(repoRoot, dirname(prefix + 'x'));
    assert.ok(existsSync(base), `${key} points at a missing directory: ${base}`);
    assert.ok(readdirSync(base).length > 0, `${key} points at an empty directory: ${base}`);
  }
});

test('federation/API modules are mapped to the suites that import them', () => {
  for (const [modulePath, expectedSuites] of Object.entries(federationMappings)) {
    const suites = contract[modulePath];
    assert.ok(Array.isArray(suites), `${modulePath} is not mapped in the coverage contract`);
    for (const suite of expectedSuites) {
      assert.ok(suites.includes(suite), `${modulePath} should be mapped to ${suite}`);
      assert.ok(referencesModule(suite, modulePath), `${suite} does not reference ${modulePath}`);
    }
  }
});

// Marker-removal fixture. The gate places a changed module ONLY through suites a marker
// says ran (`fast-gate: ran|passed|completed: <suites>`); the contract supplies the
// candidate set and the marker decides whether it executed. This mirrors that one rule
// against the real contract so the consequence is pinned in-repo, without needing the
// fleet extractor: the mapped suite places the module, and DROPPING ITS MARKER leaves the
// module unplaced. That matters because the stem/import heuristics pair render.ts with
// tests/mentions.test.mjs - a suite that does not touch the renderer - so a heuristic
// match must never be what keeps a skipped renderer suite looking covered.
function placingSuites(modulePath, executed) {
  return (contract[modulePath] ?? []).filter((suite) => executed.has(suite));
}

test('a module is placed only while its mapped suite actually ran', () => {
  const everySuite = new Set(
    readdirSync(join(repoRoot, 'tests'))
      .filter((name) => name.endsWith('.test.mjs'))
      .map((name) => `tests/${name}`),
  );
  for (const [modulePath, expectedSuites] of Object.entries(federationMappings)) {
    assert.deepEqual(
      [...placingSuites(modulePath, everySuite)].sort(),
      [...expectedSuites].sort(),
      `${modulePath} should be placed by exactly ${expectedSuites.join(' + ')}`,
    );

    // Remove each marker in turn: the module stays placed by whichever mapped suites still
    // ran, and falls to unplaced once the last one is gone. This is what makes a skipped
    // suite visible instead of covered by a sibling or by a heuristic guess.
    for (const removed of expectedSuites) {
      const remaining = expectedSuites.filter((suite) => suite !== removed);
      const withoutMarker = new Set(everySuite);
      withoutMarker.delete(removed);
      assert.deepEqual(
        [...placingSuites(modulePath, withoutMarker)].sort(),
        [...remaining].sort(),
        `${modulePath} must be placed by exactly ${remaining.join(' + ') || 'nothing'} once ${removed}'s marker is gone`,
      );
    }
  }

  // The observed false positive for the edge renderer, pinned so it cannot be adopted as
  // a mapping: mentions.test.mjs does not exercise api/activitypub-html/render.ts.
  assert.ok(!contract['api/activitypub-html/render.ts'].includes('tests/mentions.test.mjs'));
});

// Mappings whose suite exercises the module TRANSITIVELY - through a handler it bundles -
// rather than by naming the file. Declared here instead of weakening the check below to
// suites.some(), which is exactly what let a bogus suite ride along with a valid one
// (paul-kinlan-me-5xw2, filed by the msqw reviewer): with some(), re-adding the bad
// api/ask-paul.ts -> tests/ask-paul.test.mjs mapping passed 9/9 because three other
// mapped suites did reference the file.
//
// tests/activitypub-follow-docid.test.mjs is the one honest exception: it bundles
// api/activitypub/inbox.ts (:85), which imports lib/activitypub/utils/docId.js (:16) and
// calls docIdForUrl on the follow path, so it exercises the module without a specifier
// any static detector can see. The test asserts the allowance is still NECESSARY, so it
// rots loudly instead of silently weakening the rule if that suite ever imports it.
const transitiveMappings = {
  'lib/activitypub/utils/docId.ts': ['tests/activitypub-follow-docid.test.mjs'],
};

test('every explicitly mapped source file is referenced by every one of its suites', () => {
  // The contract's whole purpose is to place a changed file onto a suite that exercises
  // it; a mapping nothing references is an assertion that cannot fail, and it credits
  // coverage for a file no fast-gate suite touches (paul-kinlan-me-msqw). This applies
  // referencesModule - previously used for five hardcoded federation modules only - to
  // every explicit mapping whose key is a JS/TS source file, and demands it of EVERY
  // listed suite, not just one of them.
  const isSourceFile = (key) => /\.m?[jt]sx?$/.test(key);
  const allowed = (key, suite) => (transitiveMappings[key] ?? []).includes(suite);
  const failures = [];
  for (const [key, suites] of explicitKeys) {
    if (!isSourceFile(key)) continue;
    const unreferenced = suites.filter((suite) => !allowed(key, suite) && !referencesModule(suite, key));
    if (unreferenced.length) failures.push(`${key} -> ${unreferenced.join(', ')}`);
  }
  assert.deepEqual(failures, [],
    `contract mappings whose suites never reference the module (remove the mapping, or map it to a suite that loads it):\n  ${failures.join('\n  ')}`);
});

test('declared transitive mappings are mapped and still need the allowance', () => {
  for (const [key, suites] of Object.entries(transitiveMappings)) {
    assert.ok(existsSync(join(repoRoot, key)), `${key} no longer exists - drop its entry`);
    assert.ok(Array.isArray(contract[key]), `${key} must be mapped for the allowance to mean anything`);
    for (const suite of suites) {
      assert.ok(contract[key].includes(suite), `${key} must list ${suite}`);
      assert.ok(!referencesModule(suite, key),
        `${suite} now references ${key} directly - drop the transitive allowance so the rule applies again`);
    }
  }
});

test('assets the fast gate cannot name are documented instead of falsely mapped', () => {
  for (const [asset, browserSpec] of Object.entries(browserGateAssets)) {
    assert.ok(existsSync(join(repoRoot, asset)), `${asset} no longer exists - drop its entry`);
    assert.equal(contract[asset], undefined,
      `${asset} must not be mapped: its behaviour is exercised only by ${browserSpec}, which the fast gate never runs`);
    assert.ok(existsSync(join(repoRoot, browserSpec)), `${browserSpec} must exist`);
    const spec = readFileSync(join(repoRoot, browserSpec), 'utf8');
    assert.ok(spec.includes(asset), `${browserSpec} must reference ${asset} for the claim to be checkable`);
  }
});

test('coverage contract JSON contains no duplicate keys (paul-kinlan-me-l0le)', () => {
  const raw = readFileSync(contractFile, 'utf8');
  const keyMatches = [...raw.matchAll(/"([^"\\]+)":\s*\[/g)].map((m) => m[1]);
  const seen = new Set();
  const duplicates = [];
  for (const key of keyMatches) {
    if (seen.has(key)) duplicates.push(key);
    seen.add(key);
  }
  assert.deepEqual(duplicates, [], `duplicate keys in coverage-contract.json: ${duplicates.join(', ')}`);
});

