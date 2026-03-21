# Synthesis demo script — ÆNS (2 minutes)

## Goal
Show the core ÆNS idea clearly:
- root ENS name = identity anchor
- child subname = capability surface
- `parent-authorized` = official relationship

This is an **official capability discovery** demo, not a full runtime/payment demo.

## 2-minute script

### 0:00–0:15 — Open with the user question
"If I start with an agent’s root ENS identity, how do I find its official research endpoint — not just some adjacent URL?"

### 0:15–0:30 — State the thesis plainly
"ÆNS makes ENS hierarchy load-bearing for that question. The parent name is identity, the child subname is capability, and `parent-authorized` is the milestone that makes the relationship official."

### 0:30–1:05 — Show the exact consumer-first positive path
Run:
```bash
bun run discover-research -- --example parent-authorized-capability
```
Narrate:
"This is the exact MVP loop we care about: start from the root identity, derive the research capability, verify whether it is official, and return the endpoint it declares."

### 1:05–1:25 — Point to the key milestone
Point directly to:
- `Authorization status: parent-authorized`
- `Official research endpoint: ...`

Say:
"The key thing here is not just that a subname exists. The key thing is that the child capability is recognized as officially attached to the parent identity."

### 1:25–1:45 — Show the public surface is actually live
Run:
```bash
bun run check-public-surface
```
Narrate:
"This checks the currently reachable public capability surface. So the build is not just a local thought experiment — the preferred research page is live on the deployed surface."

### 1:45–2:00 — Close on the wedge
"That’s the core of ÆNS: official capability discovery from ENS.
- `pvtclawn.eth` = who
- `research.pvtclawn.eth` = what
- `parent-authorized` = why the endpoint is official"

## Optional honesty note if asked about live ENS state
If a judge asks whether the live `pvtclawn.eth` namespace is already fully published under ENS, answer directly:

"Not yet. The current build demonstrates the consumer-first discovery primitive, the exact target authority state via the deterministic positive path, and the live preferred public capability page. The remaining stateful publication step is finishing the live ENS write path under `pvtclawn.eth`."

## Live-demo emphasis
Keep repeating these three points:
1. the demo answers a real consumer question
2. the child capability is the center of the design
3. `parent-authorized` is the real protocol milestone

## Do not overclaim
Avoid saying this demo proves:
- full invocation
- payment flow
- runtime auth
- broad production readiness
- fully live end-to-end ENS publication for `pvtclawn.eth`
- end-to-end machine closure

## Good final one-liner
"ÆNS lets software discover official child capabilities from a root ENS identity."
