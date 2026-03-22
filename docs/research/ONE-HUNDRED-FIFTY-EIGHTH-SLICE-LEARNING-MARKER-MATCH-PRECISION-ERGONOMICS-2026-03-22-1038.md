# One-Hundred-Fifty-Eighth Slice Learning — Marker-Match Precision Ergonomics (2026-03-22 10:38 UTC)

## Context
Marker contracts are now domain-separated and checker health is restored, but precision hardening is needed to avoid substring collisions and future copy-drift false positives.

## Applied learning

### 1) `exact` should be the default for machine readiness checks
Exact matching is the easiest to reason about, easiest to test, and hardest to game by accidental overlap.

**Rule:** default all monitored marker contracts to `matchMode=exact`; require an explicit justification to use anything looser.

---

### 2) `token-boundary` is useful for controlled copy flexibility, but only with clear constraints
Token-boundary mode can tolerate punctuation/case variants while avoiding broad substring leakage.

**Rule:** if used, token-boundary markers must be route-scoped and collision-tested against all fallback/domain markers.

---

### 3) `contains` should be treated as temporary migration mode, not a steady-state mode
Contains-based checks are the fastest path to silent cross-surface collisions.

**Rule:** allow `contains` only behind explicit sunset metadata, and require a follow-up issue to remove it.

---

### 4) Alias quality matters more than alias count
Many aliases can appear robust while actually increasing collision risk.

**Rule:** keep alias sets minimal and role-semantic; remove identity-branded aliases first when tightening precision.

---

### 5) Strict matching needs operator-friendly failure messaging
Without clear diagnostics, strict checks feel brittle rather than trustworthy.

**Rule:** fail output should clearly state: expected canonical marker, active aliases considered, match mode, and why match failed (`none`, `expired-alias`, `cross-domain-collision-blocked`).

---

### 6) Precision checks should explicitly encode copy-flex boundaries
Teams need to know what can change without checker edits.

**Rule:** maintain a short "copy-safe boundary" note per route: allowed textual variants and disallowed semantic shifts.

---

### 7) Keep fallback and runtime language intentionally dissimilar
Semantic separation is stronger when marker phrases are not near-substrings of each other.

**Rule:** fallback marker strings should include bootstrap-specific wording that does not overlap preferred-runtime aliases.

## Immediate implementation guidance
- Add `matchMode` to marker contracts with `exact` default.
- Add a collision-check helper for canonical + active alias sets across domains.
- Add failure-summary tokens for strict-match diagnostics so CI output remains actionable.