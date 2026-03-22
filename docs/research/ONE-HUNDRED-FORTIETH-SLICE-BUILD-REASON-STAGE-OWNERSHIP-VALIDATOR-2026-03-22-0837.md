# One-Hundred-Fortieth Slice Build — Reason→Stage Ownership Validator (2026-03-22 08:37 UTC)

## Goal
Implement Task 1 from `PLAN-REASON-STAGE-OWNERSHIP-VALIDATOR-HARDENING-V1-2026-03-22-0832.md`:
- ship shared ownership-validator + canonical registry primitive,
- wire it into stage-gate output path,
- prove deterministic `resolved|unmapped|mismatch` outcomes.

## Implementation

### 1) Added shared ownership primitive
Created `src/reason-stage-ownership.ts`:
- canonical provenance reason→stage ownership registry,
- registry identity metadata (`REASON_STAGE_OWNERSHIP_REGISTRY_VERSION`, deterministic registry hash),
- deterministic ownership resolution API `resolveReasonStageOwnership`,
- fail-closed unmapped contract reason: `fixture-provenance-stage-reason-unmapped`,
- deterministic mismatch contract reason: `fixture-provenance-stage-owner-mismatch`.

### 2) Wired primitive into stage-gate path
Updated `src/stage-gate-adapter-parity.ts` with:
- `resolvePrimaryBlockerReasonStageOwnership(payload)`
- primary blocker ownership now resolves through the shared primitive with claimed stage owner + reason code.

### 3) Added deterministic tests
- New `src/reason-stage-ownership.test.ts`:
  - resolved known reason,
  - unmapped fail-closed result,
  - mismatch result with canonical-vs-claimed owner divergence.
- Extended `src/stage-gate-adapter-parity.test.ts`:
  - resolved ownership status for known primary blocker,
  - mismatch ownership status when claimed stage diverges,
  - unmapped fail-closed status for unknown reason code.

## Validation
- `bunx tsc --noEmit` pass
- targeted suite pass (`25 pass`)
  - `reason-stage-ownership`
  - `stage-gate-adapter-parity`
  - `machine-payload-parity`
  - `write-intent-validation-issues`
  - `migration-lineage-graph`
  - `first-seen-provenance-registry`
  - `discover-research-service`
- `bun run check-public-surface` green

## Outcome
Task 1 is implemented as a shared code primitive with deterministic ownership outcomes and stage-gate integration, without discover/public-surface regressions.

## Next smallest handoff
Lane C should verify rollout boundaries for this slice:
1) shared primitive use in stage-gate path,
2) deterministic ownership statuses + contract reasons,
3) no discover/public-surface regressions.
