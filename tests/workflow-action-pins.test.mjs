// Every GitHub Actions workflow pins third-party actions to a full commit SHA
// (paul-kinlan-me-1ulv, paul-kinlan-me-axft): a mutable tag ref moved by an
// attacker runs arbitrary third-party code with the workflow's secrets, and
// both workflows in this repo run with them. A new workflow or a bumped action
// must keep the rule. Reads two small files, touches no shared state.
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const workflowsDir = fileURLToPath(new URL('../.github/workflows', import.meta.url));

test('every workflow action is pinned to an immutable commit SHA', () => {
  const files = readdirSync(workflowsDir).filter((f) => /\.ya?ml$/.test(f));
  assert.ok(files.length > 0, 'no workflows found');
  for (const file of files) {
    const yml = readFileSync(join(workflowsDir, file), 'utf8');
    for (const [index, line] of yml.split('\n').entries()) {
      const match = /uses:\s*(\S+)/.exec(line);
      if (!match) continue;
      const ref = match[1];
      // Local actions and docker images are out of scope; everything else is
      // `owner/repo[/path]@<ref>` and the ref must be the full commit SHA.
      if (ref.startsWith('./') || ref.startsWith('docker://')) continue;
      const sha = ref.split('@')[1] ?? '';
      assert.match(sha, /^[0-9a-f]{40}$/,
        `${file}:${index + 1} pins ${ref} by a mutable ref, not a commit SHA`);
    }
  }
});
