# Plan — transition receipts non-drift rule (2026-03-19 21:01 UTC)

## Purpose
Freeze one narrow guardrail so the recent transition-receipt generalization does not pull ÆNS away from its actual center of gravity.

The useful idea is real:
- when a human/offchain control plane changes public truth, that transition deserves a compact receipt

But the latest challenge exposed the main risk:
- if transition receipts become the headline, ÆNS can drift from an **ENS-native capability-authority model** into generic service/audit infrastructure

This plan locks the ordering back in.

## Decision
### Transition receipts are **supporting artifacts for capability surfaces**, not the protocol center.

For ÆNS, the primary object must remain:
- a **child capability** under a **parent identity**

Transition receipts are only legitimate when they help explain how the public realization of that already-defined capability surface changed.

## Non-drift rule
Every future mention or implementation of transition receipts must satisfy all of these.

### 1) Capability surface comes first
A doc/flow/artifact may mention transition receipts only after it has already established:
- who the parent identity is
- what the child capability is
- whether the child is authorized under the parent

If that ordering is missing, the framing is already drifting.

### 2) Primary success condition stays authority-first
The main success condition for ÆNS remains capability authority, not receipt existence.

That means the key question is still:
- is `research.pvtclawn.eth` a coherent child capability under `pvtclawn.eth` and does it resolve as `parent-authorized`?

not:
- did we record a nice deployment transition?

### 3) Transition receipts attach only to meaningful public-surface changes
Receipts are in-scope only when a control-plane action materially changes the public realization of a capability surface.

Good examples:
- bootstrap fallback → preferred child route becomes live
- resolver/gateway switch changes what the named capability surface actually serves

Bad examples:
- generic build churn with no meaningful public-surface change
- internal operational events that do not materially affect the named capability surface

### 4) Trust stack ordering must remain explicit
Future docs/product language must keep this order:
1. **machine-verifiable authority**
2. **observed public state**
3. **transition evidence**

The third layer can support the first two.
It cannot replace or outrank them.

### 5) Product framing must stay ENS-native
Future docs must never describe ÆNS primarily as:
- deployment audit tooling
- public-state transition logging
- generic service provenance infrastructure

Preferred framing:
- ENS-native capability trust
- child capability under parent identity
- transition receipts as supporting causal-history artifacts when control planes matter

## Exact acceptance criteria for future slices
A future slice involving transition receipts is acceptable only if all of these are true:

### A. Parent/child authority is established first
The artifact/doc first establishes:
- parent identity
- child capability
- authorization relationship

before transition evidence is introduced.

### B. `parent-authorized` remains the main protocol milestone
The slice does not let `receipt captured` or `transition logged` read as a stronger success condition than capability authority.

### C. The receipt is tied to a named capability surface
The transition receipt clearly says which capability surface changed.
It is not an abstract deployment-history object floating free of the ENS identity/capability model.

### D. The transition is materially relevant
The receipt documents a change that matters to the public realization of the capability surface, not just a routine or cosmetic ops event.

### E. Public wording keeps receipts in third position
Docs/checklists/notes present:
- authority first
- public state second
- transition evidence third

### F. Repo health stays clean
- `bun test`
- `bunx tsc --noEmit`

## Explicit non-goals
This plan does **not** say:
- never use transition receipts
- control-plane evidence is unimportant
- public-state transitions should remain undocumented

It only says:
- do not let that supporting layer become the product’s center of gravity

## Next Task
### Build one small wording/structure guard if needed
Only if a future slice starts to operationalize transition receipts further, add the smallest doc/template guard that enforces:
- parent identity first
- child capability second
- authorization third
- transition receipt only after those are already clear

If no immediate slice needs that guard yet, keep the rule frozen here and move on.

## Bottom line
ÆNS stays about **ENS-authorized capability surfaces**.
Transition receipts are useful only insofar as they preserve the causal history of those surfaces.

That means the right hierarchy is:
- capability authority first
- public state second
- transition evidence third

Anything else is drift.
