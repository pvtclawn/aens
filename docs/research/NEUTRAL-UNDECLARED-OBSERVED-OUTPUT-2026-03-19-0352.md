# Neutral undeclared handling for observed proof output (2026-03-19 03:52 UTC)

## Purpose
Define the smallest readability rule needed after the observed-state slice passed.

Current roughness:
- for ordinary ENS profiles with no proof material declared,
- the observed section prints two neutral lines:
  - `proofs: not-declared`
  - `receipts: not-declared`

That is truthful, but a little noisy when the declared section already says there is no linked proof material.

## Problem statement
The observed-state model is now semantically correct.
The remaining issue is presentation concision.

The report should avoid spending extra vertical space repeating neutral undeclared states when they do not add new information.

## Minimal rule
### Collapse fully undeclared observed output into one neutral summary line
If **all** proof kinds in the observed section are `not-declared`, render a single neutral line instead of one line per kind.

Preferred line:
- `No proof fetch observations: no proof material declared.`

## Why this is safe
This does **not** weaken the state model because:
- the declared section still shows whether proofs/receipts URLs exist,
- the observed-state model still exists in code,
- and per-kind lines can still be rendered whenever they become informative.

## When to keep per-kind observed lines
Do **not** collapse the section if any observed state is more informative than `not-declared`, such as:
- `not-attempted`
- `fetch-failed`
- `content-invalid`
- `content-parsed`

In those cases, the per-kind lines matter and should remain visible.

## Examples
### Ordinary ENS profile (`vitalik.eth`-like)
Instead of:
- `proofs: not-declared`
- `receipts: not-declared`

Prefer:
- `No proof fetch observations: no proof material declared.`

### Partial declaration
If only one kind exists:
- `proofs: not-attempted`
- `receipts: not-declared`

Keep both lines, because the state contrast is meaningful.

### Failure / invalid / parsed
Keep lines such as:
- `proofs: fetch-failed (http 503)`
- `receipts: content-invalid (http 200, invalid JSON)`
- `receipts: content-parsed (http 200)`

## Acceptance criteria for the next build slice
1. If all observed proof states are `not-declared`, the observed section collapses to one neutral summary line.
2. If any observed proof state is more informative than `not-declared`, keep per-kind lines.
3. The explicit observed-state model remains intact in code.
4. Tests cover:
   - all-undeclared collapse
   - mixed-state no-collapse case

## Why this is the next smallest move
The operational semantics are now correct.
This is a readability cleanup that removes repetitive negative output without weakening the trust story.

## Bottom line
The next slice should make ordinary ENS profiles quieter, not dumber.
