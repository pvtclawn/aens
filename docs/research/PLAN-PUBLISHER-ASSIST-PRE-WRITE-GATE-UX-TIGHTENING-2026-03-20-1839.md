# Plan — publisher-assist pre-write gate UX tightening (2026-03-20 18:39 UTC)

## Purpose
Turn the new pre-write-gate critique into one tiny guarded plan without expanding the publisher-assist state model.

Relevant prior notes:
- `docs/research/PUBLISHER-ASSIST-FIRST-LIVE-SESSION-ROLE-2026-03-20-1829.md`
- `docs/research/CHALLENGE-PUBLISHER-ASSIST-PRE-WRITE-GATE-RISK-2026-03-20-1834.md`
- `docs/research/PLAN-MINIMAL-PUBLISHER-ASSIST-STATE-MACHINE-V1-2026-03-20-1731.md`

## Current truth
At planning time:
- publisher-assist v1 is already useful, read-only, and trust-hardened
- its role in the first live ENS session is now frozen as a **re-runnable pre-write gate**
- the new remaining risk is mostly **misuse/interpretation**, not missing state transitions

So the next useful move is not another state-model change.
It is a tiny role/UX tightening pass that makes the tool’s intended role harder to misunderstand.

## Guardrails
- do **not** add new workflow states
- do **not** add session-memory behavior
- do **not** expand into a wizard or phase script
- keep the tool read-only
- keep the change mostly in output/UX wording and lightweight tests

## Task 1 — make the usage boundary explicit in write-oriented output
### Goal
Prevent `next legal step` from sounding like “this tool is the whole session guide.”

### Acceptance criteria
- for write-oriented states, output includes a short usage-boundary cue such as:
  - this is guidance for the next phase boundary
  - not a replacement for the runbook
  - use after verification, before the next write
- the cue is concise and does not bury the actual next step
- non-write terminal states do not need the same pre-write cue density

## Task 2 — keep human review visibly tied to the next-step output
### Goal
Reduce the risk that the CLI sounds like machine permission rather than machine guidance.

### Acceptance criteria
- `human review required` remains visually adjacent to write-oriented next-step output
- output language makes clear that the tool is **not** approving wallet prompts
- the wording stays short and concrete, not sermon-like

## Task 3 — add one lightweight runbook-handoff cue without turning the tool into a script
### Goal
Prevent users from mistaking `next legal step` for “all write details are here.”

### Acceptance criteria
- write-oriented output includes a minimal handoff cue back to the existing operator/runbook flow
- the cue points the operator toward the runbook/verification step without dumping all payload details into the CLI
- the tool still remains a gate, not a phase script

## Chosen order
1. explicit usage-boundary cue in write-oriented output
2. tighten `human review required` / non-permission wording
3. minimal runbook-handoff cue

## Next Task
# Patch `src/publish-assist.ts` output so write-oriented states explicitly say they are phase-boundary guidance used after verification and before the next write, keep `human review required` visually tied to that guidance, and include a minimal handoff cue back to the runbook.

## Why this next
This is the smallest role/UX improvement that addresses the new misuse risks without bloating the tool, adding states, or re-opening the settled trust semantics.

## Core delta
None.
This plan does not change the parent/child authorization model.

## Rail delta
Moderate.
This is adjacent publisher-assist v1 UX tightening.

## Counterfactual relevance test
Would this plan still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting tool/UX planning, not protocol-center progress.
