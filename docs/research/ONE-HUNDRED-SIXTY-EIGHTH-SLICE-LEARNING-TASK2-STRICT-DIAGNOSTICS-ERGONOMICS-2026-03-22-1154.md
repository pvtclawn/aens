# One-Hundred-Sixty-Eighth Slice Learning — Task 2 Strict Diagnostics Ergonomics (2026-03-22 11:54 UTC)

## Context
Task 2 boundary is frozen for strict marker-failure diagnostics:
- alias-expired shadow detection,
- stable class taxonomy,
- summary/artifact retention guarantees.

The next execution risk is not taxonomy design but human/operator usability when strict classes appear in fast-moving CI logs.

## Applied learning

### 1) Class-first summaries should use fixed short templates
Operators scan class tokens first; variable prose slows triage and causes interpretation drift.

**Rule:** keep one immutable summary template per class:
- `mode-invalid` -> `invalid marker mode`
- `collision-blocked` -> `marker collision blocked`
- `alias-expired` -> `alias expired (canonical required)`
- `marker-missing` -> `expected marker missing`
- `http-failure` -> `http failure`

---

### 2) Alias-expired should sound intentional, not flaky
This class represents policy governance, not runtime instability.

**Rule:** phrase as transition state, e.g. “legacy alias expired; canonical marker now required.”
Avoid retry-oriented language that suggests transient network failure.

---

### 3) Keep summary tier and artifact tier purposefully asymmetric
Trying to make summaries and artifacts equally detailed creates noise and contradictions.

**Rule:**
- summary tier: class + concise cue only,
- artifact tier: full provenance (`failureClass`, `matchMode`, `markerDomain`, `markerMatchType`, `matchedMarker`, `aliasEvaluatedAt`, `contractIssueCode`).

---

### 4) Preserve strict class visibility in one-line output for legacy consumers
Some downstream tooling still parses plain text lines only.

**Rule:** include class token directly in summary lines so strict signal remains recoverable without structured artifact parsing.

---

### 5) Collision-blocked should be framed as safety success
Without framing, teams may interpret it as a checker bug and try to loosen rules.

**Rule:** messaging should state that collision blocking prevents false positives across marker domains.

---

### 6) Avoid over-long summary lines when adding class context
Verbose summary strings reduce signal and can hide primary class in logs.

**Rule:** enforce a soft summary length budget and prefer compact class phrases over explanatory paragraphs.

---

### 7) Keep class token names stable; add metadata instead of renaming
Renaming tokens breaks trend analysis and historical comparisons.

**Rule:** freeze primary class identifiers; if nuance is needed, add secondary metadata fields rather than changing class names.

## Immediate implementation guidance
- Add a shared class-template map consumed by both checker summary and artifact formatter wrappers.
- Add regression tests for class-token presence in one-line summaries.
- Add alias-expired wording test to prevent drift back into generic marker-missing messaging.