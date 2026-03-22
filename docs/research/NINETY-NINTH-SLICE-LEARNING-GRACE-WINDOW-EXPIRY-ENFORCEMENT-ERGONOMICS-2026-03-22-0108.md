# Ninety-Ninth Slice Learning — Grace-Window Expiry Enforcement Ergonomics (2026-03-22 01:08 UTC)

## Context
Grace-window expiry semantics are now formally bounded. The practical risk is operator misinterpretation in CI output: if deadline and release-eligibility messaging is unclear, teams either panic-revert or bypass strict gates.

## Applied learning

### 1) Deadline messaging should be relative + absolute
Showing only an ISO timestamp (`expiresAt`) forces mental conversion and increases mistakes under pressure.

**Rule:** every grace warning should include:
- absolute expiry (`expiresAt` UTC), and
- relative remaining/overrun duration (`in 3h 14m` / `expired 2d 6h ago`).

This makes urgency legible without loosening policy.

### 2) Non-release status must be visually and semantically explicit
Operators often read “valid” and assume releasable unless blocked text is unmistakable.

**Rule:** for `grace-active`, output should contain:
- `releaseEligible=false`,
- a primary blocker reason,
- explicit line: `grace-active is advisory-only; release gate remains blocked`.

### 3) Blocker explanation quality affects bypass behavior
Ambiguous blocker text causes repeated retries and manual override pressure.

**Rule:** blockers should be deterministic and remediation-oriented:
- `reasonCode`,
- affected field (`validatorVersion` or `schemaVersion`),
- exact policy path to update,
- whether issue is grace-active vs grace-expired vs unsupported.

### 4) Multiple simultaneous grace states need stable prioritization
If both validator and schema are in grace/expired states, unordered messaging creates confusion.

**Rule:** deterministic explanation order:
1. expired state(s),
2. unsupported state(s),
3. grace-active non-release warnings.

Include secondary blockers as structured list while keeping one primary reason.

### 5) CI output should preserve gate progression clarity
Users conflate policy acceptance with full release readiness.

**Rule:** append gate progression line in every provenance result:
`manifest-valid -> execution-verified -> poststate-converged`
with current achieved gate highlighted and blocked gate explicitly marked.

### 6) Grace governance works better with pre-expiry nudges
Waiting until expiry hard-fails increases emergency churn.

**Rule:** emit soft alerts when grace windows near expiry (e.g., <72h) in non-blocking channels, while keeping release gate policy unchanged.

### 7) Consistent JSON + concise human summary beats verbose dumps
Large logs hide critical information; terse machine-unfriendly output blocks automation.

**Rule:** dual-format output:
- machine JSON for automation,
- 3–5 line human summary with primary blocker, deadline, and next action.

## Immediate implementation guidance
- Add helper to format grace deadlines into absolute+relative strings.
- Extend provenance result schema with `graceRemainingSeconds` and `primaryBlockerReasonCode` (already aligned with boundary work).
- Keep strict fail-closed semantics unchanged; optimize clarity and deterministic remediation paths.
