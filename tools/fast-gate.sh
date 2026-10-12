#!/bin/bash
# Fast gate: Tailwind CSS + full Hugo build.
set -e

# assets/css/tailwind.css is generated but committed on purpose: Vercel builds
# with `hugo -D --gc`, which does not run `npm run build:css`, so the committed
# file is the stylesheet production serves. A stale committed stylesheet
# therefore ships missing CSS, and the build that reveals it also dirties the
# worktree - which the next `fleet-check` refuses to run on. Fail loudly here
# instead, with the one-line fix.
__before="$(md5sum assets/css/tailwind.css | cut -d' ' -f1)"
npm run build
__after="$(md5sum assets/css/tailwind.css | cut -d' ' -f1)"

if [ "$__before" != "$__after" ]; then
  echo "FAIL: this build rewrote assets/css/tailwind.css." >&2
  echo "It is committed because production (Vercel: hugo -D --gc) serves it, so a" >&2
  echo "change to it is part of your change." >&2
  echo "Fix: git add assets/css/tailwind.css && commit it with this change." >&2
  exit 1
fi
