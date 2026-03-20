# Thirty-third ÆNS slice verification — narrow README to the actual MVP (2026-03-20 21:46 UTC)

## Purpose
Verify the README MVP-narrowing slice against:
- `docs/research/PLAN-NARROW-CONSUMER-FIRST-MVP-2026-03-20-2136.md`

The goals of this verification are:
1. confirm the opener is explicitly narrowed to the `research` capability
2. confirm the consumer loop is concrete
3. confirm the tiny schema is visible near the top
4. confirm the authorization-vs-liveness boundary remains clear
5. confirm no wider README rewrite slipped in

## Verification inputs
Files checked:
- `README.md`
- `docs/research/PLAN-NARROW-CONSUMER-FIRST-MVP-2026-03-20-2136.md`

Checks run at verification time:
```bash
git status -sb
bunx tsc --noEmit
timeout --kill-after=2 40s bun test src/*.test.ts
grep -n "official research endpoint\|MVP v1 loop\|MVP v1 schema\|parent-authorized\|fully live end-to-end" README.md
git show --stat --name-only --format=fuller HEAD
```

## Current repo health
At verification time:
- `git status -sb` clean after the build slice commit
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes

No code paths changed in this slice itself, but repo health remains clean.

## Plan acceptance target 1 — opener is explicitly narrowed to the `research` capability
**Pass.**

Observed in `README.md`:
- the opener now says ÆNS helps discover the **official research endpoint** for an ENS identity
- it no longer leads with the broader research/payment/chat/API bundle as the MVP

### Verdict
The public product story now points at one concrete capability type instead of a broad bucket.

## Plan acceptance target 2 — the consumer loop is concrete
**Pass.**

Observed in `README.md`:
- the front door now includes an explicit `MVP v1 loop:`
  - input `pvtclawn.eth`
  - discover `research.pvtclawn.eth`
  - verify `parent-authorized`
  - return/open the official research endpoint

### Verdict
The README now describes a real consumer action rather than a vague registry concept.

## Plan acceptance target 3 — the tiny schema is visible near the top
**Pass.**

Observed in `README.md`:
- the front door now includes `MVP v1 schema:` with:
  - capability type = `research`
  - child capability name
  - service URL
  - parent identity reference
  - authorization status

### Verdict
`Machine-readable` is now concretized near the front door instead of remaining abstract.

## Plan acceptance target 4 — authorization-vs-liveness boundary remains clear
**Pass.**

Observed in `README.md`:
- the `Current proof status` block says what is currently proven
- it also says the project does **not** yet prove the endpoint is fully live end-to-end unless liveness is checked separately

### Verdict
The narrowed MVP still keeps `official` distinct from `working`.

## Plan acceptance target 5 — no wider README rewrite slipped in
**Pass.**

Observed from commit scope:
- the slice touched the README front-door section and the slice note only
- no broad README restructure or unrelated content churn slipped in

### Verdict
The slice stayed inside the frozen guardrails.

## One honest caveat
This README narrowing makes the MVP more honest and more demoable, but it does not by itself prove that the chosen `research` capability is the best long-term wedge.

That is not a gap in the slice.
It is simply the boundary between tightening the product story and validating the product strategy in real use.

## Does this close the current README MVP-narrowing thread?
**Yes.**

Why:
- the plan was deliberately tiny
- the acceptance targets all landed
- the public story is now more concrete and less broad
- the proof boundary remained intact
- no wider scope creep slipped in

The next meaningful work should not be more opening-copy narrowing unless fresh user feedback exposes a new concrete misunderstanding.

## Core delta
None.
This verification does not change the parent/child authorization model.

## Rail delta
Moderate.
This verifies README/product-definition tightening only.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product-definition verification, not protocol-center progress.

## Verdict
The narrow-README-MVP slice **passes**.

It satisfies the frozen plan.
And it closes the current README MVP-narrowing thread cleanly.
