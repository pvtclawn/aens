# Plan — ENS-App fallback threshold for the first live root phase (2026-03-20 19:29 UTC)

## Purpose
Turn the new ENS-App fallback-threshold critique into one tiny guarded plan for the first live root phase.

Relevant prior notes:
- `docs/research/ENS-APP-FIRST-ROOT-PHASE-DEFAULT-2026-03-20-1919.md`
- `docs/research/CHALLENGE-ENS-APP-FIRST-FALLBACK-THRESHOLD-2026-03-20-1924.md`
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`

## Current truth
At planning time:
- the first live root phase is now simpler by default:
  - latest Public Resolver
  - ENS App first
  - `tools.ens.xyz` only if needed
- the remaining ambiguity is the **switch threshold**
- without a threshold, fallback can happen either too early or too late

So the next useful move is not more general root-phase theory.
It is a tiny threshold clarification.

## Guardrails
- do **not** change the resolver-first strategy
- do **not** widen the state model
- do **not** turn the checklist into a giant troubleshooting tree
- keep the rule practical enough for a live human-wallet session
- record concrete failure classes instead of vague “ENS App weirdness” notes

## Task 1 — freeze the minimal switch threshold
### Goal
Define when the session should leave ENS App and move to `tools.ens.xyz`.

### Acceptance criteria
- the threshold reads roughly as:
  1. confirm the resolver tx landed
  2. attempt post-resolver record editing in ENS App
  3. if required editability still is not available after one reasonable retry/reopen check, switch to `tools.ens.xyz`
- the threshold does **not** encourage switching on the first moment of friction alone
- the threshold does **not** encourage stubbornly staying in ENS App after editability is clearly still unavailable

## Task 2 — require explicit failure-class capture when switching
### Goal
Make the fallback path teach something real instead of collapsing into vague session folklore.

### Acceptance criteria
- when fallback is triggered, the note/checklist says to record the failure class explicitly, such as:
  - `editability missing after resolver update`
  - `text-record path unavailable`
  - `wrapped-name manager friction`
- wording avoids catch-all phrases like `ENS App weirdness`
- this remains lightweight, not a full incident-report template

## Task 3 — keep fallback neutral, not shame-coded
### Goal
Prevent the contingency path from feeling like failure theater.

### Acceptance criteria
- wording treats `tools.ens.xyz` as a contingency surface, not a defeat state
- the note makes clear that preserving correct record-setting is more important than “winning” the ENS App path
- no extra model/state machinery is introduced for this slice

## Chosen order
1. freeze the minimal switch threshold
2. add explicit failure-class capture
3. keep fallback wording neutral and controlled

## Next Task
# Patch the first-live checklist/root-phase notes with the smallest threshold clarification needed to say when ENS App first becomes `tools.ens.xyz` fallback, and require recording the exact failure class if that switch happens.

## Why this next
This is the smallest load-bearing response to the remaining ambiguity in the ENS-App-first default.
It makes the live session more teachable without widening the model or introducing more process than the real session can carry.

## Core delta
None.
This plan does not change the parent/child authorization model.

## Rail delta
Moderate.
This is first-live-session execution planning only.

## Counterfactual relevance test
Would this plan still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution planning, not protocol-center progress.
