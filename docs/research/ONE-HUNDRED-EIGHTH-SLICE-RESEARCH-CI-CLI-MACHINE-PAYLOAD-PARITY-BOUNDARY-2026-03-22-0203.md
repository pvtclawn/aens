# One-Hundred-Eighth Slice Research — CI/CLI Machine-Payload Parity Boundary (2026-03-22 02:03 UTC)

## Goal
Freeze a compact boundary for CI/CLI machine-payload parity on blocker-mapper adapters, with explicit rules for:
1. parity fixture matrix,
2. sort-before-truncate secondary invariants,
3. unknown-state diagnostic contract.

## Current-state grounding
- Shared reason registry and mapper output schema now exist (`policy-blocker-reason-codes`, `policy-blocker-mapper-output`).
- Remaining integration risk is adapter divergence: CI and CLI can still serialize or truncate outputs differently.
- Existing tests cover schema correctness, but not cross-adapter payload parity guarantees.

## Boundary definition (v1)

### A) Canonical machine payload contract (adapter-neutral)
Both CI and CLI must emit the same canonical machine payload fields:
- `primaryBlockerReasonCode`
- `secondaryBlockerReasonCodes`
- `releaseEligibleByPolicy`
- `stateSummary.validatorVersionState`
- `stateSummary.schemaVersionState`
- optional `unknownState` object (when applicable)

Invariant:
- adapters may differ in human-readable summaries, but machine payload must be semantically identical for identical mapper inputs.

Canonicalization rule:
- when payload is serialized for parity checks, object keys must be deterministic (canonical JSON ordering) to avoid false drift.

---

### B) Parity fixture matrix (minimum required)
Conformance matrix must include at least these fixtures:
1. `active/active` (no blockers)
2. `grace-active/active` (non-release warning)
3. `grace-expired/active` (expired primary)
4. `unsupported/active` (unsupported primary)
5. `policy-invalid/active` (policy-invalid primary)
6. `unknown-state` (fail-closed unknown diagnostics)
7. mixed-state precedence case (`validator=grace-expired`, `schema=unsupported`)
8. secondary truncation case (>=3 secondary blockers)

For each fixture:
- compute mapper output once,
- run CI adapter output,
- run CLI adapter output,
- assert machine payload equivalence.

---

### C) Sort-before-truncate secondary invariants
Secondary blocker handling must follow this deterministic pipeline:
1. deduplicate,
2. stable-sort by mapper-defined precedence/tie-break,
3. apply truncation limit,
4. emit `remainingSecondaryCount` and `truncated` flag.

Rules:
- truncation before sort is forbidden,
- truncation must never mutate `primaryBlockerReasonCode`,
- compact and verbose modes share the same sorted base list.

Required machine metadata (when truncation is configured):
- `truncated: boolean`
- `remainingSecondaryCount: number`

---

### D) Unknown-state diagnostic contract (fail-closed)
When primary blocker is `artifact-policy-state-unknown`, machine payload must include:
- `unknownState.offendingAxis`
- `unknownState.offendingState`
- `unknownState.mapperVersion`
- `unknownState.remediationHint`

Rules:
- missing any required unknown-state field => parity/test failure,
- adapters must not collapse unknown-state into generic error strings,
- release eligibility must remain `false`.

---

### E) Parity failure taxonomy
Standardize adapter parity fail reasons:
- `adapter-parity-primary-mismatch`
- `adapter-parity-secondary-order-mismatch`
- `adapter-parity-release-eligibility-mismatch`
- `adapter-parity-state-summary-mismatch`
- `adapter-parity-unknown-diagnostic-missing`
- `adapter-parity-truncation-metadata-mismatch`

This keeps CI diagnostics deterministic and actionable.

---

### F) Test and CI execution policy
- parity harness runs in CI as blocking check for adapter changes,
- fixture outputs should be stored as machine snapshots or canonical payload assertions,
- textual summary snapshots are advisory only; machine parity assertions are authoritative.

## Minimal parity matrix (illustrative)
| Fixture | Expected primary | releaseEligibleByPolicy | Unknown diagnostics required |
|---|---|---|---|
| active/active | null | true | no |
| grace-active/active | `artifact-validator-version-grace-active-nonrelease` | false | no |
| grace-expired/active | `artifact-validator-version-grace-expired` | false | no |
| unsupported/active | `artifact-validator-version-unsupported` | false | no |
| policy-invalid/active | `artifact-policy-grace-entry-invalid` | false | no |
| unknown-state | `artifact-policy-state-unknown` | false | yes |

## Next smallest handoff
Lane E/B follow-up:
1. capture implementation ergonomics for parity harness output readability,
2. implement adapter parity harness with fixture matrix,
3. add sort-before-truncate and unknown-state invariant conformance tests as blocking CI checks.
