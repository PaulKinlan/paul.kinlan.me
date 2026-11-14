// Every GitHub Actions workflow pins third-party actions to a full commit SHA
// (paul-kinlan-me-1ulv, paul-kinlan-me-axft): a mutable tag ref moved by an
// attacker runs arbitrary third-party code with the workflow's secrets, and
// both workflows in this repo run with them. A new workflow or a bumped action
// must keep the rule. Reads two small files, touches no shared state.
//
// Parsed, not grepped (paul-kinlan-me-0enw, filed by the axft reviewer): the
// first version ran /uses:\s*(\S+)/ over raw lines, which missed a YAML-valid
// `uses:` whose value sits on the next indented line (an unpinned action passing
// the rule) and flagged a quoted-but-pinned ref, a commented-out example and a
// mention inside a `run: |` block. No YAML parser is resolvable from this repo,
// so parseActionUses() below does the three things that matter: drop comments
// quote-aware, skip block scalars (| and >), and accept a value on the following
// indented line.
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const workflowsDir = fileURLToPath(new URL('../.github/workflows', import.meta.url));

// A '#' opens a comment only outside quotes and only after whitespace (or at the
// start of the line) - GitHub's YAML rules, and the reason `@1234#frag` is not a
// comment here.
function stripComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '#' && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}

function unquote(value) {
  const trimmed = value.trim();
  const quoted = trimmed.length >= 2
    && ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'")));
  return quoted ? trimmed.slice(1, -1).trim() : trimmed;
}

const indentOf = (line) => line.length - line.trimStart().length;

// Every `uses:` value in a workflow, with the line it came from. Handles the
// quoted form, `- uses:` list items, a value on the next indented line, and
// ignores anything inside a | or > block scalar.
export function parseActionUses(yml) {
  const lines = yml.split('\n').map(stripComment);
  const found = [];
  let blockIndent = -1;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;
    const indent = indentOf(line);
    if (blockIndent >= 0) {
      // Content of the literal block is one indent level deeper than its key.
      if (indent > blockIndent) continue;
      blockIndent = -1;
    }
    if (/:\s*[|>][+-]?\d*\s*$/.test(line)) {
      blockIndent = indent;
      continue;
    }
    const match = /^\s*(?:-\s*)*uses:\s*(.*)$/.exec(line);
    if (!match) continue;
    let ref = unquote(match[1]);
    let sourceLine = index + 1;
    if (!ref) {
      // `- uses:` with the value on the next (deeper-indented) line: YAML reads
      // it as the same scalar, so the guard must too.
      for (let next = index + 1; next < lines.length; next += 1) {
        if (!lines[next].trim() || indentOf(lines[next]) <= indent) continue;
        ref = unquote(lines[next]);
        sourceLine = next + 1;
        break;
      }
    }
    found.push({ ref, line: sourceLine });
  }
  return found;
}

// Local actions and docker images are out of scope; everything else is
// `owner/repo[/path]@<ref>` and the ref must be the full commit SHA.
export function unpinnedUses(yml) {
  return parseActionUses(yml).filter(({ ref }) => {
    if (!ref || ref.startsWith('./') || ref.startsWith('docker://')) return false;
    return !/^[0-9a-f]{40}$/.test(ref.split('@')[1] ?? '');
  });
}

const SHA = 'a'.repeat(40);

test('every workflow action is pinned to an immutable commit SHA', () => {
  const files = readdirSync(workflowsDir).filter((f) => /\.ya?ml$/.test(f));
  assert.ok(files.length > 0, 'no workflows found');
  for (const file of files) {
    const yml = readFileSync(join(workflowsDir, file), 'utf8');
    for (const { ref, line } of unpinnedUses(yml)) {
      assert.fail(`${file}:${line} pins ${ref} by a mutable ref, not a commit SHA`);
    }
  }
});

test('the guard reads the YAML, not the raw lines (paul-kinlan-me-0enw)', () => {
  // Bypass from the axft review: a YAML-valid uses with its value on the next
  // indented line. The line-regex version returned nothing here.
  assert.deepEqual(parseActionUses('- uses:\n    actions/checkout@v4\n').map((u) => u.ref), ['actions/checkout@v4']);
  assert.equal(unpinnedUses('- uses:\n    actions/checkout@v4\n').length, 1, 'next-line form must be checked');

  // A bare `uses:` with no value at all is not an action reference - but a
  // sibling list item after it still is.
  assert.deepEqual(parseActionUses('- uses:\n').map((u) => u.ref), ['']);
  assert.equal(unpinnedUses('- uses:\n').length, 0);

  // False failures from the same review: quoted pinned refs, a commented-out
  // example, and a mention inside a run block.
  assert.equal(unpinnedUses(`- uses: "actions/checkout@${SHA}"\n`).length, 0, 'quoted pinned ref');
  assert.equal(unpinnedUses(`- uses: 'actions/checkout@${SHA}'\n`).length, 0, 'single-quoted pinned ref');
  assert.equal(unpinnedUses('# uses: actions/checkout@v4\n').length, 0, 'commented-out example');
  assert.equal(unpinnedUses(`- uses: actions/checkout@v4 # bump me\n`).length, 1, 'trailing comment still checked');
  assert.equal(unpinnedUses('- run: |\n    echo "uses: actions/checkout@v4"\n').length, 0, 'uses inside a run block');
  assert.equal(unpinnedUses('- run: >-\n    uses: actions/checkout@v4\n').length, 0, 'uses inside a folded block');
  // ...and a real step after the block is still seen.
  assert.deepEqual(
    parseActionUses(`- run: |\n    uses: actions/checkout@v4\n- uses: actions/setup-node@v4\n`).map((u) => u.ref),
    ['actions/setup-node@v4'],
  );

  // The rule itself, both directions.
  assert.equal(unpinnedUses(`- uses: actions/checkout@${SHA}\n`).length, 0, 'full SHA is pinned');
  for (const ref of ['actions/checkout@v4', 'actions/checkout@main', 'actions/checkout', `actions/checkout@${SHA}0`, 'actions/checkout@deadbeef']) {
    assert.equal(unpinnedUses(`- uses: ${ref}\n`).length, 1, ref);
  }
  // Out of scope refs stay out of scope.
  for (const ref of ['./.github/actions/local', 'docker://alpine:3.20']) {
    assert.equal(unpinnedUses(`- uses: ${ref}\n`).length, 0, ref);
  }
});
