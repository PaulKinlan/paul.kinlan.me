// vercel.json's top-level `ignoreCommand` decides whether Vercel builds a deployment
// for a commit, and its exit-code contract is inverted from intuition: exit 0 SKIPS
// the build, any non-zero exit RUNS it. `bd dolt push` force-updates a Dolt metadata
// branch on this repo (origin/__dolt_remote_info__, one commit per push, no site
// content), so without a skip Vercel builds and bills a preview nobody looks at.
//
// Both failure modes of this one-liner are invisible to a JSON-shape assertion:
//   * a command that always exits 0 silently stops every preview, including main;
//   * a command that compares against a ref name that does not exist always exits 1
//     - a no-op that still builds the metadata preview.
// So these tests execute the real string from vercel.json through a POSIX shell for
// each ref name, and pin the real branch name the Dolt remote pushes to. Structural
// plus `sh -c` only: no network, no build, milliseconds.
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const config = JSON.parse(readFileSync(join(repoRoot, 'vercel.json'), 'utf8'));
const ignoreCommand = config.ignoreCommand;

// The ref `bd dolt push` force-updates: `bd` names its metadata branch with double
// underscores. Verified from `git fetch origin` (origin/__dolt_remote_info__) - the
// asterisk spelling `**dolt_remote_info**` in the original directive is not a ref any
// push produces, and an equality test against it matches nothing (always exit 1).
const doltRef = '__dolt_remote_info__';

function exitCodeFor(ref) {
  const env = { ...process.env };
  delete env.VERCEL_GIT_COMMIT_REF;
  if (ref !== undefined) env.VERCEL_GIT_COMMIT_REF = ref;
  const result = spawnSync('sh', ['-c', ignoreCommand], { cwd: repoRoot, env });
  assert.equal(result.error, undefined, `spawning sh failed: ${result.error}`);
  return result.status;
}

test('vercel.json declares ignoreCommand as a non-empty single-line command', () => {
  assert.equal(typeof ignoreCommand, 'string', 'ignoreCommand must be a JSON string');
  assert.ok(ignoreCommand.trim().length > 0, 'ignoreCommand must not be empty');
  assert.doesNotMatch(ignoreCommand, /\n/, 'ignoreCommand must be a single line (Vercel runs it as one shell command)');
  // Hugo's build is otherwise untouched by this property; a second top-level key here
  // would mean this change replaced more than it intended.
  assert.equal(config.framework, 'hugo', 'the framework must stay hugo');
});

test('ignoreCommand compares against the ref a Dolt push actually produces', () => {
  // The command can only skip the metadata preview if it names the ref that exists.
  // The directive it came from spelled it with asterisks; if that spelling ever comes
  // back, the branch below skips nothing and no exit-code test above would notice.
  assert.ok(ignoreCommand.includes(doltRef), `ignoreCommand must name the real ref ${doltRef}`);
  assert.ok(
    !ignoreCommand.includes('**dolt_remote_info**'),
    'the asterisk spelling is not a ref a Dolt push produces',
  );
});

test('ignoreCommand skips the Dolt metadata branch (exit 0)', () => {
  assert.equal(exitCodeFor(doltRef), 0, `${doltRef} should skip the build`);
});

test('ignoreCommand builds for ordinary refs (exit 1)', () => {
  const building = [
    'main',
    'master',
    'fleet/vercel-ignore',
    'preview',
    'feature/http-cache',
    'dolt',
    'dolt_remote',
    doltRef.replace('remote', 'branch'),
  ];
  for (const ref of building) {
    assert.equal(exitCodeFor(ref), 1, `${ref} must not be skipped`);
  }
});

test('ignoreCommand builds when the ref is unset or empty', () => {
  assert.equal(exitCodeFor(undefined), 1, 'an unset VERCEL_GIT_COMMIT_REF must build');
  assert.equal(exitCodeFor(''), 1, 'an empty VERCEL_GIT_COMMIT_REF must build');
});

test('ignoreCommand only ever exits 0 or 1', () => {
  // Vercel treats 0 as skip and any non-zero as build, but 1 is the documented
  // "build" signal; a crash (127/2/…) would be an accident rather than a decision.
  for (const ref of [doltRef, 'main', '', undefined]) {
    assert.equal([0, 1].includes(exitCodeFor(ref)), true, `unexpected exit status for ref ${String(ref)}`);
  }
});
