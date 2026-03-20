# Plan — minimal publisher-assist state-machine v1 (2026-03-20 17:31 UTC)

## Purpose
Turn the post-proof publisher-assist direction plus the new state-machine challenge into one guarded, mergeable v1 plan.

Relevant prior notes:
- `docs/research/PLAN-POST-PROOF-PUBLISHER-ASSIST-UX-2026-03-19-1202.md`
- `docs/research/CHALLENGE-PUBLISHER-ASSIST-STATE-MACHINE-RISK-2026-03-20-1726.md`
- `docs/research/LIVE-WRITE-SESSION-HUMAN-DEPENDENCY-BOUNDARY-2026-03-20-1718.md`

## Current truth
At planning time:
- the first live ÆNS publication path is execution-blocked on Egor + wrapped-owner wallet approvals
- the surrounding proof/runbook/public-surface prep is already ready
- adjacent product work should improve the *second* publication experience, not keep polishing the first-session notes

So the right product-facing next move is not a broader automation dream.
It is a tiny publisher-assist primitive that makes legal next steps clearer without pretending to own wallet judgment.

## Guardrails
- v1 must be **read-only**: no hidden signing, no write execution, no bypass of wallet approval
- v1 must be **evidence-derived**: states come from fresh observed truth, not button progression
- v1 must preserve **human judgment** before each real write
- v1 must stay **small**: model only the states that change safety, proof validity, or the legal next move
- v1 may be scoped to the current root+child publish pattern, but state names should describe reusable publish phases rather than personal one-off labels

## v1 product shape
### One command, one current state, one legal next step
The minimal publisher-assist v1 should:
1. inspect current publish-relevant truth
2. classify the current publish state
3. print the next legal step only
4. print the exact human-review checks required before the next write
5. print the verification command(s) required after that write

This is **not** a wizard that auto-advances from internal memory.
It is a read-only state derivation tool anchored to fresh evidence.

## Minimal v1 state set
Keep the first state set deliberately tiny:
1. `preflight-ready`
2. `root-needs-write`
3. `root-verified`
4. `child-needs-create-or-write`
5. `child-verified-provisional`
6. `needs-parent-authorization`
7. `parent-authorized-verified`
8. `proof-captured`
9. `needs-operator-reconcile`
10. `aborted`

### Why this set
- small enough to avoid wizard bloat
- explicit enough to stop partial progress masquerading as success
- includes one reconciliation state instead of forcing the tool to bluff through divergence

## Task 1 — freeze evidence-derived transition rules
### Goal
Make every state transition come from fresh observed truth instead of operator click progression.

### Acceptance criteria
- the plan defines what evidence is required for each core state
- `root-verified` requires fresh root inspection output
- `child-verified-provisional` requires fresh child inspection output
- `parent-authorized-verified` requires fresh authority evidence from current inspection output
- `proof-captured` requires a real artifact path plus current public-truth snapshot
- if required evidence is missing or contradictory, the tool must classify `needs-operator-reconcile` or `aborted`, not silently progress

## Task 2 — freeze human-review checkpoints before each write
### Goal
Prevent the tool from sounding like it is implicitly approving wallet prompts.

### Acceptance criteria
- before each write-oriented next step, the plan defines a `human review required` checkpoint
- that checkpoint includes at least:
  - correct wallet connected
  - expected name/contract target
  - no suspicious UI/gas mismatch
- the tool never implies that a wallet prompt is safe just because previous machine checks passed
- the next legal step output includes both the intended write and the human review reminder

## Task 3 — freeze reconcile/abort behavior and v1 non-goals
### Goal
Keep the first implementation small, honest, and resistant to workflow theater.

### Acceptance criteria
- the plan defines when the tool should emit `needs-operator-reconcile`
- the plan defines when the tool should emit `aborted`
- the plan explicitly says v1 does **not** yet support broad multi-child/multi-session recovery flows
- the plan explicitly says v1 does **not** perform writes or wallet automation
- the plan explicitly says internal session memory cannot outrank fresh chain/public truth

## Chosen order
1. freeze the minimal state set + evidence rules
2. freeze `human review required` checkpoints for write steps
3. freeze reconcile/abort semantics + v1 non-goals

## Next Task
# Build the smallest read-only publisher-assist CLI slice that derives one current publish state from fresh evidence and prints only the next legal step, the required human-review checkpoint, and the follow-up verification command(s).

## Why this next
This is the smallest buildable response to the publisher-UX criticism that:
- improves the second publication experience
- preserves wallet consent as the security boundary
- avoids wizard theater
- and stays aligned with what the challenge note says can go wrong

## Core delta
None.
This plan does not change the parent/child authorization model.

## Rail delta
Moderate.
This is product/UX planning for the adjacent post-proof publisher-assist path.

## Counterfactual relevance test
Would this plan still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product/UX planning, not protocol-center progress.
