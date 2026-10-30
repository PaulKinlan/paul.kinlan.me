// Shared evidence-path helper for the browser specs (paul-kinlan-me-1i3).
//
// Before this tier, eight of the nine tests/*.browser.mjs wrote screenshots to
// FIXED /tmp names (/tmp/share-button-gate.png, /tmp/mentions-xss-after.png, ...).
// Run two specs - or the same spec twice - and they silently overwrite each
// other's evidence, so a "before/after" pair or a nightly sweep could not be
// trusted. The runner exports BROWSER_GATE_EVIDENCE_DIR (a unique mkdtemp dir
// per run) and every spec resolves its screenshots/logs through here, so:
//
//   - each run's evidence is isolated and survives the run (never deleted);
//   - a bare `node tests/x.browser.mjs` still works: the fallback is '/tmp',
//     matching the historical behaviour, so no spec is harder to run by hand;
//   - names stay stable WITHIN a run, so a reviewer can find them from the
//     recorded result.json.
//
// Lives under tools/browser-gate/** on purpose: the manifest's shared 'runner'
// trigger group includes that path, so editing this helper fans out to ALL nine
// specs (it changes where every one of them writes evidence).
import { join } from 'node:path';

export function evidenceDir() {
  return process.env.BROWSER_GATE_EVIDENCE_DIR ?? '/tmp';
}

// Resolve an evidence file name inside this run's directory.
export function evidencePath(name) {
  return join(evidenceDir(), name);
}
