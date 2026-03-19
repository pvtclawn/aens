# Deployment alias is public truth for ÆNS service surfaces (2026-03-19 20:18 UTC)

## Purpose
Turn the current stale-Vercel-boundary lesson into a product/trust rule.

The question is not only operational:
- why is `/research-capability/` still 404?

It is also epistemic:
- what should ÆNS treat as the relevant public truth when source/build state and production-alias state disagree?

## Source lesson
From `books_and_papers/006_think_distributed_systems.pdf`:
- a system must be reasoned about as actual collaborating components plus the network plus the real sequence of state transitions
- a complete mental model includes the relevant state that actually shapes observable outcomes

Applied here:
- repo `main` state is one truth
- local `dist/` output is another truth
- **the production alias serving a specific artifact is a third truth**

For end users and verifiers, the third one is the public one that matters most.

## Decision
### For ÆNS public service surfaces, the production alias is the primary public truth.

That means a route should be treated as publicly ready only when the current public alias actually serves the expected artifact.

Not when:
- the repo contains the fix
- the local build emits the route
- the latest commit looks correct

Those facts matter, but they are not what users call.

## Why this matters for the first live proof
ÆNS is trying to make service identity and capability authority legible.
If the proof language implicitly privileges source/build state over alias state, the first live proof can overstate readiness while the actual service target still serves stale or wrong content.

That would weaken the exact thing ÆNS is supposed to clarify.

## Rule for proof wording
When describing a service target, distinguish explicitly between:

1. **source truth**
   - current git commit / repo state
2. **build truth**
   - current generated artifact
3. **public truth**
   - what the live alias currently serves

For readiness claims, public truth wins.

## Operational consequence
Current preferred-route wording should remain:
- local preferred child route build: fixed
- public preferred child route alias: not ready
- bootstrap fallback: publicly ready capability-scoped fallback

That is more honest than describing the preferred route as “basically fixed” or “done except deployment weirdness.”

## Minimal publication rule update
Before calling a preferred `aens.service` target ready, require all of:
1. expected commit/build exists locally
2. live alias fetch returns the expected route
3. live alias artifact matches the current deployment intent

If (1) holds but (2) does not, the route is **not** ready.

## Why this is a simplification
This rule keeps the model clean:
- engineers can care about repo/build state
- users and proof artifacts can care about alias state
- docs do not need to pretend those are the same thing

## Immediate implication for the current fork
The stale-Vercel situation is best described as a production-alias sync problem, not as unresolved uncertainty about local route generation.

So the next human step is still:
- verify Vercel project settings
- redeploy or promote the correct deployment
- rerun `bun run check-public-surface`

## Bottom line
For ÆNS, a service surface is public only to the extent that its public alias serves it.
The alias is not deployment trivia.
It is part of the trust surface.
