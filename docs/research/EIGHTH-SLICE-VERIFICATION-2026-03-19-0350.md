# Eighth-slice verification — AENS explicit observed-state view (2026-03-19 03:50 UTC)

## Purpose
Verify whether the new explicit observed-state view actually strengthens the standalone AENS thesis and choose the next smallest load-bearing move.

## Checks rerun
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect vitalik.eth --with-links`
- synthetic observed-state inspection via `createObservedProofFetchViews(...)`
- synthetic observed-section inspection via `createReportSections(...)`

## Current evidence
### 1. The observed layer is now a real state model
The report no longer uses raw bundles like:
- `reachable=yes/no, valid JSON=yes/no, http status=...`

Instead, the observed layer now derives explicit states:
- `not-declared`
- `not-attempted`
- `fetch-failed`
- `content-invalid`
- `content-parsed`

That is the exact structural improvement the previous research/challenge cycle was trying to force.

### 2. State-first output is working
Live ordinary ENS output (`vitalik.eth`) now shows:
- `proofs: not-declared`
- `receipts: not-declared`

Synthetic failure-state output shows:
- `proofs: fetch-failed (http 503)`
- `receipts: content-invalid (http 200, invalid JSON)`

That means the state label is now the primary signal and transport detail is secondary context.

### 3. The slice materially improves the thesis
Before this slice, the observed section still looked implementation-shaped.
After this slice, the operational layer reads like a small trust-relevant state machine.

That is real progress in making AENS feel more like a trust debugger than a transport dump.

## What this slice still does **not** solve
### 1. Undeclared output is still somewhat noisy on ordinary ENS profiles
For names like `vitalik.eth`, the observed section now prints:
- `proofs: not-declared`
- `receipts: not-declared`

This is truthful, but slightly repetitive.
At the report level, the user may not need two separate negative lines when the declared section already says there is no linked proof material.

### 2. Invalid-content detail can still be tuned later
`content-invalid (http 200, invalid JSON)` is already decent.
There may still be room later for slightly better detail wording, but this is no longer the biggest gap.

### 3. The main semantic work is now done
The observed section is no longer the weak link in the report architecture.
The remaining work is mostly about concise presentation, not missing trust semantics.

## Verdict
The eighth slice **passes**.

It succeeds at what it was supposed to do:
- replace raw transport output with an explicit observed-state model and state-first rendering.

That is meaningful trust/UX progress for AENS.

## Next-slice decision
### Option A — neutral undeclared handling + concise observed output
Best next move.

Now that the observed-state semantics are correct, the most obvious remaining roughness is output concision for ordinary ENS profiles.
AENS should likely collapse or neutralize repeated undeclared lines when they add little value.

### Option B — richer invalid-content detail
Useful, but lower priority.
The current detail is already good enough to be honest.

## Chosen next slice
# **Neutral undeclared handling + concise observed output**

### Smallest useful shape
1. keep the explicit observed-state model intact
2. make undeclared proof kinds render more concisely/neutral when appropriate
3. preserve the ability to show per-kind states when they are actually informative

### Why this is next
- it is now the narrowest visible roughness
- it builds on the state model without reopening semantics
- it improves readability for ordinary ENS profiles without weakening the trust story

## On-chain decision
No on-chain action needed for this verification pass.
The work remains purely offchain trust/report semantics.

## Bottom line
The observed-state slice worked.

The next smallest move is not another semantics overhaul.
It is a readability cleanup so ordinary ENS profiles do not get cluttered by multiple neutral `not-declared` lines.
