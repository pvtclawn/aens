# One-Hundred-Seventy-First Slice Build — Immutable Class-Template Mapping (2026-03-22 11:59 UTC)

## Goal
Implement Task 1 from `PLAN-TASK2-STRICT-DIAGNOSTICS-HARDENING-V1-2026-03-22-1159.md`:
- immutable shared class-template mapping,
- summary/artifact parity guards,
- no local class-text override drift.

## Implementation

### 1) Added centralized strict class summary template map
Updated `src/public-surface.ts`:
- introduced `SURFACE_FAILURE_CLASS_SUMMARY_CUES` (frozen mapping for all strict failure classes),
- added `summarizeSurfaceFailure(...)` helper to ensure one mapping path is used for failure summaries,
- updated `summarizeSurfaceCheck(...)` to consume shared map instead of per-case inline strings.

### 2) Kept strict class resolution and summary generation aligned
`resolveSurfaceFailureClass(...)` remains canonical source for class token,
while summary text now derives from the shared immutable cue map.

### 3) Added parity-focused tests
- `src/public-surface.test.ts`
  - asserts cue map stability (`alias-expired` governance wording),
  - asserts summarizer uses shared cue mapping.
- `src/submission-artifacts.test.ts`
  - adds parity assertion linking artifact `failureClass` with shared cue map expectations.

## Validation
- `bunx tsc --noEmit` pass
- targeted suite pass (`23 pass`):
  - `public-surface-marker-contract`
  - `public-surface`
  - `public-proof-state`
  - `submission-artifacts`
  - `discover-research-service`
- `bun run check-public-surface` fully green (`Preferred public surface ready: yes`)

## Outcome
Task 1 is implemented: strict failure-summary wording is now driven by one immutable shared template map, and tests lock class-to-summary mapping parity to reduce drift across checker/artifact surfaces.

## Next smallest handoff
Lane C should verify rollout boundaries:
1) shared-template mapping usage and stability,
2) summary/artifact class-token parity under failed surfaces,
3) public-surface readiness remains unchanged.