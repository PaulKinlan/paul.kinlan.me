import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

// SCAN SCOPE: every code file in the repository, not a list of directories.
// The previous version scanned only api/ and lib/, so a reintroduced bypass in a
// root runtime file passed green - middleware.ts is Vercel edge runtime code that
// runs in production (paul-kinlan-me-5qh, repro B). A hand-kept list of roots has
// to be kept in step with the tree; walking the tree does not.
//   node_modules     - dependencies, third-party code we do not own or configure
//   dot-directories  - .git, .github, .vscode: VCS and tooling, not runtime code
//   tests            - this guard's own spells and samples live here
const skippedDirs = new Set(['node_modules', 'tests']);
const codeFile = /\.[cm]?[jt]sx?$/;

// A certificate check is only actually disabled by the literal false (or the
// minified !1). Measured here against Node 24 with a self-signed TLS server:
// rejectUnauthorized 0, '0', null and undefined all still FAIL the handshake, so
// flagging those spellings would make this guard wrong, not safe.
// Matching is textual, so a comment that spells a bypass out is flagged too. That
// way round is deliberate: a false alarm is a one-line edit, a missed bypass ships.
const forbidden = [
  // Node reads this variable as the string '0' and disables verification process-wide.
  /NODE_TLS_REJECT_UNAUTHORIZED/,
  // Every spelling of the key: rejectUnauthorized: false, 'rejectUnauthorized': false,
  // "rejectUnauthorized" : false, ['rejectUnauthorized']: false, rejectUnauthorized:!1,
  // options.rejectUnauthorized = false (the reviewed tip missed the quoted,
  // computed and assignment forms - repro A).
  /["'`]?rejectUnauthorized["'`]?\s*\]?\s*[:=]\s*(?:false|!1)\b/,
];

async function sourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const children = await Promise.all(entries.map(async (entry) => {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || skippedDirs.has(entry.name)) return [];
      return sourceFiles(path.join(dir, entry.name));
    }
    return codeFile.test(entry.name) ? [path.join(dir, entry.name)] : [];
  }));
  return children.flat();
}

test('repository code never bypasses TLS certificate validation', async () => {
  const files = await sourceFiles(root);
  const scanned = files.map(file => path.relative(root, file));
  // Controls on the scan itself: a walk that finds nothing, or that stops at the
  // first directory, must fail loudly rather than pass vacuously.
  assert.ok(scanned.some(file => file.startsWith('api/')), 'expected api/ to be scanned');
  assert.ok(scanned.some(file => file.startsWith('lib/')), 'expected lib/ to be scanned');
  assert.ok(scanned.some(file => !file.includes('/')), 'expected root-level code to be scanned');

  for (const filename of files) {
    const source = await readFile(filename, 'utf8');
    for (const pattern of forbidden) {
      assert.doesNotMatch(source, pattern, path.relative(root, filename));
    }
  }
});

test('the guard detects every spelling of a disabled certificate check', () => {
  const bypasses = [
    `{ rejectUnauthorized: false }`,
    `{ 'rejectUnauthorized': false }`,
    `{ "rejectUnauthorized" : false }`,
    `{ ["rejectUnauthorized"]: false }`,
    `new https.Agent({ rejectUnauthorized:!1 })`,
    `options.rejectUnauthorized = false;`,
    `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';`,
  ];
  for (const source of bypasses) {
    assert.ok(forbidden.some(pattern => pattern.test(source)), `not flagged: ${source}`);
  }

  // Controls: these do not disable verification (measured, see above), so the
  // guard must not flag them.
  const safe = [
    `{ rejectUnauthorized: true }`,
    `{ rejectUnauthorized: 0 }`,
    `{ rejectUnauthorized: null }`,
    `{ rejectUnauthorized: process.env.TLS_ALLOW_SELF_SIGNED }`,
    `{ requestCert: true, rejectUnauthorizedHost: false }`,
    `if (options.rejectUnauthorized === false) log('verification is off');`,
  ];
  for (const source of safe) {
    assert.ok(forbidden.every(pattern => !pattern.test(source)), `wrongly flagged: ${source}`);
  }
});
