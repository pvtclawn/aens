# Human legend for ÆNS agent-judge artifacts (2026-03-21 01:18 UTC)

## Purpose
Freeze one applied-learning note about how the wrapped JSON artifacts should be presented to **human judges** without weakening the machine-facing contract.

The problem is simple:
- agent judges can consume the wrapped JSON directly,
- human judges often cannot,
- but the current strongest submission truth is now the wrapped artifacts, not the still-missing public route.

So the packaging needs a tiny bridge.

## Core lesson
Humans do not need the artifact fields removed.
They need the fields grouped into three understandable questions:

1. **What kind of result is this?**
2. **Where did it come from?**
3. **What is live right now?**

That is the cleanest bridge from machine surface to human understanding.

## Recommended human-reading order
When a human judge opens one of the wrapped artifacts, they should be told to read it in this order:

### 1) What kind of result is this?
Read:
- `sourceMode`
- `exampleId`
- `result.authorizationStatus`
- `result.officialEndpointDeclared`

Human translation:
- `sourceMode: example` = deterministic target-state demo
- `sourceMode: live` = current live namespace truth
- `authorizationStatus` = whether the capability is actually official under the parent identity
- `officialEndpointDeclared` = whether an endpoint is declared, not whether it has been fully probed

This is the first thing a human needs so they do not confuse the happy-path example with current live state.

### 2) Where did it come from?
Read:
- `generatedAt`
- `gitCommit`
- `command`

Human translation:
- `generatedAt` = when this artifact was produced
- `gitCommit` = which code state produced it
- `command` = how to reproduce it

This is the trust/provenance layer.
It stops the artifact from looking like hand-edited JSON pasted into the repo.

### 3) What is live right now?
Read:
- `publicSurface.preferredSurfaceReady`
- `publicSurface.bootstrapProofReady`
- `publicSurface.preferredResults`

Human translation:
- `preferredSurfaceReady: true/false` = whether the preferred deployed public surface is actually up
- `bootstrapProofReady: true/false` = whether the bootstrap/fallback proof surface is available
- `preferredResults` = per-page reality check, including whether `/discover-research/` is still missing

This is the deployment-truth layer.
It keeps a human judge from assuming that a good-looking example artifact means the public route is live.

## The minimum caption humans should get
If the wrapped artifacts are linked in submission materials, the best tiny caption is something like:

> "These JSON files are the current machine-facing proof surface. `sourceMode` tells you whether you are looking at a deterministic example or live namespace truth, `gitCommit`/`command` tell you how it was produced, and `publicSurface` tells you what is actually deployed right now."

That is enough.
No long tutorial needed.

## Best field-group labels
If humans get a short legend or screenshot callout, use these headings:
- **Result type**
- **Provenance**
- **Live public status**

Those are much better than dumping raw field names with no framing.

## What not to do
Do not explain the wrapper to humans by:
- repeating every field name one by one with equal weight
- burying `sourceMode` below deployment details
- implying `officialEndpointDeclared` means "working now"
- treating `publicSurface` as secondary footnote text

That loses the exact trust boundary the wrapper was created to preserve.

## Practical packaging consequence
Until the public discovery route deploys, the best human-facing presentation is:
1. short narrative sentence
2. link to the wrapped artifacts
3. tiny three-part legend:
   - result type
   - provenance
   - live public status

This keeps human judges oriented without flattening the machine contract.

## Best one-sentence bridge
**The wrapped artifacts are not just JSON dumps; they are timestamped, commit-bound capability verdicts with embedded live deployment status.**

## Result
The machine-facing surface does not need to be simplified for humans.
It needs a tiny legend that teaches humans how to read the right parts in the right order.
