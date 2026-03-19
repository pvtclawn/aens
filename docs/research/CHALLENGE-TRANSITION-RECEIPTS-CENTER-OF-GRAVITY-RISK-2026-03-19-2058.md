# Challenge — transition receipts center-of-gravity risk (2026-03-19 20:58 UTC)

## Purpose
Red-team the newest generalization:

> control-plane transition receipts are a general trust primitive for agent service surfaces

The question is not whether transition receipts are useful.
It is whether generalizing them risks diluting ÆNS into a generic ops-audit framework and pulling attention away from the real thesis.

## Verdict
### Yes — unless receipts stay explicitly subordinate to the capability-authority model.

Transition receipts are useful only as a supporting trust layer.
If they become the headline, the product center of gravity shifts away from what actually makes ÆNS interesting:
- parent identity anchor
- child capability surface
- explicit capability authority
- ENS as the load-bearing coordination layer

That drift would make the project feel more like:
- deployment provenance tooling
- service-state audit receipts
- generic control-plane history tracking

Those can be valuable things.
But they are not the core ÆNS thesis.

## Core inversion risk
The dangerous inversion looks like this:

### Correct order
1. what is the parent identity?
2. what is the child capability?
3. is that capability authorized?
4. what public surface currently realizes it?
5. what changed that public realization over time?

### Diluted order
1. what changed in the public service surface?
2. what deployment/promotion event caused it?
3. what was the before/after snapshot?
4. somewhere lower down: which capability this was actually about

If the second ordering takes over, ÆNS stops feeling ENS-native and starts feeling like generic service-audit infrastructure.

## Why this matters
The main protocol fact is still:
- `research.pvtclawn.eth` is a child capability under `pvtclawn.eth`
- the meaningful trust question is whether the child is actually authorized / coherent under the parent

Transition receipts matter only because a human/offchain control plane can change how that capability surface is publicly realized.

So transition receipts should explain *changes to a capability surface*.
They should not replace capability authority as the main story.

## Specific dilution risks

### 1) Authority becomes background metadata
If transition receipts dominate the narrative, `parent-authorized` status starts to feel like setup context rather than the main proof objective.

### 2) Everything operational starts to look in-scope
Once the product gets excited about transition history, there is a temptation to capture every deployment-like event, even when it is only loosely connected to capability identity or authority.

That pulls ÆNS toward generic ops logging.

### 3) The user-facing story gets blurrier
A clean ÆNS story is legible:
- parent identity
- child capability
- authorization relationship
- current public surface

A receipt-heavy story can degrade into:
- timestamps
- cache headers
- before/after snapshots
- deployment IDs
- promotion notes

All useful, but too center-stage, and too far from the core protocol novelty.

### 4) The product can start optimizing the wrong metric
The wrong success metric becomes:
- “did we capture the service transition well?”

The right success metric remains:
- “did we make the capability relationship and service trust surface more legible and load-bearing through ENS?”

## Guardrail rule
Transition receipts are good only if the following remain true:

1. **Primary object remains the capability surface**
   - e.g. `research.pvtclawn.eth`, not an abstract deployment history stream

2. **Primary success condition remains capability authority**
   - `parent-authorized` still matters more than “receipt exists”

3. **Receipts are only attached to meaningful public-surface changes**
   - not every operational event

4. **Public docs keep receipts in third position**
   - authority first
   - public state second
   - transition evidence third

5. **The product never describes itself primarily as deployment-audit tooling**

## Preferred framing
Good framing:
> Transition receipts preserve causal history for an already-defined capability surface when a control plane changes its public realization.

Bad framing:
> ÆNS proves deployments and public-state transitions for agent services.

The second framing is how the center drifts.

## Practical rule for future docs/product language
Whenever transition receipts are mentioned, they should be introduced only after the document has already established:
- who the parent identity is
- what the child capability is
- whether the child is authorized under the parent

That ordering preserves the real center of gravity.

## Bottom line
Transition receipts strengthen ÆNS only if they remain a supporting causal-history layer for an already-defined, ENS-authorized capability surface.

If they become the main thing, the project risks drifting from:
- ENS-native capability trust

toward:
- generic service/audit infrastructure.

## Best next move
The next planning step should freeze one explicit non-drift rule:
- transition receipts are **supporting artifacts for capability surfaces**, not the protocol center.

That keeps the generalization useful without letting it swallow the thesis.
