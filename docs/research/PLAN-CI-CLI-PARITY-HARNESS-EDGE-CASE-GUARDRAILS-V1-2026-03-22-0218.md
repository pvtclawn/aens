# Plan — CI/CLI Parity Harness Edge-Case Guardrails v1 (2026-03-22 02:18 UTC)

## Goal
Freeze a compact implementation plan that turns parity-harness edge-case risk analysis into enforceable checks without changing public API contracts.

Focus areas:
1. canonical payload comparator contract,
2. deterministic fixture schema + versioning policy,
3. truncation/unknown-state invariant assertions with field-level mismatch diagnostics.

## Smallest shippable milestone
Ship one thin parity-safety vertical proving adapter machine payload drift cannot hide behind formatting differences:
- canonicalized machine payload comparison,
- deterministic fixture schema with explicit version pinning,
- invariant assertions for truncation and unknown-state diagnostics.

## Tasks (1–3) with acceptance criteria

### Task 1 — Canonical machine payload comparator
Implement shared comparator helper for CI/CLI parity harness.

Comparator behavior:
- normalize payload objects via deterministic key ordering,
- normalize optional-field absence/presence semantics (explicit null/undefined policy),
- compare canonical payloads and return structured diffs by field path.

**Acceptance criteria**
- semantically identical CI/CLI payloads compare equal despite key-order differences,
- comparator reports field-level mismatch path for true drift,
- comparator output includes deterministic diff summary suitable for CI logs,
- tests cover canonicalization edge cases (key ordering, missing optional fields).

---

### Task 2 — Deterministic fixture schema + versioning policy
Define fixture format for parity matrix inputs/expected outputs.

Required fixture fields:
- `fixtureId`
- `mapperSchemaVersion`
- `inputState` (normalized policy states)
- `expectedMachinePayload`

Rules:
- volatile fields (timestamps/random IDs/prose) excluded from machine fixtures,
- fixture IDs encode policy state composition,
- mapper schema version mismatch fails closed.

**Acceptance criteria**
- fixture validator rejects missing required fields and unknown top-level keys,
- schema version mismatch emits deterministic failure reason,
- fixture set covers minimum parity matrix (active, grace-active, grace-expired, unsupported, policy-invalid, unknown-state, mixed precedence, truncation case),
- tests prove fixture parsing is deterministic and fail-closed.

---

### Task 3 — Truncation + unknown-state invariant assertions
Add parity assertions for high-risk adapter drift paths.

Required truncation invariants:
- sort full secondary list before truncation,
- `truncated` and `remainingSecondaryCount` metadata parity,
- primary blocker unchanged by truncation.

Required unknown-state invariants (when primary is `artifact-policy-state-unknown`):
- `offendingAxis`
- `offendingState`
- `mapperVersion`
- `remediationHint`

**Acceptance criteria**
- parity tests fail if truncation metadata diverges even when lists look similar,
- parity tests fail if unknown-state required fields are missing/empty,
- failures provide field-level mismatch diagnostics (`fixtureId`, `fieldPath`, expected/observed snippet),
- CI output remains concise but deterministic.

## Out of scope (v1)
- CI event commit-source resolver implementation
- policy mutation tooling
- human-summary wording harmonization beyond machine invariant lines

## Next lane handoff
Lane B: implement Task 1 only (canonical payload comparator + structured field-level diff diagnostics + tests), leaving fixture schema/versioning and truncation/unknown-state assertion suite for follow-up slices.
