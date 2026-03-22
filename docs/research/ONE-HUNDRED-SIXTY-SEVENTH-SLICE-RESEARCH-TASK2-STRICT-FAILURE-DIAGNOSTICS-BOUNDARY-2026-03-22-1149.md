# One-Hundred-Sixty-Seventh Slice Research — Task 2 Strict Failure-Diagnostics Boundary (2026-03-22 11:49 UTC)

## Goal
Freeze Task 2 boundary after Task 1 class-precedence rollout, focusing on:
1) alias-expired shadow detection semantics,
2) strict failure-class output contract,
3) summary/artifact diagnostics retention guarantees.

## Current-state observations
- Task 1 now preserves strict failure classes through checker + artifact paths.
- `resolveSurfaceFailureClass` precedence is deterministic and no-downgrade.
- Missing piece: precise boundary for when/why `alias-expired` should be emitted, and what minimum fields must be retained in summaries vs artifacts.

## Boundary definition (v1)

### A) Alias-expired shadow detection semantics
When active aliases are exhausted by sunset, matcher should still evaluate expired aliases in a shadow path for classification.

Rule:
- if canonical fails and an expired alias would have matched at evaluation time,
  classify as `alias-expired` (not `marker-missing`).
- if canonical fails and no expired alias would match,
  classify as `marker-missing`.

Required diagnostic fields:
- `aliasEvaluatedAt`
- `expiredAliasCandidate` (or equivalent marker id/string)

---

### B) Strict failure-class output contract (surface level)
Each failed surface result must expose exactly one primary class from the frozen taxonomy:
- `mode-invalid`
- `collision-blocked`
- `alias-expired`
- `marker-missing`
- `http-failure`

Rule:
- primary class is mandatory when failed,
- class precedence remains deterministic,
- class names are stable identifiers (no per-surface renaming).

---

### C) Summary vs artifact retention guarantees
Summaries should stay concise, artifacts should stay complete.

Summary minimum:
- surface label,
- primary failure class token,
- short human cue.

Artifact minimum:
- `failureClass`
- `markerDomain`
- `matchMode`
- `markerMatchType`
- `matchedMarker`
- `aliasEvaluatedAt` (when alias path relevant)
- `contractIssueCode` (when relevant)

Rule:
- summary class token must equal artifact class token for same result.

---

### D) Taxonomy integrity safeguards
Prevent silent drift or collapse to generic classes.

Rule:
- if a stricter class is derivable, output must not fall back to `marker-missing`.
- aggregation layers cannot overwrite surface-level strict classes.
- any unknown class token is treated as hard diagnostic contract error.

---

### E) Legacy-consumer compatibility boundary
Older consumers may only parse summary lines.

Rule:
- keep class token embedded in concise summary text so strict signal remains recoverable,
- do not rely solely on new artifact fields for critical class visibility.

---

### F) Non-breaking rollout envelope
- keep existing readiness semantics unchanged (`preferredSurfaceReady` remains strict),
- additive diagnostics only,
- no matcher permissiveness increase to preserve old wording.

## Decision matrix
| Condition | Primary class |
|---|---|
| invalid/unknown mode | `mode-invalid` |
| normalized overlap contract block | `collision-blocked` |
| canonical fail + expired alias would match | `alias-expired` |
| canonical fail + no alias hit | `marker-missing` |
| transport/http failure | `http-failure` |

## Next smallest handoff
Lane E should capture applied learning for Task 2 messaging ergonomics:
- concise class-first summary phrasing templates,
- how to present alias-expired transitions without sounding flaky,
- artifact verbosity boundaries that remain audit-complete but human-scannable.