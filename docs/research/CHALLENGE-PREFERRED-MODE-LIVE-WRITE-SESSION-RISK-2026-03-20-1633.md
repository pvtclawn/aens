# Challenge — preferred-mode live write session risk (2026-03-20 16:33 UTC)

## Purpose
Red-team the first real live ÆNS publication session now that the preferred Vercel child route is live and preferred mode is the honest default.

## Current truth
Verified at challenge time:
- repo health clean
- preferred public child route live
- preferred mode is now the default honest publication mode

So the main remaining risk is not hosting reachability first.
It is operator-state drift during the live human-wallet session.

## Weakness 1 — stale bootstrap-era wording still pollutes the mainline docs
Observed in current session materials:
- the checklist still says the child checkpoint should show `service URL set to the stub page`
- the checklist proof wording still emphasizes a `commit-pinned bootstrap source reference`
- the operator steps still say `For the current bootstrap-mode case, keep the note narrow`
- the operator steps still treat the bootstrap fallback page as a normal tab to keep open

Risk:
- the operator can follow a technically updated flow while still being semantically guided by yesterday’s fallback state
- preferred mode can be undercut by stale language before any ENS transaction fails

Mitigation:
- split preferred-mainline guidance from bootstrap-regression guidance
- remove stale bootstrap-default language from the primary write-session docs
- move fallback instructions to an explicit regression appendix/path

## Weakness 2 — the runbook does not fail closed if the preferred route regresses mid-session
The docs require a baseline `bun run check-public-surface`, but not a hard final recheck before final proof capture.

Risk:
- the child could be written to the preferred URL based on earlier truth while the public surface has already regressed by final capture time
- proof scope would then over-assume continuity that was not re-verified

Mitigation:
- require a second `bun run check-public-surface` immediately before `bun run capture-proof -- final`
- if `Preferred public surface ready` is no longer `yes`, stop and treat the session as an abort or explicit regression path
- make this a mandatory checkpoint, not a narrative preference

## Weakness 3 — the pre-authorization child state is too easy to misread as success
Before the parent capability list is written, the child can already look coherent:
- real ENS name
- address present
- description present
- parent link present
- service URL present

Risk:
- a human operator can read this as `basically done`
- screenshots or notes captured too early can look like success evidence
- the strongest ÆNS claim (`parent-authorized` child capability) is exactly the thing still missing at that moment

Mitigation:
- mark the pre-parent-authorization child state explicitly as `PROVISIONAL — not yet parent-authorized`
- forbid proof-note drafting or celebratory screenshots before the final authority check
- make the parent capability-list write read as the decisive authority step, not administrative cleanup

## Weakness 4 — section-3 proof wording can stay stale even after the blocker is gone
The preferred-mode note correctly says section 3 (`Unresolved human control-plane state`) should not repeat stale blocked-route wording if the preferred route remains live.
But the older operator docs still orient around the prior blocked-route reality.

Risk:
- the final proof note can accidentally preserve a stale deployment narrative
- this weakens the claim’s honesty by making the note lag behind capture-time truth

Mitigation:
- give section 3 two explicit allowed branches:
  1. preferred route live at capture time → no unresolved preferred-route blocker visible
  2. preferred route blocked/regressed at capture time → narrow blocker wording
- do not let section 3 function as an always-present blocker placeholder

## Core delta
None.
This challenge does not change the parent/child authorization model.

## Rail delta
High.
This is operator/proof-scope/runbook hardening around the live session.

## Counterfactual relevance test
Would this challenge still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting challenge work, not protocol-center progress.

## Bottom line
The next likely failure is now documentation/operator-state drift, not the hosting surface.

## Best next move
Turn this into a small Lane A plan with four concrete doc/runbook fixes:
1. preferred-mainline vs bootstrap-regression split
2. mandatory final public-surface recheck
3. explicit provisional child-state wording before parent authorization
4. two-branch section-3 proof wording
