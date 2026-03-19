# Control-plane transition evidence path (2026-03-19 20:53 UTC)

## Purpose
Sharpen one genuinely new trust/product question beyond the now-stable bootstrap boundary:

> when the preferred route is eventually fixed by a human-controlled deployment/dashboard action, what minimum evidence should ÆNS capture so that transition itself becomes auditable?

This is **not** more Vercel forensics.
It assumes the current truth is already stable:
- `preferred surface ready = no`
- `bootstrap proof ready = yes`

The question is about the *next* trust event:
- the moment a human control-plane action promotes the intended build into public truth

## Why this matters
The recent trust work already established:
- source/build truth are not enough
- the production alias is the primary public truth
- human deployment dashboards are part of the service-trust surface

But there is still one missing bridge:
- if public truth changes later because of a human-controlled deployment action, how do we show that transition without reducing it to “someone clicked redeploy and now it works”?

If ÆNS cares about verifiable build/proof surfaces, then the control-plane transition itself needs a minimal evidence path.

## Decision
### Treat the preferred-route repair as a distinct **control-plane transition proof event**.

It is not the same as:
- the ENS authority proof
- the bootstrap proof artifact
- the local build fix

It is its own event:
- a human-controlled control plane promoted a different artifact into public truth

So ÆNS should capture that event explicitly when it happens.

## Minimal evidence bundle
The smallest honest transition bundle should contain three layers.

### 1) Before-state snapshot
Capture the public truth immediately before the control-plane action.

Minimum fields:
- timestamp
- preferred public base URL
- preferred child route URL
- current `bun run check-public-surface` output
- response metadata for the preferred root and child route when practical:
  - `ETag`
  - `Last-Modified`
  - `x-vercel-cache`

Purpose:
- prove what the public alias was serving *before* the transition
- make alias drift over time legible

### 2) Control-plane action evidence
Capture the human-controlled action that is intended to change public truth.

Minimum fields:
- deployment URL and/or deployment ID if the platform exposes one
- environment/alias being promoted (production)
- timestamp of the action
- intended repo commit hash
- if available, the project-level settings that matter:
  - root directory
  - output directory
  - production branch

If the dashboard offers no exportable structured proof, accept one of these as fallback evidence:
- screenshot of the deployment/promote view
- operator note quoting the exact deployment URL/ID and time

Purpose:
- show the causal bridge between source/build truth and later public truth
- avoid a missing middle where the final public result appears from nowhere

### 3) After-state snapshot
Capture the new public truth immediately after the control-plane action settles.

Minimum fields:
- timestamp
- rerun `bun run check-public-surface`
- response metadata for the preferred root and child route when practical:
  - `ETag`
  - `Last-Modified`
  - `x-vercel-cache`
- preferred-route verdict after the change

Purpose:
- prove that the intended control-plane action actually changed what the alias serves
- distinguish a real promotion from a no-op or dashboard guess

## Minimum success condition for the transition event
A preferred-route control-plane transition counts as evidenced only if all of these are true:

1. **before-state** shows preferred route not ready
2. **action evidence** identifies the human-controlled deployment/promotion event
3. **after-state** shows a changed public truth consistent with the intended repair
4. the transition bundle records the repo commit hash tied to the intended artifact

Without all four, the repair may still be real, but the causal history is weak.

## What this does *not* mean
This does **not** mean ÆNS needs to solve deployment attestation perfectly in v0.1.

The goal is smaller:
- do not let a meaningful public-truth transition occur without any explicit proof surface at all

That is enough to make the trust story materially better.

## Product implication
ÆNS now has a sharper trust model for service surfaces:

1. **machine-verifiable authority**
   - ENS root/child relationship, parent authorization, proof artifact structure
2. **observed public state**
   - what the alias serves at capture time
3. **human-controlled transition evidence**
   - what changed the alias from one public state to another

That third layer is important because service trust is not only about static truth.
It is also about **causal transitions** between public states.

## Why this is a good next abstraction
This idea sharpens the product without reopening the current deployment boundary.
It says:
- bootstrap mode is honest now
- preferred-route closure can still happen later
- when it does, the transition itself should leave a compact evidence trail

That keeps ÆNS focused on legible trust surfaces rather than pretending every important state transition is already onchain or machine-closed.

## Minimal future implementation idea
Do **not** build this now unless it becomes the next smallest slice.
But the natural future shape would be a tiny helper or template that collects:
- repo commit
- check-public-surface before
- deployment/promote reference
- check-public-surface after
- one markdown transition receipt

That would be enough to turn a dashboard-side fix into a real proof artifact instead of a memory.

## Bottom line
The next time the preferred route becomes live, ÆNS should not just say “it works now.”
It should capture a compact control-plane transition receipt showing:
- what public truth was before
- what human action was taken
- what public truth became after
