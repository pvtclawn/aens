# Thirty-ninth ÆNS slice — two-doc demo reorder for submission truth (2026-03-21 02:03 UTC)

## Purpose
Fix the last active route-first inconsistency in the submission stack without reopening the rest of the docs.

Goal:
- stop sending judges to the undeployed `/discover-research/` route first,
- preserve artifact-first truth,
- restore product feeling earlier for human judges,
- and keep the patch limited to the already-frozen two-doc boundary.

## Files changed
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`

## What changed
### 1) Reordered the form-pack demo flow
The form pack no longer starts with the public discovery route.

New order:
1. wrapped example artifact
2. live research-capability page
3. wrapped live artifact
4. CLI reproducibility/public-surface checks
5. `/discover-research/` as intended deployed surface while production catches up

This keeps the strongest current truth surface first and stops sending judges to a `404` before they understand the product.

### 2) Reordered the 2-minute demo script
The demo script no longer opens with `/discover-research/`.

New flow:
- start with the wrapped example artifact as the clearest proof of target discovery flow
- move quickly to the live research-capability page as the first public visual anchor
- use the wrapped live artifact to show current namespace truth honestly
- use CLI as reproducibility backup
- close by framing `/discover-research/` as the intended deployed surface rather than the current entrypoint

### 3) Kept wording non-apologetic
The patch avoids framing the route as broken/failed/fallback.
Instead it upgrades the strongest verified surface and treats the route as a production state that is still catching up.

## Verification
Ran:
- `git status -sb`
- `/home/clawn/.bun/bin/bunx tsc --noEmit`
- `timeout --kill-after=2 25s /home/clawn/.bun/bin/bun test src/*.test.ts`

Observed:
- repo clean before patch
- typecheck passes
- tests pass (`61 pass`)
- the two targeted docs no longer instruct judges to start with `/discover-research/`

## Acceptance mapping
Target | Result
- form pack no longer starts with `/discover-research/` | ✅
- demo script no longer opens with `/discover-research/` | ✅
- order now favors example artifact -> live research page -> live artifact -> CLI -> intended route | ✅
- wording stays non-apologetic | ✅
- no overclaim that `/discover-research/` is live | ✅
- scope remains limited to the two frozen docs | ✅

## Core delta
Light.
This is a demo-ordering patch, not a product or implementation change.

## Rail delta
Useful.
The submission flow is now more coherent for both human and agent judges while staying honest about deployment truth.

## Counterfactual relevance test
Would this slice still mostly make sense without the wrapped artifact work?

No.
Its whole job is to make the strongest current truth surface the first thing judges actually see.

## Result
Judges are no longer told to start at the wrong place.
