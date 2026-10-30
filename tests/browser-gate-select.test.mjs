// Node-tier tests for the browser-gate SELECTOR (paul-kinlan-me-1i3). These run
// inside tools/fast-gate.sh (they match tests/*.test.mjs) and MUST NOT launch
// Chrome or a build - they only read the manifest, classify injected path lists,
// and pin the fail-closed contract. The actual Chrome run is exercised by the CI
// workflow and verified by hand on the bead, never here.
//
// Acceptance covered (architect verdict on the bead):
//   - a source change selects its mapped browser spec;
//   - a shared input selects ALL affected specs;
//   - unrelated content selects NONE, with an explicit recorded reason;
//   - a new/unmapped browser-relevant path FAILS CLOSED;
//   - every spec on disk is mapped, self-triggers, and exists (integrity);
//   - the workflow's path filter is pinned to the manifest ciPaths (no drift);
//   - Chrome stayed OUT of the fast gate and the landing build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import {
  loadManifest,
  integrityErrors,
  browserSpecsOnDisk,
  classifyPath,
  selectFromFiles,
  selectionFailed,
  matchGlob,
  expandTriggers,
} from '../tools/browser-gate/select.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const manifest = loadManifest(repoRoot);

function select(...files) {
  return selectFromFiles(files, manifest, repoRoot);
}
function selectedSpecs(...files) {
  return select(...files).selected.map((s) => s.spec).sort();
}

// --- the glob matcher -------------------------------------------------------
test('glob: ** matches nested segments, * stays within one', () => {
  assert.equal(matchGlob('tools/browser-gate/**', 'tools/browser-gate/run.mjs'), true);
  assert.equal(matchGlob('tools/browser-gate/**', 'tools/browser-gate/sub/x.json'), true);
  assert.equal(matchGlob('tools/browser-gate/**', 'tools/browser-gate'), false);
  assert.equal(matchGlob('tests/*.browser.mjs', 'tests/mentions.xss.browser.mjs'), true);
  assert.equal(matchGlob('tests/*.browser.mjs', 'tests/nested/x.browser.mjs'), false);
  assert.equal(matchGlob('a/**/b', 'a/b'), true);
  assert.equal(matchGlob('a/**/b', 'a/x/y/b'), true);
  assert.equal(matchGlob('content/**', 'content/2020/x.md'), true);
  assert.equal(matchGlob('static/css/material.css', 'static/css/material2css'), false);
});

// --- integrity: the manifest and the disk agree -----------------------------
test('integrity: manifest is healthy against the specs on disk', () => {
  assert.deepEqual(integrityErrors(manifest, repoRoot), []);
});

test('integrity: every tests/*.browser.mjs on disk is a mapped spec key that self-triggers and exists', () => {
  const onDisk = browserSpecsOnDisk(repoRoot);
  assert.equal(onDisk.length, 9, 'expected the nine known browser specs');
  for (const spec of onDisk) {
    assert.ok(spec in manifest.specs, `${spec} is not in the manifest`);
    const triggers = expandTriggers(manifest, spec, manifest.specs[spec]);
    assert.ok(triggers.includes(spec), `${spec} does not trigger on itself`);
    assert.equal(classifyPath(spec, manifest).kind, 'select', `${spec} change must select, not ignore`);
    assert.ok(classifyPath(spec, manifest).specs.includes(spec), `${spec} change must select itself`);
  }
});

test('integrity: site-coupled set is exactly the three built-site specs', () => {
  const coupled = Object.entries(manifest.specs).filter(([, d]) => d.siteCoupled).map(([s]) => s).sort();
  assert.deepEqual(coupled, [
    'tests/air-horner.browser.mjs',
    'tests/image-hints.browser.mjs',
    'tests/palette-demo.browser.mjs',
  ]);
});

// --- selection: source change -> its mapped spec ----------------------------
test('select: a changed source module selects its mapped browser spec(s)', () => {
  assert.deepEqual(selectedSpecs('api/mentions.js'), [
    'tests/mentions-input.browser.mjs',
    'tests/mentions.xss.browser.mjs',
  ]);
  assert.deepEqual(selectedSpecs('static/javascripts/share-button.js'), ['tests/share-button.browser.mjs']);
  assert.deepEqual(selectedSpecs('static/audio/airhorn.mp3'), ['tests/air-horner.browser.mjs']);
  assert.deepEqual(selectedSpecs('static/images/2026/something.png'), ['tests/image-hints.browser.mjs']);
  assert.deepEqual(selectedSpecs('lib/ask-paul-answer.js'), [
    'tests/ask-paul-error.browser.mjs',
    'tests/ask-paul.xss.browser.mjs',
  ]);
  assert.deepEqual(selectedSpecs('static/css/material.css'), ['tests/palette-demo.browser.mjs']);
});

// --- selection: shared input -> ALL affected specs --------------------------
test('select: a shared input fans out to every affected spec', () => {
  // vercel.json drives the three CSP xss specs.
  assert.deepEqual(selectedSpecs('vercel.json'), [
    'tests/activitypub-html.xss.browser.mjs',
    'tests/ask-paul.xss.browser.mjs',
    'tests/mentions.xss.browser.mjs',
  ]);
  // The lockfile pair is a shared 'deps' input: all nine.
  assert.equal(selectedSpecs('package-lock.json').length, 9);
  assert.equal(selectedSpecs('package.json').length, 9);
  // A built-site surface is a shared 'site' input: the three site-coupled specs.
  assert.deepEqual(selectedSpecs('layouts/_default/baseof.html'), [
    'tests/air-horner.browser.mjs',
    'tests/image-hints.browser.mjs',
    'tests/palette-demo.browser.mjs',
  ]);
  // The runner itself fans out to all nine (it changes how every spec runs).
  assert.equal(selectedSpecs('tools/browser-gate/run.mjs').length, 9);
  assert.equal(selectedSpecs('tools/browser-gate/evidence.mjs').length, 9);
  assert.equal(selectedSpecs('.github/workflows/browser-gate.yml').length, 9);
});

// --- selection: unrelated content -> NONE, with an explicit reason ----------
test('select: an unrelated content path selects nothing and records an explicit reason', () => {
  const sel = select('content/2020-01-01-some-new-post.markdown');
  assert.deepEqual(sel.selected, []);
  assert.equal(selectionFailed(sel), false, 'an ignored path is not a failure');
  assert.equal(sel.skipped.length, 1);
  assert.equal(sel.skipped[0].path, 'content/2020-01-01-some-new-post.markdown');
  assert.match(sel.skipped[0].reason, /content/, 'the reason must say why it is out of scope');
  assert.equal(sel.unmapped.length, 0);
});

test('select: a pinned content page is a trigger, not an ignore (triggers win)', () => {
  assert.deepEqual(selectedSpecs('content/2016-11-29-material-color-pallette.markdown'), [
    'tests/palette-demo.browser.mjs',
  ]);
  assert.deepEqual(selectedSpecs('content/projects/jakehorner.markdown'), ['tests/air-horner.browser.mjs']);
});

// --- selection: fail closed -------------------------------------------------
test('select: a new/unmapped browser-relevant path FAILS CLOSED', () => {
  for (const p of ['netlify.toml', 'brandnew/widget.rs', 'edge-functions/x.js']) {
    const sel = select(p);
    assert.deepEqual(sel.unmapped, [p], `${p} should be unmapped`);
    assert.equal(selectionFailed(sel), true, `${p} must fail the selection closed`);
    assert.equal(classifyPath(p, manifest).kind, 'unmapped');
  }
});

test('select: an unmapped path alongside a mapped one still fails the whole selection', () => {
  const sel = select('api/mentions.js', 'something-unmapped.txt');
  assert.equal(selectionFailed(sel), true);
  assert.deepEqual(sel.unmapped, ['something-unmapped.txt']);
  // the mapped spec is still reported, but the run is refused because of the unmapped path
  assert.ok(sel.selected.some((s) => s.spec === 'tests/mentions.xss.browser.mjs'));
});

test('select: integrity violation also fails closed', () => {
  const broken = JSON.parse(JSON.stringify(manifest));
  delete broken.specs['tests/mentions.xss.browser.mjs'];
  const sel = selectFromFiles(['api/mentions.js'], broken, repoRoot);
  assert.equal(sel.integrity.length > 0, true, 'an orphaned spec on disk is an integrity error');
  assert.equal(selectionFailed(sel), true);
});

// --- the empty delta --------------------------------------------------------
test('select: an empty change list selects nothing and does not fail', () => {
  const sel = select();
  assert.deepEqual(sel.selected, []);
  assert.equal(selectionFailed(sel), false);
});

// --- workflow path filter is pinned to manifest ciPaths ---------------------
test('ci: the workflow path filter equals the manifest ciPaths (no drift)', () => {
  const yml = readFileSync(join(repoRoot, '.github', 'workflows', 'browser-gate.yml'), 'utf8');
  const lines = yml.split('\n');
  const start = lines.findIndex((l) => l.includes('paths: &browser_paths'));
  assert.ok(start >= 0, 'workflow must define the anchored paths list');
  const items = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const m = /^\s*-\s*'([^']+)'/.exec(lines[i]);
    if (m) items.push(m[1]);
    else if (items.length > 0) break; // the contiguous list ended
  }
  assert.ok(items.length > 0, 'parsed no paths from the workflow');
  assert.deepEqual([...new Set(items)].sort(), [...manifest.ciPaths].sort());
});

// ciPaths is deliberately BROADER than the trigger union (static/** covers the
// narrow per-spec static triggers so an unclassified NEW static file still
// reaches the selector and fails closed). So the check is subsumption: every
// trigger must be caught by some ciPaths entry - exact, or under a '**' parent.
test('ci: every trigger pattern is covered by the ciPaths filter', () => {
  const ci = [...manifest.ciPaths];
  const covered = (pattern) => ci.some((c) => {
    if (c === pattern) return true;
    if (c.endsWith('/**')) {
      const prefix = c.slice(0, -2); // 'static/**' -> 'static/'
      return pattern.startsWith(prefix);
    }
    return false;
  });
  for (const [spec, def] of Object.entries(manifest.specs)) {
    for (const pattern of expandTriggers(manifest, spec, def)) {
      assert.ok(covered(pattern), `trigger ${pattern} (spec ${spec}) is not covered by ciPaths`);
    }
  }
});

// --- Chrome stayed OUT of the fast gate and the landing build ---------------
test('gate budget: Chrome is not in the fast gate or the landing build', () => {
  const checkConf = readFileSync(join(repoRoot, 'tools', 'check.conf'), 'utf8');
  assert.match(checkConf, /CHECK_CMD="npm run build"/, 'landing build must stay the plain build');
  assert.match(checkConf, /CHECK_FAST_CMD="bash tools\/fast-gate\.sh"/, 'fast gate must stay fast-gate.sh');
  const fastGate = readFileSync(join(repoRoot, 'tools', 'fast-gate.sh'), 'utf8');
  assert.ok(!/browser-gate\/run\.mjs|browser-gate\.sh|puppeteer/.test(fastGate), 'fast gate must not invoke the browser tier or puppeteer');
});
