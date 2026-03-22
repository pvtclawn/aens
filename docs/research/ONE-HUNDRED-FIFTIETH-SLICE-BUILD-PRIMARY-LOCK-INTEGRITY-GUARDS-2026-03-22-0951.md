# One-Hundred-Fiftieth Slice Build — Primary-Lock Integrity Guards (2026-03-22 09:51 UTC)

## Goal
Implement Task 1 from `PLAN-IMMUTABLE-PRIMARY-LOCK-INTEGRITY-GLOSSARY-PARITY-V1-2026-03-22-0946.md`:
- add canonical enum/tuple guard primitives,
- wire lock-integrity hard-fail classification,
- add focused tests for alias rejection and `none => unlocked` enforcement.

## Implementation

### 1) Added canonical lock/source integrity guard module
Created `src/primary-lock-integrity.ts` with:
- canonical enums:
  - `PrimarySource = ownership-contract | stage-gate | none`
  - `PrimarySelectionReason = ownership-unmapped | ownership-mismatch | earliest-failing-stage | no-failure`
- tuple invariants:
  - `primarySource=none => primaryLocked=false`
  - `primarySource!=none => primaryLocked=true`
  - source/reason compatibility checks
- deterministic hard-fail classification:
  - `reasonCode = primary-lock-integrity-violation`

### 2) Wired stage-gate path to canonical lock-state validation
Updated `src/stage-gate-adapter-parity.ts`:
- added `deriveStageGatePrimaryLockState(payload)`
- lock/source state is now derived then validated through `validatePrimaryLockState(...)`
- compact summary now carries explicit lock diagnostics:
  - `primarySource`
  - `primaryLocked`
  - `primarySelectionReason`

### 3) Added targeted integrity tests
New `src/primary-lock-integrity.test.ts` verifies:
- canonical stage-gate lock state passes,
- alias source token is rejected with `primary-lock-integrity-violation`,
- contradictory tuple (`none + locked=true`) is rejected.

Extended `src/stage-gate-adapter-parity.test.ts` verifies:
- resolved path derives `stage-gate/locked/earliest-failing-stage`,
- mismatch/unmapped paths derive `ownership-contract/locked` with correct selection reason,
- compact summary includes lock/source/reason tokens consistently.

## Validation
- `bunx tsc --noEmit` pass
- targeted suite pass (`16 pass`):
  - `primary-lock-integrity`
  - `stage-gate-adapter-parity`
  - `reason-stage-ownership`
  - `machine-payload-parity`
  - `discover-research-service`
- app build pass
- `bun run check-public-surface` green

## Outcome
Task 1 is implemented: canonical lock/source enums and tuple guards now fail hard on integrity drift, and stage-gate diagnostics emit validated lock/source/reason fields for deterministic parity checks.

## Next smallest handoff
Lane C should verify rollout boundaries:
1. alias token rejection and tuple invariant enforcement,
2. deterministic lock/source/reason derivation across resolved vs ownership-failure cases,
3. no discover/public-surface regressions.
