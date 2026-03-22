# Plan — Strict Marker-Failure Diagnostics Hardening v1 (2026-03-22 11:33 UTC)

## Goal
Turn strict marker-failure challenge findings into a compact implementation plan that preserves deterministic failure classes from matcher to artifacts while keeping operator summaries concise.

## Scope boundary
- In scope: failure-class precedence + preservation, alias-expired shadow detection, unified summary/artifact mapping parity.
- Out of scope: non-diagnostic UI redesign, marker copy rewrites, non-checker ENS feature work.
- Compatibility: additive diagnostics preferred; avoid breaking existing pass/fail semantics for public-surface readiness.

## Task 1 — Implement deterministic failure-class precedence + end-to-end preservation
Define one canonical precedence pipeline and enforce it in matcher/checker/artifact stages.

### Acceptance criteria
1. Canonical precedence is explicit and tested (e.g., `mode-invalid` > `collision-blocked` > `alias-expired` > `marker-missing` > `http-failure` where path-applicable).
2. Per-surface `failureClass` is preserved from matcher output through checker summaries and artifact payloads.
3. Aggregation cannot downgrade strict classes to generic `marker-missing` when a stricter class exists.
4. Regression tests lock class preservation across all monitored surfaces.

---

## Task 2 — Add alias-expired shadow detection
Distinguish governance transitions from genuine marker absence.

### Acceptance criteria
1. After alias sunset, matcher runs shadow detection against expired aliases.
2. If expired alias would have matched, class is `alias-expired` (not `marker-missing`).
3. Diagnostics retain expired alias marker identity + evaluation timestamp context (`aliasEvaluatedAt` or equivalent).
4. Time-travel tests cover pre-sunset pass, post-sunset alias-expired, and true marker-missing paths.

---

## Task 3 — Unify summary/artifact formatter mapping with parity tests
Prevent class-message drift between CLI summaries and stored artifacts.

### Acceptance criteria
1. One shared class-to-message mapping primitive is used by summary and artifact formatters.
2. Parity tests assert summary class token equals artifact class token for the same surface result.
3. One-line summaries remain terse and class-first; artifact outputs keep full structured diagnostics.
4. Legacy parser path retains recoverable class signal via compact class token in summary text.

## Next smallest handoff
Lane B should implement **Task 1 only**:
- add canonical precedence resolver,
- wire class preservation through checker/artifact pipeline,
- add focused tests for no-downgrade behavior.