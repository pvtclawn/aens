# Plan — Lifecycle Audit Hardening v2 (2026-03-21 17:44 UTC)

## Goal
Operationalize stronger lifecycle-audit controls for privileged probe windows so metadata is not just present, but verifiably trustworthy.

## Scope boundary
- Governance + verification hardening only.
- No change to normal service behavior.
- Keep controls lightweight and auditable.

## Tasks (next 1–3)

### 1) Add provenance-link policy for critical lifecycle fields
Target: privileged probe procedure + checklist.

Acceptance criteria:
- Require explicit evidence refs for:
  - token issuance,
  - token revocation,
  - deployment activation/deactivation.
- Missing provenance marks a window record invalid.

### 2) Add canonical clock source + bounded skew rule
Target: lifecycle ordering guidance.

Acceptance criteria:
- Define canonical timestamp source hierarchy (provider/deploy timestamps first, then local UTC).
- Add bounded skew allowance and required annotation when skew is applied.
- Ordering checks must cite chosen source.

### 3) Add unique window identity constraints
Target: checklist/template fields.

Acceptance criteria:
- Introduce `window_id` and token fingerprint/hash field.
- Reject repeated `window_id` or repeated token fingerprint across windows.
- Require explicit cleanup/closeout link per window.

## Done definition
Privileged probe lifecycle audits can detect spoofed/stale metadata by requiring provenance, clock policy, and uniqueness guarantees—not just filled timestamp fields.
