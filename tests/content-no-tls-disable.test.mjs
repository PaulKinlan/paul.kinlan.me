// Published tutorials must not ship copy-pasteable code that disables TLS
// verification.
//
// Why this test exists: the ActivityPub tutorial carried
// `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` in two code samples
// (content/2022-12-16-adding-activitypub-to-your-static-site.md, inbox.ts and
// sendNote.ts). The assignment is process-wide: every connection the reader's
// server makes skips certificate checking, not just the one being debugged.
// The lines are gone (paul-kinlan-me-9sd) and the post now explains in prose
// why they must stay gone.
//
// Coverage contract (paul-kinlan-me-54l, paul-kinlan-me-ywm): the guard
// classifies text the way Hugo's renderer does - what renders as preformatted
// code is a code sample, whatever syntax produced it. That is:
//   - closed fences, ``` and ~~~, paired by marker (54l);
//   - an UNCLOSED fence: goldmark still renders it as code to EOF (ywm);
//   - raw <pre>...</pre> HTML blocks - 36 corpus files already publish code
//     this way (ywm);
//   - 4-space-indented blocks outside fences (ywm).
// The offense shape is an ASSIGNMENT to the variable inside such a region -
// plain (`X = '0'`) or bracket-quoted (`env["X"] = '0'`). Mentions in prose,
// inline spans, comments and `==` comparisons cannot turn TLS verification
// off, and the landed warning prose has to stay publishable.
//
// Fast tier: no browser, no network, no shared state. The real-content scan
// walks ~830 small files (~20ms, measured on the beads); the fixture test
// builds its own tmpdir and reads nothing shared.
import test from 'node:test';
import assert from 'node:assert/strict';

import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT_DIR = fileURLToPath(new URL('../content/', import.meta.url));
const MARKER = 'NODE_TLS_REJECT_UNAUTHORIZED';

// Authored content extensions in this repo (59 *.md, 733 *.markdown, 9 *.html
// at the time of writing). Anything else in content/ is not reader-facing
// markdown and stays out of the scan.
const CONTENT_FILE = /\.(md|markdown|html)$/;

// Raw HTML preformatted blocks: <pre> through its closing tag, case-insensitive.
const PRE_BLOCK = /<pre[^>]*>[\s\S]*?<\/pre>/gi;

// Assignment to the variable inside a code region. Between the name and `=`
// only closing quotes/brackets may appear (bracket-notation access), and `==`
// is a comparison, not an assignment.
const ASSIGNMENT = new RegExp(`${MARKER}[\\]'\"]*\\s*=(?!=)`);

// Code regions the way the renderer sees them: <pre> blocks, fence bodies
// (an unclosed fence runs to EOF, exactly like goldmark renders it), and
// 4-space-indented runs outside fences. Prose and inline spans never land in
// a region, which is what keeps the warning prose publishable.
const codeRegions = (text) => {
  const regions = [];
  for (const match of text.matchAll(PRE_BLOCK)) regions.push(match[0]);

  let openMark = null;
  let body = [];
  let indented = [];
  const flushIndented = () => {
    if (indented.length) {
      regions.push(indented.join('\n'));
      indented = [];
    }
  };
  for (const line of text.split('\n')) {
    const open = line.match(/^(```|~~~)/);
    if (openMark) {
      body.push(line);
      if (open && open[1] === openMark) {
        regions.push(body.join('\n'));
        body = [];
        openMark = null;
      }
      continue;
    }
    if (open) {
      flushIndented();
      openMark = open[1];
      body = [line];
      continue;
    }
    if (/^ {4}/.test(line)) {
      indented.push(line);
      continue;
    }
    flushIndented();
  }
  // A fence still open at EOF is rendered as code to EOF, not discarded.
  if (openMark) regions.push(body.join('\n'));
  flushIndented();
  return regions;
};

const offendersIn = (dir) => {
  const offenders = [];
  const walk = (root) => {
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      const path = join(root, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (CONTENT_FILE.test(entry.name) && codeRegions(readFileSync(path, 'utf8')).some((region) => ASSIGNMENT.test(region))) {
        offenders.push(path);
      }
    }
  };
  walk(dir);
  return offenders;
};

const rel = (dir, path) => path.slice(dir.length).replace(/^\//, '');

test('no tutorial code sample sets NODE_TLS_REJECT_UNAUTHORIZED (whole content corpus)', () => {
  assert.deepEqual(offendersIn(CONTENT_DIR).map((p) => rel(CONTENT_DIR, p)), []);
});

test('the guard fails on every renderer-visible code shape that sets the variable (fixture)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tls-guard-fixture-'));
  try {
    writeFileSync(
      join(dir, 'unsafe-closed.markdown'),
      'A post.\n\n```typescript\nprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n```\n'
    );
    writeFileSync(
      join(dir, 'unsafe-tilde.markdown'),
      'A post.\n\n~~~typescript\nprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n~~~\n'
    );
    writeFileSync(
      join(dir, 'unsafe-unclosed.markdown'),
      'A post.\n\n```javascript\nprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n'
    );
    writeFileSync(
      join(dir, 'unsafe-pre.markdown'),
      'A post.\n\n<pre><code>process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';</code></pre>\n'
    );
    writeFileSync(
      join(dir, 'unsafe-bracket.markdown'),
      'A post.\n\n```javascript\nprocess.env["NODE_TLS_REJECT_UNAUTHORIZED"] = \'0\';\n```\n'
    );
    writeFileSync(
      join(dir, 'unsafe-indented.markdown'),
      'A post.\n\ne.g.:\n\n    process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n'
    );
    writeFileSync(
      join(dir, 'unsafe.md'),
      'A post.\n\n```\nprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n```\n'
    );
    // The warning case: prose and inline spans naming the variable are how the
    // landed tutorial documents why the bypass is gone. Not code, not an offer.
    writeFileSync(
      join(dir, 'warning-prose.markdown'),
      'Older versions set `process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\'`, which was wrong. Never do that.\n'
    );
    // Mentions and comparisons inside code cannot disable verification.
    writeFileSync(
      join(dir, 'mentions-only.markdown'),
      'A post.\n\n```\n// NODE_TLS_REJECT_UNAUTHORIZED must stay untouched\nif (process.env.NODE_TLS_REJECT_UNAUTHORIZED == "1") console.log("ok");\n```\n'
    );
    // Non-content extensions are not part of the published-corpus contract.
    writeFileSync(join(dir, 'notes.txt'), 'process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n');

    assert.deepEqual(
      offendersIn(dir).map((p) => rel(dir, p)).sort(),
      [
        'unsafe-bracket.markdown',
        'unsafe-closed.markdown',
        'unsafe-indented.markdown',
        'unsafe-pre.markdown',
        'unsafe-tilde.markdown',
        'unsafe-unclosed.markdown',
        'unsafe.md'
      ]
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
