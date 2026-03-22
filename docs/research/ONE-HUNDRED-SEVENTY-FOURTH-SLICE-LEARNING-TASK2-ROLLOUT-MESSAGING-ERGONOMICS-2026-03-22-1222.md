# One-Hundred-Seventy-Fourth Slice Learning — Task 2 Rollout Messaging Ergonomics (2026-03-22 12:22 UTC)

## Context
Task 2 rollout boundary is frozen with strict class-token requirements, alias-expired shadow detection semantics, and aggregate per-surface retention rules. The practical risk now is message quality under real operator pressure.

## Applied learning

### 1) One-line failures should be class-first and action-biased
Operators need “what failed” and “what to do” in one glance.

**Rule:**
- keep format: `<surface>: <failureClass> (<short action cue>)`
- avoid narratives in first-line output.

---

### 2) `alias-expired` messaging should include migration instruction
Without explicit instruction, teams treat expiry like random drift.

**Rule:** append canonical migration cue in summary:
- `alias-expired (switch to canonical marker)`

This keeps governance transitions operationally clear.

---

### 3) Aggregate output should headline status, but never hide per-surface class rows
A compact aggregate verdict is useful, but class detail is where the fix lives.

**Rule:**
- aggregate header may be single line,
- always follow with per-surface class lines when failures exist.

---

### 4) Keep summary vocabulary stable across commands
Class-first output loses trust if different commands use different synonyms.

**Rule:** command wrappers must consume shared class template map; no command-local wording forks.

---

### 5) Preserve terse readability with fixed phrase budget
If each class cue expands over time, logs become noisy and tokens get buried.

**Rule:** maintain a short phrase budget per class template and test it.

---

### 6) Make strictness visible as reliability, not hostility
Teams accept strict checks when messaging explains protective intent.

**Rule:** `collision-blocked` and `mode-invalid` cues should frame protection of diagnostic integrity, not “mysterious checker behavior.”

---

### 7) Artifact detail should remain layered and scannable
Even full-detail artifacts need structure to be useful in incident reviews.

**Rule:** artifact order should remain:
1. class + pass/fail,
2. matcher contract context,
3. evidence fields,
4. temporal/governance fields.

## Immediate implementation guidance
- Add fixed class-first line templates with action cues for each strict class.
- Add regression tests for per-command summary wording parity.
- Add aggregate-report tests requiring per-surface class rows whenever aggregate is failing.