# One-Hundred-Sixty-Third Slice Learning — Strict Marker-Failure Diagnostics Ergonomics (2026-03-22 11:23 UTC)

## Context
Marker contracts now enforce explicit `matchMode` and fail-closed behavior with normalized overlap guards. The next risk is operator confusion when strict failures are technically correct but poorly explained.

## Applied learning

### 1) `alias-expired` wording must read as governance, not outage
When an alias expires, users often interpret the failure as random checker flakiness.

**Rule:** phrase `alias-expired` as an expected policy transition:
- “legacy alias expired; canonical marker now required.”

Avoid language that implies transport/runtime instability.

---

### 2) One-line summaries should stay terse, but class-aware
Operators need fast triage in CI logs; verbose dumps in-line increase noise.

**Rule:** one-line output should include exactly:
- surface label,
- primary failure class,
- short human cue.

Example style:
- `research capability page: alias-expired (canonical marker required)`

---

### 3) Artifacts should carry full diagnostic context, not summaries
Human summaries are for speed; artifacts are for audit and reproducibility.

**Rule:** machine artifacts retain:
- `failureClass`
- `markerDomain`
- `matchMode`
- `markerMatchType`
- `matchedMarker`
- `aliasEvaluatedAt` (when alias path applies)

Summaries should reference, not duplicate, this data.

---

### 4) `collision-blocked` should be framed as integrity protection
Without framing, teams may try to bypass strict checks.

**Rule:** describe `collision-blocked` as intentional safety behavior:
- “cross-domain marker overlap blocked to prevent false positives.”

This keeps strictness from looking like accidental breakage.

---

### 5) `marker-missing` must remain the residual class only
If all strict classes collapse into `marker-missing`, triage quality degrades.

**Rule:** reserve `marker-missing` for true absence after mode, alias, and collision logic are evaluated.

---

### 6) Distinguish operator-facing vs reviewer-facing verbosity
Internal maintainers and external judges need different levels of detail.

**Rule:**
- operator logs: compact class-first summaries,
- reviewer artifacts: structured field-rich diagnostics.

Do not force reviewer-level verbosity into every CLI line.

---

### 7) Keep class taxonomy stable across release slices
Renaming classes frequently ruins historical comparability.

**Rule:** freeze class tokens once introduced; if refinement is needed, add secondary fields instead of renaming primary classes.

## Immediate implementation guidance
- Add a `failureClass`-first summary formatter for checker output.
- Keep detail expansion in structured artifact payloads only.
- Add regression tests ensuring strict classes do not collapse into generic `marker-missing` paths.