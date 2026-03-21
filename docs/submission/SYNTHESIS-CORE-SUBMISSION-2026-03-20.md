# Synthesis submission core — ÆNS

## One-line thesis
**ÆNS lets software discover an agent’s official capability endpoints from its ENS root identity.**

Instead of using one ENS name as a generic profile or endpoint, ÆNS treats the parent name as the identity anchor and a child subname as an official capability surface.

Example:
- `pvtclawn.eth` → who the agent is
- `research.pvtclawn.eth` → what capability it exposes
- `parent-authorized` → why that capability should be treated as official

## The problem
Agent identity systems can often tell you one of two things:
- who an agent is
- where some endpoint lives

But they often do **not** give a clean answer to the more useful trust question:

> is this specific capability endpoint actually endorsed by that ENS identity?

Without that, discovery tends to collapse into weaker patterns:
- one root name trying to mean both identity and every capability
- generic endpoint discovery without authority semantics
- offchain metadata that is adjacent to identity rather than clearly authorized by it

## The core idea
ÆNS makes ENS hierarchy load-bearing for agents.

### Parent name = identity
The parent ENS name is the stable identity anchor.

### Child subname = capability
A child subname represents one concrete capability surface.

### `parent-authorized` = official relationship
The milestone is not just that a subname exists or a URL is reachable.
The milestone is that the child capability is recognized as **parent-authorized** under the parent identity.

That gives the hierarchy real meaning:
- `pvtclawn.eth` says **who**
- `research.pvtclawn.eth` says **what**
- `parent-authorized` says the capability is intentionally attached to that identity

## What the current build demonstrates
The current build demonstrates a working **consumer-first** capability discovery flow.

Given a root ENS identity, ÆNS can:
1. derive the expected research capability subname
2. inspect the parent/child relationship
3. classify whether the child is officially parent-authorized
4. return the official endpoint if one is declared

The current build includes:
- a consumer-first CLI for research capability discovery
- a deterministic positive-path demo of the exact target flow
- a public web discovery route on the preferred surface
- a trust-oriented ENS inspector for live and example namespaces
- a live deployed public research capability page on the preferred surface

## The actual demo claim
The honest current claim is:

> ÆNS demonstrates the official capability discovery primitive: starting from a root ENS identity, the system can discover a research capability, classify whether it is parent-authorized, and return the official endpoint it declares.

That is stronger than a generic profile or endpoint lookup.
It is weaker than full runtime/payment/invocation proof.
And it is also weaker than claiming that the `pvtclawn.eth` namespace is already fully published live end-to-end under ENS today.

That is okay.
The point of this submission is to make the **capability-authority primitive** real and useful.

## Why this matters
Agent systems need more than:
- a wallet address
- a profile page
- a generic endpoint directory

They need a way to say:
- this is the root identity
- this is one specific capability
- this capability is officially endorsed by that identity

ÆNS makes that question legible from the naming hierarchy itself.

## Why this is the differentiated wedge
The differentiated wedge is **not**:
- generic discovery
- generic profile aggregation
- generic deployment provenance
- generic receipts or public-state logging

The differentiated wedge is:

> **official capability discovery from the ENS hierarchy**

Or more concretely:

> **ENS-native parent-authorized child capability authority**

That is the thing judges should remember.

## What the demo does not overclaim
To stay honest, this submission does **not** yet claim:
- full invocation proof
- payment flow proof
- runtime auth proof
- universal production readiness for every capability surface
- that `pvtclawn.eth` is already fully published live as a parent-authorized research capability on ENS today

## Judge-facing framing
If explaining this quickly, say:

> "Most agent identity systems can tell you who an agent is, or where some endpoint lives. ÆNS does something more precise: it lets software start from a root ENS identity, discover a child capability, and verify whether that capability is actually official under the parent. That turns `<capability>.<agent>.eth` into a useful trust primitive instead of just naming sugar."

## Demo commands
### Exact consumer-first positive-path demo
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run discover-research -- --example parent-authorized-capability
```

### Public-surface check
```bash
bun run check-public-surface
```

### Optional live namespace honesty check
```bash
bun run discover-research -- pvtclawn.eth
```

## Short submission summary
**ÆNS is the ENS-native primitive for official capability discovery.**
The parent ENS name anchors identity, the child subname expresses a concrete capability, and the system can classify whether that capability is actually parent-authorized under the parent. In the current build, the consumer-first flow is already demoable, the preferred public research surface is live, and the next stateful publication step is finishing the live ENS namespace under `pvtclawn.eth`.

## What to emphasize in judging
- the build answers a real consumer question: "what is the official research endpoint for this ENS identity?"
- the hierarchy means something
- the child capability is the center of the design
- `parent-authorized` is the protocol milestone
- the public surface is live, while the live ENS publication step is kept explicit rather than hand-waved
icit rather than hand-waved
