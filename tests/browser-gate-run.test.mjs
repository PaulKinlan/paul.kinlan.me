// Node-tier tests for the browser-gate RUNNER plan + cache key
// (paul-kinlan-me-1i3). Like the selector tests these run in the fast gate and
// MUST NOT launch Chrome or a build: they only exercise the pure planning layer
// (what WOULD run, in what order, bounded how, isolated where) and the cache-key
// binding. The real serial/timed/isolated Chrome run and the build-before-run
// behaviour are proven by the CI workflow and by a hand run recorded on the bead.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { loadManifest, selectFromFiles } from '../tools/browser-gate/select.mjs';
import { plan, cacheKey, runtimeFingerprint, chromeBuildId } from '../tools/browser-gate/run.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const manifest = loadManifest(repoRoot);
const manifestRaw = readFileSync(join(repoRoot, 'tools', 'browser-gate', 'manifest.json'), 'utf8');
const fingerprint = runtimeFingerprint(repoRoot);

function planFor(...files) {
  const selection = selectFromFiles(files, manifest, repoRoot);
  return plan({ repoRoot, selection, tree: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef', all: false });
}

// --- the build runs ONCE, only when a site-coupled spec is selected ---------
test('plan: a fixture-only delta schedules NO build', () => {
  const p = planFor('api/mentions.js');
  assert.equal(p.build, null);
  assert.deepEqual(p.specs.map((s) => s.spec), [
    'tests/mentions-input.browser.mjs',
    'tests/mentions.xss.browser.mjs',
  ]);
  assert.ok(p.specs.every((s) => s.siteCoupled === false));
  assert.ok(p.specs.every((s) => !('SITE_DIR' in s.env)), 'fixture specs must not get SITE_DIR');
});

test('plan: a site-coupled delta schedules exactly ONE build for the shared tree', () => {
  const p = planFor('layouts/_default/baseof.html');
  assert.ok(p.build, 'site-coupled selection must build');
  assert.equal(p.build.once, true);
  assert.deepEqual(p.build.command, manifest.siteBuild.command);
  assert.equal(p.build.timeoutSec, manifest.siteBuild.timeoutSec);
  const coupled = p.specs.filter((s) => s.siteCoupled);
  assert.equal(coupled.length, 3);
  for (const s of coupled) {
    assert.equal(s.env.SITE_DIR, '<repoRoot>/public', 'every site-coupled spec shares the same built tree');
  }
});

// --- serial, bounded, isolated ---------------------------------------------
test('plan: every spec is bounded, serial, and gets the run evidence dir', () => {
  const p = planFor('package.json'); // deps shared -> all nine
  assert.equal(p.specs.length, 9);
  for (const s of p.specs) {
    assert.ok(Number.isFinite(s.timeoutSec) && s.timeoutSec > 0, `${s.spec} needs a timeout`);
    assert.equal(s.env.BROWSER_GATE_EVIDENCE_DIR, '<run-evidence-dir>', 'evidence is isolated per run');
  }
  // plan order is the execution order (the runner iterates it serially), and the
  // selector's contract is stable ALPHABETICAL order - independent of where the
  // entries sit in the manifest. (paul-kinlan-me-1b6: this used to assert manifest
  // declaration order, which passed only by coincidence while the two agreed.)
  const planned = p.specs.map((s) => s.spec);
  assert.deepEqual(planned, [...planned].sort(), 'specs run in stable alphabetical order (reproducible)');
});

test('cache: the default cache dir lives outside the repo, so a local run cannot dirty the worktree', (t) => {
  if (process.env.BROWSER_GATE_CACHE_DIR) {
    t.skip('BROWSER_GATE_CACHE_DIR is set in this environment; the default is what 6lw pins');
    return;
  }
  const p = planFor('api/mentions.js');
  assert.ok(!p.cache.dir.startsWith(repoRoot), `default cache dir ${p.cache.dir} must not sit inside the worktree`);
});

test('fingerprint: the chrome binding includes the executable stat, not just its path', () => {
  const saved = process.env.PUPPETEER_EXECUTABLE_PATH;
  try {
    // Any statable file proves the binding shape: env:<path-hash>-<size>-<mtime>.
    process.env.PUPPETEER_EXECUTABLE_PATH = join(repoRoot, 'package.json');
    const bound = chromeBuildId(repoRoot);
    assert.match(bound, /env:[0-9a-f]{16}-\d+-\d+/, 'a same-path browser upgrade (new size/mtime) must change the key');
    delete process.env.PUPPETEER_EXECUTABLE_PATH;
    assert.ok(!chromeBuildId(repoRoot).includes('env:'), 'with no override the bundled-build scan answers instead');
  } finally {
    if (saved === undefined) delete process.env.PUPPETEER_EXECUTABLE_PATH;
    else process.env.PUPPETEER_EXECUTABLE_PATH = saved;
  }
});

test('plan: records skipped paths and the cache fingerprint', () => {
  const p = planFor('content/2020-01-01-post.markdown', 'api/mentions.js');
  assert.equal(p.skipped.length, 1);
  assert.equal(p.skipped[0].path, 'content/2020-01-01-post.markdown');
  assert.ok(p.cache.key && p.cache.key.length === 64, 'a sha256 cache key is recorded');
  assert.equal(p.cache.fingerprint.node, process.version);
});

// --- the cache key binds everything the architect named --------------------
test('cacheKey: identical inputs produce an identical key', () => {
  const selection = selectFromFiles(['api/mentions.js'], manifest, repoRoot);
  const a = cacheKey({ tree: 'abc', selection, manifestRaw, fingerprint });
  const b = cacheKey({ tree: 'abc', selection, manifestRaw, fingerprint });
  assert.equal(a, b);
  assert.equal(a.length, 64);
});

test('cacheKey: a different tree, selection, manifest, or fingerprint invalidates the PASS', () => {
  const selection = selectFromFiles(['api/mentions.js'], manifest, repoRoot);
  const base = cacheKey({ tree: 'abc', selection, manifestRaw, fingerprint });

  const otherTree = cacheKey({ tree: 'abd', selection, manifestRaw, fingerprint });
  assert.notEqual(base, otherTree, 'a new commit must not replay a cached PASS');

  const otherSelection = selectFromFiles(['static/javascripts/share-button.js'], manifest, repoRoot);
  assert.notEqual(base, cacheKey({ tree: 'abc', selection: otherSelection, manifestRaw, fingerprint }), 'a different spec set is a different key');

  assert.notEqual(base, cacheKey({ tree: 'abc', selection, manifestRaw: manifestRaw + ' ', fingerprint }), 'manifest content is bound into the key');

  const otherFingerprint = { ...fingerprint, chrome: 'chrome-999.0.0.0' };
  assert.notEqual(base, cacheKey({ tree: 'abc', selection, manifestRaw, fingerprint: otherFingerprint }), 'the browser build is bound into the key');
});

test('cacheKey: changing a selected spec within the same delta changes the key', () => {
  // Two deltas that touch the same file but select different spec sets must not
  // share a PASS. (Mentions vs share-button select disjoint specs.)
  const s1 = selectFromFiles(['api/mentions.js'], manifest, repoRoot);
  const s2 = selectFromFiles(['api/mentions.js', 'static/javascripts/share-button.js'], manifest, repoRoot);
  const k1 = cacheKey({ tree: 'abc', selection: s1, manifestRaw, fingerprint });
  const k2 = cacheKey({ tree: 'abc', selection: s2, manifestRaw, fingerprint });
  assert.notEqual(k1, k2);
});

// --- fingerprint binds the runner sources ----------------------------------
test('fingerprint: binds the runner, selector, evidence helper, wrapper and workflow sources', () => {
  for (const key of ['runner', 'selector', 'evidence', 'wrapper', 'workflow', 'node', 'puppeteer', 'chrome']) {
    assert.ok(key in fingerprint, `fingerprint must bind ${key}`);
    assert.ok(typeof fingerprint[key] === 'string' && fingerprint[key].length > 0, `${key} must be a non-empty value`);
  }
});
