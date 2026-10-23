// Published tutorials must not ship copy-pasteable code that disables TLS
// verification.
//
// Why this test exists: the ActivityPub tutorial carried
// `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` in two fenced samples
// (content/2022-12-16-adding-activitypub-to-your-static-site.md, inbox.ts and
// sendNote.ts). The assignment is process-wide: every connection the reader's
// server makes skips certificate checking, not just the one being debugged.
// The lines are gone (paul-kinlan-me-9sd) and the post now explains in prose
// why they must stay gone - so the contract here is deliberately about fenced
// code blocks, the part readers copy and run. Prose may name the variable in
// order to warn about it; a code sample may not set it.
//
// Fast tier: no browser, no network, no shared state - it reads only the
// content tree in this repo, so the file is order-independent.
import test from 'node:test';
import assert from 'node:assert/strict';

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT_DIR = fileURLToPath(new URL('../content/', import.meta.url));
const MARKER = 'NODE_TLS_REJECT_UNAUTHORIZED';

// Code fences are the executable part of a tutorial: everything between a
// line starting with ``` and the next such line. Prose and inline spans stay
// out of the check on purpose - warning prose has to be able to name the
// variable it forbids.
const fences = (text) => text.match(/^```[^\n]*\n(?:[^\n]*\n)*?^```/gm) ?? [];

const offenders = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (/\.(md|html)$/.test(entry.name) && fences(readFileSync(path, 'utf8')).some((block) => block.includes(MARKER))) {
      offenders.push(path);
    }
  }
};
walk(CONTENT_DIR);

test('no tutorial code sample sets NODE_TLS_REJECT_UNAUTHORIZED', () => {
  assert.deepEqual(
    offenders.map((p) => p.slice(CONTENT_DIR.length)),
    []
  );
});
