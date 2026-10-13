// Guard for bead paul-kinlan-me-ajt: the /polymath production chain must never
// float back to wildcard specs or the vulnerable axios/follow-redirects/form-data
// versions. Reads only committed files (package.json, package-lock.json), plus
// node_modules when present, so it is order-independent and never red on a
// machine that has not installed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));

test('@polymath-ai/* direct dependencies are pinned, not wildcards', () => {
  assert.equal(pkg.dependencies['@polymath-ai/client'], '^1.1.2');
  assert.equal(pkg.dependencies['@polymath-ai/host'], '^0.0.2');
  for (const dep of Object.values(pkg.dependencies)) {
    assert.notEqual(dep, '*', 'no wildcard dependency specs allowed');
  }
});

test('overrides force the patched network chain', () => {
  assert.ok(pkg.overrides?.axios?.startsWith('^1.'), 'axios override to ^1.x');
  const fr = pkg.overrides?.['follow-redirects'];
  assert.ok(fr, 'follow-redirects override present');
  assert.ok(parseInt(fr.replace(/^\^/, '').split('.')[1], 10) >= 15 || parseInt(fr.replace(/^\^/, '').split('.')[0], 10) > 1, 'follow-redirects >= 1.15.12 line');
  assert.ok(pkg.overrides?.['form-data']?.startsWith('^4.'), 'form-data override to patched 4.x');
});

test('lockfile resolves the patched chain under openai 3.2.1', () => {
  const axios = lock.packages['node_modules/axios'];
  assert.ok(axios.version.startsWith('1.'), `axios in lockfile is 1.x, got ${axios.version}`);
  const fr = lock.packages['node_modules/follow-redirects'];
  const [frMaj, frMin] = fr.version.split('.').map(Number);
  assert.ok(frMaj > 1 || (frMaj === 1 && frMin >= 15), `follow-redirects >= 1.15.12, got ${fr.version}`);
  const fd = lock.packages['node_modules/form-data'];
  assert.ok(fd.version >= '4.0.6', `form-data >= 4.0.6, got ${fd.version}`);
  // host's wildcard transitive deps stay pinned by the override
  assert.equal(lock.packages['node_modules/@polymath-ai/types'].version, '2.0.0');
  assert.equal(lock.packages['node_modules/@polymath-ai/validation'].version, '2.0.0');
});

test('installed node_modules matches the pins (skipped when not installed)', { skip: !existsSync(new URL('../node_modules/axios', import.meta.url)) }, () => {
  const axios = JSON.parse(readFileSync(new URL('../node_modules/axios/package.json', import.meta.url), 'utf8'));
  assert.ok(axios.version.startsWith('1.'), `installed axios is 1.x, got ${axios.version}`);
  const fr = JSON.parse(readFileSync(new URL('../node_modules/follow-redirects/package.json', import.meta.url), 'utf8'));
  const [frMaj, frMin] = fr.version.split('.').map(Number);
  assert.ok(frMaj > 1 || (frMaj === 1 && frMin >= 15), `installed follow-redirects >= 1.15.12, got ${fr.version}`);
});
