# Ninety-Third Slice Research — Commit/Version Allowlist Enforcement Boundary (2026-03-22 00:33 UTC)

## Goal
Freeze a compact boundary for strict commit/version allowlist enforcement on provenance artifacts, covering:
1. CI release policy details,
2. allowed-version governance,
3. fail-closed mismatch semantics.

## Current-state observations
- Provenance evaluator core exists (`src/provenance-gate.ts`) and already enforces tuple/mode/status logic.
- Commit/version/schema allowlist predicates are planned but not enforced yet in a dedicated CI gate.
- Existing workflow coverage is probe-window specific; provenance release-gate workflow does not exist yet.

## Boundary definition (v1)

### A) CI release gate policy (blocking)
Release gate for provenance artifacts must enforce all predicates simultaneously:
1. `validationMode === strict`
2. `status === manifest-valid`
3. `validatedCommit === expectedCommit` (exact string match)
4. `validatorVersion ∈ ALLOWED_VALIDATOR_VERSIONS`
5. `schemaVersion ∈ ALLOWED_SCHEMA_VERSIONS`

Rule:
- any predicate failure => release gate fail (no warning-only downgrade).

---

### B) Commit binding semantics
`expectedCommit` must be resolved by CI from the release context (not from artifact payload), then compared exactly.

Required behavior:
- PR validation context: compare against tested head SHA for the workflow run.
- main/release context: compare against merge commit SHA used for release artifact generation.

Fail-closed cases:
- missing `validatedCommit`
- missing CI-resolved `expectedCommit`
- non-exact match

Recommended output fields:
- `validatedCommit`
- `expectedCommit`
- `commitMatch` (boolean)
- `primaryBlockerReasonCode`

---

### C) Version allowlist governance
Allowlists must be explicit, version-controlled, and reviewed as policy artifacts.

Required files (suggested):
- `config/provenance-policy.json` (or equivalent), containing:
  - `allowedValidatorVersions`
  - `allowedSchemaVersions`
  - `policyVersion`
  - optional `effectiveFrom`

Governance rules:
1. New validator/schema version requires same-PR update to allowlist + migration note.
2. Unknown versions are hard-fail (no permissive fallback).
3. Version removals require explicit deprecation notice and migration window (if applicable).
4. CI gate must print active `policyVersion` for audit traceability.

---

### D) Fail-closed mismatch taxonomy
Standardize deterministic reason codes for release gate mismatches:
- `artifact-provenance-missing`
- `artifact-mode-not-release-eligible`
- `artifact-status-not-manifest-valid`
- `artifact-source-commit-mismatch`
- `artifact-validator-version-unsupported`
- `artifact-schema-version-unsupported`

Ordering rule (deterministic):
1. missing fields,
2. commit mismatch,
3. mode/status mismatch,
4. version/schema unsupported.

This keeps root-cause diagnosis stable and prevents noisy mismatch churn.

---

### E) CI workflow shape (minimal)
Minimal release-gate workflow should:
1. check out repository,
2. load policy allowlist file,
3. parse provenance artifact metadata,
4. evaluate commit/mode/status/version/schema predicates,
5. fail closed with machine-readable summary JSON + concise log line.

No wallet/on-chain action required in this gate.

## Minimal policy matrix
| Condition | Gate result | Reason code |
|---|---|---|
| strict + valid status + commit match + allowed versions | pass | null |
| commit mismatch | fail | `artifact-source-commit-mismatch` |
| unknown validator version | fail | `artifact-validator-version-unsupported` |
| unknown schema version | fail | `artifact-schema-version-unsupported` |
| compat mode in release gate | fail | `artifact-mode-not-release-eligible` |

## Next smallest handoff
Lane E/B follow-up:
1. capture applied learning on allowlist governance ergonomics (how to avoid policy churn),
2. implement policy loader + strict evaluator predicate expansion,
3. add CI matrix test fixtures for pass/fail reason-code stability.
