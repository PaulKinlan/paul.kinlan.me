// Published tutorials must not ship copy-pasteable code that disables TLS
// verification.
//
// Why this test exists: the ActivityPub tutorial carried
// `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` in two fenced samples
// (content/2022-12-16-adding-activitypub-to-your-static-site.md, inbox.ts and
// sendNote.ts). The assignment is process-wide: every connection the reader's
// server makes skips certificate checking, not just the one being debugged.
// The lines are gone (paul-kinlan-me-9sd) and the post now explains in prose
// why they must stay gone.
//
// Coverage contract (paul-kinlan-me-54l): the first cut of this guard only
// read *.md and *.html, but 733 of the 801 authored content files here are
// *.markdown - a false green across 91% of the corpus. So: every authored
// content extension is scanned, and fence detection understands both ``` and
// ~~~ fence markers. Prose and inline code spans stay out of the check on
// purpose - warning prose has to be able to name the variable it forbids; a
// fenced code sample may not set it.
//
// Fast tier: no browser, no network, no shared state. The real-content scan
// walks ~800 small files (tens of ms, measured on the bead); the fixture test
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

// A fenced block: opened by a line starting with ``` or ~~~ (optionally with
// an info string), closed by the next line starting with the same marker.
// The backreference keeps the pair honest - a ``` line inside a ~~~ block is
// content, not a closer, and vice versa.
const FENCE = /^(```|~~~)[^\n]*\n(?:[^\n]*\n)*?^\1/gm;

// The harmful shape is an assignment in copy-pasteable code: any mention
// without `=` (a comment, a log line) cannot turn TLS verification off.
const FENCE_ASSIGNMENT = new RegExp(`${MARKER}\\s*=`);

const fences = (text) => text.match(FENCE) ?? [];

const offendersIn = (dir) => {
  const offenders = [];
  const walk = (root) => {
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      const path = join(root, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (CONTENT_FILE.test(entry.name) && fences(readFileSync(path, 'utf8')).some((block) => FENCE_ASSIGNMENT.test(block))) {
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

test('the guard fails on unsafe guidance in *.markdown, ~~~ fences, and *.md alike (fixture)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tls-guard-fixture-'));
  try {
    writeFileSync(
      join(dir, 'unsafe.markdown'),
      'A post.\n\n```typescript\nprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n```\n'
    );
    writeFileSync(
      join(dir, 'unsafe-tilde.markdown'),
      'A post.\n\n~~~typescript\nprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n~~~\n'
    );
    writeFileSync(
      join(dir, 'unsafe.md'),
      'A post.\n\n```\nprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n```\n'
    );
    // Prose and inline spans are the warning case, not the copy-paste case:
    // the post that documents why the bypass is gone must stay publishable.
    writeFileSync(
      join(dir, 'warning-prose.markdown'),
      'Older versions set `process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\'`, which was wrong. Never do that.\n'
    );
    // A fence that merely mentions the variable without assigning it is fine.
    writeFileSync(
      join(dir, 'mentions-only.markdown'),
      'A post.\n\n```\n// NODE_TLS_REJECT_UNAUTHORIZED must stay untouched\nconsole.log("ok");\n```\n\nAnd prose after the fence can still name it: `NODE_TLS_REJECT_UNAUTHORIZED`.\n'
    );
    // Non-content extensions are not part of the published-corpus contract.
    writeFileSync(join(dir, 'notes.txt'), 'process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\';\n');

    assert.deepEqual(
      offendersIn(dir).map((p) => rel(dir, p)).sort(),
      ['unsafe-tilde.markdown', 'unsafe.markdown', 'unsafe.md']
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
