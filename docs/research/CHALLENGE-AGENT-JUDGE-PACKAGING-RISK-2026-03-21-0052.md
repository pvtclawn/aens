# Challenge — agent-judge packaging rule still has a truth/provenance gap (2026-03-21 00:52 UTC)

## Purpose
Red-team the new agent-judge packaging rule before it hardens into submission truth.

The rule says ÆNS should ship:
- a human surface (video / route / narrative)
- a machine surface (JSON artifacts or endpoint contract)

That is directionally right.
The question here is: **why might that still fail with agent judges?**

## What was checked
Observed current machine-facing output directly:

### Deterministic positive JSON
```bash
bun run discover-research -- --example parent-authorized-capability --json
```

### Honest live JSON
```bash
bun run discover-research -- --json pvtclawn.eth
```

Current output shape includes:
- `parentName`
- `researchCapabilityName`
- `authorizationStatus`
- `authorizationSummary`
- `parentListsChild`
- `childDeclaresParent`
- `serviceUrl`
- `officialEndpointDeclared`
- `livenessChecked`
- `notes`

## Main critique
The packaging rule is correct at the level of **format** (`include JSON`), but still weak at the level of **provenance** and **truth boundaries**.

That matters because an agent judge is likely to ask:
- is this JSON synthetic or live?
- when was it generated?
- from which commit?
- is this describing current prod truth or a deterministic example?
- is the endpoint merely declared, or is the public surface currently reachable?

Right now, the raw JSON alone does not answer those questions.

## Weakness 1 — detached JSON artifacts are ambiguous
The deterministic positive JSON and the live JSON share the same result shape, but the object itself does **not** say whether it came from:
- an example scenario, or
- a live ENS lookup.

That means if the JSON is copied into a submission bundle by itself, an agent judge cannot tell whether the happy-path artifact is:
- synthetic demo truth, or
- current live namespace truth.

This is a serious weakness.

### Why it matters
The exact failure mode is that the strongest-looking artifact (`parent-authorized`) could be mistaken for current live state.
That would make the submission look more complete than it really is.

### Mitigation
Add an outer artifact wrapper with explicit provenance fields such as:
- `schemaVersion`
- `artifactKind` (`discover-research-result`)
- `sourceMode` (`example` | `live`)
- `exampleId` when relevant
- `generatedAt`
- `gitCommit`
- `command`
- `result`

## Weakness 2 — no freshness or reproducibility metadata
The current JSON output has useful result fields but no evidence fields.
It does not tell an agent judge:
- when it was generated
- from which repo commit
- under which public-surface state
- with which command
- against which preferred base URL / environment

So even if the JSON is honest, it is still hard to verify or compare.

### Why it matters
An agent judge may prefer artifacts that are clearly:
- reproducible
- timestamped
- commit-bound
- environment-scoped

Without that, the JSON looks more like a pasted example than a verifiable artifact.

### Mitigation
Every packaged JSON artifact should include provenance metadata and ideally be generated into a committed artifact path such as:
- `docs/submission/artifacts/discover-research-example.json`
- `docs/submission/artifacts/discover-research-live.json`

## Weakness 3 — authority and public reachability are still separated across surfaces
The result tells an agent judge about authority/declaration, but not the current status of the preferred public surface.

Today, that gap matters a lot because:
- `serviceUrl` may point to a real page
- the public discovery route is still not deployed live
- prod truth and repo truth are temporarily out of sync

An agent judge that only sees the JSON artifact could still over-infer deploy readiness.

### Why it matters
`officialEndpointDeclared: true` + `livenessChecked: false` is honest, but it still does not tell the judge whether:
- the preferred public surface is currently up,
- the endpoint is reachable,
- the demo route is live,
- production is ahead/behind the commit.

### Mitigation
The machine-facing package should include either:
- a `publicSurface` block inside the wrapper artifact, or
- a paired verifier artifact from `bun run check-public-surface`

Minimum useful fields:
- `preferredPublicBaseUrl`
- `preferredSurfaceReady`
- `bootstrapProofReady`
- `checkedAt`
- `discoverResearchPageStatus` when that route exists

## Weakness 4 — raw JSON alone may still look static/fake
A checked-in JSON file is cheap, but agent judges may discount it as:
- static fixture data
- hand-edited output
- non-canonical attachment

That is especially likely if no public JSON endpoint exists yet.

### Why it matters
The whole ÆNS thesis is that machine-readable capability discovery should be **consumable**.
If the machine surface is just an attached blob with no stable contract or public retrieval path, the submission may still feel more like a deck than a protocol slice.

### Mitigation
Best next build target:
1. public JSON query mode for `/discover-research/`, or
2. dedicated public JSON endpoint exposing the same result contract.

If that is blocked by deployment/control-plane issues, the fallback should be:
- committed JSON artifacts
- plus explicit provenance wrapper
- plus linked verifier artifact

## Strongest critique sentence
The current packaging rule improves **format**, but not yet **machine-verifiable provenance**.

## What this changes
This critique changes the next build target.
The next strong build is **not** merely “export two JSON files.”
It is one of:
- a versioned JSON artifact wrapper with provenance fields, or
- a public JSON endpoint / route mode, ideally both.

## Recommended next move
Smallest meaningful follow-up build:
- add a wrapper artifact schema for packaged JSON outputs
- emit deterministic + live artifacts under a stable `docs/submission/artifacts/` path
- include commit/timestamp/source-mode/public-surface metadata

Then, once deploy is healthy:
- expose the same contract publicly on the discovery route

## Verdict
The agent-judge packaging rule is directionally right, but currently incomplete.
Without explicit provenance and public-status metadata, the machine-facing surface is still too easy to misread, overtrust, or dismiss as static.
