import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const forbidden = new RegExp(['NODE_TLS_REJECT_UNAUTHORIZED', 'rejectUnauthorized\\s*:\\s*false'].join('|'));

async function sourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const children = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(filename);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [filename] : [];
  }));
  return children.flat();
}

test('API and library code never bypass TLS certificate validation', async () => {
  const files = (await Promise.all(['api', 'lib'].map(dir => sourceFiles(path.join(root, dir))))).flat();
  for (const filename of files) {
    const source = await readFile(filename, 'utf8');
    assert.doesNotMatch(source, forbidden, path.relative(root, filename));
  }
});
