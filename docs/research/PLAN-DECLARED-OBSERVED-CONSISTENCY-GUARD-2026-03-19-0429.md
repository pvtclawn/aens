# Plan — declared/observed consistency guard (2026-03-19 04:29 UTC)

## Purpose
Turn the consistency-guard research + challenge notes into a small, guarded execution plan for the next AENS slice.

## Constraint from the challenge
The next slice must not become a local renderer-only check.
It only counts if declared/observed consistency becomes an explicit **cross-view invariant**, not a lucky side effect of the current derivation path.

## Chosen plan (ordered)

### Task 1 — Reusable cross-view guard predicate **(NEXT TASK)**
#### Goal
Define one explicit predicate that decides whether the collapsed undeclared observed summary is allowed.

#### Scope
The predicate should require all of the following:
- declared proof view is fully empty
- `declared.proofSurfacePresent === false`
- `declared.proofsUrl === null`
- `declared.receiptsUrl === null`
- every observed proof state is `not-declared`

If any condition fails, the renderer must keep the per-kind observed lines.

#### Acceptance criteria
1. Guard logic is implemented as a reusable predicate over the declared proof view + observed proof view.
2. The renderer uses that predicate rather than duplicating conditions inline.
3. The predicate is generic over the observed-state list and does not hardcode only today’s proof kinds.
4. Collapse is impossible when any declared proof URL exists.

#### Why this is first
This is the smallest move that turns the declared/observed relationship into an explicit invariant rather than a local formatter assumption.

---

### Task 2 — Synthetic contradiction tests
#### Goal
Prove the explicit guard is stronger than today’s happy-path derivation assumptions.

#### Scope
Add tests for cases that would be dangerous if the guard were missing, such as:
- declared proof URLs present while observed states are all `not-declared`
- partially inconsistent declared proof view fields
- mixed observed states that should never collapse

#### Acceptance criteria
1. Test: fully empty declared view + all `not-declared` → collapse allowed.
2. Test: declared proof URL present + all `not-declared` → collapse forbidden.
3. Test: mixed observed states → collapse forbidden.
4. Test: contradictory declared view fields cannot produce the collapsed summary.

#### Why this is second
This makes the hardening measurable instead of purely conceptual.

---

### Task 3 — Small renderer cleanup only if still needed
#### Goal
Keep the renderer simple after the invariant is in place.

#### Scope
- centralize collapse decision in one place
- avoid duplicated string logic
- keep summary wording neutral

#### Acceptance criteria
1. The renderer reads from the reusable guard predicate.
2. The collapsed summary string remains unchanged unless a wording change is clearly needed.
3. No extra semantic behavior is introduced beyond the invariant hardening.

#### Why this is third
This is cleanup after the actual invariant exists.

## Single next task
# **Build Task 1 — Reusable cross-view guard predicate**

### Smallest mergeable slice
Do not change the observed-state model again.
Just:
- add one explicit declared/observed collapse guard predicate,
- route the observed section through it,
- add contradiction tests,
- and keep the current CLI behavior green.

## What to avoid next
- no local one-off `if` around only the collapsed string
- no new semantics beyond the guard
- no wording churn unless necessary
- no new proof kinds or report sections

## Bottom line
The next build slice should prove one thing:

> AENS can only emit the collapsed undeclared observed summary when the declared proof view and observed proof view explicitly agree that no proof material exists.
