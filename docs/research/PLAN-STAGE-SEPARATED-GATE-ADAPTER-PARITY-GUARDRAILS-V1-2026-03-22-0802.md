# Plan — Stage-Separated Gate Adapter-Parity Guardrails v1 (2026-03-22 08:02 UTC)

## Goal
Convert the latest stage-separation challenge into a compact implementation plan that prevents adapter-level trust drift while preserving current service/public-surface behavior.

## Scope boundary
- In scope: provenance-gating machine-contract guardrails and adapter parity controls.
- Out of scope: ENS publish flow changes, API schema expansion unrelated to stage gating, deployment/runtime changes.
- Must remain non-breaking for existing discover/public-surface contracts.

## Task 1 — Add adapter-parity contract tests for blocked-stage semantics
Implement a shared parity fixture set covering:
- explicit `not-evaluated` downstream states,
- earliest-failing-stage primary blocker selection,
- suppressed downstream reasons never becoming primary.

### Acceptance criteria
1. New tests fail when any adapter omits a stage field (`integrity`, `freshness`, `identity`).
2. New tests fail if freshness failure can produce identity reason as primary blocker.
3. Tests assert deterministic compact payload includes stage triad and blocked-by metadata when applicable.
4. Typecheck and targeted suite pass.

---

## Task 2 — Centralize reason→stage ownership mapping with fail-closed behavior
Create one canonical registry used by evaluator + adapters:
- each reason code maps to exactly one stage owner,
- unknown reason codes fail closed (no implicit fallback stage assignment).

### Acceptance criteria
1. Single exported reason-stage registry is consumed by stage arbitration logic.
2. Unknown/unmapped reason code produces deterministic contract failure reason (no silent coercion).
3. Regression tests cover known mapping integrity and unknown-code rejection.
4. Existing reason codes retain current semantics.

---

## Task 3 — Add stage-tuple validator + compact wording completion guardrails
Add a validator for impossible state combinations and compact-output wording protections:
- reject invalid tuples (e.g., `integrity=fail` with downstream `fail/pass`),
- reserve completion wording for full `pass/pass/pass` only.

### Acceptance criteria
1. Invalid stage tuples return deterministic contract reason (`fixture-provenance-stage-contract-invalid` or equivalent agreed constant).
2. Compact output for blocked runs cannot use completion language.
3. Snapshot/contract tests lock wording and tuple validation behavior.
4. Typecheck and targeted suite pass.

## Next smallest handoff
Lane B should implement **Task 1 only** (adapter-parity contract tests for `not-evaluated` + primary-blocker invariants), with no schema-breaking changes.