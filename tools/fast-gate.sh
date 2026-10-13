#!/bin/bash
# Fast gate: workflow safety contract + WebMention escape tests + Tailwind CSS
# + full Hugo build.
set -e

# Work from the repo root, so this is safe to invoke from any directory.
cd "$(dirname "$0")/.."

# COVERAGE MARKERS (paul-kinlan-me-c3z). `fleet-check --fast` reads this log with
# ~/fleet/remote/check-coverage.py, which attributes a changed file to a suite only
# from positive evidence that the suite executed - a line-anchored
# `fast-gate: running|ran|passed|completed|failed: <suite>...` marker. This gate ran
# real suites all along and named none of them, so EVERY fast-gate verdict in this
# repo said the changed files were "NOT demonstrated to be exercised" even when they
# were, and the reviewer had to rebuild the mapping by hand - the exact cost the
# cached verdict exists to remove. The node runner's own output is not evidence
# either, so the markers are the only thing the extractor can read here.
#
# The marker is emitted AFTER the step returns: `ran:` when it succeeded, `failed:`
# when it did not (printed before exiting, so a red gate still reports what it
# dispatched - the vocabulary accepts running:/ran:/passed:/completed:/failed:
# precisely so a failing run is not published as having covered nothing). Never
# before it starts: a `running:` line would be read as evidence the suite executed,
# so a gate killed mid-suite would claim coverage it never produced. The suite list
# is the expansion of the same glob handed to `node --test` (real paths, never the
# glob itself). The browser gates
# (tests/*.xss.browser.mjs) need Chrome, are not run here, and are deliberately not
# named: a change to one must still come back as uncovered.
mark() {
  echo "fast-gate: $1: $2"
}

run_step() {
  local label="$1"
  shift
  if "$@"; then
    mark ran "$label"
  else
    # Capture the status BEFORE any echo resets $?.
    local status=$?
    mark failed "$label"
    exit "$status"
  fi
}

# ONE definition of the node suites, used for both the marker and the invocation, so
# the log can never credit a suite the runner was not handed.
shopt -s nullglob
node_suites=(tests/*.test.mjs)
shopt -u nullglob
if [ ${#node_suites[@]} -eq 0 ]; then
  # The extractor's explicit "I cannot determine coverage" marker. An absent suite
  # list is not a zero: without this the gate would exit on node's own error and the
  # verdict would have to guess.
  mark unknown "no tests/*.test.mjs suite was found to dispatch"
  exit 1
fi

# Nothing else enforces the Software Factory gate workflow's contract (file sink,
# credential gate, pinned action, read-only permissions), and that workflow runs
# third-party code plus a paid credential on pull requests. Milliseconds, and no
# YAML library, so it belongs in this tier rather than in a new one. It is named by
# its own path because that script IS what this step executes, so the marker is
# honest about what ran (and a change to it is exercised by every gate run).
run_step "tools/check-factory-gate.py" python3 tools/check-factory-gate.py

# api/mentions.js renders third-party webmention.io content into HTML, so its
# escaping and URL-scheme rules are a security contract, not a nicety. Node's
# test runner, no extra dependency, ~0.4s. (tests/mentions.xss.browser.mjs is the
# browser-driven evidence gate for the same file; it needs Chrome, so it is run
# by hand when that file changes rather than on every gate.)
run_step "${node_suites[*]}" node --test "${node_suites[@]}"

# assets/css/tailwind.css is generated but committed on purpose: Vercel builds
# with `hugo -D --gc`, which does not run `npm run build:css`, so the committed
# file is the stylesheet production serves. A stale committed stylesheet
# therefore ships missing CSS, and the build that reveals it also dirties the
# worktree - which the next `fleet-check` refuses to run on. Fail loudly here
# instead, with the one-line fix.
__before="$(git hash-object -- assets/css/tailwind.css)"
# Named "build": the hugo step is a gate step, not a test suite, but the log has to
# say it ran or a change that only the build exercises cannot be attributed.
run_step "build" npm run build
__after="$(git hash-object -- assets/css/tailwind.css)"

if [ "$__before" != "$__after" ]; then
  echo "FAIL: this build rewrote assets/css/tailwind.css." >&2
  echo "It is committed because production (Vercel: hugo -D --gc) serves it, so a" >&2
  echo "change to it is part of your change." >&2
  echo "Fix: git add assets/css/tailwind.css && commit it with this change." >&2
  exit 1
fi
