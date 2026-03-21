# Plan — agent-judge artifact wrapper for ÆNS (2026-03-21 00:57 UTC)

## Why this plan exists
The last challenge note froze the real weakness in the current machine-facing submission surface:
raw JSON output exists, but it does **not** yet carry enough provenance or public-status context for agent judges.

So the next build should not be vague "more JSON" work.
It should be one thin, verifiable slice that makes the machine-facing package trustworthy.

## Smallest shippable milestone
Add a **versioned wrapper artifact** around the existing `discover-research` result and emit two canonical JSON artifacts under `docs/submission/artifacts/`:
- deterministic example artifact
- honest live artifact

This is the smallest strong move because it:
- fixes provenance ambiguity,
- preserves the current inner result model,
- does not depend on the public discovery route being live,
- gives agent judges a contract instead of an attachment blob.

## Crisp tasks

### Task 1 — define the wrapper artifact schema
Create one wrapper shape for packaged machine-facing artifacts.

Required top-level fields:
- `schemaVersion`
- `artifactKind` (`discover-research-result`)
- `sourceMode` (`example` | `live`)
- `exampleId` (nullable)
- `generatedAt`
- `gitCommit`
- `command`
- `publicSurface`
- `result`

Required `publicSurface` fields:
- `preferredPublicBaseUrl`
- `preferredSurfaceReady`
- `bootstrapProofReady`
- `preferredResults`

Constraint:
- keep the existing inner `result` object intact unless there is a strong reason to change it

### Task 2 — add one packaging command
Add one repo command that generates the two canonical artifacts:
- `docs/submission/artifacts/discover-research-example.json`
- `docs/submission/artifacts/discover-research-live.json`

The command should:
- resolve the deterministic example
- resolve the live `pvtclawn.eth` result
- fetch current public-surface state
- capture current git commit
- write both wrapped artifacts

### Task 3 — wire the artifacts into submission docs
Update submission-facing docs so they point to the packaged artifacts as the canonical agent-judge surface.

Constraint:
- do **not** claim the public discovery route is live unless the verifier is green again
- frame the packaged artifacts as the current machine-facing truth surface while deploy lag persists

## Acceptance criteria
The milestone passes only if all of the following are true:

1. Running the new packaging command produces exactly two JSON artifacts under `docs/submission/artifacts/`
2. Each artifact includes explicit provenance:
   - `sourceMode`
   - `generatedAt`
   - `gitCommit`
   - `command`
3. Each artifact includes explicit public-status context from the current verifier:
   - `preferredPublicBaseUrl`
   - `preferredSurfaceReady`
   - `bootstrapProofReady`
4. The wrapped `result` preserves the current `discover-research` contract rather than inventing a second incompatible result shape
5. Submission docs link to the artifacts as the machine-facing judge surface
6. The docs do not overclaim live deployment status of `/discover-research/`

## Explicit non-goals for this slice
Do **not** try to do all of this at once:
- public JSON endpoint
- public JSON query mode on the route
- deploy-system debugging beyond current known boundary
- reshaping the core `discover-research` result object

Those may come later.
This slice is just the wrapper artifact + packaging surface.

## One clearly defined next task
**Implement the versioned wrapper artifact generator and add a single packaging command that writes the deterministic + live artifacts under `docs/submission/artifacts/`.**

## Why this is the right next step
It is:
- smaller than public endpoint work,
- stronger than free-floating JSON,
- honest under current deploy lag,
- and directly useful for agent judges right now.
