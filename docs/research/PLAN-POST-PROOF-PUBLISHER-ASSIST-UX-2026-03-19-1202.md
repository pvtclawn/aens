# Plan — post-proof publisher-assist UX for ÆNS (2026-03-19 12:02 UTC)

## Purpose
Freeze the product response to the valid critique:

> if publishing ÆNS still feels like raw ENS admin work, what is the point?

Do this without derailing the immediate live/public-proof path.

## Decision
### Immediate path stays the same
The next live publication should still use the current runbook:
- resolver modernization on `pvtclawn.eth`
- root records
- child creation + records
- parent capability authorization last

The goal is still to land the first live public proof artifact.

### First serious post-proof product slice
After the first live proof succeeds, the next meaningful product-facing slice should be:
# **publisher-assist UX**

Not more report polish.
Not another trust note.
Not a second proof helper.

## Why this is the right response
The criticism is correct if the manual ENS browser flow remains the whole publishing experience.

But it does **not** invalidate the ÆNS thesis.
It means the current browser/wallet flow should be treated as:
- bootstrap under custody
- not the intended steady-state publisher UX

So the product response is:
- keep the first live publish narrow and secure
- then reduce ceremony around the second publish

## Desired UX principle
# **machine-prepared, human-approved**

Meaning:
- ÆNS prepares the exact payloads, names, URLs, and record values
- the human still approves privileged onchain writes
- manual wallet approval remains the security boundary
- ad hoc ENS clicking should shrink as much as possible

## Smallest useful publisher-assist slice
### Candidate shape
1. one command to generate the exact publish payload for:
   - root records
   - child records
   - parent capability list
2. one concise operator output that includes:
   - exact values to set
   - exact order to set them
   - exact verification commands to run after each step
3. integrate proof capture into the same flow
4. keep final wallet approval outside the tool

## Acceptance criteria
1. A human can prepare a publication session from one command/output instead of consulting multiple notes.
2. The tool prints the frozen values for:
   - `pvtclawn.eth`
   - `research.pvtclawn.eth`
   - resolver target
   - `aens.*` keys
3. The tool prints the verification commands and proof-capture steps.
4. The tool models the publish flow as explicit states/transitions, so the next step is shown only after the previous step is machine-verified.
5. The tool exposes an explicit terminal outcome of either `proof-captured` or `aborted`; partial execution is not presented as success.
6. The tool does **not** attempt to silently sign or bypass wallet approval.
7. The second publication attempt should feel materially easier than the first.

## What this slice should not be
- not a full automated publisher with hidden signing
- not a replacement for wallet consent
- not another inspector-only improvement
- not another Pages/proof-surface tangent unless directly needed

## Relationship to the current live proof path
This plan does **not** replace the immediate next step.

Immediate next step remains:
- resolve the Pages settings boundary if needed
- run the first live publication with the current checklist/runbook

This plan only freezes what comes **right after** the first live proof.

## Next task after first live proof
# **Build the smallest publisher-assist UX that turns the current runbook into one prepared publication flow with human approval still required.**

## Bottom line
The right answer to the publisher-UX criticism is not to abandon ÆNS.
It is to prove the model once under secure manual custody, then make future publication feel prepared and intentional instead of improvised and annoying.
lan does **not** replace the immediate next step.

Immediate next step remains:
- resolve the Pages settings boundary if needed
- run the first live publication with the current checklist/runbook

This plan only freezes what comes **right after** the first live proof.

## Next task after first live proof
# **Build the smallest publisher-assist UX that turns the current runbook into one prepared publication flow with human approval still required.**

## Bottom line
The right answer to the publisher-UX criticism is not to abandon ÆNS.
It is to prove the model once under secure manual custody, then make future publication feel prepared and intentional instead of improvised and annoying.
