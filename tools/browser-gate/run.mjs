// Browser-gate runner (paul-kinlan-me-1i3): executes the specs the selector
// chose, serially, under one per-VM browser lease, each with its own hard
// timeout and process-group kill, against a single freshly-built site tree, and
// into a unique evidence directory that survives the run.
//
// This is the tier the architect verdict on the bead specified. It is INVOKED,
// it does not gate anything by itself:
//   - .github/workflows/browser-gate.yml runs it on each changed tip (and a
//     nightly --all sweep), path-filtered by manifest ciPaths;
//   - tools/browser-gate.sh wraps it in flock (the one-Chrome-at-a-time lease);
//   - a human runs `bash tools/browser-gate.sh --base origin/main` by hand.
//
// It NEVER runs inside tools/fast-gate.sh or CHECK_CMD. Chrome stays out of
// both budgets (docs/speed.md); this is a separate, change-triggered tier.
//
// Design rules this file enforces (all from the bead):
//   1. SERIAL. One spec at a time; the flock lease in the wrapper guarantees one
//      Chrome per VM. No parallel browser processes, ever.
//   2. BOUNDED. Each spec runs under its manifest timeoutSec with a
//      process-group SIGKILL on expiry, so a hung Chrome cannot outlive the run
//      (the reaper's "browsers older than 45 min" never sees ours).
//   3. ONE BUILD. If any selected spec is siteCoupled, `npm run build` runs ONCE
//      for this tree and every site-coupled spec gets the SAME SITE_DIR - never
//      an older public/.
//   4. ISOLATED EVIDENCE. Each run gets a unique dir (mkdtemp); BROWSER_GATE_-
//      EVIDENCE_DIR is exported so specs write screenshots/logs there instead of
//      the fixed /tmp names that used to overwrite each other. The dir is NOT
//      deleted: evidence outlives the run.
//   5. CACHE KEY BINDS EVERYTHING. A PASS is cached under a key of: git tree +
//      exact runner/selector/evidence source + selected spec list + full manifest
//      content + puppeteer + Chrome build id + node version. Change any of them
//      and the key changes, so a stale PASS can never be replayed. --no-cache
//      forces a real run; a nightly --all always misses (different selection).
//
// Exit codes: 0 = all selected specs passed (or nothing selected, or cache hit);
// 1 = a spec failed/timed out, the build failed, or fail-closed selection;
// 2 = usage/environment error.
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadManifest,
  selectFromFiles,
  selectionFailed,
  changedFiles,
  resolveMergeBase,
  resolveSha,
  integrityErrors,
} from './select.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = resolve(here, '..', '..');

function argValue(argv, flag) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : null;
}
function hasFlag(argv, flag) {
  return argv.includes(flag);
}

// ---------------------------------------------------------------------------
// Runtime fingerprint for the cache key. Everything here is a thing that, if it
// changed, could change a spec's verdict - so all of it is in the key.
// ---------------------------------------------------------------------------
function sha(text) {
  return createHash('sha256').update(text).digest('hex');
}
function fileSha(path) {
  return existsSync(path) ? sha(readFileSync(path, 'utf8')) : 'missing';
}

export function chromeBuildId(repoRoot) {
  // CHEAP on purpose. We must NOT require('puppeteer') here: its executablePath()
  // resolves and verifies an installed browser build, which measured ~15s and
  // would land inside the fast gate (these functions are imported by the node
  // tests). The puppeteer package version already pins the exact Chrome-for-
  // Testing build, and that version is a separate fingerprint field; here we
  // only best-effort read an installed browser's build id from the cache dir
  // name (a readdir, no launch), and fall back without one.
  const roots = [
    process.env.PUPPETEER_CACHE_DIR,
    join(homedir(), '.cache', 'puppeteer'),
    join(repoRoot, '.puppeteer-cache'),
    join(repoRoot, 'node_modules', 'puppeteer', '.local-chromium'),
  ].filter(Boolean);
  const found = [];
  // Bind the executable that will ACTUALLY launch. When PUPPETEER_EXECUTABLE_PATH
  // is set (fleet VMs use the system Chrome), bind the binary's identity, not just
  // its path (paul-kinlan-me-02b): a same-path package upgrade changes size/mtime,
  // so statSync keeps an upgraded browser from replaying a stale PASS. statSync
  // follows symlinks (/usr/bin/google-chrome -> the real binary). No spawn: this
  // function runs inside the fast-gate node tests, where launching anything is
  // forbidden. When the env is unset, puppeteer uses its own downloaded build and
  // the cache-dir scan below names its exact build id; if NEITHER exists the specs
  // cannot launch at all, so 'no-local-chrome' is the honest value - there is no
  // PASS to invalidate.
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    const exe = process.env.PUPPETEER_EXECUTABLE_PATH;
    let binding = sha(exe).slice(0, 16);
    try {
      const st = statSync(exe);
      binding += `-${st.size}-${Math.round(st.mtimeMs)}`;
    } catch {
      binding += '-missing';
    }
    found.push(`env:${binding}`);
  }
  for (const root of roots) {
    for (const sub of [join(root, 'chrome'), root]) {
      try {
        const hit = readdirSync(sub).filter((e) => /[0-9]+\.[0-9]+\.[0-9]+/.test(e)).sort();
        if (hit.length) found.push(...hit);
      } catch {
        /* not installed here */
      }
    }
  }
  return found.length ? [...new Set(found)].sort().join(',') : 'no-local-chrome';
}

export function runtimeFingerprint(repoRoot) {
  return {
    node: process.version,
    puppeteer: (() => {
      try {
        return JSON.parse(readFileSync(join(repoRoot, 'node_modules', 'puppeteer', 'package.json'), 'utf8')).version;
      } catch {
        return 'unresolved';
      }
    })(),
    chrome: chromeBuildId(repoRoot),
    runner: fileSha(join(here, 'run.mjs')),
    selector: fileSha(join(here, 'select.mjs')),
    evidence: fileSha(join(here, 'evidence.mjs')),
    wrapper: fileSha(join(repoRoot, 'tools', 'browser-gate.sh')),
    workflow: fileSha(join(repoRoot, '.github', 'workflows', 'browser-gate.yml')),
  };
}

// The cache key: git tree + selection + manifest + fingerprint. Binding the
// manifest CONTENT (not its hash alone) and the exact selected list means a
// re-mapped path or a different delta produces a different key.
export function cacheKey({ tree, selection, manifestRaw, fingerprint }) {
  const payload = JSON.stringify({
    tree,
    specs: selection.selected.map((s) => s.spec),
    manifest: sha(manifestRaw),
    fingerprint,
  });
  return sha(payload);
}

function cacheDir(repoRoot) {
  // Default lives OUTSIDE the repo (paul-kinlan-me-6lw): an untracked
  // .browser-gate-cache/ inside the worktree dirtied the tree on every run,
  // which (correctly) disabled the PASS cache for every later run and tripped
  // clean-tree tooling. The home cache is shared across this repo's worktrees,
  // which is sound because the key binds the git tree + manifest + runner
  // sources: a record only ever replays for identical content. The repoRoot
  // parameter stays for callers that want a repo-local cache via the env.
  return process.env.BROWSER_GATE_CACHE_DIR ?? join(homedir(), '.cache', 'paul-kinlan-me-browser-gate');
}

// ---------------------------------------------------------------------------
// Process-group-bounded spawn. detached => the child leads a new process group,
// so a timeout can kill the whole tree (node + Chrome + esbuild) with one
// negative-pid signal, leaving nothing for the reaper to find.
// ---------------------------------------------------------------------------
function runBounded(command, args, { cwd, env, timeoutSec, logPath, label }) {
  return new Promise((res) => {
    const started = Date.now();
    mkdirSync(dirname(logPath), { recursive: true });
    const logFd = openSync(logPath, 'a');
    const child = spawn(command, args, {
      cwd,
      env,
      detached: true,
      stdio: ['ignore', logFd, logFd],
    });
    let killed = false;
    const timer = setTimeout(() => {
      killed = true;
      killGroup(child.pid, 'SIGKILL');
    }, timeoutSec * 1000);

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      try { closeSync(logFd); } catch { /* ignore */ }
      const durationMs = Date.now() - started;
      if (killed) {
        res({ ok: false, timedOut: true, code, signal, durationMs, label });
      } else {
        res({ ok: code === 0, timedOut: false, code, signal, durationMs, label });
      }
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      try { closeSync(logFd); } catch { /* ignore */ }
      res({ ok: false, timedOut: false, error: String(err), durationMs: Date.now() - started, label });
    });
  });
}

function killGroup(pid, signal) {
  if (!pid) return;
  try {
    process.kill(-pid, signal);
  } catch {
    try {
      process.kill(pid, signal);
    } catch {
      /* already gone */
    }
  }
}

// The cache key binds the git TREE - which only pins spec content when the
// worktree is clean. On a dirty tree, what will execute is not what the key
// names, so the PASS cache is disabled automatically (read AND write): a stale
// PASS can never vouch for uncommitted content, and a dirty run can never
// poison the cache for the clean tree it shadows.
export function worktreeDirty(repoRoot) {
  try {
    const out = spawnSync('git', ['status', '--porcelain'], { cwd: repoRoot, encoding: 'utf8', timeout: 60_000 });
    if (out.status !== 0) return true; // cannot prove clean => treat as dirty
    return out.stdout.trim().length > 0;
  } catch {
    return true;
  }
}

// ---------------------------------------------------------------------------
// Plan (no side effects) - what WOULD run. Exported for the node tests so they
// can assert serial order, single build, isolation and cache-key binding without
// launching Chrome.
// ---------------------------------------------------------------------------
export function plan({ repoRoot = defaultRepoRoot, selection, tree, all }) {
  const manifest = loadManifest(repoRoot);
  const manifestRaw = readFileSync(join(repoRoot, 'tools', 'browser-gate', 'manifest.json'), 'utf8');
  const fingerprint = runtimeFingerprint(repoRoot);
  const siteCoupled = selection.selected.some((s) => s.siteCoupled);
  const key = cacheKey({ tree, selection, manifestRaw, fingerprint });
  return {
    mode: all ? 'all' : 'delta',
    repoRoot,
    tree,
    build: siteCoupled
      ? { command: manifest.siteBuild.command, timeoutSec: manifest.siteBuild.timeoutSec, once: true }
      : null,
    // Serial, in the selector's stable order: selectFromFiles sorts spec paths
    // alphabetically, so a run is reproducible independently of the manifest's
    // declaration order (paul-kinlan-me-1b6).
    specs: selection.selected.map((s) => ({
      spec: s.spec,
      siteCoupled: s.siteCoupled,
      timeoutSec: s.timeoutSec,
      why: s.why,
      env: {
        BROWSER_GATE_EVIDENCE_DIR: '<run-evidence-dir>',
        ...(s.siteCoupled ? { SITE_DIR: '<repoRoot>/public' } : {}),
      },
    })),
    skipped: selection.skipped,
    cache: { key, dir: cacheDir(repoRoot), fingerprint },
  };
}

// ---------------------------------------------------------------------------
// Execute.
// ---------------------------------------------------------------------------
export async function execute(plan_, { repoRoot, selection, noCache, logger = console }) {
  const manifest = loadManifest(repoRoot);
  const evidenceDir = process.env.BROWSER_GATE_EVIDENCE_DIR ?? mkdtempSync(join(tmpdir(), 'browser-gate-'));
  mkdirSync(evidenceDir, { recursive: true });

  const cacheFile = join(plan_.cache.dir, `${plan_.cache.key}.json`);
  if (!noCache && existsSync(cacheFile)) {
    const cached = JSON.parse(readFileSync(cacheFile, 'utf8'));
    logger.log(`browser-gate: CACHE HIT ${plan_.cache.key} (tree ${plan_.tree?.slice(0, 12) ?? 'dirty'}); skipping re-run`);
    logger.log(`browser-gate: prior evidence: ${cached.evidenceDir}`);
    return { ok: true, cached: true, key: plan_.cache.key, evidenceDir: cached.evidenceDir, results: cached.results };
  }

  const results = [];
  let buildRan = false;

  // ONE fresh build for the site-coupled specs, before any of them runs.
  if (plan_.build) {
    logger.log(`browser-gate: building site once (${plan_.build.command.join(' ')}) for ${plan_.specs.filter((s) => s.siteCoupled).length} site-coupled spec(s)`);
    const blog = join(evidenceDir, 'build.log');
    const bres = await runBounded(plan_.build.command[0], plan_.build.command.slice(1), {
      cwd: repoRoot,
      env: { ...process.env },
      timeoutSec: plan_.build.timeoutSec,
      logPath: blog,
      label: 'build',
    });
    buildRan = true;
    if (!bres.ok) {
      logger.error(`browser-gate: BUILD FAILED (${bres.timedOut ? 'timeout' : `code ${bres.code}`}); see ${blog}`);
      logger.error('browser-gate: failed: build');
      return finish({ ok: false, results, evidenceDir, plan_, buildRan, noCache, logger, reason: 'build' });
    }
    logger.log(`browser-gate: ran: build (${bres.durationMs}ms)`);
    results.push({ label: 'build', ok: true, durationMs: bres.durationMs, log: blog });
  }

  // SERIAL. One spec at a time (the flock lease already bounds Chrome to one
  // per VM; this bounds it to one per run).
  for (const spec of plan_.specs) {
    const logPath = join(evidenceDir, `${spec.spec.replace(/[^\w.]+/g, '_')}.log`);
    logger.log(`browser-gate: running: ${spec.spec} (timeout ${spec.timeoutSec}s, siteCoupled=${spec.siteCoupled})`);
    const env = {
      ...process.env,
      BROWSER_GATE_EVIDENCE_DIR: evidenceDir,
      ...(spec.siteCoupled ? { SITE_DIR: join(repoRoot, 'public') } : {}),
    };
    const res = await runBounded(process.execPath, [spec.spec], {
      cwd: repoRoot,
      env,
      timeoutSec: spec.timeoutSec,
      logPath,
      label: spec.spec,
    });
    const record = {
      label: spec.spec,
      ok: res.ok,
      timedOut: res.timedOut,
      code: res.code,
      durationMs: res.durationMs,
      log: logPath,
      siteCoupled: spec.siteCoupled,
      why: spec.why,
    };
    results.push(record);
    if (res.ok) {
      logger.log(`browser-gate: ran: ${spec.spec} (${res.durationMs}ms)`);
    } else {
      logger.error(`browser-gate: failed: ${spec.spec} (${res.timedOut ? `timeout after ${spec.timeoutSec}s` : `code ${res.code}`}); see ${logPath}`);
    }
  }

  const ok = results.every((r) => r.ok);
  return finish({ ok, results, evidenceDir, plan_, buildRan, noCache, logger, manifest });
}

function finish({ ok, results, evidenceDir, plan_, buildRan, noCache, logger }) {
  // Evidence and a machine-readable record survive the run (rule 4/record rule).
  const record = {
    at: new Date().toISOString(),
    key: plan_.cache.key,
    tree: plan_.tree,
    ok,
    buildRan,
    specs: results.filter((r) => r.label !== 'build'),
    build: results.find((r) => r.label === 'build') ?? null,
    skipped: plan_.skipped,
    fingerprint: plan_.cache.fingerprint,
    evidenceDir,
  };
  try {
    writeFileSync(join(evidenceDir, 'result.json'), JSON.stringify(record, null, 2));
  } catch (e) {
    logger.error(`browser-gate: could not write result.json: ${e.message}`);
  }
  if (ok && !noCache) {
    try {
      mkdirSync(plan_.cache.dir, { recursive: true });
      writeFileSync(join(plan_.cache.dir, `${plan_.cache.key}.json`), JSON.stringify({ at: record.at, evidenceDir, results }, null, 2));
    } catch (e) {
      logger.error(`browser-gate: could not write cache record: ${e.message}`);
    }
  }
  const passed = results.filter((r) => r.ok).length;
  logger.log(`browser-gate: ${ok ? 'PASS' : 'FAIL'} - ${passed}/${results.length} step(s) ok; evidence: ${evidenceDir}`);
  return { ok, cached: false, key: plan_.cache.key, evidenceDir, results };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
export async function main(argv = process.argv.slice(2)) {
  const repoRoot = argValue(argv, '--repo') ? resolve(process.cwd(), argValue(argv, '--repo')) : defaultRepoRoot;
  const all = hasFlag(argv, '--all');
  const noCacheFlag = hasFlag(argv, '--no-cache');
  const dirty = worktreeDirty(repoRoot);
  if (dirty && !noCacheFlag) {
    console.error('browser-gate: worktree is dirty - the git tree no longer binds what will execute; PASS cache disabled for this run');
  }
  const noCache = noCacheFlag || dirty;
  const planOnly = hasFlag(argv, '--plan');

  let manifest;
  try {
    manifest = loadManifest(repoRoot);
  } catch (e) {
    console.error(`browser-gate: ${e.message}`);
    return 2;
  }
  const integ = integrityErrors(manifest, repoRoot);
  if (integ.length > 0) {
    for (const e of integ) console.error(`browser-gate: INTEGRITY: ${e}`);
    return 1;
  }

  // Resolve the pinned delta. --all (nightly) selects everything and needs no delta.
  let selection;
  let tree;
  let head = null;
  if (all) {
    const specs = Object.entries(manifest.specs).map(([spec, def]) => ({
      spec,
      siteCoupled: Boolean(def.siteCoupled),
      timeoutSec: def.timeoutSec,
      why: ['--all nightly sweep'],
    }));
    selection = { selected: specs, skipped: [], unmapped: [], integrity: [] };
    head = safeSha(repoRoot, argValue(argv, '--head') ?? 'HEAD');
    tree = head;
  } else {
    const filesArg = argValue(argv, '--files');
    let files;
    let base = null;
    if (filesArg) {
      files = filesArg.split(',').map((f) => f.trim()).filter(Boolean);
      head = safeSha(repoRoot, argValue(argv, '--head') ?? 'HEAD');
    } else {
      try {
        head = resolveSha(repoRoot, argValue(argv, '--head') ?? 'HEAD');
        const baseRef = argValue(argv, '--base');
        const mbRef = argValue(argv, '--merge-base-with') ?? (baseRef ? null : 'origin/main');
        base = baseRef ? resolveSha(repoRoot, baseRef) : resolveMergeBase(repoRoot, mbRef, head);
        files = changedFiles(repoRoot, base, head);
      } catch (e) {
        console.error(`browser-gate: cannot derive the delta: ${String(e.message ?? e).split('\n')[0]}`);
        console.error('browser-gate: pass --base/--head (both commits) or --files, or --all for the nightly sweep');
        return 2;
      }
    }
    selection = selectFromFiles(files, manifest, repoRoot);
    tree = head;
  }

  if (selectionFailed(selection)) {
    for (const e of selection.integrity) console.error(`browser-gate: INTEGRITY: ${e}`);
    for (const p of selection.unmapped) console.error(`browser-gate: UNMAPPED: ${p}`);
    console.error('browser-gate: fail closed - classify the path(s) in tools/browser-gate/manifest.json, then re-run.');
    return 1;
  }

  const plan_ = plan({ repoRoot, selection, tree, all });

  if (planOnly) {
    console.log(JSON.stringify(plan_, null, 2));
    return 0;
  }

  if (plan_.specs.length === 0 && !plan_.build) {
    console.log(`browser-gate: nothing selected (${selection.skipped.length} path(s) explicitly out of scope); no Chrome launched`);
    return 0;
  }

  const result = await execute(plan_, { repoRoot, selection, noCache });
  return result.ok ? 0 : 1;
}

function safeSha(repoRoot, ref) {
  try {
    return resolveSha(repoRoot, ref);
  } catch {
    return 'unresolved';
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then(
    (code) => {
      process.exitCode = code;
    },
    (err) => {
      console.error(`browser-gate: runner crashed: ${err?.stack ?? err}`);
      process.exitCode = 2;
    },
  );
}
