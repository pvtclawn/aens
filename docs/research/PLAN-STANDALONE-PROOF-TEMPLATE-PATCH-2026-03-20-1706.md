# Plan — standalone first-live-proof template patch (2026-03-20 17:06 UTC)

## Purpose
Turn the standalone proof-template boundary note plus the branch-split challenge into one small, mergeable patch plan.

Relevant prior notes:
- `docs/research/PROOF-TEMPLATE-PREFERRED-LIVE-VS-REGRESSION-BOUNDARY-2026-03-20-1654.md`
- `docs/research/CHALLENGE-PROOF-TEMPLATE-BRANCH-SPLIT-RISK-2026-03-20-1701.md`

Current truth at planning time:
- repo health clean
- preferred Vercel child route live
- live-session runbooks already reflect preferred mode as the mainline path
- the standalone proof template is now the last meaningful doc-hardening gap from this sequence

## Guardrails
- Keep the same four top-level sections:
  1. `Machine-verifiable scope`
  2. `Observed public-alias state (time-scoped)`
  3. `Unresolved human control-plane state`
  4. `Not yet proven`
- Do not weaken the distinction between machine-verifiable ENS authority and capture-time public observation.
- Do not make bootstrap/regression sound like an embarrassing failure state.
- Keep this as a single-file doc patch, not a broader runbook rewrite.

## Task 1 — add explicit branch selection and branch-lock rule
### File
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

### Goal
Prevent mixed-branch `frankenproofs` by making branch choice explicit before the sections begin.

### Acceptance criteria
- the template defines two valid branches only:
  - `preferred-live`
  - `bootstrap/regression`
- near the top, the template instructs the writer to choose exactly one branch for the note
- the template includes a small branch marker/header such as `Proof branch: ...`
- the template says both branches are acceptable when chosen honestly from capture-time truth
- bootstrap/regression is described as a narrower honest proof mode, not as a shame branch

## Task 2 — patch the four sections with branch-sensitive wording and tighter section-3 scope
### File
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

### Goal
Make the template reflect current preferred-live reality without blurring observational truth into machine-closed proof.

### Acceptance criteria
- section 1 keeps machine-verifiable scope load-bearing and only includes bootstrap-specific pinned-source wording when bootstrap/regression is actually used
- section 2 stays explicitly observational and time-scoped in both branches
- the preferred-live branch strongly prefers echoing the exact capture-time verifier lines instead of freehand paraphrase alone
- section 3 no longer invents a blocker by default
- preferred-live section 3 includes a scope-limiting sentence equivalent to:
  - `No unresolved preferred-route blocker was visible at capture time; other non-proven areas remain in section 4.`
- the preferred-live section 3 also keeps `observational rather than machine-closed proof` in the same paragraph
- bootstrap/regression section 3 keeps the earlier narrow blocker wording, but only for that branch
- section 4 stays blunt in both branches and does not let preferred-live wording imply invocation/payment/runtime closure

## Task 3 — harden compact summaries and acceptance rule
### File
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

### Goal
Prevent the compact summary from undoing the honesty work done by sections 1–4.

### Acceptance criteria
- the template provides one compact summary per branch, not a universal bootstrap default summary
- the template says explicitly that the compact summary is derived last from the chosen branch
- the template says the summary cannot overstate the detailed sections
- if there is any tension between the summary and sections 1–4, the summary must be weakened
- the final acceptance rule is branch-neutral and lets a reader tell:
  1. what was machine-verified
  2. what was only observed at capture time
  3. whether a preferred-route blocker was visible at capture time or not
  4. what still is not proven

## Chosen order
1. explicit branch selection + branch-lock rule
2. branch-sensitive section rewrites with tighter preferred-live section 3
3. compact summary + acceptance rule hardening

## Next Task
# Patch `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md` so it becomes a two-branch template with explicit branch selection, a scope-limited preferred-live section 3, and branch-safe compact summary rules.

## Why this next
This is the smallest mergeable slice left in the current doc-hardening chain.
It closes the last isolated gap without reopening runbooks, deployment work, or broader proof-model changes.

## Core delta
None.
This plan does not change the parent/child authorization model or the four-section proof model.

## Rail delta
High.
This is documentation/proof-scope planning for the next standalone template patch.

## Counterfactual relevance test
Would this plan still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting planning work, not protocol-center progress.
