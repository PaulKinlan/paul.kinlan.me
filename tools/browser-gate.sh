#!/usr/bin/env bash
# tools/browser-gate.sh - the ONE-Chrome-at-a-time lease around the browser tier.
#
# The architect verdict on paul-kinlan-me-1i3 requires "a single per-VM browser
# lease (one Chrome process at a time)". The runner already runs specs SERIALLY,
# but two lanes (or a lane + the nightly CI on a self-hosted runner) could each
# start a run on the same VM. flock on a fixed per-VM lockfile serialises them:
# the second run waits for the first to release, so there is never more than one
# browser tier driving Chrome here. The lock is released automatically when the
# runner exits (including on the runner's own process-group kill / timeout), so a
# hung spec cannot wedge the lease beyond its bound.
#
# Everything after the lock is the runner; this wrapper adds NO gate logic.
# Chrome stays out of tools/fast-gate.sh and CHECK_CMD - this is a separate tier.
#
# Usage (identical to run.mjs):
#   bash tools/browser-gate.sh --base origin/main          # delta vs pinned merge-base
#   bash tools/browser-gate.sh --files static/css/material.css
#   bash tools/browser-gate.sh --all --no-cache            # nightly sweep
#   bash tools/browser-gate.sh --plan --base origin/main   # dry run: what would execute
set -euo pipefail

cd "$(dirname "$0")/.."

LOCK="${BROWSER_GATE_LOCK:-/tmp/paul-kinlan-me-browser-gate.lock}"
RUNNER="tools/browser-gate/run.mjs"

# flock(1) is present on the Linux CI runners and the fleet VMs. If a host lacks
# it (e.g. a bare macOS dev box), fall back to running unlocked rather than
# refusing to run at all - the runner is still serial within the process.
if command -v flock >/dev/null 2>&1; then
  # -w 1800: wait up to 30 min for the lease (a full site-coupled sweep can be
  # long); if it cannot acquire, fail loudly rather than run a second Chrome.
  exec flock -w "${BROWSER_GATE_LOCK_WAIT:-1800}" "$LOCK" node "$RUNNER" "$@"
else
  echo "browser-gate: flock not found; running WITHOUT the per-VM lease (serial within this process only)" >&2
  exec node "$RUNNER" "$@"
fi
