# One-Hundred-Forty-Seventh Slice Research — Immutable Primary-Lock + Source-Tag Parity Boundary (2026-03-22 09:26 UTC)

## Goal
Freeze Task 2 boundary for ownership-precedence enforcement so post-arbitration paths cannot re-promote stage blockers and compact/verbose surfaces cannot disagree on primary source.

Focus:
1) immutable primary-lock semantics,
2) single-source primarySource derivation,
3) parity constraints preventing adapter/local sorter drift.

## Current-state observations
- Task 1 now emits ownership-preemption tokens and ownership-contract primary wording in compact summaries.
- Current helper layer does not yet expose explicit lock metadata (`primaryLocked`) or an explicit shared `primarySource` field.
- Earliest-stage alignment helpers still exist and are useful, but without lock/source contracts they can be misused by downstream sorters or renderers.

## Boundary definition (v1)

### A) Primary arbitration must emit a lock contract
After arbitration, primary selection is final for the run.

Required fields:
- `primarySource: 'ownership-contract' | 'stage-gate' | 'none'`
- `primaryLocked: true` when source is not `none`
- `primarySelectionReason: 'ownership-unmapped' | 'ownership-mismatch' | 'earliest-failing-stage' | 'no-failure'`

Rule:
- any downstream adapter may reformat but may not replace `primarySource` or primary reason identity when `primaryLocked=true`.

---

### B) Shared primarySource derivation primitive is authoritative
Define a single exported arbitration primitive that returns:
- selected primary source,
- lock status,
- selected primary reason token,
- stage triad context.

Rule:
- compact, verbose, and UI surfaces must consume this result directly;
- no adapter-local primary source inference from reason text/severity/stage order.

---

### C) Ownership preemption outranks stage-gate in lock model
When ownership status is `unmapped|mismatch`:
- `primarySource='ownership-contract'`
- `primaryLocked=true`
- stage primary remains suppressed/context-only.

When ownership status is `resolved`:
- stage-gate arbitration may select earliest failing stage (`primarySource='stage-gate'`) or `none`.

---

### D) Sorter bypass prevention boundary
Sorters may order secondary/suppressed reasons only.

Forbidden behavior:
- changing primary source while `primaryLocked=true`,
- replacing ownership-contract primary with stage reason,
- reclassifying `none` as stage-gate due to non-primary severity signals.

Required safeguard:
- mutation guard function that rejects payloads where downstream output changes locked primary fields.

---

### E) Compact/verbose parity contract
Parity checks must assert exact equality for:
- `primarySource`
- `primaryLocked`
- primary reason class/contract reason token
- ownership failure class (when applicable)

Allowed differences:
- wording density,
- field order,
- optional diagnostic expansion.

---

### F) Regression fixture set (minimum)
1. `mismatch + freshness fail` -> ownership-contract locked primary.
2. `unmapped + integrity fail` -> ownership-contract locked primary.
3. `resolved + freshness fail` -> stage-gate locked primary.
4. `resolved + no stage fail` -> source `none`, unlocked/empty primary.

All fixtures must be tested across compact + verbose render paths.

---

### G) Non-breaking rollout envelope
- Preserve existing discover/public-surface external behavior.
- Introduce lock/source fields in machine-facing payloads as additive diagnostics.
- Keep existing summary compatibility where possible; only tighten invariants.

## Decision matrix (lock/source)
| Ownership status | Earliest stage fail | Primary source | Primary locked |
|---|---:|---|---:|
| unresolved (`unmapped`) | any | ownership-contract | true |
| unresolved (`mismatch`) | any | ownership-contract | true |
| resolved | yes | stage-gate | true |
| resolved | no | none | false |

## Next smallest handoff
Lane E should capture applied learning for operator ergonomics of lock/source diagnostics:
- minimal compact wording for `primaryLocked` and `primarySelectionReason`,
- how to explain immutable primary behavior without UI clutter,
- ordering of lock/source vs stage context in verbose traces.
