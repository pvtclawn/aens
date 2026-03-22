# Plan — Fixture Schema/Versioning Hardening v1 (2026-03-22 02:48 UTC)

## Goal
Freeze a compact implementation plan that hardens parity-fixture governance against bypass and drift while preserving strict fail-closed behavior.

Focus areas:
1. semantic-consistency validator (beyond shape checks),
2. dual-schema cutoff enforcement,
3. enforced lint->semantic->parity stage ordering with global duplicate fixture-id gate.

## Smallest shippable milestone
Ship one thin governance vertical that blocks semantically stale fixtures before parity comparison:
- fixture lint remains strict,
- semantic consistency checks run before parity,
- deterministic failure reasons point to exact fixture and field.

## Tasks (1–3) with acceptance criteria

### Task 1 — Fixture semantic-consistency validator
Implement validator that cross-checks `inputState` and `expectedMachinePayload` for coherence.

Minimum checks:
- `releaseEligibleByPolicy` aligns with blocker presence,
- primary blocker plausibly matches normalized state class,
- unknown-state diagnostics required when primary is `artifact-policy-state-unknown`,
- no template placeholder/sentinel values remain.

**Acceptance criteria**
- semantically stale fixture fails with deterministic reason code + field path,
- valid fixture passes without parity comparator involvement,
- tests cover stale-state mismatch, missing unknown diagnostics, and placeholder leakage,
- validator output is machine-readable and deterministic.

---

### Task 2 — Dual-schema cutoff enforcement
Implement policy-aware fixture schema cutoff behavior.

Required behavior:
- dual-schema support allowed only with explicit deprecation deadline,
- adding new fixtures in deprecated schema during warning/cutoff windows is blocked,
- expired dual-schema window fails closed.

**Acceptance criteria**
- schema cutoff logic emits deterministic reason codes for warning vs hard-fail phases,
- tests cover active dual support, warning phase, and hard-cutoff phase,
- no silent fallback/coercion from deprecated schema to current schema.

---

### Task 3 — Enforced stage ordering + duplicate fixture-id gate
Add execution-order guard and registry checks.

Required pipeline order:
1. fixture schema/version lint,
2. semantic-consistency validator,
3. parity comparator.

Global registry rule:
- fixture IDs must be unique across entire fixture bundle.

**Acceptance criteria**
- CI/local command fails if stages run out of order or a stage is skipped,
- duplicate fixture IDs fail with both file paths in diagnostics,
- parity stage cannot run when lint/semantic stages have unresolved blockers,
- tests confirm deterministic order and duplicate-id rejection.

## Out of scope (v1)
- CI event commit-source resolver
- policy mutation automation
- adapter prose harmonization work

## Next lane handoff
Lane B: implement Task 1 only (semantic-consistency validator + deterministic reason/path diagnostics + tests), then re-run focused suite + public-surface check.
