# Twelfth-slice verification — AENS contrasting capability-authority examples (2026-03-19 10:14 UTC)

## Purpose
Verify whether the new contrasting capability-authority examples materially improve the standalone AENS story, and decide what the next smallest move should be now that the example surface covers more than one authority state.

## Checks rerun
- `git status -sb`
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect --example parent-authorized-capability`
- `bun run inspect --example unlisted-child-capability`
- `bun run inspect --example identity-mismatch-capability`

## Current evidence
### 1. The repo is clean and the expanded example surface is stable
`git status -sb` returned a clean branch state before verification.
The expanded example slice passed tests and typecheck without follow-up fixes.

That means this slice is not another “works only in one local branch state” artifact.

### 2. The authority classifier is now legible as a model, not just a hidden implementation detail
The CLI now renders three contrasting deterministic states through the same report path:
- `parent-authorized`
- `unlisted-child`
- `identity-mismatch`

Each example clearly exposes the intended differences in:
- listed-by-parent
- identity-matches-parent
- authority summary text

This materially improves the standalone story because a reader can now understand what AENS is classifying without reading unit tests or source first.

### 3. The live ordinary ENS negative path still stays distinct
The live `vitalik.eth` check still renders:
- strong identity anchor
- no callable service surface
- `Capability authorization: not-a-capability-surface`

So the richer example coverage does not blur ordinary ENS profile metadata into capability authority.

### 4. The next bottleneck is now repo legibility, not classifier coverage
After this slice, the core model is visible enough from the CLI.
But the repo still lacks a top-level README or similarly obvious entry surface explaining:
- what AENS is
- what problem it solves
- which commands to run first
- how to interpret the three authority outcomes

So the main gap is now presentation / onboarding, not missing example-state coverage.

## Verdict
The twelfth slice **passes**.

It succeeds at its intended job:
- make the contrasting capability-authority states visible and runnable from the same deterministic CLI surface.

This is enough example coverage to stop treating the authority classifier as the main bottleneck.

## Next-move decision
### Option A — sample input mode next
Not the best next move.

It would add a second input surface before the first one is fully explained, which risks making AENS feel broader but less legible.

### Option B — public live positive example next
Valuable later, but not the smallest next move.

It would provide stronger public proof, but it depends on external ENS publication and coordination, while the current repo still lacks a simple top-level way to understand the product.

### Option C — README / demo-surface cleanup next
**Best next move.**

This is now the smallest change that most improves standalone legibility.
A concise README can turn the current example commands and trust report into a coherent demo flow instead of requiring a guided explanation.

## Chosen next slice
# **README / demo-surface cleanup**

### Smallest useful shape
Add a concise top-level README that covers:
- one-sentence project thesis
- which ENS records AENS reads today
- what the capability-authority statuses mean
- the first commands to run:
  - `bun run inspect vitalik.eth`
  - `bun run inspect --example parent-authorized-capability`
  - `bun run inspect --example unlisted-child-capability`
  - `bun run inspect --example identity-mismatch-capability`
- what is implemented now vs what is not yet implemented

## On-chain decision
No on-chain action needed for this verification pass.
The right next move is still offchain repo/demo-surface cleanup.

## Bottom line
The contrasting-example slice worked.

AENS can now show its authority model clearly from the CLI.
The next smallest meaningful move is to make that model **self-explanatory from the repo surface**, not to add another ingestion mode or jump straight to live publication.
