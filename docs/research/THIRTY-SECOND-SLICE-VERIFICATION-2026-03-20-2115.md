# Thirty-second ÆNS slice verification — README front-door copy tightening (2026-03-20 21:15 UTC)

## Purpose
Verify the tiny README front-door copy slice against:
- `docs/research/PLAN-README-FRONT-DOOR-COPY-2026-03-20-2105.md`

The goals of this verification are:
1. confirm sentence 1 leads with human-facing value
2. confirm sentence 2 restores the differentiator immediately
3. confirm the proof boundary sits directly below the opener
4. confirm an early concrete example appears near the top
5. confirm no wider README rewrite slipped in

## Verification inputs
Files checked:
- `README.md`
- `docs/research/PLAN-README-FRONT-DOOR-COPY-2026-03-20-2105.md`

Checks run at verification time:
```bash
git status -sb
bunx tsc --noEmit
timeout --kill-after=2 40s bun test src/*.test.ts
grep -n "official machine-readable capabilities\|parent ENS name authorizes child capabilities\|Current proof status\|research.pvtclawn.eth" README.md
git show --stat --name-only --format=fuller HEAD
```

## Current repo health
At verification time:
- `git status -sb` clean after the build slice commit
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes

No code paths changed in this slice itself, but repo health remains clean.

## Plan acceptance target 1 — sentence 1 leads with human-facing value
**Pass.**

Observed in `README.md`:
- the first sentence now leads with:
  - `official machine-readable capabilities`
  - concrete endpoint categories like research, payment, chat, and API endpoints
- the sentence answers the useful human/software question:
  - which services actually belong to an ENS identity

### Verdict
The opener now leads with product value instead of abstract identity language.

## Plan acceptance target 2 — sentence 2 restores the differentiator immediately
**Pass.**

Observed in `README.md`:
- the second sentence now says explicitly that:
  - a **parent ENS name authorizes child capabilities**
- it uses `research.pvtclawn.eth` as the early concrete example

### Verdict
The opener no longer stops at generic `profile + links`; it restores the core differentiator immediately.

## Plan acceptance target 3 — proof boundary sits directly below the opener
**Pass.**

Observed in `README.md`:
- a short `Current proof status` block now appears immediately below the first two sentences
- it says:
  - what ÆNS currently proves (ENS-backed authorization of child capabilities)
  - what it does **not** yet prove (full end-to-end liveness of every child service)

### Verdict
The front door stays honest without poisoning the opening sentence.

## Plan acceptance target 4 — early concrete example appears near the top
**Pass.**

Observed in `README.md`:
- `pvtclawn.eth` / `research.pvtclawn.eth` appear near the top of the file
- the example reinforces child capability under parent identity rather than staying abstract

### Verdict
The opener now becomes easier to visualize quickly.

## Plan acceptance target 5 — no whole-README rewrite slipped in
**Pass.**

Observed from commit scope:
- the slice touched the README front-door section and a slice note only
- no broad README restructure or unrelated documentation churn slipped in

### Verdict
The slice stayed inside the frozen guardrails.

## One honest caveat
The improved opener makes ÆNS easier to understand, but it does not by itself solve the deeper product question of whether official machine-readable capability publishing becomes useful enough for real software consumption.

That is not a gap in the slice.
It is the honest boundary of copy work versus product traction.

## Does this close the current README front-door copy thread?
**Yes.**

Why:
- the plan was deliberately tiny
- the acceptance targets all landed
- the front door is now less generic and more honest
- the proof boundary is visible immediately
- no wider copy churn slipped in

The next meaningful work should not be more opening-line polishing unless direct user feedback exposes a concrete new misunderstanding.

## Core delta
None.
This verification does not change the parent/child authorization model.

## Rail delta
Moderate.
This verifies README/product-copy tightening only.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product framing verification, not protocol-center progress.

## Verdict
The README front-door copy tightening slice **passes**.

It satisfies the frozen plan.
And it closes the current README front-door copy thread cleanly.
