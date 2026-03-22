# Plan — Reason→Stage Ownership Validator Hardening v1 (2026-03-22 08:32 UTC)

## Goal
Turn the latest ownership-edge challenge into a compact implementation plan that hardens reason-stage ownership enforcement without breaking existing discover/public-surface contracts.

## Scope boundary
- In scope: provenance stage-gate ownership validation, mismatch/unmapped precedence guarantees, failure-state diagnostics minimums, registry identity/cache safety.
- Out of scope: ENS publish/deploy flows, non-stage-gate API redesign, policy-surface semantic rewrites.
- Compatibility constraint: preserve current external discover/public-surface behavior; add diagnostics as optional/non-breaking fields where needed.

## Task 1 — Ship shared ownership validator + canonical registry primitive
Implement one shared primitive used by all stage-gate emitting entrypoints:
- canonical reason→stage ownership registry for provenance reasons,
- owner resolution API with deterministic statuses (`resolved|unmapped|mismatch`),
- deterministic contract reason for unknown ownership (`fixture-provenance-stage-reason-unmapped`).

### Acceptance criteria
1. All stage-gate entrypoints resolve owner through one shared module (no local fallback maps).
2. Unknown reason codes return deterministic unmapped contract outcome; no default stage assignment.
3. Registry identity metadata (`reasonStageRegistryVersion`, optional hash) is available from shared primitive.
4. Typecheck + targeted ownership/parity tests pass.

---

## Task 2 — Enforce non-overridable mismatch/unmapped precedence
Harden arbitration so ownership resolution failures preempt stage-specific blockers.

### Acceptance criteria
1. `unmapped`/`mismatch` ownership outcomes always become primary blocker source for the run.
2. Legacy sorter paths cannot demote ownership contract failures beneath stage-level reasons.
3. Regression tests lock precedence behavior across compact + verbose render paths.
4. No discover/public-surface regressions.

---

## Task 3 — Add required failure-state diagnostics + cache/identity safeguards
Define minimum diagnostics for failure states and prevent stale ownership metadata drift.

### Acceptance criteria
1. Failure states include deterministic diagnostics minimums:
   - `stageOwnerResolutionStatus`,
   - `reasonCode`,
   - `claimedStageOwner`/`canonicalStageOwner` when mismatch applies,
   - registry identity metadata.
2. Compact output carries failure class + one deterministic remediation hint.
3. Registry identity change invalidates cached ownership metadata; stale cache cannot silently override current owner map.
4. Contract/parity tests lock both presence and determinism of failure-state diagnostics.

## Next smallest handoff
Lane B should implement **Task 1 only**:
- add shared ownership-validator/registry primitive,
- wire it into stage-gate output path(s),
- add focused tests for resolved/unmapped/mismatch behavior with deterministic outcomes.