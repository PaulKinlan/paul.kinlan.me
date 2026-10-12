#!/usr/bin/env python3
"""Guard the safety contract of the Software Factory gate workflow.

`.github/workflows/software-factory-pr.yml` runs third-party action code and a paid
model credential on pull requests. Its header states the contract; nothing else
enforces it, so a later edit could quietly turn an inert, file-sink audit into a
publication boundary or an ungated paid run. This is a text-level check on purpose:
it needs no YAML library, so it runs anywhere python3 does (the fleet fast gate).

Run it directly, or through tools/fast-gate.sh, which calls it before the build.
"""
from __future__ import annotations

import pathlib
import re
import sys

WORKFLOW = (
    pathlib.Path(__file__).resolve().parent.parent
    / ".github"
    / "workflows"
    / "software-factory-pr.yml"
)

FACTORY_ACTION = "paulkinlan/agents/.github/actions/factory"
PUBLISHING_SINKS = ("beads", "github-issues")

_KEY_RE = re.compile(r"^\s*([A-Za-z0-9_-]+):[ \t]*(.*?)\s*$")


def _unquote(value: str) -> str:
    """Drop one layer of YAML quoting: `"file"` and `file` are one declaration.

    Without this the guard both misses a quoted `uses: "...@main"` (the bypass it
    exists to catch) and fails a legitimate `sink: "file"` (breaking someone
    else's commit), which is worse than useless.
    """
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        return value[1:-1]
    return value


def values(text: str, key: str) -> list[str]:
    """Unquoted values of `key`, inline comments removed, in file order."""
    found = []
    for line in text.splitlines():
        match = _KEY_RE.match(line)
        if not match or match.group(1) != key:
            continue
        value = match.group(2)
        if " #" in value:  # a trailing comment; not a '#' inside a quoted value
            value = value.split(" #", 1)[0].rstrip()
        found.append(_unquote(value))
    return found


def _items(value: str) -> list[str]:
    """Read a scalar, a flow sequence (`[a, b]`) or a comma list as items."""
    value = value.strip()
    if value.startswith("[") and value.endswith("]"):
        value = value[1:-1]
    return [item.strip().strip("\"'") for item in value.split(",") if item.strip()]


def _pairs(text: str) -> list[tuple[str, str]]:
    """Every `key: value` line, unquoted, in file order."""
    pairs = []
    for line in text.splitlines():
        match = _KEY_RE.match(line)
        if match:
            pairs.append((match.group(1), _unquote(match.group(2))))
    return pairs


def check(text: str) -> list[str]:
    """Return one message per broken contract term; empty means the file is clean."""
    bad: list[str] = []

    for uses in values(text, "uses"):
        if uses.split("@", 1)[0] != FACTORY_ACTION:
            continue
        if not re.fullmatch(re.escape(FACTORY_ACTION) + r"@[0-9a-f]{40}", uses):
            bad.append(
                f"{FACTORY_ACTION} must be pinned to a 40-hex commit SHA, not "
                f"'{uses.split('@', 1)[1]}' - it runs with a model credential"
            )

    # Findings must stay in the run artifact. beads/github-issues publish.
    sinks = [item for value in values(text, "sink") for item in _items(value)]
    for sink in PUBLISHING_SINKS:
        if sink in sinks:
            bad.append(f"sink '{sink}' publishes findings; this gate must use 'file'")
    if "file" not in sinks:
        bad.append("no 'sink: file' step found - findings would have nowhere safe to go")

    # The paid matrix must stay gated on the credential preflight.
    needs = [item for value in values(text, "needs") for item in _items(value)]
    if "preflight" not in needs:
        bad.append("the audit job no longer declares 'needs: preflight'")
    if not any("needs.preflight.outputs.enabled" in value for value in values(text, "if")):
        bad.append("the audit job is no longer conditional on the preflight credential flag")

    # The credential may only be read into a step env, never a job-level if.
    if any("secrets." in value for value in values(text, "if")):
        bad.append("a job-level 'if' reads secrets - the secrets context is unavailable there")

    # Scans that read a public repository need no write scope. Any `key: write`
    # line in a workflow is a permission grant, so none of them belong here.
    if "read" not in values(text, "contents"):
        bad.append("'permissions: contents: read' is missing")
    for key, value in _pairs(text):
        if value == "write":
            bad.append(f"permission '{key}: write' is not needed by a read-only audit")

    return bad


def main() -> int:
    if not WORKFLOW.is_file():
        print(f"FAIL: {WORKFLOW} is missing", file=sys.stderr)
        return 1
    problems = check(WORKFLOW.read_text(encoding="utf-8"))
    if problems:
        for problem in problems:
            print(f"FAIL: {problem}", file=sys.stderr)
        return 1
    print(f"OK: {WORKFLOW.name} keeps its file-sink, credential-gated, pinned-action contract")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
