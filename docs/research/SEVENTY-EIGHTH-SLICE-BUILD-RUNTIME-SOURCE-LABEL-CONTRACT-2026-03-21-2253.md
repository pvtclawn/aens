# Seventy-Eighth Slice Build — Runtime Source-Label Contract (2026-03-21 22:53 UTC)

## Goal
Implement Task 1 from `PLAN-CHAIN-FIRST-SOURCE-LABEL-WRITE-INTENT-VERIFICATION-V1-2026-03-21-2248.md`:
- runtime source-label contract for discover web flow,
- fail-closed unknown-source handling,
- tests,
- no API schema changes.

## Changes shipped

### 1) New source-label contract module
Added `src/discover-source-label.ts`:
- source tags:
  - `demo-fixture`
  - `live-chain-direct`
  - `live-chain-via-service`
- runtime mode→source mapping via `sourceTagForLookupMode(...)`
- fail-closed view mapping via `toDiscoverSourceView(...)`:
  - known tags => trusted labels
  - unknown tags => warning + de-trusted label

### 2) Discover web UI now renders runtime-bound source labels
Updated `app/src/discover-research-page.tsx`:
- tracks runtime source tag in state,
- derives user-facing source label from the contract module,
- displays both source label and raw source tag in UI,
- renders a `Source integrity warning` card when unknown source tags appear.

### 3) Test coverage
Added `src/discover-source-label.test.ts`:
- mode→tag mapping checks,
- unknown mode fail-closed check,
- known source label checks,
- unknown source warning/de-trust checks.

## Validation
```bash
bunx tsc --noEmit
bun test src/discover-source-label.test.ts src/discover-research.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- Typecheck pass.
- Targeted tests pass (`13 pass`).
- Public surface check remains green.

## Contract guardrails
- No API contract changes (service schema untouched).
- Existing discover semantics preserved.
- Trust-source display now uses runtime mapping instead of static copy.
