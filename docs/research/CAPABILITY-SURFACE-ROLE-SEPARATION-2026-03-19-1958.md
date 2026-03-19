# Capability-surface role separation for the first live ÆNS proof (2026-03-19 19:58 UTC)

## Purpose
Use a small applied design lesson to settle the current publication question:

> If the Vercel root landing is publicly live but `/research-capability/` still 404s, should `research.pvtclawn.eth` temporarily point to the root landing anyway?

## Source of the lesson
- `books_and_papers/006_think_distributed_systems.pdf`

The relevant systems-design lesson is not protocol-specific:
- good reasoning depends on keeping component boundaries honest
- a clean model should not flatten two different roles into one component just because that is operationally convenient

## Applied to ÆNS
ÆNS already wants a sharp distinction between:
- **root identity anchor** → who this agent/project is
- **capability surface** → what exact child capability is being authorized/called

Those are different trust objects.
They may live under the same project and the same parent name, but they should not silently collapse into the same public target unless the product explicitly intends them to be the same thing.

For the current live-proof slice, the intended meaning is clear:
- root landing = project / identity surface
- `research.pvtclawn.eth` = child capability surface

So if the root landing is reachable while the research-capability route is not, that is a **real boundary mismatch**, not a cosmetic hosting detail.

## Decision
### Do not use the root landing as a temporary `aens.service` target for `research.pvtclawn.eth`.

That would blur:
- identity anchor
- capability authority
- callable service surface

and weaken the first live proof exactly where ÆNS is supposed to be more legible than a generic profile site.

## Acceptable targets for the first live proof
For `research.pvtclawn.eth`, the service target should be only one of:

1. **Preferred:**
   a reachable capability-specific page/route that is visibly about the research capability

2. **Fallback:**
   an explicit capability-scoped bootstrap document/page that is clearly labeled as temporary

## Not acceptable
- generic root landing page used as a stand-in for the capability page only because it currently returns `200`

## Why this is the better simplification
This keeps the product model legible:
- `pvtclawn.eth` answers **who**
- `research.pvtclawn.eth` answers **what callable surface**

That means the first live proof continues to demonstrate real role separation instead of an accidental flattening caused by deployment lag.

## Immediate operational consequence
If the Vercel route remains 404 after redeploy/settle checks, the next honest move is:
- use a capability-scoped fallback surface,
- not the root landing.

## Acceptance criteria for the service target
Before using a public URL as `aens.service` for `research.pvtclawn.eth`, it should satisfy all of:

1. returns `200`
2. contains clear research-capability language, not just generic project identity copy
3. is visibly under project control
4. does not depend on readers inferring that a generic root landing “also means” the child capability

## Bottom line
A live root page is useful, but it is not enough.
For the first live ÆNS authority proof, the child capability should still point to a child-capability surface.
