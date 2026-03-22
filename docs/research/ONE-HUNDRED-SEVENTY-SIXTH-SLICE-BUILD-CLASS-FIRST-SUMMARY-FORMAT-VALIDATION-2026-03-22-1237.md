# One-Hundred-Seventy-Sixth Slice Build — Class-First Summary Format Validation (2026-03-22 12:37 UTC)

## Goal
Implement Task 1 from `PLAN-TASK2-ROLLOUT-MESSAGING-HARDENING-V1-2026-03-22-1232.md`:
- class-first summary format invariants,
- parser-safe class-token placement,
- wrapper compliance path via shared formatter validation.

## Implementation

### 1) Added parser/validator for class-first failure summaries
Created `src/surface-summary-format.ts`:
- `parseSurfaceFailureSummary(...)`
- `isClassFirstFailureSummary(...)`

Contract now expects class-first failure shape:
- `<surface>: <failureClass> (<cue>) (<url>)`

### 2) Wired failure summaries through class-first validator
Updated `src/public-surface.ts`:
- failure summaries now generated via `summarizeSurfaceFailure(...)` using class token + cue map,
- each generated failure summary is validated (`isClassFirstFailureSummary`) and throws on format drift,
- non-failure summaries (`ok`, `ok alias`) unchanged.

### 3) Updated tests for parser-safe class-token placement
- Added `src/surface-summary-format.test.ts` to validate parser behavior and reject prose-first failures.
- Updated `public-surface.test.ts` expected failure summaries to class-first format.
- Updated `submission-artifacts.test.ts` expected HTTP failure summary to class-first format.

## Validation
- `bunx tsc --noEmit` pass
- targeted suite pass (`25 pass`):
  - `surface-summary-format`
  - `public-surface-marker-contract`
  - `public-surface`
  - `public-proof-state`
  - `submission-artifacts`
  - `discover-research-service`
- `bun run check-public-surface` fully green

## Outcome
Task 1 is implemented: failure summaries now follow an enforced class-first parser-safe contract, reducing wrapper drift risk and preserving machine-recoverable class tokens in one-line outputs.

## Next smallest handoff
Lane C should verify Task 1 rollout boundaries:
1) class-first summary parser resilience,
2) no wrapper drift on failure-line format,
3) readiness non-regression under class-first output enforcement.