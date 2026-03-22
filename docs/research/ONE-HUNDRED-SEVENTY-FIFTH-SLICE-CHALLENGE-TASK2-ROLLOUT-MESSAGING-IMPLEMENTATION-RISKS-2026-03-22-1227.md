# One-Hundred-Seventy-Fifth Slice Challenge — Task 2 Rollout Messaging Implementation Risks (2026-03-22 12:27 UTC)

## Goal
Red-team Task 2 rollout messaging implementation, focusing on:
1) class-first template drift,
2) action-cue loss,
3) aggregate/per-surface visibility regressions.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- marker/proof/artifact/discover tests pass (`23 pass`)
- `bun run check-public-surface` fully green (`preferredSurfaceReady=yes`)

## Challenge findings

### 1) Class-first summaries can regress to prose-first under wrapper refactors (high)
**Failure mode:** command wrappers prepend narrative text before class token.

**Impact:** legacy text parsers and human triage lose immediate class visibility.

**Mitigation:**
- enforce summary format invariant (`<surface>: <class> (...)`) via tests,
- fail CI if class token is not present before first parenthetical cue,
- expose a shared summary builder API and prohibit wrapper-local string concatenation.

---

### 2) Action cues can disappear during “brevity” optimizations (high)
**Failure mode:** compact mode strips parenthetical action cue to shorten output.

**Impact:** operators see class but no next step, increasing decision latency.

**Mitigation:**
- mark class action cue as required in failure summaries,
- set hard minimum content schema (`class + action cue`),
- add truncation tests ensuring action cue survives compact mode.

---

### 3) Aggregate views can hide failing surfaces behind one status line (high)
**Failure mode:** aggregate reporter prints only `not-ready` and omits per-surface class lines.

**Impact:** actionable diagnostics disappear despite strict class resolution upstream.

**Mitigation:**
- require per-surface lines when aggregate status is failing,
- add aggregate contract tests enforcing at least one class-token line per failed surface,
- keep aggregate header informative but non-substitutive.

---

### 4) Class-template map can drift through duplicated constants in docs/CLI helpers (medium-high)
**Failure mode:** copied template strings in helper modules diverge from canonical map.

**Impact:** wording mismatch across channels, inconsistent operator instructions.

**Mitigation:**
- enforce single import path for class templates,
- block duplicate template literals via grep/lint check,
- parity test summaries generated from all entrypoints.

---

### 5) Alias-expired wording can become ambiguous during copy edits (medium-high)
**Failure mode:** wording changes to “marker outdated” without canonical migration cue.

**Impact:** teams treat transition as flaky drift instead of governed migration.

**Mitigation:**
- snapshot lock `alias-expired` canonical phrase,
- include explicit “canonical required/switch” verb in template contract,
- reject alias-expired template updates lacking migration cue.

---

### 6) Multi-failure surfaces may emit mismatched action cues (medium)
**Failure mode:** class precedence chooses `collision-blocked`, but action cue still suggests marker replacement.

**Impact:** operators take wrong remediation path.

**Mitigation:**
- bind action cues directly to resolved primary class token,
- test mixed-signal cases for class/cue coherence,
- forbid action cue composition from non-primary secondary classes.

---

### 7) Localization/i18n layers can remove recoverable class tokens (medium)
**Failure mode:** translated summaries replace stable class token text entirely.

**Impact:** downstream automation cannot parse class from summary lines.

**Mitigation:**
- keep class token machine-stable and language-agnostic in output,
- localize only surrounding cue text,
- add tests for token retention across localization hooks.

## Hardened rule (post-challenge)
Task 2 rollout messaging implementation is acceptable only if:
1. class-first format is invariant and parser-stable,
2. failure summaries keep both class token and action cue,
3. aggregate output never hides per-surface class diagnostics,
4. class templates remain centralized with no duplicate literal drift,
5. alias-expired wording remains migration-explicit,
6. action cues are strictly bound to resolved primary class,
7. class tokens remain stable under localization/formatting layers.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- class-first summary format invariants + parser-safe tests,
- required action-cue retention under terse output,
- aggregate/per-surface diagnostic visibility enforcement with mixed-signal coherence checks.