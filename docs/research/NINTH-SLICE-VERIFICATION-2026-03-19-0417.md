# Ninth-slice verification — AENS neutral undeclared observed-output collapse (2026-03-19 04:17 UTC)

## Purpose
Verify whether the neutral-undeclared collapse slice actually strengthens the standalone AENS thesis and choose the next smallest load-bearing move.

## Checks rerun
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect vitalik.eth --with-links`
- synthetic mixed-state observed-section inspection via `createReportSections(...)`

## Current evidence
### 1. Pure undeclared sameness now collapses correctly
For ordinary ENS profiles like `vitalik.eth`, the observed section now renders one neutral line:
- `No proof fetch observations: no proof material declared.`

That is more concise than:
- `proofs: not-declared`
- `receipts: not-declared`

while preserving the same truth.

### 2. Mixed cases still stay expanded
The synthetic mixed-state check still renders separate lines such as:
- `proofs: not-attempted`
- `receipts: not-declared`

That means the new collapse rule is not hiding meaningful contrast.

### 3. The slice improves readability without regressing the trust model
The explicit observed-state model still exists in code, and the collapse is now clearly a small readability optimization layered on top of it.

That is the correct shape.

## What this slice still does **not** solve
### 1. Declared/observed consistency is currently implicit, not explicit
In the current implementation, contradiction is avoided because `not-declared` is derived from the absence of proof URLs.
So the new collapse cannot happen in contradictory declared-URL cases under today’s model.

That is good.
But the consistency protection is still somewhat implicit in the derivation path rather than expressed as an explicit guard near the collapse behavior.

### 2. Neutral wording is already good enough
The current collapsed line is calm and explanatory.
Further wording work is optional and lower priority than a small consistency hardening pass.

## Verdict
The ninth slice **passes**.

It succeeds at what it was supposed to do:
- compress pure neutral sameness,
- while preserving meaningful differences.

That makes ordinary ENS profiles calmer without weakening the trust story.

## Next-slice decision
### Option A — declared/observed consistency guard next
Best next move.

The collapse behavior is currently correct, but a small explicit guard would make the invariant clearer and harder to regress later.

### Option B — neutral wording polish next
Lower priority.
The wording is already acceptable.

## Chosen next slice
# **Declared/observed consistency guard**

### Smallest useful shape
Add an explicit consistency check so the neutral collapsed undeclared summary cannot render if the declared proof view is non-empty, even if future changes accidentally distort the observed-state derivation path.

### Why this is next
- small hardening pass
- improves future robustness without reopening semantics
- keeps the report invariants explicit rather than incidental

## On-chain decision
No on-chain action needed for this verification pass.
The work remains report/trust semantics only.

## Bottom line
The neutral-undeclared collapse slice worked.

The next smallest move is a tiny explicit guard that makes the declared/observed consistency invariant harder to break in future edits.
