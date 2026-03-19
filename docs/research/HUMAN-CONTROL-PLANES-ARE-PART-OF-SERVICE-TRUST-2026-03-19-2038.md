# Human-controlled control planes are part of ÆNS service trust (2026-03-19 20:38 UTC)

## Purpose
Turn the new dashboard-only Vercel boundary into a product/trust rule.

The immediate question is not only:
- why is the preferred Vercel child route still not publicly ready?

It is also:
- how should ÆNS describe trust when a human-controlled deployment dashboard can still change what the public alias serves?

## Source lesson
From `books_and_papers/006_think_distributed_systems.pdf`:
- a system should be reasoned about as the real components plus the network plus the actual state transitions that shape observable behavior
- relevant state does not stop at source code; it includes whatever can change the system behavior users actually experience

Applied here, the deployment dashboard/project config is a **control-plane component**.
It is not outside the service system in any useful trust sense.

## Decision
### For ÆNS public service surfaces, human-controlled deployment control planes are part of the service-trust surface when they can change what the public alias serves.

That means the trust story for a public `aens.service` target should distinguish at least four layers:

1. **source truth**
   - repo commit / intended code state
2. **build truth**
   - generated artifact state
3. **control-plane truth**
   - deployment/project settings or promotion state that decide which artifact goes live
4. **public truth**
   - what the alias actually serves right now

## Why this matters
Without the control-plane layer, proof language can still become misleading even after the alias-truth rule:
- it can say the code is fixed
- it can say the alias is stale
- but it can still flatten away the component that is currently deciding the mismatch

That produces vague phrases like:
- “deployment weirdness”
- “Vercel lag”

Those phrases are less honest than naming the actual boundary:
- a human-controlled deployment control plane has not yet promoted the intended build into public truth

## Rule for proof wording
When a public service surface depends on a human-controlled dashboard or project config, docs/proof language should not describe that control plane as incidental infra noise.

Instead, it should say clearly whether:
- source/build are ready
- control-plane state is unresolved
- public alias is ready or not

## Current application to the preferred ÆNS route
The honest current description is:
- preferred route source/build: fixed locally
- deployment control plane: unresolved dashboard-side state
- preferred public alias: not ready
- bootstrap fallback: still the only publicly ready capability-scoped surface

That is better than calling the situation “basically fixed except deployment weirdness.”

## Why this is useful for ÆNS
ÆNS is trying to make service trust surfaces legible.
If a human-controlled control plane materially affects what the public alias resolves to, then hiding that layer would make the trust surface less legible, not more.

So this rule actually strengthens the product:
- it keeps the proof boundary honest
- it admits the real remaining dependency
- it avoids pretending everything is already machine-closed when it is not

## Practical consequence
For the first live proof, keep the publication state stable until the control-plane issue is resolved:
- `preferred surface ready = no`
- `bootstrap proof ready = yes`

And if a later human dashboard action fixes the preferred route, that should be described as a control-plane transition that promoted the intended artifact into public truth.

## Bottom line
A service surface is not just code plus an alias.
If a human-controlled deployment dashboard can still change what that alias serves, the control plane is part of the service-trust surface too.
