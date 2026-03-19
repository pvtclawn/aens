# Plan — neutral undeclared observed-output cleanup (2026-03-19 04:02 UTC)

## Purpose
Turn the neutral-undeclared research + challenge notes into a small, guarded execution plan for the next AENS slice.

## Constraint from the challenge
The next slice must not become over-collapse.
It only counts if it compresses **pure sameness** without hiding meaningful differences or contradicting the declared proof surface.

## Chosen plan (ordered)

### Task 1 — Strict all-undeclared collapse predicate **(NEXT TASK)**
#### Goal
Collapse repeated undeclared observed lines only when doing so is semantically lossless.

#### Scope
- add a strict collapse predicate for the observed proof section
- collapse only when **all** observed proof states are `not-declared`
- render one neutral summary line in that case
- otherwise keep per-kind lines

#### Acceptance criteria
1. If all observed proof states are `not-declared`, the observed section renders one line:
   - `No proof fetch observations: no proof material declared.`
2. If any observed proof state differs from `not-declared`, the section does **not** collapse.
3. Collapse logic is implemented generically over the observed-state list, not hardcoded around today’s proof kinds.
4. Tests cover:
   - all-undeclared collapse
   - mixed-state no-collapse

#### Why this is first
This is the smallest slice that removes the current readability noise without weakening the operational-state model.

---

### Task 2 — Declared/observed consistency guard
#### Goal
Make it impossible for the observed section to claim “no proof material declared” while the declared section shows proof URLs.

#### Scope
- ensure collapse only occurs when the declared proof surface is truly empty
- preserve per-kind observed lines whenever any proof URL is declared

#### Acceptance criteria
1. The collapsed undeclared summary cannot appear if any proof URL is declared.
2. Tests cover at least one contradiction-prevention case.
3. The declared proof section remains the source of truth for proof-surface presence.

#### Why this is second
Important safeguard, but easiest to add once the collapse predicate exists.

---

### Task 3 — Neutral wording + comparability check
#### Goal
Keep the collapsed summary calm and non-failure-shaped while preserving comparability in mixed cases.

#### Scope
- keep the summary explanatory and neutral
- ensure mixed states still show per-kind lines so contrasts remain visible

#### Acceptance criteria
1. Collapsed wording reads like absence of declaration, not failed effort.
2. Mixed cases still show separate lines such as:
   - `proofs: not-attempted`
   - `receipts: not-declared`
3. The underlying observed-state model remains intact in code.

#### Why this is third
Mostly presentation polish after the structural collapse rule + consistency guard are in place.

## Single next task
# **Build Task 1 — Strict all-undeclared collapse predicate**

### Smallest mergeable slice
Do not touch the observed-state derivation model.
Just:
- add the strict collapse rule in the observed-section renderer,
- keep per-kind output for any mixed state set,
- and prove the predicate with direct tests.

## What to avoid next
- no fuzzy “mostly undeclared” heuristics
- no collapse when any state is informative
- no contradiction with declared proof URLs
- no broader wording overhaul in the same slice

## Bottom line
The next build slice should prove one thing:

> AENS can compress repeated neutral undeclared output **only** when doing so preserves every meaningful distinction.
