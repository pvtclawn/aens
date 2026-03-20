# Challenge — publisher-assist state-machine risk (2026-03-20 17:26 UTC)

## Purpose
Red-team the new post-proof product direction that says publisher-assist UX should be an explicit state machine rather than a nicer checklist.

## Current truth
At challenge time:
- repo health clean on the deterministic check path
- preferred public child route live
- the first live publication path is execution-blocked on Egor + wrapped-owner wallet approvals
- post-proof publisher-assist UX is the adjacent product-facing direction
- that direction now includes an explicit publish-state-machine idea

This is a plausible improvement.
But it can still fail in several specific ways before it becomes real product value.

## Weakness 1 — named states can become fake rigor
A tool can display states like:
- `root-verified`
- `child-verified-provisional`
- `proof-captured`

without those states being grounded in authoritative evidence.

Risk:
- the workflow looks stricter without actually being safer
- partial progress can still masquerade as success, just with nicer labels

Mitigation:
- every state transition must be evidence-derived rather than click-derived
- `root-verified` requires fresh root inspection
- `child-verified-provisional` requires fresh child inspection
- `proof-captured` requires a real proof artifact plus final public-truth snapshot
- missing evidence means stay put or transition to `aborted`

## Weakness 2 — the model can overfit the first live session
The current proposed states map neatly onto the first `pvtclawn.eth` / `research.pvtclawn.eth` session.
That can make the first implementation too coupled to one exact flow.

Risk:
- the result becomes a one-off wizard for this publish rather than a reusable ÆNS publisher-assist primitive
- already-modernized roots, second-child publication, or restart/recovery flows become awkward bolt-ons

Mitigation:
- define states around publish semantics, not one personal name pair
- keep v1 narrow, but phrase states as reusable publish phases
- document explicitly what v1 does not yet support

## Weakness 3 — a strong workflow can hide necessary operator judgment
If the tool feels authoritative, the operator may drift toward:
- `the tool says next step, so this wallet prompt must be fine`

Risk:
- some checks are still irreducibly human:
  - correct wallet connected
  - expected contract/name target
  - suspicious gas/UI mismatch
  - weird ENS App behavior
- over-structured tooling can train obedience where skepticism is still required

Mitigation:
- model `human review required` as a real checkpoint before each write
- remind the operator what must be verified in the wallet/UI before approving
- never let machine-prepared state imply machine-approved wallet safety

## Weakness 4 — tool state can diverge from chain/public truth
The tool may believe it is in one state while reality has drifted:
- a write lands differently than expected
- another session changes the ENS state
- public truth changes between steps
- cached/browser state lags

Risk:
- local session state starts to outrank real chain/public state
- the UX becomes polished but epistemically weak

Mitigation:
- derive the current state from fresh reads whenever possible
- use current `inspect` / `check-public-surface` output as load-bearing transition evidence
- if expected state and observed state diverge, go to `aborted` or `needs-operator-reconcile`, not silently onward

## Weakness 5 — too many states can recreate the same friction in prettier form
There is a narrow band where the state machine is genuinely simpler than the runbook.
Outside it, the tool becomes another thing to learn.

Risk:
- the first version may feel more ceremonial than helpful
- the product response to the publisher-UX critique would then fail in practice

Mitigation:
- keep the first state machine tiny and risk-focused
- model only the states that change safety, proof validity, or the legal next move
- defer richer branching until one real second-publication attempt reveals what actually hurts

## Core delta
None.
This challenge does not change the parent/child authorization model.

## Rail delta
Moderate.
This is a challenge to the adjacent post-proof UX/product rail.

## Counterfactual relevance test
Would this challenge still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product/UX challenge work, not protocol-center progress.

## Bottom line
The publisher-assist state-machine direction is promising only if it stays:
- evidence-derived
- reusable enough
- judgment-preserving
- chain/public-truth anchored
- small enough to reduce friction rather than add ritual

## Best next move
Freeze one minimal publisher-assist state-machine plan before build time with four safeguards:
1. evidence-derived transitions only
2. explicit `human review required` checkpoint before each write
3. reconciliation/abort state when tool state and observed truth diverge
4. deliberately tiny v1 state set
