#!/bin/bash
set -euo pipefail

if pgrep -f fleet-check > /dev/null; then
  echo "ERROR: fleet-check is currently running. Cannot edit VM global config safely." >&2
  exit 1
fi

if [ -z "${FLEET_LANE:-}" ]; then
  echo "ERROR: Not running inside a fleet lane." >&2
  exit 1
fi

cp tools/check.conf "$HOME/.fleet/check.conf"
echo "VM global config successfully updated from tools/check.conf"
