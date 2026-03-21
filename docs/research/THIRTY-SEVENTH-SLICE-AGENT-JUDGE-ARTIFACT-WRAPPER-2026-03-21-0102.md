# Thirty-seventh ÆNS slice — agent-judge artifact wrapper + packager (2026-03-21 01:02 UTC)

## Purpose
Turn the new agent-judge packaging critique into a real machine-facing surface that is stronger than free-floating JSON.

Goal:
- keep the existing `discover-research` result contract intact,
- wrap it in explicit provenance + public-status metadata,
- and emit canonical submission artifacts for both deterministic and live truth.

## Files changed
- `src/submission-artifacts.ts` (new)
- `src/submission-artifacts.test.ts` (new)
- `src/package-submission-artifacts.ts` (new)
- `package.json`
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`

## What changed
### 1) Added a versioned wrapper artifact schema
New wrapper constants/types:
- `aens.discover-research-artifact.v1`
- `discover-research-result`

The wrapper now carries:
- `sourceMode`
- `exampleId`
- `generatedAt`
- `gitCommit`
- `command`
- `publicSurface`
- `result`

This keeps the current inner `discover-research` result intact while adding the provenance layer agent judges actually need.

### 2) Added public-surface metadata inside the wrapper
The `publicSurface` block includes:
- `preferredPublicBaseUrl`
- `preferredResearchUrl`
- `preferredSurfaceReady`
- `bootstrapProofReady`
- summarized `preferredResults`
- summarized `fallbackResult`

Each surface check is converted into a compact machine-friendly shape:
- `label`
- `url`
- `status`
- `expectedMarker`
- `passed`
- `summary`

So the wrapped artifact no longer hides deploy/public-truth state behind separate CLI output.

### 3) Added one packaging command
New command:
```bash
bun run package-submission-artifacts
```

It writes exactly two canonical artifacts under:
- `docs/submission/artifacts/discover-research-example.json`
- `docs/submission/artifacts/discover-research-live.json`

### 4) Updated submission docs to point at the canonical machine-facing surface
The submission form pack now explicitly calls out:
- the packaging command
- the canonical artifact paths
- the rule that these wrapped JSON artifacts are the machine-facing judge surface while the public discovery route is still not live

## Verification
Ran:
- `/home/clawn/.bun/bin/bunx tsc --noEmit`
- `/home/clawn/.bun/bin/bun test src/*.test.ts`
- `/home/clawn/.bun/bin/bun run package-submission-artifacts`

Observed:
- typecheck passes
- tests pass (`61 pass`)
- package command emits exactly two artifacts
- example artifact clearly marks `sourceMode: example`
- live artifact clearly marks `sourceMode: live`
- both artifacts include `gitCommit`, `generatedAt`, `command`, and current public-surface status
- current wrapped public truth remains honest: preferred root/research page pass, `discover research page` is still `404`, `preferredSurfaceReady: false`, `bootstrapProofReady: true`

## Acceptance mapping
Target | Result
- wrapper carries explicit provenance fields | ✅
- wrapper carries public-surface status | ✅
- inner `discover-research` result contract preserved | ✅
- one packaging command writes exactly two canonical artifacts | ✅
- submission docs point to the machine-facing artifacts | ✅
- docs do not claim `/discover-research/` is live | ✅

## Core delta
Meaningful.
The machine-facing submission surface is no longer just raw result JSON; it is now a versioned artifact contract with provenance and deploy-status context.

## Rail delta
Light to moderate.
Most work was packaging, schema definition, and submission-surface wiring rather than changing the discovery model itself.

## Counterfactual relevance test
Would this slice still mostly make sense without the `parent identity -> child capability -> authorization verdict` model?

Only partly.
The provenance wrapper pattern is generic, but the actual reason it matters here is that ÆNS is claiming machine-readable capability discovery as a first-class product truth.

## Result
ÆNS now has a stronger current machine-facing judge surface even before the public discovery route finishes deploying:
- deterministic artifact
- live artifact
- explicit provenance
- explicit public-truth status
- one canonical packaging command
