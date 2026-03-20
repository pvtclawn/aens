# Plan — preferred-mode live session doc hardening (2026-03-20 16:38 UTC)

## Purpose
Turn the preferred-mode live-session challenge into one small, mergeable doc/runbook hardening plan.

Current truth at planning time:
- repo health clean
- preferred Vercel child route live
- preferred mode is now the honest default for the first real live ENS publication session

So the next useful work is not more hosting analysis.
It is tightening the operator/proof docs so they reflect current truth and fail closed when that truth changes.

## Guardrails
- Keep this as a **doc/runbook** slice, not a broader product rewrite.
- Do not change the underlying parent/child authority model.
- Prefer explicit preferred-mainline guidance with an explicit bootstrap-regression branch, not mixed co-equal defaults.

## Task 1 — make preferred mode the mainline path in the live-session docs
### Files
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`

### Goal
Remove stale bootstrap-era wording from the mainline session flow and make preferred mode the default honest path.

### Acceptance criteria
- mainline wording treats `preferred` as the default live session when `Preferred public surface ready = yes`
- stale phrases are removed from the preferred-mainline path, including:
  - `service URL set to the stub page`
  - `For the current bootstrap-mode case`
- bootstrap fallback remains available only as an explicit regression/fallback branch, not the default narrative
- the operator is told why the preferred URL is the honest current target, not just what to paste

## Task 2 — add fail-closed public-truth checkpoints
### Files
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`

### Goal
Prevent the live session from silently assuming the preferred route stayed live from baseline through final proof capture.

### Acceptance criteria
- baseline `bun run check-public-surface` remains mandatory
- a second `bun run check-public-surface` is required immediately before `bun run capture-proof -- final`
- docs say clearly: if `Preferred public surface ready` is no longer `yes` at final recheck, stop and treat the session as an abort or explicit regression path
- the final proof capture is no longer allowed to proceed on stale baseline truth alone

## Task 3 — harden provisional/section-3 proof wording
### Files
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

### Goal
Make intermediate child state and section-3 proof wording honest under the new preferred-live reality.

### Acceptance criteria
- pre-parent-authorization child state is labeled explicitly as provisional / not yet `parent-authorized`
- docs forbid success proof-writing or celebratory screenshots before the final authority check
- section 3 (`Unresolved human control-plane state`) gets two explicit branches:
  1. preferred route live at capture time → no unresolved preferred-route blocker visible
  2. preferred route blocked/regressed at capture time → narrow blocker wording
- bootstrap-specific proof wording remains available only for the regression branch, not as the universal default template story

## Chosen order
1. preferred-mainline wording + fail-closed checkpoints in checklist/operator steps
2. proof-template two-branch section-3 wording
3. any remaining cleanup of bootstrap-regression wording

## Next Task
# Patch the two live-session runbooks first (`CHECKLIST...` + `OPERATOR-STEPS...`) so preferred mode is the mainline path, the final public-surface recheck is mandatory, and the pre-authorization child state is explicitly provisional.

## Why this next
This is the smallest mergeable slice that eliminates the most likely operator-state failures without needing a broader rewrite.
It directly addresses three of the four identified risks, and it gives the proof-template update a cleaner, current runbook to align with afterward.

## Core delta
None.
This plan does not change the parent/child authorization model.

## Rail delta
High.
This is execution/runbook hardening around the live preferred-mode session.

## Counterfactual relevance test
Would this plan still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting planning work, not protocol-center progress.
