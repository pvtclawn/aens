# Plan — Marker-Contract Hardening v1 (2026-03-22 10:17 UTC)

## Goal
Turn marker-contract challenge findings into a compact implementation plan that restores deterministic public-surface checks while preventing future drift bypasses.

## Scope boundary
- In scope: bounded alias governance, strict runtime/fallback marker separation, shared-constant enforcement, drift-class preservation in checker output.
- Out of scope: broad copy rewrites, UI redesign, non-marker deployment changes.
- Compatibility: preserve existing checker shape where possible; add diagnostics without breaking core consumer flows.

## Task 1 — Implement bounded alias governance + strict domain separation
Add a shared marker-contract module with explicit domains:
- `preferred-runtime` markers,
- `bootstrap-fallback` markers.

Allow temporary aliases only through explicit metadata and bounded policy.

### Acceptance criteria
1. Marker constants are domain-separated; runtime checks cannot consume fallback markers.
2. Alias entries require explicit sunset metadata and are optional-by-policy (not implicit defaults).
3. Checker can report whether a match came from canonical or alias marker path.
4. Existing public-surface checker still classifies root/research/discover/fallback per surface.

---

## Task 2 — Block literal-escape drift and keep marker precision high
Prevent ad hoc marker literals from bypassing shared constants.

### Acceptance criteria
1. Marker literals used by checker/tests come from one shared source module.
2. Guard test (or lint-like check) fails if canonical marker strings are duplicated outside approved marker module/test fixtures.
3. Canonical runtime markers are route-specific enough to avoid false-positive collisions.
4. No identity-coupled strings are required for preferred-runtime readiness.

---

## Task 3 — Preserve drift classification in checker/report outputs
Keep strict failure behavior while improving operational clarity.

### Acceptance criteria
1. Checker distinguishes `http-failure` vs `marker-drift` vs `ok` per surface.
2. Machine-facing summaries retain drift class for each failing surface.
3. Preferred readiness remains red on marker drift (no silent pass-through).
4. Regression tests lock classification semantics under copy-change scenarios.

## Next smallest handoff
Lane B should implement **Task 1 only**:
- introduce domain-separated marker constants,
- wire checker to runtime/fallback domains,
- add minimal alias metadata plumbing and tests for domain-isolation behavior.