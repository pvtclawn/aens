# Plan — Task 2 Strict Diagnostics Hardening v1 (2026-03-22 11:59 UTC)

## Goal
Convert Task 2 strict-diagnostics risks into a compact implementation plan that prevents class drift in operator summaries while preserving full machine-grade provenance in artifacts.

## Scope boundary
- In scope: immutable class-template mapping, class-token visibility invariants, no-recompute summary/artifact parity guarantees.
- Out of scope: matcher permissiveness changes, copy-heavy route rewrites, unrelated ENS feature additions.
- Compatibility: additive diagnostics where possible; keep current public-surface readiness semantics unchanged.

## Task 1 — Enforce immutable shared class-template mapping
Create one class-template map for strict failure classes and require every summary/artifact formatter to consume it.

### Acceptance criteria
1. Single source-of-truth template map for all strict classes (`mode-invalid`, `collision-blocked`, `alias-expired`, `marker-missing`, `http-failure`).
2. Formatter wrappers cannot override class text locally.
3. Tests fail if summary/artifact mappings diverge for the same class token.
4. Existing success formatting remains intact.

---

## Task 2 — Add class-token visibility invariants for terse outputs
Guarantee class recoverability in compact/legacy-consumer-friendly lines.

### Acceptance criteria
1. Every failure summary line includes the explicit class token.
2. Terse mode cannot drop class token due to truncation/length limits.
3. Alias-expired template includes governance-transition cue (canonical required).
4. Snapshot tests lock class-token presence for all failure classes.

---

## Task 3 — Prevent summary/artifact class recomputation drift
Class should be computed once and propagated, not re-derived in each presentation layer.

### Acceptance criteria
1. Surface-level class token is treated as canonical downstream.
2. Summary and artifact builders consume propagated class token (no independent class recomputation from partial fields).
3. Parity tests assert exact class-token equality across summary and artifact for each failed surface.
4. Aggregation preserves per-surface class tokens without replacing them with generic fallback classes.

## Next smallest handoff
Lane B should implement **Task 1 only**:
- add immutable shared class-template map,
- wire summary/artifact formatting through the shared map,
- add parity tests for mapping equality.