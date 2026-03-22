# Plan — Deterministic Blocker-Mapper Integration Guardrails v1 (2026-03-22 01:48 UTC)

## Goal
Freeze a compact implementation plan that operationalizes blocker-mapper integration safety across CI/CLI without changing public API contracts.

Focus areas:
1. central reason-code registry + mapper output schema,
2. CI/CLI machine-payload parity checks,
3. sort-before-truncate secondary-list contract + unknown-state invariant enforcement.

## Smallest shippable milestone
Ship one thin integration-safety vertical that guarantees deterministic machine semantics even if presentation copy changes:
- one canonical reason-code registry,
- one mapper result schema,
- one parity test harness shared by CI/CLI adapters.

## Tasks (1–3) with acceptance criteria

### Task 1 — Central reason-code registry + mapper output schema
Implement a shared module exporting:
- canonical blocker reason-code constants,
- mapper output types:
  - `primaryBlockerReasonCode`
  - `secondaryBlockerReasonCodes[]`
  - `releaseEligibleByPolicy`
  - `stateSummary`
  - unknown-state diagnostics fields.

**Acceptance criteria**
- no adapter defines ad-hoc blocker strings,
- mapper/adapter code imports registry constants only,
- unknown states map fail-closed to `artifact-policy-state-unknown`,
- tests fail if unregistered reason codes appear.

---

### Task 2 — CI/CLI machine-payload parity checks
Add conformance harness validating CI and CLI adapters preserve identical machine semantics for identical mapper inputs.

Checks:
- same `primaryBlockerReasonCode`,
- same ordered `secondaryBlockerReasonCodes`,
- same `releaseEligibleByPolicy`,
- same unknown-state diagnostic fields.

**Acceptance criteria**
- parity test matrix covers active/grace-active/grace-expired/unsupported/policy-invalid/unknown states,
- CI fails when adapter outputs diverge at machine payload level,
- human text may differ, machine payload must remain byte-stable (or field-stable with canonical ordering).

---

### Task 3 — Secondary-list truncation + unknown-state invariant contract
Implement and enforce two invariants:
1. full secondary list sorted deterministically before truncation,
2. unknown-state outputs include required diagnostics.

Required unknown-state fields:
- `offendingAxis`
- `offendingState`
- `mapperVersion`
- remediation hint

**Acceptance criteria**
- truncation tests prove sort-before-truncate behavior under permuted inputs,
- compact mode exposes `remainingSecondaryCount` and `truncated` flags,
- missing unknown-state invariants fail adapter tests,
- primary blocker remains immutable through presentation layer.

## Out of scope (v1)
- CI event-specific commit resolver implementation
- grace-window policy mutation tooling
- wallet/on-chain execution flows

## Next lane handoff
Lane B: implement Task 1 only (reason-code registry + mapper output schema + unregistered-code fail tests), leaving parity harness and truncation/invariant enforcement for follow-up slices.
