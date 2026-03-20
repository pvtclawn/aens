# Plan — narrow the consumer-first ÆNS MVP (2026-03-20 21:36 UTC)

## Purpose
Turn the consumer-first MVP broadness critique into one small, mergeable product cut.

Relevant prior notes:
- `docs/research/STRONG-VS-WEAK-AENS-PRODUCT-THESIS-2026-03-20-2110.md`
- `docs/research/CONSUMER-FIRST-AENS-MVP-CUT-2026-03-20-2126.md`
- `docs/research/CHALLENGE-CONSUMER-FIRST-MVP-BROADNESS-2026-03-20-2131.md`

## Current truth
At planning time:
- the strong thesis is now clear: official machine-readable capabilities/endpoints under one ENS identity
- the consumer-first MVP cut is also clear: input ENS name -> output official endpoint(s)
- the remaining weakness is breadth

Right now `research`, `payment`, `chat`, and `API` are all still hiding inside the single word `capability`.
That is too broad for a convincing MVP.

## Core narrowing decision
### MVP v1 should choose **one capability type** and one concrete downstream action.

For the current project state, the smallest honest choice is:
- **capability type:** `research`
- **downstream action:** discover the official research endpoint for an ENS identity and open/use that endpoint

Why this cut:
- `research.pvtclawn.eth` is already the current live child capability path
- the existing proof/runbook/public-surface work already clusters around it
- this keeps the MVP real and demoable instead of jumping to a hypothetical API/payment product all at once

## MVP v1 user story
> Given `pvtclawn.eth`, tell me the official research capability for that identity, verify whether it is parent-authorized, and give me the endpoint to use.

## Task 1 — freeze the single capability type
### Goal
Prevent the MVP from staying an abstract multi-capability bucket.

### Acceptance criteria
- the MVP note explicitly says v1 is about the **research** capability only
- other capability types (`payment`, `chat`, `API`) are treated as future expansion, not current promise
- the README/submission/product language for the MVP should not imply all capability types are equally real today

## Task 2 — freeze the concrete downstream action
### Goal
Prevent the MVP from collapsing into a directory demo.

### Acceptance criteria
- the MVP loop ends in a real action: use/open the official research endpoint
- the demo is not just `here is a list of names`
- the consumer story is expressible as:
  1. input `pvtclawn.eth`
  2. discover `research.pvtclawn.eth`
  3. verify `parent-authorized` status
  4. open/use the official research endpoint

## Task 3 — freeze the minimum schema for this capability
### Goal
Make `machine-readable` concrete enough for software consumption.

### Acceptance criteria
- the research capability MVP defines at least:
  - capability type = `research`
  - child capability name
  - service URL / endpoint
  - parent identity reference
  - authorization status
- the schema stays tiny and specific to the MVP cut
- the product does not depend on vague `some URL exists here` logic alone

## Task 4 — freeze the authorization vs liveness boundary
### Goal
Keep the MVP from accidentally implying more than it proves.

### Acceptance criteria
- MVP output keeps these separate:
  - official / parent-authorized status
  - endpoint value
  - live/publicly reachable status (if checked)
- if liveness is not checked, the product should say so clearly
- the MVP does not collapse `official` into `working`

## Chosen order
1. choose one capability type (`research`)
2. choose one downstream action (open/use official research endpoint)
3. define a tiny schema for that capability
4. keep authorization and liveness clearly separate

## Next Task
# Patch product-facing docs/notes so the MVP is explicitly narrowed to the `research` capability, with one real consumer loop: input parent ENS name -> verify official research capability -> return the endpoint to use.

## Why this next
This is the smallest product-definition fix that turns the strong thesis into something demoable instead of keeping `capability` as a broad, fuzzy bucket.

## Core delta
None.
This plan does not change the parent/child authorization model.

## Rail delta
Moderate.
This is product-definition planning after the consumer-first MVP cut.

## Counterfactual relevance test
Would this plan still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product/MVP planning, not protocol-center progress.
