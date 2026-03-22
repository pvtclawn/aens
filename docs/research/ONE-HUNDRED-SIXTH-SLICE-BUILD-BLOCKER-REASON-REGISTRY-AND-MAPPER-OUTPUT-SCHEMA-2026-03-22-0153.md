# One-Hundred-Sixth Slice Build — Blocker Reason Registry + Mapper Output Schema (2026-03-22 01:53 UTC)

## Goal
Implement Task 1 from `PLAN-DETERMINISTIC-BLOCKER-MAPPER-INTEGRATION-GUARDRAILS-V1-2026-03-22-0148.md`:
- central blocker reason-code registry,
- deterministic blocker-mapper output schema,
- unregistered-code fail tests.

## Changes shipped

### 1) Central reason-code registry
Added `src/policy-blocker-reason-codes.ts`:
- canonical `POLICY_BLOCKER_REASON_CODES` registry,
- type `PolicyBlockerReasonCode`,
- helpers:
  - `isPolicyBlockerReasonCode(...)`
  - `assertPolicyBlockerReasonCode(...)`

This removes ad-hoc blocker string definitions from downstream consumers.

### 2) Deterministic blocker-mapper output schema
Added `src/policy-blocker-mapper-output.ts`:
- canonical mapper output types:
  - `PolicyStateSummary`
  - `PolicyBlockerMapperOutput`
  - `PolicyUnknownStateDiagnostic`
- builder `buildPolicyBlockerMapperOutput(...)` with guardrails:
  - primary reason code must be registered,
  - secondary reason codes must be registered,
  - duplicate secondary reason rejection,
  - secondary list must not repeat primary,
  - unknown-state diagnostics require `primaryBlockerReasonCode=artifact-policy-state-unknown`,
  - fail-closed guard when `releaseEligibleByPolicy=false` and primary blocker is missing.

### 3) Test coverage (unregistered-code fail paths)
Added `src/policy-blocker-mapper-output.test.ts` with coverage for:
- registry recognition/assertion of known codes,
- unregistered primary reason code rejection,
- unregistered secondary reason code rejection,
- unknown-state invariant enforcement,
- happy-path schema construction for registered reason codes.

### 4) Export surface update
Updated `src/index.ts` to export:
- `policy-blocker-reason-codes`
- `policy-blocker-mapper-output`

## Validation
```bash
bunx tsc --noEmit
bun test src/policy-blocker-mapper-output.test.ts src/grace-window-deadline.test.ts src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- typecheck pass,
- targeted suite pass (`36 pass`),
- public surface check remains green.

## Contract guardrails
- no discover/public API schema changes,
- no CI/CLI adapter behavior overrides in this slice,
- reason-code/mapper schema foundation now centralized for parity and conformance work in follow-up slices.
