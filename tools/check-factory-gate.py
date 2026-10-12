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


def check(text: str) -> list[str]:
    """Return one message per broken contract term; empty means the file is clean."""
    bad: list[str] = []

    for uses in re.findall(r"^\s*uses:\s*(\S+)\s*$", text, re.MULTILINE):
        if uses.split("@", 1)[0] != FACTORY_ACTION:
            continue
        if not re.fullmatch(re.escape(FACTORY_ACTION) + r"@[0-9a-f]{40}", uses):
            bad.append(
                f"{FACTORY_ACTION} must be pinned to a 40-hex commit SHA, not "
                f"'{uses.split('@', 1)[1]}' - it runs with a model credential"
            )

    # Findings must stay in the run artifact. beads/github-issues publish.
    for sink in ("beads", "github-issues"):
        if re.search(rf"^\s*sink:\s*{sink}\s*$", text, re.MULTILINE):
            bad.append(f"sink '{sink}' publishes findings; this gate must use 'file'")
    if not re.search(r"^\s*sink:\s*file\s*$", text, re.MULTILINE):
        bad.append("no 'sink: file' step found - findings would have nowhere safe to go")

    # The paid matrix must stay gated on the credential preflight.
    if not re.search(r"^\s*needs:\s*preflight\s*$", text, re.MULTILINE):
        bad.append("the audit job no longer declares 'needs: preflight'")
    if "needs.preflight.outputs.enabled" not in text:
        bad.append("the audit job is no longer conditional on the preflight credential flag")

    # The credential may only be read into a step env, never a job-level if.
    if re.search(r"^\s*if:.*secrets\.", text, re.MULTILINE):
        bad.append("a job-level 'if' reads secrets - the secrets context is unavailable there")

    # Scans that read a public repository need no write scope.
    if not re.search(r"^\s*contents:\s*read\s*$", text, re.MULTILINE):
        bad.append("'permissions: contents: read' is missing")
    for scope in re.findall(r"^\s*([a-z-]+):\s*write\s*$", text, re.MULTILINE):
        bad.append(f"permission '{scope}: write' is not needed by a read-only audit")

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
