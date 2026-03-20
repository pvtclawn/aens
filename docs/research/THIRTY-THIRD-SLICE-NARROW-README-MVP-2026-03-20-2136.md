# Thirty-third ÆNS slice — narrow README to the actual MVP (2026-03-20 21:36 UTC)

## Purpose
Execute the consumer-first MVP narrowing plan from:
- `docs/research/PLAN-NARROW-CONSUMER-FIRST-MVP-2026-03-20-2136.md`

This slice only patches the top/front-door section of `README.md` so the public product story matches the newly frozen MVP cut.

## File changed
- `README.md`

## What changed
### 1) The opener is now narrowed to one capability type
The README no longer opens with the broad bucket of research/payment/chat/API capabilities.
It now centers the MVP on:
- the **research** capability
- discovering the official research endpoint for an ENS identity

### 2) The consumer loop is now explicit near the top
The README now states the MVP loop directly:
- input `pvtclawn.eth`
- discover `research.pvtclawn.eth`
- verify `parent-authorized`
- return/open the official research endpoint

So the front door now describes a real consumer action instead of a broad registry idea.

### 3) A tiny MVP schema is now explicit
The README front door now freezes the minimum machine-readable shape for the MVP:
- capability type = `research`
- child capability name
- service URL
- parent identity reference
- authorization status

That makes `machine-readable` more concrete than “some URL exists here.”

### 4) Authorization and liveness stay separate
The proof-status line now says:
- what is currently proven = ENS-backed authorization of the research capability under the parent identity
- what is **not** yet proven = full end-to-end liveness unless checked separately

That keeps the MVP from silently collapsing `official` into `working`.

## Verification
At slice time:
- repo health was already clean before the README patch:
  - `git status -sb` clean
  - `bunx tsc --noEmit` passes
  - `bun test src/*.test.ts` passes
- no code paths changed in this slice

## Acceptance mapping
Planned MVP-narrowing target | Result
- one capability type | ✅ (`research`)
- one downstream action | ✅ (return/open official research endpoint)
- one tiny schema | ✅
- clear authorization-vs-liveness boundary | ✅
- no wider README rewrite | ✅

## Core delta
None.
No change to the parent/child authorization model.

## Rail delta
Moderate.
This is product-definition/README tightening only.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product-definition work, not protocol-center progress.

## Result
The README front door now describes the actual MVP worth building instead of the broader capability-registry ambition.
