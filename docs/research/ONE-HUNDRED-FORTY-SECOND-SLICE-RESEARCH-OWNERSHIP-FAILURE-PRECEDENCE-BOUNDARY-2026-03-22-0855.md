# One-Hundred-Forty-Second Slice Research — Ownership Failure Precedence Boundary (2026-03-22 08:55 UTC)

## Goal
Freeze Task 2 boundary for reason-stage ownership hardening:
- ensure `unmapped|mismatch` ownership failures cannot be demoted by legacy sorter paths,
- define preemption rules for primary blocker arbitration,
- lock adapter parity constraints.

## Current-state signal
- Shared ownership resolver now emits deterministic statuses and contract reasons.
- Existing stage-gate helpers still expose stage-first alignment checks (`computeEarliestFailingStage`) that can conflict with ownership failure precedence unless explicitly ordered.
- Risk: downstream block reasons may still appear primary if sorters run before ownership-contract arbitration.

## Boundary definition (v1)

### A) Ownership contract failures preempt stage-level blocker arbitration
Precedence order must be explicit and non-overridable:
1. ownership failure (`unmapped` or `mismatch`),
2. earliest failing stage blocker,
3. secondary/suppressed reasons.

Rule: when ownership status is not `resolved`, stage-level primary blocker selection is bypassed.

---

### B) Deterministic primary-blocker source model
Add explicit source tag for primary blocker:
- `ownership-contract` (for unmapped/mismatch)
- `stage-gate` (for normal earliest-failing-stage cases)

Rule: adapter renderers must consume source tag, not re-derive priority from reason text/severity.

---

### C) Unmapped behavior (hard fail-closed)
When reason is not in canonical registry:
- primary blocker reason is `fixture-provenance-stage-reason-unmapped`,
- include original reason code as diagnostic context only,
- block all stage-level primary blocker selection for that run.

---

### D) Mismatch behavior (hard fail-closed)
When claimed stage owner differs from canonical owner:
- primary blocker reason is `fixture-provenance-stage-owner-mismatch`,
- include `claimedStageOwner` + `canonicalStageOwner` diagnostics,
- block stage-level primary blocker selection for that run.

---

### E) Legacy sorter bypass prevention
All formatter/sorter paths must accept already-arbitrated primary blocker payload.

Guardrails:
- forbid adapter-local re-sorting of primary blocker class,
- add regression fixture where ownership mismatch coexists with freshness failure;
  expected primary blocker remains ownership-contract,
- fail tests if any path surfaces stage blocker as primary during ownership failure.

---

### F) Adapter parity contract requirements
Parity checks must assert:
1. ownership failure status implies primary source = `ownership-contract`,
2. contract reason code matches failure class (`unmapped` vs `mismatch`),
3. stage-level primary blocker is suppressed while ownership failure is active,
4. compact output includes deterministic ownership failure token and single-step remediation hint.

---

### G) Backward-compatibility envelope
- Keep discover/public-surface external contracts unchanged.
- Introduce precedence/source diagnostics under optional machine-facing fields where needed.
- Do not change consumer-facing wording unless failure context is present.

## Decision matrix (arbitration)
| Ownership status | Stage fail exists | Primary source | Primary reason class |
|---|---:|---|---|
| resolved | yes | stage-gate | stage reason |
| resolved | no | none | none |
| unmapped | any | ownership-contract | `fixture-provenance-stage-reason-unmapped` |
| mismatch | any | ownership-contract | `fixture-provenance-stage-owner-mismatch` |

## Next smallest handoff
Lane E should capture operator-facing learning for precedence diagnostics:
- minimal compact wording for ownership preemption,
- remediation hints that avoid blaming the wrong stage,
- consistent explanation order across compact and verbose outputs.
