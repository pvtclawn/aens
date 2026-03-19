# Capability-authority example coverage for AENS (2026-03-19 10:10 UTC)

## Purpose
Freeze the next AENS demo-surface decision now that the first positive capability example has passed verification.

## Current gap
AENS can now visibly show one happy path:
- `parent-authorized`

That is already better than a repo that only shows ordinary ENS names and negative-path sanity checks.
But the CLI/demo surface still does **not** make the full authority model legible, because two important contrasting states are still mostly trapped in tests and source:
- `unlisted-child`
- `identity-mismatch`

## Wrong next moves
### 1. Sample input / JSON mode first
Too early.
That would add a second ingestion path before the main ENS-native authority story is fully legible through the current CLI.

### 2. Live public positive example first
Valuable later, but too heavy as the next smallest move.
That depends on external publication / ownership state and is bigger than what the current loop needs.

### 3. More report semantics work first
Too late.
The report surface is already good enough to support broader example coverage.

## Best next slice
# **Richer deterministic example coverage for capability authority states**

## Smallest useful shape
Extend the existing `--example` path so the CLI can deterministically render at least three contrasting authority states:
- `parent-authorized`
- `unlisted-child`
- `identity-mismatch`

## Recommended implementation shape
1. Keep using the current `src/examples.ts` fixture registry.
2. Add two new example scenarios alongside the existing positive path.
3. Reuse the existing CLI/report/authorization pipeline exactly as-is.
4. Add tests that prove the example registry and rendered reports expose the intended contrasting statuses.

## Why this is the best next move
- makes the authority classifier legible without reading source
- keeps ENS load-bearing by staying inside the current CLI/report path
- expands product understanding without introducing a new input mode
- keeps the slice deterministic, offline, and mergeable

## Acceptance criteria
1. `listExampleIds()` exposes at least:
   - `parent-authorized-capability`
   - `unlisted-child-capability`
   - `identity-mismatch-capability`
2. Each example renders through the normal CLI/report flow.
3. The rendered output clearly shows the intended authority status.
4. Tests assert both scenario classification and visible report output.
5. No live ENS writes or new non-ENS input mode are required.

## Good boundary for the slice
### Include
- new deterministic example scenarios
- example tests
- one small research note for the slice

### Exclude
- live ENS publication
- sample JSON input mode
- new proof semantics
- README overhaul
- payment/invocation work

## Bottom line
The next smallest meaningful move is:

> **make the contrasting capability-authority states visible from the same deterministic CLI example path.**

That will make AENS feel more like a coherent ENS-native authority model and less like one happy-path demo plus a pile of hidden tests.
