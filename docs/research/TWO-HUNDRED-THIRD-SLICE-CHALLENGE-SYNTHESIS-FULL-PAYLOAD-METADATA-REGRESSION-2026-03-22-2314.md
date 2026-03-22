# Two-Hundred-Third Slice Challenge — Synthesis Full-Payload Metadata Regression (2026-03-22 23:14 UTC)

## Trigger
The live Synthesis project is now stronger in one important way:
- the improved submission-cut demo URL survives on the public project surface

But the same full-payload update also regressed fields that had previously been auto-populated from GitHub:
- `commitCount`
- `contributorCount`
- `firstCommitAt`
- `lastCommitAt`

All four are back to `null` on current public readback.

## Core critique
The current Synthesis project-update path is not merely inconsistent.
It is **non-monotonic**.

That means:
- a later “improvement” update can make one visible part of the submission better
- while silently degrading other previously working proof fields

This is more dangerous than a simple missing field because it punishes iterative cleanup.

## What appears to have happened
Observed sequence:
1. full payload update with non-empty `skills` successfully restored GitHub-derived metadata
2. later full payload update switching to the improved submission-cut `videoURL` preserved the new video
3. after that update, the GitHub-derived metadata fields returned to `null`

So the live system now exhibits a bad property:

> field persistence quality depends on the exact write path or recomputation behavior of the current update, not just on the payload content itself.

## Why this matters for the remaining hours
There are only a few prize-facing hours left.
So the question is no longer “can we keep tweaking until everything looks perfect?”
It is:

> which fields are safe to touch without risking collateral regression on already-visible proof?

Right now, the answer appears to be:
- not all of them
- and not reliably through repeated full-payload writes

## Main failure modes exposed
### 1) Hidden collateral damage from full updates
A write intended to improve `videoURL` may wipe out unrelated GitHub-derived metadata.

### 2) False confidence from mutation response
The mutation response can look healthy while later GET state is materially worse in another dimension.

### 3) Cleanup loop thrash
Repeated “final touch” updates can become negative expected value if each pass risks breaking a different visible proof field.

### 4) Judge-surface instability
If judges inspect at different moments, they may see a moving target where one field improves while another disappears.

## Strategic implication
The submission is already in a substantially stronger state than it was earlier tonight:
- published
- 4-track attached
- improved demo URL visible
- helpful resources include `agent.json`
- explicit project identity and deployed URL visible

So the threshold for more external updates should now be much higher.

A late write is only worth doing if:
- it has clearly positive judge-facing value
- and low collateral regression risk

## Safer decision rule from here
Treat current Synthesis mutation behavior as **fragile**.

Before any further project update:
1. identify the one field you want to improve
2. ask whether it is worth possibly regressing other visible proof fields
3. if not, stop updating and strengthen the repo-side artifacts instead

## Best remaining posture
Given the current state, the safer posture is:
- avoid more speculative full-payload mutation churn unless there is a very strong upside
- invest remaining effort in repo-visible artifacts (`agent_log.json`, maybe clearer proof notes) that do not destabilize the live project page

## Compact applied rule
> The Synthesis full-project update path is currently fragile enough that each new improvement must be weighed against metadata-regression risk; after the improved demo landed, additional writes should face a much higher bar.
