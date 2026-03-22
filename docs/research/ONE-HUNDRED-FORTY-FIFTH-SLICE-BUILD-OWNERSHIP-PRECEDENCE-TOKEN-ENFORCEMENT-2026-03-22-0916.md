# One-Hundred-Forty-Fifth Slice Build — Ownership-Precedence Token Enforcement (2026-03-22 09:16 UTC)

## Goal
Implement Task 1 from `PLAN-OWNERSHIP-PRECEDENCE-ENFORCEMENT-V1-2026-03-22-0911.md`:
- require suppression/context tokens during ownership-failure preemption,
- keep stage triad as context only,
- prevent stage-primary wording in compact output when preemption is active.

## Implementation

### 1) Added ownership-preemption signal derivation
Updated `src/stage-gate-adapter-parity.ts`:
- new `OwnershipFailureClass` type (`none|unmapped|mismatch`),
- new `StageGateOwnershipPreemptionSignals` shape,
- new `deriveStageGateOwnershipPreemptionSignals(payload)` helper.

Behavior:
- `resolved|no-primary` => no preemption (`false/false`),
- `unmapped|mismatch` => `stagePrimarySuppressed=true` + `stageStatusContextOnly=true`.

### 2) Enforced compact token presence
`formatStageGateCompactSummary(payload)` now always includes deterministic preemption tokens:
- `ownershipFailureClass=...`
- `stagePrimarySuppressed=...`
- `stageStatusContextOnly=...`

### 3) Removed stage-primary wording during ownership failure
When ownership preemption is active, compact primary token now uses ownership-contract reason:
- `primary=ownership-contract:<contractReasonCode>`

Instead of stage-formatted primary (`<stage>:<reasonCode>`), preventing stage-first remediation cues during ownership failures.

## Tests
Extended `src/stage-gate-adapter-parity.test.ts` to lock Task 1 behavior:
- resolved fixture => tokens present with `none/false/false`,
- mismatch fixture => required tokens + ownership-contract primary + explicit non-stage-primary assertion,
- unmapped fixture => required tokens + ownership-contract primary + explicit non-stage-primary assertion.

## Validation
- `bunx tsc --noEmit` pass
- targeted suite pass (`13 pass`)
  - `stage-gate-adapter-parity`
  - `reason-stage-ownership`
  - `machine-payload-parity`
  - `discover-research-service`
- `app` build pass
- `bun run check-public-surface` green

## Outcome
Task 1 is implemented: ownership-failure outputs now deterministically carry suppression/context tokens and avoid stage-primary wording while preserving stage triad context.

## Next smallest handoff
Lane C should verify rollout boundaries:
1) token presence invariants in ownership-failure outputs,
2) ownership-contract primary rendering during preemption,
3) no discover/public-surface regressions.
