# Declared/observed consistency guard for AENS proof output (2026-03-19 04:19 UTC)

## Purpose
Freeze the smallest hardening rule after the neutral-undeclared collapse slice passed.

Current situation:
- the collapsed observed summary is correct today,
- but its safety depends on the observed-state derivation path continuing to imply declared/observed consistency.

The next slice should make that invariant explicit near the collapse behavior itself.

## Problem statement
The collapsed observed summary says:
- `No proof fetch observations: no proof material declared.`

That line is only safe when the declared proof surface is truly empty.

If future changes ever allow this summary to appear while the declared section shows proof URLs or `Proof surface present: yes`, the report would become self-contradictory.

## Minimal guard rule
### The neutral collapsed observed summary may render **only if all of the following are true**
1. `declared.proofSurfacePresent === false`
2. `declared.proofsUrl === null`
3. `declared.receiptsUrl === null`
4. every observed proof state is `not-declared`

If any of these fail, the observed section must **not** collapse.

## Safe fallback behavior
If a contradictory combination somehow appears in the future, the renderer should prefer the more explicit output:
- keep per-kind observed lines
- do **not** emit the collapsed undeclared summary

That keeps the report from making a stronger summary claim than the underlying views support.

## Design rationale — collapsed summaries are cross-view claims
A supporting software-design lesson from `books_and_papers/003_solid_software.pdf` and `books_and_papers/006_think_distributed_systems.pdf`:
- make invariants explicit,
- and do not let derived convenience summaries drift away from the source-of-truth state they summarize.

Applied to AENS:
- the collapsed undeclared observed line is not a primitive fact,
- it is a **derived cross-view claim** about both declaration state and observation state.

So it must be computed from both source-of-truth views together:
- declared proof view
- observed proof view

and never from observed state alone.

## Why this is the right smallest move
This does not reopen the semantics.
It simply hardens the already-correct readability optimization by making its preconditions explicit.

## Acceptance criteria for the next build slice
1. Collapse predicate requires both:
   - fully empty declared proof view
   - all observed states equal `not-declared`
2. A synthetic contradiction case with declared proof URLs cannot produce the collapsed summary.
3. Mixed or declared cases continue to show per-kind observed lines.
4. Tests assert the guard directly.

## Example
### Safe to collapse
Declared:
- no proofs URL
- no receipts URL
- proof surface present: no

Observed:
- `proofs: not-declared`
- `receipts: not-declared`

Result:
- `No proof fetch observations: no proof material declared.`

### Must not collapse
Declared:
- `proofsUrl` exists

Observed:
- `proofs: not-declared`
- `receipts: not-declared`

Result:
- keep per-kind lines or otherwise avoid the collapsed summary
- because the report would otherwise contradict itself

## Bottom line
The next hardening slice should make one invariant explicit:

> **AENS may collapse undeclared observed output only when the declared proof surface is truly empty.**
