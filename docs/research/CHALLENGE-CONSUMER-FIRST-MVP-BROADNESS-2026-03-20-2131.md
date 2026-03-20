# Challenge — consumer-first ÆNS MVP broadness (2026-03-20 21:31 UTC)

## Purpose
Red-team the newly frozen consumer-first ÆNS MVP cut before it hardens into roadmap truth.

Current MVP cut:
1. input parent ENS name
2. discover official child capabilities
3. verify parent authorization
4. return the endpoint to use

This is directionally correct.
But it can still fail as an actual product MVP.

## Weakness 1 — discovery alone can still feel like a directory, not a product
If the flow ends at `here are the official endpoints`, the demo may still feel like a nicer lookup table.

Risk:
- the product shows discovery, but not enough action
- the result is still one step away from a compelling user job
- it can remain intellectually cleaner than it is practically useful

Mitigation:
- the MVP should include one immediate downstream action after discovery for the chosen capability type
- do not stop the demo at endpoint listing alone

## Weakness 2 — capability scope is still too broad
`research`, `payment`, `chat`, `API` are all different products hiding inside one noun `capability`.

Risk:
- the MVP remains too generic
- required metadata/UX stays fuzzy
- the product can drift back into abstract capability talk

Mitigation:
- choose one capability type for the real MVP
- treat the rest as future surface area, not current promise

## Weakness 3 — machine-readable is still underspecified without a tiny schema
The product thesis says software should consume the output.
That only becomes real if there is enough structure for software to rely on.

Risk:
- a single URL field is not much of a registry standard
- the MVP may still be a custom demo parser rather than a credible pattern

Mitigation:
- define the minimum schema needed for the chosen capability type
- keep it tiny but explicit
- make software consumption depend on that schema, not on vague conventions

## Weakness 4 — the real pain point may still be too diffuse
Even with a consumer-first cut, the project needs one sharp use case where official endpoint discovery obviously matters.

Risk:
- the demo is elegant but low-pressure
- judges/users still ask `why blockchain/ENS for this?`

Mitigation:
- pick the capability type with the strongest authenticity/discovery pain
- optimize the MVP for that one case first

## Weakness 5 — officialness and liveness still need a hard boundary
A consumer flow can still blur:
- official endpoint
- usable/live endpoint

Risk:
- the product unintentionally upgrades authorization into uptime/service guarantees
- the same trust-boundary confusion returns in a new place

Mitigation:
- the MVP should output authorization status separately from live/health status
- if liveness is not checked, say so explicitly

## Core delta
None.
This challenge does not change the parent/child authorization model.

## Rail delta
Moderate.
This is product/MVP challenge work after the thesis refinement.

## Counterfactual relevance test
Would this challenge still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product direction work, not protocol-center progress.

## Bottom line
The consumer-first cut is the right direction, but it may still be too broad to be a convincing MVP.

## Best next move
If this thread continues, freeze one tiny MVP-narrowing plan around:
1. one chosen capability type
2. one concrete downstream action
3. one minimal schema
4. one explicit authorization-vs-liveness boundary
