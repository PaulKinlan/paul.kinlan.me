// Browser-gate selector (paul-kinlan-me-1i3): the fail-closed changed-path ->
// browser-spec mapper the architect verdict on that bead requires.
//
// Nine tests/*.browser.mjs evidence gates existed and nothing executed them. The
// tier this file belongs to fixes that by SELECTING, per delta, exactly the specs
// a change can affect - never by appending Chrome to the fast or full gate (both
// budgets in docs/speed.md are already exceeded; Chrome stays out of both).
//
// Contract (tools/browser-gate/manifest.json is the reviewed declaration):
//
//   1. Every changed path is classified, and classification is total. A path that
//      matches a spec trigger selects that spec; a path that matches an explicit
//      ignore rule is skipped WITH ITS REASON RECORDED (never silently treated as
//      covered); a path that matches NEITHER is an error and the selection FAILS
//      CLOSED (exit 2). A new browser-relevant file therefore cannot slip past
//      this tier: someone must map it to a spec or write down why it needs none.
//   2. Every tests/*.browser.mjs on disk must be a manifest spec key, must exist,
//      and must trigger on itself. Integrity is checked on every invocation, not
//      only by the node-tier test, so deleting/renaming a spec breaks the tier
//      loudly instead of orphaning it.
//   3. The delta is derived from a PINNED MERGE-BASE between two commits
//      (--base/--head), never from working-directory state: the evidence must be
//      about a tree a reviewer can check out, not about whatever was dirty.
//
// Pure module + CLI. No Chrome, no build, no network: this file is safe inside
// the fast-gate-timeout world (tests/browser-gate-select.test.mjs imports it),
// and it is what the CI job and tools/browser-gate.sh both call first.
//
// Usage:
//   node tools/browser-gate/select.mjs                       # merge-base(origin/main, HEAD)..HEAD
//   node tools/browser-gate/select.mjs --base <ref> --head <ref>
//   node tools/browser-gate/select.mjs --files a.js,b.css    # injected delta (tests)
//   node tools/browser-gate/select.mjs --merge-base-with origin/main --head HEAD
//
// Output: one JSON document on stdout (see selectFromFiles for the shape).
// Exit codes: 0 = classified (even when nothing is selected); 2 = fail-closed
// (unmapped path or integrity violation); 1 = usage/git error.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MANIFEST_RELPATH = join('tools', 'browser-gate', 'manifest.json');

// ---------------------------------------------------------------------------
// Glob matching. Deliberately hand-rolled (~25 lines): tests/deps-pins.test.mjs
// guards the dependency tree, so this tier adds no minimatch/picomatch dep.
// Semantics (repo-relative paths, '/' separated):
//   **/  zero or more whole segments ("a/**/b" matches "a/b" and "a/x/y/b")
//   /**  at the end: one or more segments below ("tools/x/**" matches
//        "tools/x/run.mjs" and deeper, not the directory itself)
//   *    within a segment: any run of characters except '/'
//   ?    within a segment: exactly one character except '/'
// Everything else is literal. Anchored at both ends.
// ---------------------------------------------------------------------------
export function globToRegexSource(pattern) {
  let source = '^';
  let i = 0;
  while (i < pattern.length) {
    if (pattern.startsWith('**/', i)) {
      source += '(?:[^/]+/)*';
      i += 3;
      continue;
    }
    if (pattern.startsWith('**', i) && i === pattern.length - 2) {
      // Trailing '**': one or more segments below the prefix (or any path at all
      // when the pattern is exactly '**').
      source += '(?:[^/]+/)*[^/]+';
      i += 2;
      continue;
    }
    if (pattern.startsWith('**', i)) {
      source += '[^/]*'; // '**' not delimited as its own segment behaves like '*'
      i += 2;
      continue;
    }
    const ch = pattern[i];
    if (ch === '*') source += '[^/]*';
    else if (ch === '?') source += '[^/]';
    else source += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    i += 1;
  }
  return `${source}$`;
}

// Compiling a RegExp per match is the selector's only real cost (a delta walks
// every spec's triggers). Memoise pattern -> RegExp: patterns are few and fixed
// per manifest, so this turns a repeated ~0.7ms compile into a map hit and keeps
// the fast-gate node tests well inside budget.
const regexCache = new Map();
function regexFor(pattern) {
  let re = regexCache.get(pattern);
  if (!re) {
    re = new RegExp(globToRegexSource(pattern));
    regexCache.set(pattern, re);
  }
  return re;
}

export function matchGlob(pattern, path) {
  return regexFor(pattern).test(path);
}

// ---------------------------------------------------------------------------
// Manifest loading + integrity. Integrity runs on EVERY invocation (CLI, runner,
// CI) because a silently orphaned spec is the exact defect this tier exists to
// end.
// ---------------------------------------------------------------------------
export function loadManifest(repoRoot) {
  const file = join(repoRoot, MANIFEST_RELPATH);
  if (!existsSync(file)) {
    throw Object.assign(new Error(`browser-gate manifest missing: ${file}`), { integrity: true });
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function browserSpecsOnDisk(repoRoot) {
  return readdirSync(join(repoRoot, 'tests'))
    .filter((name) => name.endsWith('.browser.mjs'))
    .map((name) => `tests/${name}`)
    .sort();
}

// Returns a list of human-readable integrity errors ([] = healthy).
export function integrityErrors(manifest, repoRoot) {
  const errors = [];
  const specs = manifest.specs ?? {};
  const onDisk = browserSpecsOnDisk(repoRoot);
  for (const spec of onDisk) {
    if (!(spec in specs)) {
      errors.push(`browser spec ${spec} is not a key in ${MANIFEST_RELPATH}: map it (triggers must include itself) or the tier cannot select it`);
    }
  }
  for (const [spec, def] of Object.entries(specs)) {
    if (!existsSync(join(repoRoot, spec))) {
      errors.push(`manifest names spec ${spec} which does not exist on disk (renamed or deleted without updating ${MANIFEST_RELPATH})`);
    }
    const triggers = expandTriggers(manifest, spec, def);
    if (!triggers.includes(spec)) {
      errors.push(`manifest spec ${spec} does not trigger on itself: a change to the spec must re-run it`);
    }
    if (!(Number.isFinite(def.timeoutSec) && def.timeoutSec > 0 && def.timeoutSec <= 1800)) {
      errors.push(`manifest spec ${spec} has no sane timeoutSec (0 < t <= 1800)`);
    }
  }
  for (const group of Object.keys(manifest.shared ?? {})) {
    for (const [spec, def] of Object.entries(specs)) {
      for (const ref of def.shared ?? []) {
        if (ref === group && !(manifest.shared[group].length > 0)) {
          errors.push(`shared trigger group "${group}" referenced by ${spec} is empty`);
        }
      }
    }
  }
  if (!Array.isArray(manifest.ciPaths) || manifest.ciPaths.length === 0) {
    errors.push(`manifest ciPaths is missing or empty: the workflow path filter is pinned from it`);
  }
  return errors;
}

// A spec's full trigger list: its own patterns plus the shared groups it refs
// (e.g. "site" = every built-site input, "deps" = the lockfile pair, "runner" =
// this tier's own files). Shared groups exist so the fan-out is declared ONCE
// and reviewed as one list, per the architect's shared-input rule.
export function expandTriggers(manifest, spec, def) {
  const own = def?.triggers ?? [];
  const shared = (def?.shared ?? []).flatMap((name) => manifest.shared?.[name] ?? []);
  return [...new Set([...own, ...shared])];
}

// ---------------------------------------------------------------------------
// Classification. Order matters: triggers WIN over ignores (a pinned content
// page must select its spec even though content/** is an ignored surface).
// ---------------------------------------------------------------------------
export function classifyPath(path, manifest) {
  const specs = manifest.specs ?? {};
  const selected = [];
  for (const [spec, def] of Object.entries(specs)) {
    if (expandTriggers(manifest, spec, def).some((pattern) => matchGlob(pattern, path))) {
      selected.push(spec);
    }
  }
  if (selected.length > 0) return { kind: 'select', specs: selected.sort() };
  for (const rule of manifest.ignore ?? []) {
    if ((rule.paths ?? []).some((pattern) => matchGlob(pattern, path))) {
      return { kind: 'ignore', reason: rule.reason };
    }
  }
  return { kind: 'unmapped' };
}

// The selection document (also what --json prints and what run.mjs consumes):
//   { selected: [{spec, siteCoupled, timeoutSec, why: [paths]}],
//     skipped:  [{path, reason}],
//     unmapped: [paths],            // non-empty => fail closed
//     integrity: [errors] }         // non-empty => fail closed
export function selectFromFiles(files, manifest, repoRoot) {
  const integrity = integrityErrors(manifest, repoRoot);
  const whyBySpec = new Map();
  const skipped = [];
  const unmapped = [];
  for (const file of files) {
    const verdict = classifyPath(file, manifest);
    if (verdict.kind === 'select') {
      for (const spec of verdict.specs) {
        if (!whyBySpec.has(spec)) whyBySpec.set(spec, []);
        whyBySpec.get(spec).push(file);
      }
    } else if (verdict.kind === 'ignore') {
      skipped.push({ path: file, reason: verdict.reason });
    } else {
      unmapped.push(file);
    }
  }
  const selected = [...whyBySpec.keys()].sort().map((spec) => ({
    spec,
    siteCoupled: Boolean(manifest.specs[spec]?.siteCoupled),
    timeoutSec: manifest.specs[spec]?.timeoutSec ?? 300,
    why: whyBySpec.get(spec).sort(),
  }));
  return { selected, skipped: skipped.sort((a, b) => a.path.localeCompare(b.path)), unmapped: unmapped.sort(), integrity };
}

export function selectionFailed(selection) {
  return selection.integrity.length > 0 || selection.unmapped.length > 0;
}

// ---------------------------------------------------------------------------
// Git delta: pinned merge-base between two commits, never the working tree.
// ---------------------------------------------------------------------------
function git(repoRoot, args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', timeout: 60_000 }).trim();
}

export function changedFiles(repoRoot, base, head) {
  // No --diff-filter: deletions count too. Deleting static/css/material.css is a
  // browser-relevant change and must select (and fail) its spec, not vanish.
  return git(repoRoot, ['diff', '--name-only', base, head])
    .split('\n')
    .filter(Boolean);
}

export function resolveMergeBase(repoRoot, ref, head) {
  return git(repoRoot, ['merge-base', ref, head]);
}

export function resolveSha(repoRoot, ref) {
  return git(repoRoot, ['rev-parse', '--verify', `${ref}^{commit}`]);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
function argValue(args, flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
}

export function main(argv = process.argv.slice(2)) {
  // Default repo root = the checkout this script lives in (tools/browser-gate/../..),
  // so the selector reads the manifest that belongs to the tree it selects for.
  const root = argValue(argv, '--repo')
    ? join(process.cwd(), argValue(argv, '--repo'))
    : fileURLToPath(new URL('../..', import.meta.url));

  let manifest;
  try {
    manifest = loadManifest(root);
  } catch (error) {
    console.error(`browser-gate: ${error.message}`);
    return 1;
  }

  const filesArg = argValue(argv, '--files');
  let files;
  let base = null;
  let head = null;
  if (filesArg) {
    files = filesArg.split(',').map((f) => f.trim()).filter(Boolean);
  } else {
    try {
      head = resolveSha(root, argValue(argv, '--head') ?? 'HEAD');
      const baseRef = argValue(argv, '--base');
      const mbRef = argValue(argv, '--merge-base-with') ?? (baseRef ? null : 'origin/main');
      base = baseRef ? resolveSha(root, baseRef) : resolveMergeBase(root, mbRef, head);
      files = changedFiles(root, base, head);
    } catch (error) {
      console.error(`browser-gate: cannot derive the delta: ${error.message?.split('\n')[0] ?? error}`);
      console.error('browser-gate: pass --base/--head explicitly (both must be commits; the delta is pinned, never the working tree)');
      return 1;
    }
  }

  const selection = selectFromFiles(files, manifest, root);
  const out = { ...selection, base, head, files };
  console.log(JSON.stringify(out, null, 2));

  if (selection.integrity.length > 0) {
    for (const e of selection.integrity) console.error(`browser-gate: INTEGRITY: ${e}`);
    return 2;
  }
  if (selection.unmapped.length > 0) {
    for (const p of selection.unmapped) {
      console.error(`browser-gate: UNMAPPED: ${p} matches no spec trigger and no explicit ignore rule in ${MANIFEST_RELPATH}`);
    }
    console.error('browser-gate: fail closed. Map the path to a spec, or add an ignore rule WITH A REASON, then re-run.');
    return 2;
  }
  if (selection.selected.length === 0) {
    console.error(`browser-gate: no browser spec selected (${selection.skipped.length} path(s) explicitly out of scope)`);
  }
  return 0;
}

// Act as a CLI only when invoked directly (node .../select.mjs), not when
// imported by run.mjs or the tests.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
