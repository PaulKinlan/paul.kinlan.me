#!/bin/bash
set -e

# Resolve repo directory robustly
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONF_FILE="${FLEET_CHECK_CONF:-$HOME/.fleet/check.conf}"

# Detect drift between repo config and VM global config.
# If another project's 'fleet new' overwrites the config, this fails
# the build (provided the VM config still points to npm run build).
# Note: If the drifted config points to a completely different command,
# this file will not be reached during fleet-check.
if [ -n "${FLEET_LANE:-}" ] && [ -f "$CONF_FILE" ]; then
  if ! cmp -s "$REPO_DIR/tools/check.conf" "$CONF_FILE"; then
    echo "ERROR: Gate drift detected! $REPO_DIR/tools/check.conf differs from $CONF_FILE" >&2
    echo "Repo config ($REPO_DIR/tools/check.conf):" >&2
    cat "$REPO_DIR/tools/check.conf" >&2
    echo "" >&2
    echo "VM config ($CONF_FILE):" >&2
    cat "$CONF_FILE" >&2
    echo "" >&2
    echo "To recover safely (when fleet-check is not running): bash $REPO_DIR/tools/install-gate.sh" >&2
    exit 1
  fi
fi
