# Twenty-sixth ÆNS slice verification — standalone proof-template patch (2026-03-20 17:13 UTC)

## Purpose
Verify the standalone first-live-proof template patch against:
- `docs/research/PLAN-STANDALONE-PROOF-TEMPLATE-PATCH-2026-03-20-1706.md`
- `docs/research/CHALLENGE-PROOF-TEMPLATE-BRANCH-SPLIT-RISK-2026-03-20-1701.md`

The goals of this verification are:
1. confirm the planned acceptance targets landed
2. confirm the branch-split safeguards from the challenge were actually absorbed
3. decide whether this closes the current preferred-mode doc-hardening chain or leaves one meaningful gap

## Verification inputs
Files checked:
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`
- `docs/research/PLAN-STANDALONE-PROOF-TEMPLATE-PATCH-2026-03-20-1706.md`
- `docs/research/CHALLENGE-PROOF-TEMPLATE-BRANCH-SPLIT-RISK-2026-03-20-1701.md`

Repo/public-truth checks at verification time:
```bash
git status -sb
bunx tsc --noEmit
bun test src/*.test.ts
bun run check-public-surface
grep -n "Proof branch:\|Branch-lock rule\|Preferred public surface ready: yes\|No unresolved preferred-route blocker was visible at capture time; other non-proven areas remain in section 4.\|write it **last**\|do **not** let it overstate" docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md
```

## Current repo/public truth
At verification time:
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes
- `bun run check-public-surface` reports:
  - preferred root `ok`
  - preferred child route `ok`
  - `Preferred public surface ready: yes`
  - `Bootstrap proof ready: no`

So the template is being verified against the current preferred-live reality, not the older bootstrap-blocked state.

## Plan acceptance target 1 — explicit branch selection and branch-lock rule
**Pass.**

Observed in the patched template:
- it now declares two honest capture-time branches only:
  - `preferred-live`
  - `bootstrap/regression`
- it requires the writer to choose exactly one branch before section 1 begins
- it includes an explicit branch marker:
  - `Proof branch: preferred-live`
  - `Proof branch: bootstrap/regression`
- it includes a `Branch-lock rule`
- it explicitly says bootstrap/regression is a narrower honest proof mode, not a shame branch

### Verdict
The mixed-branch `frankenproof` risk is materially reduced.

## Plan acceptance target 2 — branch-sensitive four-section wording with tighter preferred-live section 3
**Pass.**

Observed in the patched template:
- the same four top-level sections are preserved
- section 1 keeps machine-verifiable scope load-bearing and only adds pinned bootstrap-source wording for the bootstrap/regression branch
- section 2 stays explicitly observational and time-scoped in both branches
- section 2 now strongly prefers echoing exact capture-time verifier lines rather than freehand paraphrase alone
- section 3 no longer invents a blocker by default
- preferred-live section 3 includes the required scope-limiting sentence:
  - `No unresolved preferred-route blocker was visible at capture time; other non-proven areas remain in section 4.`
- the same preferred-live paragraph also keeps the observational-vs-machine-closed distinction present in-place
- bootstrap/regression section 3 keeps the earlier narrow blocker wording, but only for that branch
- section 4 stays blunt and does not upgrade preferred-live observation into invocation/payment/runtime closure

### Verdict
The patch preserves the proof model while fixing the stale-blocker default.

## Plan acceptance target 3 — compact summary and acceptance-rule hardening
**Pass.**

Observed in the patched template:
- the template now provides one compact summary per branch
- it says the compact summary must be written last
- it says the summary must be derived from the already chosen branch
- it says the summary must not overstate sections 1–4
- it says that if there is tension, the summary must be weakened
- the final acceptance rule is branch-neutral and still asks whether the reader can distinguish:
  1. machine-verified facts
  2. capture-time public observation
  3. whether a preferred-route blocker was visible at capture time
  4. what is still not proven

### Verdict
The summary layer is now constrained by the detailed sections instead of being allowed to outrun them.

## Challenge safeguard check
The earlier branch-split challenge asked for three specific structural safeguards.
All three landed.

### Safeguard 1 — explicit branch selection near the top
**Pass.**
Present near the beginning of the template.

### Safeguard 2 — scope-limiting sentence in preferred-live section 3
**Pass.**
Present verbatim in the preferred-live section-3 branch.

### Safeguard 3 — compact summary derived last and not allowed to overstate the sections
**Pass.**
Present explicitly in the compact summary rule.

## Remaining meaningful gap?
For the **current preferred-mode doc-hardening chain**, no meaningful gap remains.

Why:
- the runbooks were already patched and verified
- the standalone proof template is now aligned with them
- the current patch absorbed the main branch-split safeguards
- the current preferred-live vs bootstrap/regression wording boundary is now legible across the whole small proof/runbook stack

What remains outside this chain is not another documentation gap of the same kind.
The next meaningful work should move back to execution/proof/product reality:
- actual live ENS write session
- on-chain/public proof capture
- or further load-bearing AENS product work

## Core delta
None.
This verification does not change the parent identity / child capability / authorization model or the four-section proof model.

## Rail delta
High.
This verifies documentation/proof-scope hardening only.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting verification work, not protocol-center progress.

## Verdict
The standalone proof-template patch **passes**.

It satisfies the frozen plan.
It absorbs the earlier branch-split safeguards.
And it closes the current preferred-mode doc-hardening chain cleanly.
