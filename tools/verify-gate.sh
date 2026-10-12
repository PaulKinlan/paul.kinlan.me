#!/bin/bash
set -e

# Detect drift between repo config and VM global config.
# If another project's 'fleet new' overwrites ~/.fleet/check.conf,
# this will fail the build and alert the operator.
if [ -n "$FLEET_LANE" ] && [ -f "$HOME/.fleet/check.conf" ]; then
  if ! cmp -s tools/check.conf "$HOME/.fleet/check.conf"; then
    echo "ERROR: Gate drift detected! tools/check.conf differs from ~/.fleet/check.conf" >&2
    echo "Repo config (tools/check.conf):" >&2
    cat tools/check.conf >&2
    echo "" >&2
    echo "VM config (~/.fleet/check.conf):" >&2
    cat "$HOME/.fleet/check.conf" >&2
    echo "" >&2
    echo "To recover safely (when fleet-check is not running): bash tools/install-gate.sh" >&2
    exit 1
  fi
fi
