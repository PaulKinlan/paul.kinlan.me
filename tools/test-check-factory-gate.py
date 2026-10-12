#!/usr/bin/env python3
"""Mutation tests for tools/check-factory-gate.py.

A guard that silently stopped catching things is worse than no guard, and the two
ways it can go wrong opposite directions: a false negative (a broken contract that
still passes) and a false positive (a legitimate edit that fails every lane's gate).
This table pins both, including the YAML quoting cases - `sink: "file"` is the same
declaration as `sink: file`, while `uses: "...@main"` is the same bypass as
`uses: ...@main`.

Not part of tools/fast-gate.sh: it is a test of the guard, not of the site, and the
guard itself already runs there in milliseconds. Run it after touching either the
guard or the workflow:

    python3 tools/test-check-factory-gate.py
"""
from __future__ import annotations

import pathlib
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
WORKFLOW = ROOT / ".github/workflows/software-factory-pr.yml"
GUARD = ROOT / "tools/check-factory-gate.py"
SHA = "99f7d654d7f5447756726d37930c63b43ce32489"

# (name, replacements applied to a copy, expected exit code of the guard)
CASES = [
    ("unpinned @main", [("actions/factory@" + SHA, "actions/factory@main")], 1),
    (
        "quoted unpinned @main",
        [
            ("actions/factory@" + SHA, 'actions/factory@main"'),
            (
                'uses: paulkinlan/agents/.github/actions/factory@main"',
                'uses: "paulkinlan/agents/.github/actions/factory@main"',
            ),
        ],
        1,
    ),
    (
        "single-quoted @v1",
        [
            ("actions/factory@" + SHA, "actions/factory@v1'"),
            (
                "uses: paulkinlan/agents/.github/actions/factory@v1'",
                "uses: 'paulkinlan/agents/.github/actions/factory@v1'",
            ),
        ],
        1,
    ),
    ("beads sink", [("sink: file", "sink: beads")], 1),
    ("quoted beads sink", [("sink: file", 'sink: "beads"')], 1),
    ("flow sink list", [("sink: file", "sink: [file, github-issues]")], 1),
    ("sink removed", [("          sink: file\n", "")], 1),
    ("no needs", [("needs: preflight", "needs: []")], 1),
    ("wrong needs", [("needs: preflight", "needs: other")], 1),
    ("ungated if", [("if: needs.preflight.outputs.enabled == 'true'", "if: true")], 1),
    (
        "secrets in a job-level if",
        [
            (
                "if: needs.preflight.outputs.enabled == 'true'",
                "if: ${{ secrets.GEMINI_API_KEY != '' }}",
            )
        ],
        1,
    ),
    ("contents write", [("contents: read", "contents: write")], 1),
    ("extra write scope", [("contents: read", "contents: read\n  issues: write")], 1),
    # Controls: legitimate edits, which must stay green.
    (
        "control: quoted sink and permission",
        [("sink: file", 'sink: "file"'), ("contents: read", 'contents: "read"')],
        0,
    ),
    ("control: flow needs with a comment", [("needs: preflight", "needs: [preflight]  # gated")], 0),
    ("control: unchanged workflow", [], 0),
]


def main() -> int:
    with tempfile.TemporaryDirectory() as tmp:
        tree = pathlib.Path(tmp)
        (tree / "tools").mkdir()
        (tree / ".github/workflows").mkdir(parents=True)
        shutil.copy(GUARD, tree / "tools/check-factory-gate.py")
        pristine = WORKFLOW.read_text()

        broken = 0
        for name, replacements, expected in CASES:
            text = pristine
            for old, new in replacements:
                if old not in text:
                    print(f"SKIP   {name}: pattern absent, the case needs updating")
                    broken += 1
                    break
                text = text.replace(old, new, 1)
            else:
                (tree / ".github/workflows/software-factory-pr.yml").write_text(text)
                result = subprocess.run(
                    [sys.executable, "tools/check-factory-gate.py"],
                    cwd=tree, capture_output=True, text=True,
                )
                if result.returncode == expected:
                    print(f"ok     {name}")
                else:
                    broken += 1
                    detail = (result.stdout + result.stderr).strip().splitlines()
                    print(f"FAILED {name}: exit {result.returncode}, wanted {expected} | {detail[0] if detail else ''}")

    total = len(CASES)
    print(f"\n{total - broken}/{total} mutation cases behaved as expected")
    return 1 if broken else 0


if __name__ == "__main__":
    raise SystemExit(main())
