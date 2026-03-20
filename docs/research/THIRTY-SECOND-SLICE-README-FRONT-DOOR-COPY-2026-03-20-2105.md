# Thirty-second ÆNS slice — README front-door copy tightening (2026-03-20 21:05 UTC)

## Purpose
Execute the tiny README front-door copy plan from:
- `docs/research/PLAN-README-FRONT-DOOR-COPY-2026-03-20-2105.md`

This slice only patches the top/front-door section of `README.md`.
It does **not** change the model, CLI, or proof mechanics.

## File changed
- `README.md`

## What changed
### 1) Sentence 1 now leads with concrete human-facing value
The README now opens with:
- official machine-readable capabilities
- examples like research/payment/chat/API endpoints
- the question it answers for humans/software: which services actually belong to an ENS identity

This replaces the riskier generic `verified profile + links` vibe.

### 2) Sentence 2 now restores the real differentiator immediately
The second sentence now says the important part explicitly:
- a **parent ENS name authorizes child capabilities**
- `research.pvtclawn.eth` is used as the concrete early example

That keeps the front door understandable without erasing the actual core claim.

### 3) The proof boundary now sits directly below the opener
A short `Current proof status` block now appears immediately under the first two sentences.
It says:
- what ÆNS currently proves (ENS-backed authorization of child capabilities)
- what it does **not** yet prove (full end-to-end liveness of every child service)

So the copy stays honest without poisoning the opening line.

### 4) One early concrete example is now near the top
The README now gives an early concrete example using:
- `pvtclawn.eth`
- `research.pvtclawn.eth`

That keeps the front door from staying too abstract.

## Verification
At slice time:
- repo health was already clean before the copy patch:
  - `git status -sb` clean
  - `bunx tsc --noEmit` passes
  - `bun test src/*.test.ts` passes
- no code paths changed in this slice

## Acceptance mapping
Planned front-door target | Result
- sentence 1 = human-facing value | ✅
- sentence 2 = immediate differentiator | ✅
- proof boundary directly below | ✅
- early concrete example near opener | ✅
- no whole-README rewrite | ✅

## Core delta
None.
No change to the parent/child authorization model.

## Rail delta
Moderate.
This is README/product-copy tightening only.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product framing work, not protocol-center progress.

## Result
The README front door is now harder to misread as a generic verified-profile product and more honest about both the differentiator and the current proof boundary.
