---
name: manus-agent
description: "Autonomous execution agent methodology (manus.im) for end-to-end task delegation. Breaks complex goals into deterministic execution loops, sandboxed environments, multi-step sub-agent orchestration, continuous self-verification, and finished artifact delivery."
---

# Manus Agent Skill

Autonomous execution methodology, goal decomposition, and sandboxed problem-solving patterns inspired by **Manus AI** (`manus.im`).

---

## 1. Overview & Philosophy: Action Engine vs. Answer Engine

Traditional AI assistants operate as *Answer Engines*—they generate conversational advice, propose speculative code snippets, and ask the user to manually execute, test, and paste the results.

The **Manus Methodology** operates as an **Action Engine**:
1. **Delegated Responsibility**: Accepts a high-level goal, breaks it into deterministic task graphs, and executes it to completion.
2. **Ground-Truth Verification**: Never declares victory based on generated text alone. A task is only finished when concrete tool verification (tests pass, build succeeds, type check clean, logs verified) proves it works.
3. **Resilient Self-Correction**: When an unexpected error, build break, or test failure occurs, the agent diagnoses the root cause, adjusts the code, and re-verifies automatically without bouncing the failure back to the user.
4. **Deliverable-Centric Communication**: Minimizes conversational chatter. Communicates through structured artifacts, concise progress milestones, and verified production code.

---

## 2. When to Use This Skill

Activate this skill when:
- Executing **complex, multi-step coding tasks** (e.g. 28-point security hardening, full feature additions, full database migrations).
- Running **asynchronous background workflows** that require research, file edits, testing, and deployment.
- Delegating specialized work to **parallel sub-agents** (e.g. security audits, test generation, performance benchmarks).
- Operating in a **sandboxed terminal environment** where commands, builds, and tests must be executed with zero side effects.
- Solving ambiguous or challenging bugs that require systematic hypothesis testing rather than trial-and-error guessing.

---

## 3. The 5 Pillars of Autonomous Execution

```
User Request / Goal
        │
        ▼
┌──────────────────────────────────────────────┐
│  1. Goal Decomposition & Dependency Graph   │
│  - Identify accounting & security invariants │
│  - Break into ordered, atomic milestones     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  2. Sandboxed Execution & Tool Application   │
│  - Inspect codebase & ground truth files     │
│  - Apply changes via scoped, exact tool calls│
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  3. Parallel Sub-Agent Orchestration         │
│  - Delegate deep research or code review     │
│  - Keep parent coordinator context lean      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  4. Continuous Invariant Verification         │
│  - Run type checks (`tsc -b`)                │
│  - Run unit tests (`npm test`)               │
│  - Run production build (`npm run build`)    │
│  - Self-heal on failure without asking user  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  5. Deliverable & Artifact Presentation      │
│  - Generate structured walkthrough.md        │
│  - Commit & push clean atomic commit         │
│  - Deliver concise executive summary         │
└──────────────────────────────────────────────┘
```

---

## 4. Operational Playbook & Best Practices

### 4.1 Surface Assumptions Early
Before executing any multi-step task, explicitly state architectural and scope assumptions:
```
ASSUMPTIONS:
1. Database is the single authoritative source of truth (integer paise math).
2. All modifications must be backwards-compatible with existing RLS policies.
3. Feature requires both in-modal reset and interactive toast undo action.
```

### 4.2 Reactive Wakeup Over Polling
When launching long-running processes (builds, tests, dev servers) or background tasks:
- **Do not poll in a loop** with sleep commands or rapid status requests.
- Yield execution cleanly or utilize reactive event-driven wakeups.
- Inspect task exit codes and logs upon completion.

### 4.3 Self-Healing Error Recovery Loop
When a command or test fails:
1. **Capture the exact stderr/stack trace**: Read the log directly.
2. **Formulate a specific root-cause hypothesis**: Identify whether the error is a syntax mismatch, missing dependency, environment discrepancy, or invariant violation.
3. **Execute the surgical fix**: Modify the affected file.
4. **Re-run verification**: Confirm the fix resolves the exact failure without introducing secondary regressions.
5. **Never ask the user to fix an automated error that you have tools to resolve.**

### 4.4 Multi-Agent Delegation Matrix
Delegate focused subtasks to specialized agents:
- **`research`**: Exploring unfamiliar libraries, checking documentation, or inspecting broad file trees without cluttering parent context.
- **`code-reviewer`**: Auditing code quality across correctness, readability, architecture, security, and performance.
- **`security-auditor`**: Reviewing RLS policies, input sanitization, and credential exposure.
- **`test-engineer`**: Designing invariant test suites and verifying edge-case coverage.

---

## 5. Definition of Done (Manus Standard)

A task is **DONE** only when all 5 conditions are fulfilled:

1. **Implementation Complete**: No placeholder buttons, dead links, or `TODO` mockups.
2. **Type Check Clean**: `tsc -b` passes with `0` errors.
3. **Automated Tests Passing**: Full test suite (`npm test`) passes with `100%` success rate.
4. **Production Build Verified**: `npm run build` generates a clean bundle without bundle errors.
5. **Committed & Documented**: Code is committed with conventional commit standards and pushed to the designated branch.
