# One-Hundred-Sixty-Ninth Slice Learning — Task 2 Class-First Summary / Artifact Boundaries (2026-03-22 11:54 UTC)

## Context
Task 2 boundary for strict marker-failure diagnostics is frozen; Task 1 class precedence/preservation is implemented and verified. The remaining practical risk is communication drift between terse operator summaries and rich audit artifacts.

## Applied learning

### 1) Class token must be the first semantic unit in one-line output
Operators scan from left to right under time pressure.

**Rule:** summary line structure should begin with class signal after surface label, e.g.:
- `<surface>: <failure-class> (<short cue>)`

This keeps class extraction stable for humans and text-only parsers.

---

### 2) Alias-expired phrasing should imply “action now,” not “failure forever”
If wording sounds fatal, teams may rollback valid transitions.

**Rule:** include a concise next-action cue:
- `alias-expired (switch to canonical marker)`

Avoid generic “missing marker” wording on expiry paths.

---

### 3) Artifact detail should be layered, not dumped
Even artifact consumers benefit from predictable structure.

**Rule:** artifact order:
1. primary class + pass/fail
2. marker contract context (`domain`, `matchMode`)
3. match evidence (`markerMatchType`, `matchedMarker`)
4. temporal/governance fields (`aliasEvaluatedAt`, expiry context)

This improves forensic scanning without sacrificing completeness.

---

### 4) Summary and artifact should share one class dictionary
If wording dictionaries split, class parity drifts silently.

**Rule:** use one shared class-to-template map for both surfaces; artifact can add fields but not reinterpret class meaning.

---

### 5) Keep “marker-missing” as the residual class only
When class-first messaging is in place, overusing residual class hides governance and integrity failures.

**Rule:** `marker-missing` appears only after mode/overlap/expiry checks are exhausted.

---

### 6) Add explicit success class neutrality in summaries
Success lines should not look like absent diagnostics.

**Rule:** keep success concise but explicit (`ok` / `ok (matched alias marker)`), and reserve failure classes for failed rows only.

---

### 7) Preserve machine recoverability for legacy consumers
Some pipelines still parse only the summary string.

**Rule:** ensure failure class token appears verbatim in summary text so downstream systems can extract signal without JSON upgrades.

## Immediate implementation guidance
- Add shared summary-template constants keyed by strict failure class.
- Add tests that assert class token appears in every failure summary line.
- Add parity tests ensuring artifact class and summary class token never diverge for same surface result.