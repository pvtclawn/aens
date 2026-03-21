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

### 0:30–0:55 — Start with the clearest current proof of the target flow
Open:
- `docs/submission/artifacts/discover-research-example.json`

Narrate:
"Start with the wrapped example artifact for the clearest current proof of the target discovery flow: given a root ENS identity, derive the research capability, verify whether it is official, and return the endpoint it declares."

### 0:55–1:15 — Show a real public surface early
Open:
- `https://aens-nine.vercel.app/research-capability/`

Narrate:
"This is the current public visual anchor for the build. So the demo is not just a JSON bundle or local shell exercise — there is already a live public research surface."

### 1:15–1:35 — Show current namespace truth honestly
Open:
- `docs/submission/artifacts/discover-research-live.json`

Point directly to:
- `sourceMode: live`
- `authorizationStatus` (current live result)
- `preferredSurfaceReady` and `bootstrapProofReady` (current public status)

Say:
"The important thing here is that ÆNS reports current truth honestly. The example artifact shows the target authority state; the live artifact shows the current namespace truth and the current public deployment status."

### 1:35–1:50 — Keep reproducibility visible
Run:
```bash
bun run discover-research -- --example parent-authorized-capability --json
bun run discover-research -- --json pvtclawn.eth
bun run check-public-surface
```

Narrate:
"These commands reproduce the target-state artifact, the live-truth artifact, and the current public-surface status directly from the repo."

### 1:50–2:00 — Close on the wedge and current deployed surface
Say:
"That’s the core of ÆNS: official capability discovery from ENS.
- `pvtclawn.eth` = who
- `research.pvtclawn.eth` = what
- `parent-authorized` = why the endpoint is official

The `/discover-research/` route is now live on the preferred public surface, and the wrapped artifacts stay as the strongest machine-facing truth surface."

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
