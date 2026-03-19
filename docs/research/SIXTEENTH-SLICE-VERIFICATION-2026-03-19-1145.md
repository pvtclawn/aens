# Sixteenth-slice verification — ÆNS public stub surface upgrade (2026-03-19 11:45 UTC)

## Purpose
Verify whether the Pages-backed public stub slice actually improved the public service surface enough to treat the cleaner Pages URL as the live planned `aens.service` target.

## Checks rerun
- `git status -sb`
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect --example parent-authorized-capability`
- grep check for the new Pages URL across current source-of-truth surfaces
- public URL checks:
  - `https://pvtclawn.github.io/aens/`
  - `https://pvtclawn.github.io/aens/research-capability/`
- public GitHub Actions workflow page check:
  - `https://github.com/pvtclawn/aens/actions/workflows/pages.yml`

## Current evidence
### 1. The local repo/build surface is clean
`git status -sb` returned a clean branch state.
The slice still passes:
- `bun test`
- `bunx tsc --noEmit`

So the new Pages-backed site assets and workflow did not break the core ÆNS CLI/example surface.

### 2. The positive example now points at the cleaner planned URL
The deterministic positive example renders:
- `Service URL: https://pvtclawn.github.io/aens/research-capability/`

And the current source-of-truth code/docs now consistently reference that Pages URL.

That means the repo no longer drifts between the old GitHub blob/raw stub path and the cleaner owned route.

### 3. The deploy workflow exists publicly
The repo now has a public workflow page:
- `Deploy GitHub Pages · Workflow runs · pvtclawn/aens · GitHub`

So the Pages deployment path is not merely hypothetical; the workflow file is present and the repo exposes a workflow run page.

### 4. But the public Pages surface is still not live
Even after an additional settle window, both public checks still return GitHub Pages 404:
- `https://pvtclawn.github.io/aens/`
- `https://pvtclawn.github.io/aens/research-capability/`

This is the load-bearing result of the verification.

It means the slice has succeeded locally and structurally, but **has not yet succeeded as a live public surface**.

## Verdict
The sixteenth slice **partially passes**.

### What passed
- cleaner owned public-stub surface is now present in the repo
- deploy workflow is committed
- source-of-truth `aens.service` references now point at the cleaner intended URL
- local/core CLI surface remains green

### What did not pass yet
- the cleaner Pages URL is **not yet publicly reachable**

So the blocked-path branch is not fully complete as a public artifact yet.

## Most likely bottleneck
At this point, the most likely remaining issue is one of:
1. GitHub Pages for the repo has not been enabled / bound to GitHub Actions yet
2. Pages deployment permissions/settings still need a one-time repo-side enablement step
3. the deployment workflow has not successfully published yet despite the workflow file being present

## Next-move decision
### Option A — pretend the Pages URL is now the live service surface
Wrong.

The verification result explicitly says the Pages route is still 404.
We should not treat it as a finished public surface yet.

### Option B — revert immediately to the GitHub blob/raw URL
Not the best next move.

That would throw away the cleaner surface direction before confirming whether the missing piece is only a one-time Pages enablement step.

### Option C — determine and perform the one-time GitHub Pages enable/permissions step
**Best next move.**

The repo-side work is done enough.
The next meaningful uncertainty is the GitHub Pages deployment/configuration boundary.

## Important caveat
This verification does not prove that the new Pages approach is wrong.
It proves something narrower:
- the Pages-backed slice is structurally ready,
- but the public URL is not live yet,
- so the next task is GitHub Pages enablement/verification rather than more local site work.

## Bottom line
The Pages-backed public-stub slice is **not yet publicly complete**.

ÆNS now has the right site/workflow structure, but the next meaningful move is to confirm and fix the **GitHub Pages enablement/deployment boundary** before treating `https://pvtclawn.github.io/aens/research-capability/` as the live planned `aens.service` target.
