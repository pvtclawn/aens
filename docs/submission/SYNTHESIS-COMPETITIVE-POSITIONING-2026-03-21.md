# Synthesis competitive positioning — ÆNS (2026-03-21)

## Fast read
The ENS lane is real, but a lot of current projects cluster around the same general shapes:
- ENS as identity/profile
- ENS + agent registry wrappers
- ENS + communication/discovery tooling
- ENS-backed SDK convenience layers

ÆNS should **not** present itself as another "ENS identity" project.
Its strongest wedge is narrower and more load-bearing:

> **official capability discovery from a root ENS identity**

Given `pvtclawn.eth`, a client should be able to discover the official research endpoint, verify that it is parent-authorized, and then decide whether to use or probe it.

---

## What the field seems crowded with
From the current Synthesis submissions scan, the closest shapes are:
- **identity wrappers / SDKs** — resolve an ENS name, package metadata, simplify agent identity lookups
- **registry-style agent surfaces** — manage or inspect agent identity and associated metadata
- **broader platforms using ENS** — ENS is part of the stack, but not the core primitive

The risk for ÆNS is sounding like one of these:
- "verified ENS profile"
- "agent identity page"
- "ENS-based registry"
- "discovery platform for agents"

All of those make ÆNS sound broader, weaker, and more generic than it actually is.

---

## The under-served wedge
The under-served wedge is:

> a parent ENS identity can officially authorize child capability surfaces

That means the product is not mainly about:
- who the agent is
- all metadata about the agent
- every possible endpoint
- generic profile aggregation

It is mainly about one trust question:

> **If I start with the root ENS name, which capability endpoint is officially endorsed by that identity?**

That is the sharp pitch.

---

## The best judge-facing framing
### One-line positioning
**ÆNS lets software discover an agent’s official capability endpoints from its ENS root identity.**

### Short explanation
Most ENS agent projects stop at identity or metadata. ÆNS goes one step further: it treats the parent name as identity and a child subname as an official capability surface, then classifies whether that capability is actually parent-authorized.

### Memory hook
- `pvtclawn.eth` = who
- `research.pvtclawn.eth` = what
- `parent-authorized` = why it is official

This is the thing judges should remember.

---

## What to lead with
Lead with:
1. **consumer action** — input root ENS name, get official capability endpoint
2. **trust primitive** — child capability is parent-authorized, not just adjacent metadata
3. **machine usefulness** — software can consume this, not just humans reading a profile page

Say it like this:

> "ÆNS is an ENS-native official capability registry. Start with a root identity like `pvtclawn.eth`, discover `research.pvtclawn.eth`, verify that it is parent-authorized, and then use or test the official endpoint it declares."

---

## What not to lead with
Do **not** lead with:
- verified profile
- profile page
- agent page
- generic discovery
- generic registry
- offchain proof rails
- deployment receipts / public-surface checks as the main story

Those are either weaker than the real wedge or supporting rails rather than the core build.

---

## Recommended submission angle
### Headline
**Official capability discovery for agents on ENS**

### Problem framing
Today, agent identity stacks can usually tell you who an agent is or where some endpoint lives, but not whether a specific child capability is officially endorsed by that identity from the ENS hierarchy itself.

### Solution framing
ÆNS makes ENS hierarchy load-bearing:
- root name = identity
- child subname = capability
- `parent-authorized` = official relationship

### Why this is useful
This gives clients and other agents a cleaner answer to:
- where is the official research endpoint?
- is it actually endorsed by the root identity?
- should I treat this surface as official or just adjacent metadata?

---

## How to position the current build honestly
Current strongest honest story:
- there is a **consumer-first CLI** for research capability discovery
- there is a **deterministic positive-path demo** of the exact target loop
- there is a **live preferred public research page** on the deployed surface
- the first live ENS publication under `pvtclawn.eth` is still the next stateful publication step

That means the submission should sound like:
- **real build, real interface, real deployed surface**
- not yet the full final published namespace state

This is stronger than a concept and weaker than a fully completed live ENS publication. Phrase it that way.

---

## Track recommendation
Best fit:
1. **ENS Open Integration**
2. **ENS Identity**

Why:
- the differentiator is not generic identity branding alone
- it is an ENS-native integration pattern for official capability discovery
- identity matters, but mainly as the anchor for capability authority

`ENS Communication` is weaker unless the build starts emphasizing messaging/addressability rather than official capability discovery.

---

## Demo guidance
Best demo arc:
1. Start with the consumer question: "How do I find the official research endpoint for this agent from its ENS root?"
2. Run the consumer-first positive-path demo command.
3. Show the deployed public capability page.
4. Emphasize `parent-authorized` as the milestone.
5. Close on why this is useful to software, not just humans.

Avoid spending most of the demo on:
- generic profile inspection
- side rails
- deployment mechanics
- long caveat sections

---

## Copy rules
### Good phrases
- official capability discovery
- root ENS identity
- child capability subname
- parent-authorized
- official endpoint
- machine-readable capability surface

### Bad phrases
- verified profile
- profile page for agents
- ENS links page
- ENS registry for everything
- discovery platform

---

## Final positioning sentence
**ÆNS is the ENS-native primitive for discovering official child capabilities from a root agent identity.**
