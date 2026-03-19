# Supporting trust rails must not replace the ÆNS protocol core (2026-03-19 21:33 UTC)

## Purpose
Turn the now-confirmed capability-subname wedge and the recent transition-receipt anti-drift work into one simpler product rule.

The current question is:

> if transition receipts and other trust rails are useful, how should ÆNS keep them from becoming the main product story?

## Source lesson
From `books_and_papers/004_building_ethereum_products_and_protocols.pdf`:
- products, protocols, and platforms are different layers with different jobs
- crypto engineering is trust engineering, but good system design still depends on keeping layers legible instead of collapsing everything into one vague stack

Applied here, ÆNS should not confuse:
- the **protocol core**
with
- the **supporting trust/platform rails** around it

## Decision
### The ÆNS protocol core is the ENS-native capability-authority model.

That means the primary object remains:
- parent identity name
- child capability name
- authorization relationship between them

For the current project language, that means:
- `pvtclawn.eth` = identity anchor
- `research.pvtclawn.eth` = capability surface
- `parent-authorized` = main protocol milestone

## What counts as supporting trust rails
Supporting trust rails include:
- public-surface verification
- proof artifacts
- publication-state snapshots
- control-plane transition receipts
- operational evidence for how a capability surface changed in public truth

These are useful because real agent service surfaces are partly realized through offchain control planes.
But they remain **supporting rails**.
They do not define the core protocol object.

## Why this matters
The recent landscape check confirmed that the differentiated gap still looks like:
- **parent-authorized child capability authority**

That means ÆNS does **not** win by becoming:
- generic service discovery
- generic deployment provenance
- generic ops-audit infrastructure

It wins by making ENS names load-bearing for agent capability authority.

Supporting rails matter only insofar as they make that authority surface more legible, more trustworthy, or more usable.

## Product rule
When evaluating future ÆNS slices, keep this ordering explicit:

### 1) Protocol core first
Does the slice make the parent/child capability authority model clearer, stronger, or more load-bearing?

### 2) Supporting trust rails second
Does the slice help observe, verify, or preserve causal history for that already-defined capability surface?

If a slice mostly does (2) without strengthening (1), it should be treated as secondary.

## Practical acceptance rule
A future slice involving receipts, proofs, or public-state machinery is only high-priority if it satisfies at least one of:
- clarifies the meaning of the child capability under the parent
- strengthens the authority interpretation of the capability surface
- prevents a real trust misunderstanding that would otherwise blur the authority model

If it only adds richer operational history while leaving the authority model unchanged, it is supporting work, not the center.

## Current implication
This rule keeps the current repo direction honest:
- the Vercel/public-surface work is supporting trust-rail work
- proof-state capture is supporting trust-rail work
- transition receipts are supporting trust-rail work
- the core protocol story is still the same child-capability authority model

## Bottom line
ÆNS should absolutely keep building useful trust rails.
But those rails must remain in service of the protocol core:
- **ENS-authorized child capability surfaces under parent identity**

When the rails start looking like the main product, that is drift.
