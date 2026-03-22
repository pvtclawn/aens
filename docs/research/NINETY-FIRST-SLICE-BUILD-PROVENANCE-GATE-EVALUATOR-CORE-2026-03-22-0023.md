# Ninety-First Slice Build — Provenance Gate Evaluator Core (2026-03-22 00:23 UTC)

## Goal
Implement Task 1 from `PLAN-PROVENANCE-GATE-EVALUATOR-AND-COMPAT-EXPIRY-V1-2026-03-22-0018.md`:
- computed release-eligibility evaluator,
- tuple-binding checks,
- deterministic blocker reason codes,
- tests.

## Changes shipped

### 1) New provenance gate evaluator module
Added `src/provenance-gate.ts` with:
- artifact metadata + expected tuple interfaces,
- computed gate evaluation result (`releaseEligible`, `primaryBlockerReasonCode`, `bindingTupleMatches`),
- deterministic blocker precedence:
  1. missing tuple values -> `artifact-provenance-missing`
  2. tuple mismatch -> `artifact-binding-tuple-mismatch`
  3. non-strict mode -> `artifact-mode-not-release-eligible`
  4. non-`manifest-valid` status -> `artifact-status-not-manifest-valid`

Notably, evaluator ignores any inbound `releaseEligible` assertion and derives eligibility from predicates.

### 2) Test coverage for spoof/mismatch paths
Added `src/provenance-gate.test.ts` covering:
- strict positive path with forged `releaseEligible=false` input still computing `true`,
- tuple mismatch rejection precedence over mode/status,
- fail-closed missing tuple values,
- compat-mode rejection even with forged `releaseEligible=true`,
- manifest-invalid rejection path.

### 3) Export surface update
Updated `src/index.ts` to export `provenance-gate` module.

## Validation
```bash
bunx tsc --noEmit
bun test src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- typecheck pass,
- targeted suite pass (`22 pass`),
- public surface check remains green.

## Contract guardrails
- no discover API schema changes,
- no write execution automation,
- release eligibility now computed and resistant to forged input flag claims in evaluator core.
