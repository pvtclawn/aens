# One-Hundred-Seventy-Third Slice Research — Task 2 Implementation Roll Boundary (2026-03-22 12:17 UTC)

## Goal
Freeze the execution boundary for Task 2 strict diagnostics rollout, focusing on:
1) alias-expired shadow-detection contract,
2) terse class-token visibility guarantees,
3) aggregate parity retention across summary/artifact/report layers.

## Current-state signal
- Task 1 is implemented and verified (`a21fc99`, `d1ca5b0`): class templates centralized and summary/artifact mapping parity is green.
- Open implementation risk is not precedence logic; it is rollout behavior when stricter diagnostics meet terse output and aggregate reporting.

## Boundary definition (v1)

### A) Alias-expired shadow-detection contract
When canonical marker fails, the matcher must evaluate expired aliases in shadow mode before class finalization.

Rule:
- if expired alias would match -> primary class is `alias-expired`,
- else -> continue normal failure resolution (`marker-missing` etc),
- shadow match must not count as pass.

Required diagnostic retention:
- `aliasEvaluatedAt`
- `expiredAliasCandidate`
- `shadowAliasMatch: true|false`

---

### B) Terse output class-token visibility invariant
Compact/terse outputs must never omit failure class signal.

Rule:
- every failed one-line summary includes explicit class token,
- class token is non-droppable under truncation/length constraints,
- summary template still remains short and class-first.

Suggested format invariant:
- `<surface>: <failureClass> (<short cue>)`

---

### C) Aggregate parity retention contract
Aggregated status must not replace per-surface strict classes.

Rule:
- aggregate report may provide overall status,
- but per-surface `failureClass` entries must remain intact and machine-visible,
- aggregate layer must not remap strict classes to generic `marker-missing` or `not-ready`.

---

### D) Summary/artifact no-recompute guarantee
Class token computed at surface-result stage remains canonical downstream.

Rule:
- summary formatters and artifact builders consume canonical class token,
- no independent class recomputation from partial fields in presentation layers,
- parity test required: summary class token == artifact class token for same surface result.

---

### E) Unknown-class hard fail behavior
Forward compatibility should fail explicitly, not silently.

Rule:
- unknown class token triggers deterministic mapping error (`class-map-missing`),
- output must include offending token and surface label,
- no fallback to nearest known class.

---

### F) Rollout scope minimization
Keep Task 2 rollout focused on diagnostics behavior only.

In scope:
- alias shadow detection classification path,
- class-token summary invariants,
- aggregate/per-surface parity checks.

Out of scope:
- marker copy updates,
- matcher permissiveness changes,
- route-level UX redesign.

## Decision matrix
| Condition | Surface class | Summary requirement |
|---|---|---|
| canonical match | none (success) | `ok` |
| active alias match | none (success) | `ok (matched alias marker)` |
| expired alias shadow-hit | `alias-expired` | class token mandatory |
| contract overlap block | `collision-blocked` | class token mandatory |
| invalid mode | `mode-invalid` | class token mandatory |
| no marker path | `marker-missing` | class token mandatory |
| transport failure | `http-failure` | class token mandatory |

## Next smallest handoff
Lane E should capture applied ergonomics for Task 2 rollout messaging:
- concise class-first line templates by failure class,
- alias-expired transition phrasing examples,
- aggregate summary style that stays terse while preserving per-surface class visibility.