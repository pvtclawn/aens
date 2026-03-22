# One-Hundred-Sixtieth Slice Build — Marker `matchMode` Fail-Closed + Normalized Overlap Guards (2026-03-22 10:53 UTC)

## Goal
Implement Task 1 from `PLAN-MARKER-MATCH-PRECISION-HARDENING-V1-2026-03-22-1048.md`:
- explicit `matchMode` contracts,
- fail-closed mode handling,
- normalized cross-domain overlap guards.

## Implementation

### 1) Added explicit `matchMode` to marker contracts
Updated `src/public-surface-marker-contract.ts`:
- introduced `SurfaceMarkerMatchMode` (`exact|token-boundary|contains`),
- added mandatory `matchMode` field to every marker contract,
- set current runtime/fallback contracts to `matchMode: 'exact'`.

### 2) Added normalized overlap guard primitives
In `src/public-surface-marker-contract.ts`:
- `normalizeMarkerText` (NFKC + whitespace collapse + case fold),
- `hasNormalizedMarkerOverlap`,
- `validateSurfaceMarkerContracts` + `assertSurfaceMarkerContractsValid`.

Validation now catches:
- invalid/unknown `matchMode` tokens,
- cross-domain normalized overlap between preferred-runtime and bootstrap-fallback marker sets.

Also removed the risky runtime research alias (`PrivateClawn Research Capability`) so contracts pass overlap checks.

### 3) Wired fail-closed matcher behavior
Updated `src/public-surface.ts`:
- `SurfaceCheckTarget` now carries `matchMode`,
- marker matcher uses explicit mode dispatcher,
- unknown/missing mode fails closed (`markerMatchType='none'`),
- `buildPreferredSurfaceTargets` and `buildFallbackSurfaceTarget` validate marker contracts via `assertSurfaceMarkerContractsValid()` before emitting targets.

Updated `src/public-proof-state.ts` to pass through `matchMode` in checks/results.

### 4) Added focused tests
- New `src/public-surface-marker-contract.test.ts`:
  - default contracts validate,
  - unknown `matchMode` rejected,
  - normalized overlap detection catches collisions.
- Updated `src/public-surface.test.ts`:
  - verifies explicit `matchMode` in targets,
  - verifies unknown-mode fail-closed behavior.
- Updated fixtures in `src/submission-artifacts.test.ts` for new `matchMode` field.

## Validation
- `bunx tsc --noEmit` pass
- targeted suite pass (`20 pass`):
  - `public-surface-marker-contract`
  - `public-surface`
  - `public-proof-state`
  - `submission-artifacts`
  - `discover-research-service`
- app build pass
- `bun run check-public-surface` fully green (`Preferred public surface ready: yes`)

## Outcome
Task 1 is implemented: marker contracts now require explicit `matchMode`, unknown modes fail closed, and normalized cross-domain overlap guards are enforced in the shared marker contract path.

## Next smallest handoff
Lane C should verify rollout boundaries for Task 1:
1) unknown-mode fail-closed behavior,
2) normalized overlap enforcement and collision-negative coverage,
3) preferred/fallback surface readiness remains green under current deployment.