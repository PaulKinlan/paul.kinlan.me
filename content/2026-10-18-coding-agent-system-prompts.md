---
date: 2026-10-18T16:45:00Z
draft: false
slug: coding-agent-system-prompts
summary:
  A deep architectural audit and comparative analysis of default system prompts
  across Claude Code, DeepSeek Coder, OpenAI Codex, OpenCode, T3 Code, and the
  Exe.dev Fleet multi-agent harness. Exploring instruction density, error-recovery,
  clickability, and token efficiency.
tags:
- ai
- agents
- prompt engineering
- claude
- deepseek
- codex
- fleet
title: "Coding Agent System Prompts: A Comparative Deep Dive & Architectural Audit"
---

As language models scale in raw coding capability, the system prompt is no longer just a set of instructions; it is the **operating system ABI (Application Binary Interface)** that governs how models manipulate the host filesystem, handle fatal errors, manage context windows, and interact with other autonomous processes.

In this deep dive, we examine the production system prompts and control architectures of five premier coding agent implementations, benchmark them against the Exe.dev Fleet prompt architecture (`roles/common.md`, `roles/coord.md`, and role specifications), and identify concrete improvements that reduce token bloat while boosting reasoning accuracy.

---

## 1. Architectural Paradigms Compared

| Agent Runtime | Prompt Paradigm | Primary Strengths | Key Vulnerabilities / Gaps | Base Prompt Tokens |
| :--- | :--- | :--- | :--- | :--- |
| **Claude Code** (Anthropic) | Dynamic Modular Fragments | Clickable `file:line` hyperlinks; turn-by-turn `<system-reminder>` injection; strong distinction between exploration and destructive execution. | Tightly bound to single interactive sessions; lacks distributed multi-agent ledger synchronization. | ~1,100 |
| **DeepSeek Coder** (DeepSeek) | Code-Dense Minimalist | 87% code-trained corpus bias; native Fill-In-The-Middle (FIM) syntax; high instruction adherence with minimal negative constraints. | Degrades rapidly when overloaded with multi-page conversational rules and negative warnings ("do not do X"). | ~600 |
| **OpenAI Codex CLI** (OpenAI) | Structured ACI Contract | Compact; explicit `AGENTS.md` scoping hierarchy; clear separation of streaming thoughts vs tool patches. | Requires strict external sandbox execution; assumes direct human in the loop for ambiguous commands. | ~450 |
| **OpenCode / Interpreter** | Execution Feedback Loop | Client-server separation; execution error back-propagation; dynamic on-demand Skill loading into sub-agent contexts. | Prone to deep context pollution without strict memory compaction; higher multi-turn token costs. | ~1,400 |
| **T3 Code** (pingdotgg / Theo) | Control Plane & Guardrails | Git worktree isolation per task; strict process safety ("3 ways to hurt yourself" rules prevent wild `pkill`/`kill` cascades); desktop diff UI. | Orchestrator rather than an autonomous prompt harness; delegates prompt construction to underlying agents. | External wrapper |
| **Exe.dev Fleet** (Paul Kinlan) | Distributed Ledger & Roles | "Beads is the ledger; a message is a photograph"; independent cross-family model review; preemption-aware heavy gate vs fast gate. | Prompt size inflation (`roles/common.md` is ~15.5 KB, near the 16KB limit); repetition of deterministic rules handled by daemons. | ~3,800 |

---

## 2. Anatomy of the Systems

### Claude Code: The Dynamic Harness Mindset

Claude Code treats the model not as a generic conversationalist, but as an interactive CLI tool operating with user-selected permissions. Key prompt excerpts demonstrate how it enforces safety and clickability:

```text
You are Claude Code, Anthropic's official CLI for Claude. You are an interactive agent that helps users with software engineering tasks.

Tools run behind a user-selected permission mode; a denied call means the user declined it — adjust, don't retry verbatim. The system may send updates, reminders, or modifications to rules via mid-conversation system turns.

Prefer the dedicated file/search tools over shell commands when one fits. Independent tool calls can run in parallel in one response. Reference code as file_path:line_number — it's clickable.

Write code that reads like the surrounding code: match its comment density, naming, and idiom.
```

**Key Architectural Takeaway:** Rather than dumping 50 edge-case rules into the boot prompt, Claude Code injects `<system-reminder>` blocks on specific turns (e.g., when Plan mode is activated or a test failure occurs).

---

### OpenAI Codex CLI: The AGENTS.md Hierarchy

OpenAI Codex's system prompt is remarkably brief (less than 500 words), delegating project-specific behavior entirely to the filesystem:

```text
You are a coding agent running in the Codex CLI, a terminal-based coding assistant. 
You are expected to be precise, safe, and helpful.

## AGENTS.md Spec:
- Repositories often contain AGENTS.md files specifying coding conventions, organization patterns, or test execution steps.
- The scope of an AGENTS.md file covers the directory tree rooted at its folder.
- You must strictly obey instructions in any AGENTS.md file whose scope includes a file you modify.
```

---

### DeepSeek Coder (V3 / R1): Minimalist Code Bias

DeepSeek models are trained heavily on raw code repositories (roughly 87% code and 13% natural language) across over 80 programming languages. They excel with structural tokens and Fill-In-The-Middle (FIM) templates:

```text
<｜fim begin｜>{prefix}<｜fim hole｜>{suffix}<｜fim end｜>
```

When given long conversational negative constraints ("Do not ever use X, never assume Y, under no circumstances do Z"), DeepSeek's internal attention heads tend to attend to the negative keywords and suffer from instruction confusion. Keeping the prompt dense with positive specifications yields significantly higher pass rates.

---

### OpenCode & T3 Code: Process Discipline & Worktrees

**OpenCode** bridges the gap between CLI tools and multi-agent coordination by separating agents into distinct execution personas (`plan`, `build`, `review`), loading dynamic Markdown skills on demand.

**T3 Code** introduces vital operating system hygiene rules:
- **Worktree Isolation:** Every active task runs in a clean Git worktree (`~/worktrees/<project>-<lane>`), preventing simultaneous edits from corrupting the master checkout.
- **Process Guardrails:** Forbids broad wildcard process termination (`pkill -f`) that could inadvertently kill sibling agents or host daemons.

---

### Exe.dev Fleet: Autonomous Multi-Agent Systems

The Fleet prompt architecture solves an existential problem that neither Claude Code nor Codex addresses: **autonomous multi-agent coordination across independent virtual machines without human stalling**.

```text
## Rules that never bend
1. Beads is the ledger. Every piece of work has a bead. Claim it with bd update <id> --claim.
2. Never review your own work. A different model family reviews every change.
3. Verify for real. "It serves" or "tests pass" is not "it works". Drive the actual behaviour in a browser.
4. Long commands: fleet-gate, then stop. Never poll with sleep loops or repeated status checks.
```

The core innovation is **Cross-Family Verification**: Gemini 3.8 Flash, OpenAI Codex, Claude 3.7 Sonnet, DeepSeek V3, and Qwen cross-review each other's pull requests. A model is never permitted to review its own code, preventing self-confirmation bias.

---

## 3. Four Concrete Improvements for Fleet Prompts

From this comparative study, we identified four major architectural upgrades for our fleet prompts:

### 1. Compact `roles/common.md` by 40% (Prompt Token Budget)
- **Problem:** `roles/common.md` has grown to 15,580 bytes (~3,800 tokens), close to the 16KB deployment limit. Over 40% of its content describes mechanisms enforced deterministically by daemons (e.g. 6/h wake limits, reaper thresholds, process groups).
- **Fix:** Strip daemon implementation details from the prompt. Replace verbose explanations with terse, actionable invariants. This saves ~1,500 tokens on every single turn across all 18 active VMs.

### 2. Adopt Clickable Terminal Links (`file:line`)
- **Inspiration:** Claude Code's clickability rule.
- **Fix:** Add an explicit formatting rule: *"Always reference code locations as `path/to/file.ext:line`."* When reviewers report findings on beads or terminal logs, operators can click directly into the exact line in VS Code or iTerm.

### 3. Hypothesis-First Bounded Turn Rule
- **Inspiration:** SWE-agent's `DISCUSSION` &rarr; `COMMAND` pattern.
- **Fix:** DeepSeek and GLM implementers sometimes execute 8-10 speculative bash tool calls without writing code or committing. Enforce: *"State 1 concrete hypothesis &rarr; run focused probe &rarr; commit code &rarr; end turn."*

### 4. Dynamic Phase Injection vs Static Bloat
- **Inspiration:** Claude Code's `<system-reminder>`.
- **Fix:** Instead of having all reviewer and landing rules in every lane's system prompt, have `lanes.sh spawn` inject role criteria only when that specific phase begins.

---

## Conclusion

Prompt engineering for autonomous coding agents is converging on **high instruction density, filesystem-based contracts (`AGENTS.md` and Beads), and deterministic daemon guardrails**. By stripping operational ceremony from static prompts and letting daemons enforce process boundaries, agents gain higher token budgets for what matters: deep reasoning and robust code generation.
