# One-Hundred-Fifty-Ninth Slice Challenge — Marker-Match Precision Implementation Edge Risks (2026-03-22 10:43 UTC)

## Goal
Red-team the upcoming marker-match precision implementation, focusing on:
1) match-mode misuse,
2) alias sunset bypasses,
3) strict-mode diagnostics ambiguity.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- marker/proof/artifact tests pass (`13 pass`)
- `bun run check-public-surface` green (`preferredSurfaceReady=yes`)

## Challenge findings

### 1) `matchMode` can become cosmetic metadata if matcher defaults silently (high)
**Failure mode:** contracts declare `exact`, but matcher still executes broad `includes` fallback when mode is missing/unknown.

**Impact:** strictness appears enabled while collisions remain possible.

**Mitigation:**
- fail closed on unknown/absent mode (no implicit fallback),
- require explicit mode per contract in schema validation,
- add tests that unknown mode returns hard failure.

---

### 2) Alias sunset checks can be bypassed via stale precomputed alias sets (high)
**Failure mode:** active alias lists are cached once at process start and reused after sunset.

**Impact:** expired aliases continue matching, undermining bounded governance.

**Mitigation:**
- compute active aliases at match time (or cache keyed by current date window with strict invalidation),
- add time-travel tests crossing sunset boundary in one process,
- include `aliasEvaluatedAt` in diagnostics when alias matches.

---

### 3) Cross-domain overlap checks can miss Unicode/normalization variants (high)
**Failure mode:** overlap scanner compares raw strings only; equivalent text with different dash/space/Unicode forms passes checks.

**Impact:** collisions survive validation and reappear in production checks.

**Mitigation:**
- normalize markers (`NFKC`, whitespace collapse, case fold) before overlap analysis,
- test overlap detection with typographic dash/space variants,
- fail build on normalized overlap, not just raw overlap.

---

### 4) Strict matching can fail “correct” pages if marker location changes (medium-high)
**Failure mode:** marker moves from title to body (or vice versa) and exact checker tied to one location marks drift.

**Impact:** false red status during harmless layout edits.

**Mitigation:**
- define allowed marker locations per route contract,
- include location in diagnostics (`title`, `body`, `meta`),
- require location-aware tests for each monitored surface.

---

### 5) Alias cleanup may remove needed runtime bridge too early (medium-high)
**Failure mode:** alias removed before deployment propagation completes across CDN edges.

**Impact:** transient false failures despite healthy rollout path.

**Mitigation:**
- tie alias removal to verified canonical-only green checks over consecutive runs,
- keep a short grace threshold for propagation windows,
- require evidence artifact before alias deletion commit.

---

### 6) Strict-mode failures can be operationally opaque without failure class tokens (medium)
**Failure mode:** output only says “missing marker,” hiding whether issue is mode mismatch, expired alias, or overlap block.

**Impact:** longer triage loops and accidental rollbacks.

**Mitigation:**
- emit deterministic failure classes (`mode-invalid`, `alias-expired`, `collision-blocked`, `marker-missing`),
- preserve class in machine-facing summaries and artifacts,
- add tests for class stability.

---

### 7) Fallback marker can still leak into runtime checks via shared utility misuse (medium)
**Failure mode:** helper APIs accept any marker set and caller passes fallback contract into runtime route accidentally.

**Impact:** domain separation in data model, but not in call-site behavior.

**Mitigation:**
- type-safe route/domain-specific checker entrypoints,
- guard assertions verifying `target.domain` matches checker path,
- integration tests ensuring runtime checker rejects fallback-domain contracts.

## Hardened rule (post-challenge)
Precision implementation is acceptable only if:
1. `matchMode` is mandatory and fail-closed,
2. alias sunset logic is evaluated at match time,
3. overlap checks use normalized text,
4. marker location contracts are explicit and tested,
5. alias removals are evidence-gated,
6. strict failures include stable diagnostic classes,
7. checker entrypoints enforce domain-safe contract usage.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- fail-closed `matchMode` enforcement + normalized overlap guards,
- sunset-safe alias evaluation and diagnostics class taxonomy,
- domain-safe checker entrypoint constraints with location-aware marker contracts.