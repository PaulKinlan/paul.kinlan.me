#!/bin/bash
# Fast gate: workflow safety contract + WebMention escape tests + Tailwind CSS
# + full Hugo build.
set -e

# Work from the repo root, so this is safe to invoke from any directory.
cd "$(dirname "$0")/.."

# Nothing else enforces the Software Factory gate workflow's contract (file sink,
# credential gate, pinned action, read-only permissions), and that workflow runs
# third-party code plus a paid credential on pull requests. Milliseconds, and no
# YAML library, so it belongs in this tier rather than in a new one.
python3 tools/check-factory-gate.py

# api/mentions.js renders third-party webmention.io content into HTML, so its
# escaping and URL-scheme rules are a security contract, not a nicety. Node's
# test runner, no extra dependency, ~0.4s. (tests/mentions.xss.browser.mjs is the
# browser-driven evidence gate for the same file; it needs Chrome, so it is run
# by hand when that file changes rather than on every gate.)
node --test tests/*.test.mjs

# assets/css/tailwind.css is generated but committed on purpose: Vercel builds
# with `hugo -D --gc`, which does not run `npm run build:css`, so the committed
# file is the stylesheet production serves. A stale committed stylesheet
# therefore ships missing CSS, and the build that reveals it also dirties the
# worktree - which the next `fleet-check` refuses to run on. Fail loudly here
# instead, with the one-line fix.
__before="$(git hash-object -- assets/css/tailwind.css)"
npm run build
__after="$(git hash-object -- assets/css/tailwind.css)"

if [ "$__before" != "$__after" ]; then
  echo "FAIL: this build rewrote assets/css/tailwind.css." >&2
  echo "It is committed because production (Vercel: hugo -D --gc) serves it, so a" >&2
  echo "change to it is part of your change." >&2
  echo "Fix: git add assets/css/tailwind.css && commit it with this change." >&2
  exit 1
fi
