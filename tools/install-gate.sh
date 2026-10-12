#!/bin/bash
set -euo pipefail

# Resolve repo directory robustly
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONF_FILE="${FLEET_CHECK_CONF:-$HOME/.fleet/check.conf}"

# The lock files are the canonical way to know if a gate is running.
if fuser -s "$HOME/.fleet/checks/"*.lock 2>/dev/null; then
  echo "ERROR: fleet-check is currently running (locks held in ~/.fleet/checks/). Cannot edit VM global config safely." >&2
  exit 1
fi

if [ -z "${FLEET_LANE:-}" ]; then
  echo "ERROR: Not running inside a fleet lane." >&2
  exit 1
fi

cp "$REPO_DIR/tools/check.conf" "$CONF_FILE"
echo "VM global config ($CONF_FILE) successfully updated from tools/check.conf"
