# Plan — Dual-Schema Cutoff Hardening v1 (2026-03-22 03:18 UTC)

## Goal
Freeze a compact implementation plan that makes dual-schema cutoff enforcement non-bypassable and deterministic across local + CI execution paths.

Focus areas:
1. shared UTC phase evaluator with boundary tests,
2. tamper-resistant first-seen provenance registry checks,
3. deterministic blocking/advisory mixed-outcome reporting contract.

## Smallest shippable milestone
Ship one thin governance vertical that prevents cutoff ambiguity before parity comparisons run:
- one shared phase evaluator consumed by local + CI,
- deterministic first-seen provenance checks for deprecated-schema additions,
- stable blocker/advisory reporting order for mixed fixture outcomes.

## Tasks (1–3) with acceptance criteria

### Task 1 — Shared UTC phase evaluator + boundary tests
Implement a shared lifecycle classifier for `prepare` / `warning` / `hard-cutoff` based on UTC timestamps.

Required semantics:
- `warning` when `warningFrom <= now < cutoffAt`
- `hard-cutoff` when `now >= cutoffAt`
- `prepare` otherwise

**Acceptance criteria**
- local and CI paths call the same phase evaluator module,
- exact boundary tests lock `now == cutoffAt` to `hard-cutoff`,
- evaluator output includes `evaluatedAtUtc`, `phase`, and policy timestamps,
- invalid/missing cutoff metadata fails closed with deterministic reason code.

---

### Task 2 — Tamper-resistant first-seen provenance registry checks
Define provenance source and validation rules for deprecated-schema new-addition blocking.

Required checks:
- fixture ID first-seen schema/version provenance cannot be user-edited inline,
- first-seen registry binds `fixtureId + schemaVersion + content hash` (and path where applicable),
- new deprecated-schema fixtures in warning/hard-cutoff phases are blocked deterministically.

**Acceptance criteria**
- provenance mismatch or missing first-seen record fails closed,
- duplicate fixture ID or fixture-ID mutation attempts are detected and blocked,
- tests cover legitimate legacy fixture allowance vs blocked new deprecated addition,
- diagnostics include `fixtureId`, expected/observed provenance state, and fix path.

---

### Task 3 — Deterministic blocking/advisory mixed-outcome reporting contract
Implement stable ordering and summary rules when fixture set contains mixed warning + blocking outcomes.

Required behavior:
- deterministic precedence (policy-invalid > hard-cutoff > deprecated-new-addition > warning advisory),
- explicit counts:
  - `blockingFixtureCount`
  - `advisoryFixtureCount`,
- deterministic fixture ID ordering inside each severity group.

**Acceptance criteria**
- same fixture bundle always yields identical primary blocker + ordered grouped output,
- warning-only cases never mask blocking cases,
- compact summary includes phase + primary reason + next action,
- tests lock ordering and mixed-outcome grouping behavior.

## Out of scope (v1)
- schema migration authoring automation
- policy editing CLI
- adapter prose localization

## Next lane handoff
Lane B: implement Task 1 only (shared UTC phase evaluator + exact boundary tests + fail-closed metadata validation), then run focused suite and public-surface checks.
