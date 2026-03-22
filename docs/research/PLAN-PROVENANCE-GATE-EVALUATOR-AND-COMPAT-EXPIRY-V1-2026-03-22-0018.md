# Plan — Provenance Gate Evaluator + Commit/Version Allowlist + Compat-Expiry v1 (2026-03-22 00:18 UTC)

## Goal
Freeze a compact implementation plan that operationalizes strict/compat provenance policy into enforceable checks:
1. computed release-eligibility evaluator,
2. strict commit/version allowlist enforcement,
3. compat-usage expiry controls.

## Smallest shippable milestone
Ship one thin vertical proving release eligibility cannot be spoofed:
- evaluator computes eligibility from artifact predicates (never trusts input flag),
- tuple-binding checks enforce artifact continuity,
- strict CI policy rejects unsupported commit/version/mode states.

## Tasks (1–3) with acceptance criteria

### Task 1 — Provenance gate evaluator (computed eligibility + tuple binding)
Implement evaluator over artifact metadata and binding tuple:
- binding tuple: `intentPayloadHash + intentId + validatedCommit`
- evaluate:
  - `releaseEligible` (derived boolean)
  - `primaryBlockerReasonCode`
  - `gateStatus` summary

Rules:
- ignore incoming `releaseEligible` field if present,
- fail closed on missing tuple components,
- reject mixed artifact chains with tuple mismatch.

**Acceptance criteria**
- evaluator returns `releaseEligible=false` for any non-strict/missing/invalid predicate,
- forged `releaseEligible=true` input does not influence outcome,
- tuple mismatch produces deterministic blocker reason,
- unit tests cover positive strict path + spoof/mismatch negatives.

---

### Task 2 — Strict commit/version allowlist enforcement
Add CI-grade checks:
- exact `validatedCommit === expectedCommit`,
- `validatorVersion` in allowlist,
- `schemaVersion` in allowlist,
- `validationMode === strict` for release gating.

**Acceptance criteria**
- unknown version/schema fails closed with explicit reason code,
- commit mismatch fails closed with explicit reason code,
- strict pass path succeeds only when all predicates pass,
- CI script/test fixture demonstrates fail/pass matrix.

---

### Task 3 — Compat-usage expiry + non-release policy checks
Track compat usage and enforce bounded migration semantics:
- compat artifacts must declare `releaseEligible=false`,
- compat allowance includes expiry metadata (`compatExpiresAt` or policy window),
- release gate fails when latest artifact chain is compat-only or expired.

**Acceptance criteria**
- compat artifacts always produce non-release verdict,
- expired compat allowance fails with deterministic reason code,
- summary output includes primary blocker + gate progression line,
- tests cover non-expired advisory vs expired fail states.

## Out of scope (v1)
- write execution engine
- wallet signing flow
- on-chain convergence verifier implementation

## Next lane handoff
Lane B: implement Task 1 only (provenance gate evaluator with computed eligibility + tuple-binding checks + tests), leaving commit/version allowlist and compat-expiry enforcement for follow-up slices.
