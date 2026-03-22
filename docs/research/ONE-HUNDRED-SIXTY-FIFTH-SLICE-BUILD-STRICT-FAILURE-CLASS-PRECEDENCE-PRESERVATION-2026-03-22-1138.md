# One-Hundred-Sixty-Fifth Slice Build — Strict Failure-Class Precedence + Preservation (2026-03-22 11:38 UTC)

## Goal
Implement Task 1 from `PLAN-STRICT-MARKER-FAILURE-DIAGNOSTICS-HARDENING-V1-2026-03-22-1133.md`:
- deterministic failure-class precedence,
- end-to-end class preservation,
- no-downgrade behavior.

## Implementation

### 1) Added strict failure-class model + precedence resolver
Updated `src/public-surface.ts`:
- introduced `SurfaceFailureClass`:
  - `mode-invalid`
  - `collision-blocked`
  - `alias-expired`
  - `marker-missing`
  - `http-failure`
- added deterministic precedence resolver (`resolveSurfaceFailureClass`) with explicit ordering.

### 2) Wired no-downgrade preservation semantics
`resolveSurfaceFailureClass` now preserves stricter upstream class hints (`result.failureClass`) and refuses to downgrade to generic `marker-missing` when stricter classes are present.

`surfaceCheckPassed` now relies on resolved failure class first:
- any failure class => fail,
- success requires no class + valid marker pass path.

### 3) Propagated failure class through checker/artifact pipeline
Updated `src/public-proof-state.ts`:
- `checkSurface` computes and attaches `failureClass` per surface result.

Updated `src/submission-artifacts.ts`:
- artifact surface checks now include `failureClass` field,
- builder resolves class via shared resolver and preserves it in artifact payload.

### 4) Added focused tests for precedence/preservation
Updated `src/public-surface.test.ts`:
- added explicit no-downgrade test (`collision-blocked` stays strict even when marker match is none).

Updated `src/submission-artifacts.test.ts`:
- asserts `failureClass` is present and preserved in artifact checks (`null` on success, `http-failure` on 404 case).

## Validation
- `bunx tsc --noEmit` pass
- targeted suite pass (`21 pass`):
  - `public-surface-marker-contract`
  - `public-surface`
  - `public-proof-state`
  - `submission-artifacts`
  - `discover-research-service`
- `bun run check-public-surface` fully green

## Outcome
Task 1 is implemented: failure classes now have deterministic precedence, are preserved end-to-end through checker and artifacts, and cannot silently degrade into weaker generic classes when stricter diagnostics are available.

## Next smallest handoff
Lane C should verify Task 1 rollout boundaries:
1) deterministic class precedence under mixed signals,
2) no-downgrade preservation from surface result to artifact,
3) checker readiness remains green under current deployment.