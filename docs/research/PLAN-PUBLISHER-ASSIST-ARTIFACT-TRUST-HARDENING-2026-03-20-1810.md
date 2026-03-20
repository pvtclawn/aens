# Plan — publisher-assist artifact-trust hardening (2026-03-20 18:10 UTC)

## Purpose
Turn the new local-artifact trust critique into one tiny guarded plan for publisher-assist v1.

Relevant prior notes:
- `docs/research/CHALLENGE-PUBLISHER-ASSIST-LOCAL-ARTIFACT-TRUST-RISK-2026-03-20-1805.md`
- `docs/research/PLAN-MINIMAL-PUBLISHER-ASSIST-STATE-MACHINE-V1-2026-03-20-1731.md`
- `docs/research/ABORTED-VS-RECONCILE-V1-BOUNDARY-2026-03-20-1755.md`

## Current truth
At planning time:
- publisher-assist v1 is read-only and stateless
- fresh ENS/public reads are already load-bearing
- the current remaining weakness is local proof-artifact trust
- specifically, `proof-captured` can currently be triggered by a weak markdown-content heuristic

So the next useful move is not another state-model expansion.
It is a small hardening pass on artifact-sensitive completion semantics.

## Guardrails
- keep v1 **read-only**
- keep the current state model small
- do **not** let local disk evidence outrank fresh ENS/public truth
- prefer demotion to advisory evidence over optimistic terminal-state promotion
- if the artifact contract is weak or ambiguous, fail closed to `parent-authorized-verified` rather than `proof-captured`

## Task 1 — freeze a strong final-proof artifact contract
### Goal
Define what must be true before a local proof artifact is allowed to promote state to `proof-captured`.

### Acceptance criteria
- the plan defines a **strong final-proof artifact match** instead of the current loose text-marker heuristic
- the artifact contract should require, at minimum:
  - final-phase evidence (not baseline or post-root)
  - current publication mode / service URL alignment
  - the current child ENS name
  - structurally expected proof-capture metadata rather than loose substring presence alone
- if those fields are missing or weak, artifact presence is not sufficient for `proof-captured`

## Task 2 — demote weak artifact matches to advisory evidence
### Goal
Keep local proof artifacts useful without letting them silently overstate workflow completeness.

### Acceptance criteria
- weak or partial artifact matches do **not** produce `proof-captured`
- with current live authority verified but artifact contract weak, the state remains `parent-authorized-verified`
- advisory evidence may still appear in output/evidence lines, but it must not flip the terminal state
- historical artifacts should not be enough on their own to make the current run look complete

## Task 3 — freeze tiny testable behavior for v1
### Goal
Keep the hardening slice small and verifiable.

### Acceptance criteria
- add/adjust tests for at least:
  1. strong final-proof artifact match → `proof-captured`
  2. weak or stale artifact match → stays `parent-authorized-verified`
  3. no artifact match + current parent authorization → stays `parent-authorized-verified`
- do not add new workflow states for this slice
- do not add session-memory semantics
- do not add writes or wallet automation

## Chosen order
1. define the strong final-proof artifact contract
2. harden `proof-captured` classification against that contract
3. add tests proving weak artifacts stay non-terminal

## Next Task
# Patch `src/publish-assist.ts` so `proof-captured` requires a strong final-proof artifact match; otherwise local artifact presence is advisory only and current parent-authorized truth remains `parent-authorized-verified`.

## Why this next
This is the smallest load-bearing fix for the newly identified trust weakness.
It improves epistemic honesty without broadening scope, adding states, or pretending the tool owns more workflow state than it does.

## Core delta
None.
This plan does not change the parent/child authorization model.

## Rail delta
Moderate.
This is adjacent publisher-assist v1 hardening.

## Counterfactual relevance test
Would this plan still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting tool/UX planning, not protocol-center progress.
