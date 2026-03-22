# One-Hundred-Twenty-First Slice Build — Dual-Schema Cutoff Phase Evaluator (2026-03-22 03:23 UTC)

## Goal
Implement Task 1 from `PLAN-DUAL-SCHEMA-CUTOFF-HARDENING-V1-2026-03-22-0318.md`:
- shared UTC dual-schema cutoff phase evaluator,
- exact boundary semantics (`now == cutoffAt` => hard-cutoff),
- fail-closed cutoff-metadata validation.

## Changes shipped

### 1) New shared phase evaluator module
Added `src/dual-schema-cutoff-phase.ts`:
- `evaluateDualSchemaCutoffPhase({ evaluatedAt, policy })`
- lifecycle phases:
  - `prepare`
  - `warning`
  - `hard-cutoff`

Deterministic phase semantics:
- `hard-cutoff` when `evaluatedAt >= cutoffAt`
- `warning` when `warningFrom <= evaluatedAt < cutoffAt`
- `prepare` otherwise

### 2) Fail-closed metadata validation
Evaluator now fails closed with deterministic error payload when policy metadata is invalid:
- missing/non-empty-string checks for key policy fields,
- invalid timestamp checks (`evaluatedAt`, `warningFrom`, `cutoffAt`),
- invalid window ordering check (`cutoffAt` must be later than `warningFrom`).

Error contract:
- `ok: false`
- `reasonCode: fixture-schema-cutoff-policy-invalid`
- `path`
- `message`

### 3) Boundary and validation tests
Added `src/dual-schema-cutoff-phase.test.ts` covering:
- `prepare` before warning window,
- `warning` at warning start and before cutoff,
- `hard-cutoff` at exact cutoff boundary and after,
- fail-closed invalid metadata scenarios (bad timestamp, invalid window order).

### 4) Export surface update
Updated `src/index.ts` to export `dual-schema-cutoff-phase`.

## Validation
```bash
bunx tsc --noEmit
bun test src/dual-schema-cutoff-phase.test.ts src/parity-fixture-semantic-consistency.test.ts src/machine-payload-parity.test.ts src/policy-blocker-mapper-output.test.ts src/grace-window-deadline.test.ts src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- typecheck pass,
- targeted suite pass (`48 pass`),
- public surface check remains green.

## Contract guardrails
- no discover/public API schema changes,
- no first-seen provenance registry logic yet (next tasks),
- phase classification now centralized and deterministic for shared local/CI reuse.
