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

function isPatchedFollowRedirects(version) {
  const match = /^\^?(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '');
  if (!match) return false;
  const [major, minor, patch] = match.slice(1).map(Number);
  return major > 1 || (major === 1 && (minor > 15 || (minor === 15 && patch >= 12)));
}

test('follow-redirects version boundary rejects the vulnerable 1.15 patch line', () => {
  for (const version of ['1.15.2', '^1.15.2', '1.15.11', '1.14.99', '1.15', 'not-a-version']) {
    assert.equal(isPatchedFollowRedirects(version), false, version);
  }
  for (const version of ['1.15.12', '^1.15.12', '1.16.0', '1.16.1', '2.0.0']) {
    assert.equal(isPatchedFollowRedirects(version), true, version);
  }
});

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
  assert.ok(isPatchedFollowRedirects(fr), `follow-redirects override >= 1.15.12, got ${fr}`);
  assert.ok(pkg.overrides?.['form-data']?.startsWith('^4.'), 'form-data override to patched 4.x');
});

test('lockfile resolves the patched chain under openai 3.2.1', () => {
  const axios = lock.packages['node_modules/axios'];
  assert.ok(axios.version.startsWith('1.'), `axios in lockfile is 1.x, got ${axios.version}`);
  const fr = lock.packages['node_modules/follow-redirects'];
  assert.ok(isPatchedFollowRedirects(fr.version), `follow-redirects >= 1.15.12, got ${fr.version}`);
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
  assert.ok(isPatchedFollowRedirects(fr.version), `installed follow-redirects >= 1.15.12, got ${fr.version}`);
});
