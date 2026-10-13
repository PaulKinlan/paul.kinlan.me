// Guard for bead paul-kinlan-me-wak: `guessSyntax` (and, before that, the whole
// Pygments palette) was written *after* the `[pagination]` table header in
// config.toml. TOML files every key that follows a table header under that table,
// so Hugo never saw them - `hugo config` printed
// `pagination = map[pagersize:20 pygmentscodefences:true
// pygmentscodefencesguesssyntax:true pygmentsstyle:monokai]` and no
// `markup.highlight` at all. The site then rendered Hugo's unconfigured default
// palette, and every unlabelled fence fell through to Tailwind Typography's light
// `pre` instead of the dark highlighted block.
//
// The property that has to hold is not "the keys are in the file" - they were, and
// they did nothing. It is "the keys reach Hugo", so this test asks Hugo, through
// `hugo config`, rather than re-reading config.toml with a parser of our own (a
// hand-rolled section walker would have to reproduce the exact TOML nesting rule
// that bit us, and would keep passing if it got that rule wrong). `hugo config`
// prints the *applied* configuration - defaults merged with config.toml - so it is
// also the only form of the question that can tell a default from an override.
//
// It costs one `hugo config` invocation (~0.12s, no build, no browser). The output
// is Go's `%v` map print, which is not a format anything can be parsed out of in
// general (map values are unquoted, so `name:Paul Kinlan]` has no delimiter), so
// this test reads the one top-level line it needs and the one nested segment in
// it, by bracket matching, and checks for whole key names (`guesssyntax:`) rather
// than parsing entries. Every check first proves the thing it inspects was found,
// so a future Hugo that changes the debug output fails here with the raw line in
// the message instead of passing vacuously.
//
// The values pinned are the two the bead decided: the palette stays in
// [markup.highlight] (its contrast is measured by tests/chroma-contrast.test.mjs,
// a different property and a separate test), and guessing is on. Guessing is on
// because, measured over this content, it cannot guess anything wrong: all 38
// unlabelled fences analyse to Chroma's fallback lexer, so the key only gives them
// the same dark block every labelled fence gets.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// The binary the gate's own build step uses (npm run build -> hugo).
const HUGO = join(ROOT, 'node_modules', '.bin', 'hugo');

// Key names that lived under [pagination] only because of the nesting mistake.
// None of them belongs to that table, so finding any of them in it is the bug,
// whatever else the file says.
const NEVER_UNDER_PAGINATION = [
  'pygmentscodefences:',
  'pygmentscodefencesguesssyntax:',
  'pygmentsstyle:',
  'defaultcontentlanguage:',
  'defaultcontentlanguagesubdir:',
  'defaultcontentlanguageinsubdir:',
];

const output = execFileSync(HUGO, ['config'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

/** The applied configuration's top-level keys, mapped to the raw printed value. */
const topLevel = new Map();
for (const line of output.split('\n')) {
  const eq = line.indexOf(' = ');
  if (eq === -1 || !/^[a-z0-9]+$/.test(line.slice(0, eq))) continue;
  topLevel.set(line.slice(0, eq), line.slice(eq + 3));
}

/** The top-level value for `key`, proving it exists and is a non-empty `map[...]`. */
function appliedTable(key) {
  const line = topLevel.get(key);
  assert.ok(
    line !== undefined,
    `hugo config has no top-level "${key}"; its output format may have changed:\n${output.slice(0, 400)}`,
  );
  assert.ok(line.startsWith('map['), `"${key}" is not a table Hugo printed: ${line}`);
  return line;
}

/** The text inside `key:map[...]` in `line`, by bracket matching. */
function nestedMapContents(line, key) {
  const at = line.indexOf(`${key}:map[`);
  assert.ok(
    at !== -1,
    `hugo config has no "${key}" table here: ${line}\n(keys nested under another table header do not appear at all - that is the bug this guards)`,
  );
  const start = at + key.length + 5;
  let depth = 0;
  for (let i = start; i < line.length; i += 1) {
    if (line[i] === '[') depth += 1;
    if (line[i] === ']') {
      if (depth === 0) return line.slice(start, i);
      depth -= 1;
    }
  }
  assert.fail(`unbalanced map in hugo config output: ${line.slice(at, at + 200)}`);
}

test('Hugo applies [markup.highlight] style and guessSyntax', () => {
  const highlight = nestedMapContents(appliedTable('markup'), 'highlight');
  // The keys must be entries of this table, not of a table nested inside it, and
  // the same mistake one level deeper is silent in exactly the same way.
  assert.ok(!highlight.includes('map['), `[markup.highlight] has a nested table; its keys are not entries of it: ${highlight}`);
  assert.ok(
    highlight.includes('style:github-dark'),
    `the code-block palette must be read from [markup.highlight], not a nested-away table: ${highlight}`,
  );
  assert.ok(
    highlight.includes('guesssyntax:true'),
    `without [markup.highlight] guessSyntax, unlabelled fences keep Tailwind Typography's light pre (background #f9fafb, text #111827) while every labelled fence is a dark github-dark block: ${highlight}`,
  );
});

test('no configuration key is filed under the [pagination] table', () => {
  const pagination = appliedTable('pagination');
  // Proves the line is the real table before the stray-key check can pass vacuously.
  assert.ok(pagination.includes('pagersize:'), `the printed pagination table is not Hugo's: ${pagination}`);
  assert.deepEqual(
    NEVER_UNDER_PAGINATION.filter((key) => pagination.includes(key)),
    [],
    `a key in this list follows a table header it does not belong to, so TOML files it under [pagination] and Hugo ignores it: ${pagination}`,
  );
  // The other half of the same mistake: these are site-level keys and must be read
  // from the top level of the file.
  for (const key of ['defaultcontentlanguage', 'defaultcontentlanguageinsubdir']) {
    assert.ok(topLevel.has(key), `${key} must be a top-level key, not filed under a table header`);
  }
});
