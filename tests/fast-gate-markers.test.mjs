// tools/fast-gate.sh must NAME the suites it dispatches. `fleet-check --fast` reads
// the gate log with ~/fleet/remote/check-coverage.py, and that extractor can only
// attribute a changed file to a suite from positive evidence that the suite ran - a
// line-anchored `fast-gate: running|ran|passed|completed|failed: <suite>...` marker.
// Without one, every fast-gate verdict in this repo reported the changed files as
// "NOT demonstrated to be exercised" even when the gate had run their tests, and the
// reviewer rebuilt the mapping by hand (paul-kinlan-me-c3z).
//
// This test runs the GATE ITSELF, with a shim `python3` or `node` first on PATH that
// fails immediately. That keeps it at a few hundred milliseconds - the gate never
// reaches the Tailwind or Hugo build - while pinning the two properties that matter:
// a red gate still reports what it dispatched, and the node marker lists the real
// suites (never the glob, never the Chrome-only browser gates). The shim prints
// `shim-ran:` so the tests can also assert the marker comes AFTER the step rather
// than before it: a marker emitted up front would be read as evidence of execution
// by a gate that was killed before the suite ever produced a result.
//
// tests/coverage-contract.json names this file as the suite for tools/fast-gate.sh:
// the extractor's naming oracle only pairs sources with tests of a compatible
// extension, so a .sh source can never be attributed to a .mjs test without it, and
// every change to the gate would come back as uncovered.
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

// The suites the gate's `tests/*.test.mjs` glob expands to, derived here from the
// filesystem rather than from the script, so an edit that changes the glob without
// changing the marker (or the reverse) fails this test.
const dispatachableSuites = readdirSync(join(repoRoot, 'tests'))
  .filter((name) => name.endsWith('.test.mjs'))
  .map((name) => `tests/${name}`)
  .sort();

// Run tools/fast-gate.sh with `shims` (name -> exit status) prepended to PATH, so the
// named step fails without the rest of the gate running. Each shim announces itself
// on stdout, which gives the tests a position to compare a marker against.
function runGate(shims) {
  const shimDir = mkdtempSync(join(tmpdir(), 'fast-gate-markers-'));
  try {
    for (const [name, status] of Object.entries(shims)) {
      const file = join(shimDir, name);
      writeFileSync(file, `#!/bin/sh\necho "shim-ran: ${name}"\nexit ${status}\n`);
      chmodSync(file, 0o755);
    }
    const result = spawnSync('bash', ['tools/fast-gate.sh'], {
      cwd: repoRoot,
      encoding: 'utf8',
      timeout: 60_000,
      env: { ...process.env, PATH: `${shimDir}:${process.env.PATH}` },
    });
    assert.equal(result.error, undefined, `could not run the gate: ${result.error}`);
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  } finally {
    rmSync(shimDir, { recursive: true, force: true });
  }
}

function markerLines(output, kind) {
  const pattern = new RegExp(`^fast-gate: ${kind}: (.*)$`);
  return output
    .split('\n')
    .map((line) => line.match(pattern))
    .filter(Boolean)
    .map((match) => match[1]);
}

function assertMarkerFollowsStep(output, stepLine, markerLine) {
  const stepAt = output.indexOf(stepLine);
  const markerAt = output.indexOf(markerLine);
  assert.notEqual(stepAt, -1, `the step never ran:\n${output}`);
  assert.notEqual(markerAt, -1, `the marker was never printed:\n${output}`);
  assert.ok(
    markerAt > stepAt,
    `the marker must be emitted after the step returns, not before it starts:\n${output}`
  );
}

test('a step that fails is named after it returns, with that step status', () => {
  const { status, output } = runGate({ python3: 7 });

  assert.equal(status, 7, `the gate must exit with the failing step's status:\n${output}`);
  assert.deepEqual(markerLines(output, 'running'), [], 'no marker may claim a suite before it has run');
  assert.deepEqual(markerLines(output, 'ran'), [], 'a step that failed must not also be named as ran');
  assert.deepEqual(
    markerLines(output, 'failed'),
    ['tools/check-factory-gate.py'],
    'a red gate must still report the suite it dispatched, or the verdict reads as untested'
  );
  assertMarkerFollowsStep(output, 'shim-ran: python3', 'fast-gate: failed: tools/check-factory-gate.py');
});

test('the node marker names the real suite list, not the glob and not the browser gates', () => {
  const { status, output } = runGate({ node: 3 });

  assert.equal(status, 3, `the gate must stop at the failing node step:\n${output}`);
  assert.deepEqual(markerLines(output, 'running'), [], 'no marker may claim a suite before it has run');
  assert.deepEqual(
    markerLines(output, 'ran'),
    ['tools/check-factory-gate.py'],
    'the steps before the failing one ran and must be named'
  );

  const failed = markerLines(output, 'failed');
  assert.equal(failed.length, 1, `only the node step failed:\n${output}`);
  assertMarkerFollowsStep(output, 'shim-ran: node', `fast-gate: failed: ${failed[0]}`);

  const dispatched = failed[0].split(/\s+/).filter(Boolean).sort();
  assert.deepEqual(dispatched, dispatachableSuites, 'the marker must be the expansion of the glob node --test was handed');
  assert.ok(!failed[0].includes('*'), 'the marker must name real suites, never the glob');
  for (const suite of dispatched) {
    assert.ok(
      !suite.includes('.browser.mjs'),
      `${suite} needs Chrome and is not run by this gate, so it must not be named as executed`
    );
  }
});
