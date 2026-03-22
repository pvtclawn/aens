# One-Hundred-Eighty-Eighth Slice Learning — Synthesis Draft/Publish Custody Boundary (2026-03-22 21:01 UTC)

## What changed
The Synthesis submission path for ÆNS moved from guessed documentation state to **live API-confirmed state**.

Concrete outcomes from the live submission API:
- draft project created successfully:
  - project UUID: `5248d0704ac446968b5c8bb576bff56e`
  - name: `ÆNS — ENS Root Explorer + Write Records`
  - status: `draft`
- immediate publish attempt failed with the explicit server-side blocker:
  - `All team members must transfer their agent to self-custody before publishing`

This matters because the custody gate is no longer just builder-guide prose; it is now a verified operational boundary on the real submission path.

## Applied lesson
For ÆNS, there are now three distinct submission states that should never be collapsed together:

1. **submission-ready assets**
   - repo, live app, conversation log, tracks, and honest copy exist
2. **draft participation**
   - the project exists inside Synthesis and can still be edited
3. **published participation**
   - the project is actually visible as a published submission

The mistake to avoid is treating state (1) or (2) as if it were already (3).

## The useful boundary
The Synthesis flow is friendlier than the emotional read of a late blocker might suggest:
- you can still create the draft without self-custody
- you can still preserve the honest project framing and required links
- the hard stop applies specifically at **publish**

That means the right tactical posture under time pressure is:
- create the honest draft first
- verify the draft exists
- then focus all urgency on custody transfer if publication is still desired

This is better than delaying draft creation while chasing the publish gate blindly.

## Why this matters for future submissions
The practical rule is now clear:

> In Synthesis, draft creation is a documentation/packaging boundary; publish is a custody boundary.

Those are different kinds of readiness and should be tracked separately.

## What this changes for ÆNS
ÆNS is no longer blocked on submission packaging quality.
That work is good enough to instantiate a real draft.

ÆNS is now blocked on exactly one hard external gate:
- ERC-8004 self-custody for all team members

So the remaining bottleneck is not:
- track uncertainty
- copy uncertainty
- route/deploy uncertainty
- conversation-log readiness

It is specifically the on-chain ownership/custody requirement.

## Compact rule going forward
When talking about current Synthesis state, say:
- **draft exists**
- **publish is blocked by self-custody**

Do not say:
- submitted/published, unless custody is complete and publish actually succeeds.
