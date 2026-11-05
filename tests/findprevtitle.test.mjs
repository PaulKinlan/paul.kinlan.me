// Regression tests for findprevtitle.py shell injection (paul-kinlan-me-9i45):
// Guards findprevtitle.py against shell=True command injection and ensures safe
// argument passing to git log.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const source = readFileSync(new URL('../findprevtitle.py', import.meta.url), 'utf8');

test('findprevtitle.py never uses shell=True', () => {
  assert.equal(source.includes('shell=True'), false, 'shell=True must not be used');
});

test('findprevtitle.py wraps main execution in __name__ == "__main__"', () => {
  assert.match(source, /if\s+__name__\s*==\s*['"]__main__['"]:/, 'top-level loop must be guarded by __main__');
});

test('findprevtitle.py imports cleanly without running file modifications', () => {
  const output = execFileSync('python3', [
    '-c',
    'import findprevtitle; assert callable(findprevtitle.get_previous_yaml_title); assert callable(findprevtitle.update_post_title); print("OK")',
  ], { encoding: 'utf8' });
  assert.equal(output.trim(), 'OK');
});

test('get_previous_yaml_title extracts title from git history without shell execution', () => {
  const output = execFileSync('python3', [
    '-c',
    `
import findprevtitle
title = findprevtitle.get_previous_yaml_title('content/2024-11-06-user-agents-hitting-my-site.md')
assert title == 'User Agents Hitting My Site', f'Unexpected title: {title}'
print("MATCH")
    `,
  ], { encoding: 'utf8' });
  assert.equal(output.trim(), 'MATCH');
});

test('get_previous_yaml_title safely handles filenames with shell metacharacters', () => {
  const markerPath = '/tmp/findprevtitle_injection_marker.txt';
  const output = execFileSync('python3', [
    '-c',
    `
import os, findprevtitle
marker = '${markerPath}'
if os.path.exists(marker): os.unlink(marker)
hostile_path = 'content/test;touch ' + marker + ';.md'
result = findprevtitle.get_previous_yaml_title(hostile_path)
assert result is None, f'Expected None for nonexistent hostile file, got {result}'
print("SAFE")
    `,
  ], { encoding: 'utf8' });
  assert.equal(output.trim(), 'SAFE');
  assert.equal(existsSync(markerPath), false, 'shell command must not have executed');
});
