# Plan — Ownership-Precedence Enforcement v1 (2026-03-22 09:11 UTC)

## Goal
Convert the latest ownership-precedence challenge into a compact implementation plan that prevents stage-blocker re-promotion and preserves deterministic ownership-contract preemption.

## Scope boundary
- In scope: ownership-preemption tokens, immutable primary-lock behavior, source-tag parity, source-aware remediation/UI mapping.
- Out of scope: new ENS feature surfaces, publish/deploy flow changes, broad schema redesign outside ownership-precedence path.
- Compatibility: keep discover/public-surface external behavior unchanged; diagnostics may be additive.

## Task 1 — Enforce required preemption/context tokens for ownership failures
Add hard requirements whenever ownership status is `unmapped|mismatch`:
- `stagePrimarySuppressed=true`
- `stageStatusContextOnly=true`
- compact output must include ownership failure class token.

### Acceptance criteria
1. Ownership-failure compact payloads always include both suppression/context tokens.
2. Contract tests fail if either token is missing during ownership preemption.
3. Stage triad remains present as context, but no stage-primary wording appears when suppressed.
4. Typecheck and targeted tests pass.

---

## Task 2 — Add immutable primary-lock + source-tag parity guarantees
Prevent post-arbitration sorters from replacing ownership-contract primary blockers.

### Acceptance criteria
1. Primary blocker includes lock metadata (`primaryLocked=true`) after arbitration.
2. `primarySource` is derived once from shared primitive and is identical across compact + verbose outputs.
3. Regression fixture (`mismatch + freshness fail`) always yields ownership-contract primary source in all render modes.
4. Tests fail on any adapter path that re-promotes stage blockers during ownership failure.

---

## Task 3 — Enforce source-aware remediation + UI source-priority mapping
Ensure failure hints and visual priority follow ownership source semantics.

### Acceptance criteria
1. Ownership-contract source can only emit ownership-specific remediation templates.
2. Stage remediation templates are suppressed while ownership failure is active.
3. UI/source badges prioritize `ownership-contract` over stage labels when preemption applies.
4. Snapshot/parity tests lock hint text and source-priority behavior.

## Next smallest handoff
Lane B should implement **Task 1 only**:
- add required preemption/context tokens to ownership-failure outputs,
- add deterministic tests for token presence and stage-context-only labeling.