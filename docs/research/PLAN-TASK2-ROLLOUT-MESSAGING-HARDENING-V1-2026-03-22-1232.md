# Plan — Task 2 Rollout Messaging Hardening v1 (2026-03-22 12:32 UTC)

## Goal
Convert Task 2 rollout-messaging challenge findings into a compact implementation plan that keeps strict diagnostics readable, parser-safe, and class-faithful under terse and aggregate reporting.

## Scope boundary
- In scope: class-first summary invariants, action-cue retention guarantees, aggregate/per-surface visibility enforcement, template drift prevention.
- Out of scope: marker matching logic changes, route copy redesign, non-diagnostics feature work.
- Compatibility: preserve existing strict class taxonomy and public-surface readiness semantics.

## Task 1 — Enforce class-first summary format invariants
Lock a parser-safe summary contract for failure lines.

### Acceptance criteria
1. Every failed summary line follows class-first shape:
   - `<surface>: <failureClass> (<short cue>)`
2. Class token appears before any prose expansion and remains machine-recoverable.
3. Wrapper/local formatter paths cannot prepend narrative text ahead of the class token.
4. Tests fail on class-token position drift.

---

## Task 2 — Require non-droppable action cues in terse mode
Preserve immediate remediation value while staying concise.

### Acceptance criteria
1. Each strict failure class has a required short action cue template.
2. Terse output cannot drop action cue when failure class is present.
3. `alias-expired` cue remains migration-explicit (`switch/use canonical marker`).
4. Truncation tests prove class token + action cue survive compact rendering.

---

## Task 3 — Enforce aggregate/per-surface visibility and template centralization
Prevent aggregate collapse and wording forks.

### Acceptance criteria
1. Aggregate failure output always includes per-surface class lines.
2. Shared immutable template map is used by all commands (no duplicate literals).
3. Mixed-signal scenarios keep class/cue coherence with resolved primary class.
4. Localization/formatting layers retain stable class token while allowing cue text adaptation.

## Next smallest handoff
Lane B should implement **Task 1 only**:
- add class-first summary format validator,
- wire summaries through the validator path,
- add tests for class-token placement and parser-safe extraction.