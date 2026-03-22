# Plan — Marker-Match Precision Hardening v1 (2026-03-22 10:48 UTC)

## Goal
Convert the latest precision challenge into a compact implementation plan that hardens marker matching against mode misuse, alias bypasses, and ambiguous strict-match diagnostics.

## Scope boundary
- In scope: fail-closed `matchMode` enforcement, normalized cross-domain overlap guards, sunset-safe alias evaluation at match time, domain-safe checker constraints, strict failure-class diagnostics.
- Out of scope: broad page copy rewrites, non-checker UI refactors, unrelated ENS feature work.
- Compatibility: keep current public-surface route behavior and outputs stable where possible; add diagnostics fields without breaking existing consumers.

## Task 1 — Implement fail-closed matchMode + normalized overlap guards
Add explicit match mode contracts with strict validation and collision checks:
- required `matchMode` per marker contract (`exact|token-boundary|contains`),
- fail closed on missing/unknown mode,
- normalized (NFKC/space/case) overlap detection across runtime/fallback canonical + alias sets.

### Acceptance criteria
1. Marker contracts cannot compile/load without explicit `matchMode`.
2. Unknown/missing mode triggers deterministic hard failure (no implicit substring fallback).
3. Normalized overlap checks fail on cross-domain collisions, including unicode/punctuation variants.
4. Tests cover mode-invalid and normalized-overlap failure paths.

---

## Task 2 — Enforce sunset-safe alias evaluation + diagnostic class taxonomy
Harden alias lifetime semantics and strict-match debugging clarity:
- evaluate active aliases at match time only,
- classify strict-match failures with stable tokens.

### Acceptance criteria
1. Post-sunset aliases cannot match in same-process time-travel tests.
2. Alias match diagnostics include evaluation context (`aliasEvaluatedAt` or equivalent).
3. Strict failures emit deterministic classes (`mode-invalid`, `alias-expired`, `collision-blocked`, `marker-missing`).
4. Checker/report summaries preserve failure class in machine-facing output.

---

## Task 3 — Add domain-safe checker entrypoint constraints + marker location contracts
Prevent domain mixups and brittle location assumptions:
- route/domain-specific checker entrypoints,
- explicit allowed marker locations per target (`title/body/meta`).

### Acceptance criteria
1. Runtime checker rejects fallback-domain marker contracts and vice versa.
2. Marker location rules are explicit in target contracts and included in diagnostics.
3. Location-aware tests validate expected passes/fails when markers move between title/body/meta.
4. Public-surface readiness remains green under current deployment/copy.

## Next smallest handoff
Lane B should implement **Task 1 only**:
- add explicit `matchMode` contracts,
- add fail-closed mode validation,
- add normalized cross-domain overlap guards + focused tests.