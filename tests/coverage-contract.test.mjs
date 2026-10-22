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
  'api/activitypub-html/render.ts': 'tests/handler-input-hardening.test.mjs',
  'lib/http-signature/index.js': 'tests/activitypub-inbox-signature.test.mjs',
  'lib/activitypub/utils/guardedFetch.js': 'tests/activitypub-ssrf.test.mjs',
  'lib/activitypub/utils/logSafe.js': 'tests/log-hygiene.test.mjs',
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
// to that exact file, or a quoted relative path naming it. The second form is how
// tests/handler-input-hardening.test.mjs loads the edge handler (`buildHandler('../api/
// activitypub-html/render.ts')`), which is a real dependency but not an import statement.
function referencesModule(suitePath, modulePath) {
  const source = readFileSync(join(repoRoot, suitePath), 'utf8');
  const target = resolve(repoRoot, modulePath);
  const imported = importSpecifiers(source).some(
    (specifier) => specifier.startsWith('.') && resolve(dirname(join(repoRoot, suitePath)), specifier) === target,
  );
  if (imported) return true;
  const relativeSpecifier = relative(dirname(suitePath), modulePath).split(sep).join('/');
  return [`'${relativeSpecifier}'`, `"${relativeSpecifier}"`].some((literal) => source.includes(literal));
}

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
  for (const [modulePath, expectedSuite] of Object.entries(federationMappings)) {
    const suites = contract[modulePath];
    assert.ok(Array.isArray(suites), `${modulePath} is not mapped in the coverage contract`);
    assert.ok(suites.includes(expectedSuite), `${modulePath} should be mapped to ${expectedSuite}`);
    assert.ok(referencesModule(expectedSuite, modulePath), `${expectedSuite} does not reference ${modulePath}`);
  }
});
