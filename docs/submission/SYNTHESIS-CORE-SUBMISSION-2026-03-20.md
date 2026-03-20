# Synthesis submission core — ÆNS (2026-03-20)

## One-line thesis
**ÆNS makes `<capability>.<agent>.eth` load-bearing.**

Instead of using one ENS name as a generic profile or endpoint, ÆNS treats the parent name as the **identity anchor** and a child subname as an **authorized capability surface**.

Example:
- `pvtclawn.eth` → who the agent is
- `research.pvtclawn.eth` → what capability the agent exposes

## The problem
Today, the pieces around agent identity already exist:
- ENS names and subnames
- generic service endpoints
- agent IDs and metadata
- discovery layers and registries

But there is still a missing trust primitive:

> there is no clean ENS-native way to express that a specific child capability is meaningfully authorized under a parent agent identity.

That means most current flows collapse into one of these weaker patterns:
- one root name trying to mean both identity and capability
- generic service discovery without authority semantics
- offchain endpoint claims that are hard to interpret from the ENS hierarchy itself

## The core idea
ÆNS introduces a simple authority model:

### Parent name = identity
The parent ENS name is the stable identity anchor.

### Child subname = capability
A child subname represents a concrete capability surface.

### Parent-authorized = main milestone
The main protocol milestone is not just “a record exists” or “an endpoint is reachable.”
It is that the child capability is recognized as **authorized under the parent identity**.

That gives the hierarchy meaning:
- `pvtclawn.eth` says **who**
- `research.pvtclawn.eth` says **what capability**
- `parent-authorized` says the capability is not just adjacent metadata, but intentionally attached to that identity

## What this submission demonstrates
This submission demonstrates one live ÆNS authority path built around:
- `pvtclawn.eth`
- `research.pvtclawn.eth`

The proof goal is narrow but real:
- the child capability is defined under the parent identity
- the capability surface can be inspected from the ENS structure and associated records
- the CLI/report path can classify the child as `parent-authorized`

That is the real wedge.

## Why this matters
Agent systems need more than:
- a wallet address
- a profile page
- a generic endpoint

They need a way to say:
- this is the parent identity
- this is one specific capability
- this capability is meaningfully attached to that identity

ÆNS makes ENS names more useful for agent systems by making the hierarchy itself carry capability trust semantics.

## The actual demo claim
The current live claim should be stated precisely:

> ÆNS proves one ENS-backed authority path where a child capability subname (`research.pvtclawn.eth`) is recognized under a parent identity (`pvtclawn.eth`) and rendered as `parent-authorized`.

That is stronger than a generic endpoint claim.
It is weaker than full runtime/payment/invocation proof.
And that is okay — because the point of this submission is to make the **authority model** real first.

## What the demo does not claim
To stay honest, this submission does **not** yet claim all of the following:
- full invocation proof
- full payment-flow proof
- runtime auth proof
- broad production-readiness proof for every service surface

Those are future layers.

The submission is about making the **capability-authority primitive** real.

## Why this is the differentiated wedge
The differentiated wedge is not:
- generic discovery
- generic deployment provenance
- generic public-state receipts

The differentiated wedge is:

> **ENS-native parent-authorized child capability authority**

That is the thing that should stay in the judge’s head after the demo.

## Judge-facing framing
If explaining this quickly, say:

> Most agent identity systems can tell you who an agent is, or where some endpoint lives. ÆNS makes ENS hierarchy do something more precise: the parent name anchors identity, the child subname expresses a capability, and the system can classify whether that capability is actually authorized under the parent. That turns `<capability>.<agent>.eth` into a real trust primitive instead of just naming sugar.

## 60-second demo script
1. Start with the parent identity:
   - show `pvtclawn.eth`
   - explain: this is the identity anchor

2. Move to the child capability:
   - show `research.pvtclawn.eth`
   - explain: this is not just another label; it is the research capability surface

3. Run the inspection flow:
   - inspect parent
   - inspect child
   - highlight the `parent-authorized` classification

4. Show the public surface:
   - explain that the capability points to a real public surface
   - keep the claim narrow: public surface + authority path, not full runtime closure

5. End on the thesis:
   - `pvtclawn.eth` = who
   - `research.pvtclawn.eth` = what
   - `parent-authorized` = why the relationship matters

## Suggested live commands
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
bun run check-public-surface
```

## Short submission summary
**ÆNS turns ENS subnames into agent capability primitives.**
The parent name anchors identity, the child subname represents a concrete capability, and the system can classify whether that capability is actually authorized under the parent. The demo shows that model live with `pvtclawn.eth` and `research.pvtclawn.eth`, making `<capability>.<agent>.eth` load-bearing instead of decorative.

## What to emphasize in judging
- the hierarchy means something
- the child capability is the center of the design
- `parent-authorized` is the real protocol milestone
- future rails (runtime auth, payments, transition receipts, richer proofs) are support layers, not the core thesis
