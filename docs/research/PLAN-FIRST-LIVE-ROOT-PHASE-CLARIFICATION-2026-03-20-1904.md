# Plan — first live root-phase clarification (2026-03-20 19:04 UTC)

## Purpose
Turn the new first-live root-phase challenge into one tiny guarded plan.

Relevant prior notes:
- `docs/research/CHALLENGE-FIRST-LIVE-ROOT-PHASE-BUNDLE-RISK-2026-03-20-1859.md`
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/PUBLISHER-ASSIST-FIRST-LIVE-SESSION-ROLE-2026-03-20-1829.md`

## Current truth
At planning time:
- the first live ENS session is still blocked on Egor + wrapped-owner wallet approvals
- the opening root phase remains conceptually correct:
  - resolver modernization first
  - root records immediately after
- the newly identified risk is not proof/model drift
- it is early-session **operational ambiguity** if the resolver tx lands but the root-record step becomes awkward or blocked

So the next useful move is not a state-model expansion or broader product change.
It is a tiny root-phase-specific clarification/abort-note pass.

## Guardrails
- do **not** change the overall resolver-first strategy
- do **not** expand the publisher-assist state model
- do **not** turn the checklist into a giant UI walkthrough
- keep the follow-up as a small doc/runbook clarification only
- prefer naming the risky failure case explicitly over adding general ceremony

## Task 1 — clarify that the root phase is one goal but may span multiple tool surfaces
### Goal
Prevent `resolver modernization + root records` from sounding like one smooth tool path when it may actually require multiple UI surfaces.

### Acceptance criteria
- the checklist explicitly says the root phase remains one continuous goal even if it spans ENS App and `tools.ens.xyz`
- wording makes clear that the resolver write is only the opening sub-action of the root phase
- wording does **not** imply that the session should pause casually between resolver update and root records

## Task 2 — add an explicit mid-root failure note
### Goal
Name the case where the resolver tx lands but root records do not become cleanly writable.

### Acceptance criteria
- the checklist names this as a distinct root-phase abort/failure case
- the note says to:
  - save the resolver tx hash
  - run `bun run inspect pvtclawn.eth`
  - record the exact blocked record/editability point
  - stop rather than drifting into child creation
- this failure note appears close to Phase 1 / Phase 2, not buried in a generic catch-all section

## Task 3 — keep the root-phase success criterion sharp
### Goal
Reduce the chance that the resolver tx itself gets emotionally misread as meaningful success.

### Acceptance criteria
- wording makes explicit that the root phase is not operationally complete until `bun run inspect pvtclawn.eth` shows:
  - address
  - description
  - `aens.agentId`
  - `aens.runtime`
- the clarification reinforces existing checkpoint truth rather than inventing a new milestone system

## Chosen order
1. add the root-phase continuity + multi-surface clarification
2. add the explicit mid-root failure/abort note
3. sharpen the already-existing root-phase completion wording only if needed

## Next Task
# Patch `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md` with the smallest root-phase-specific clarification/abort note needed to handle the case where the resolver tx lands but root records do not become cleanly writable.

## Why this next
This is the smallest load-bearing response to the new root-phase critique.
It reduces the risk of early-session operator confusion without widening the model, touching the CLI, or reopening closed trust/UX threads.

## Core delta
None.
This plan does not change the parent/child authorization model.

## Rail delta
Moderate.
This is execution/runbook planning for the first live session edge.

## Counterfactual relevance test
Would this plan still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution planning, not protocol-center progress.
