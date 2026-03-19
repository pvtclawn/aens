# Eighteenth-slice verification — ÆNS Vite/React landing scaffold (2026-03-19 13:10 UTC)

## Purpose
Verify whether the new Vite/React landing scaffold materially improves the blocked-path public surface without breaking the existing ÆNS CLI/report path, and decide whether the external blocker has changed.

## Checks rerun
- `git status -sb`
- `cd app && bun run build`
- `bun test`
- `bunx tsc --noEmit`
- `bun run check-public-surface`
- `bun run inspect --example parent-authorized-capability`
- public URL checks:
  - `https://pvtclawn.github.io/aens/`
  - `https://pvtclawn.github.io/aens/research-capability/`
- public workflow page check:
  - `https://github.com/pvtclawn/aens/actions/workflows/pages.yml`

## Current evidence
### 1. The app scaffold is structurally sound
The repo is clean and the new Vite/React app build succeeds.
The existing ÆNS repo checks still pass:
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect --example parent-authorized-capability`

That means the app pivot did not damage the core CLI/example surface.

### 2. The blocked-path public surface is now pointed in the right long-term direction
The preferred landing/service surface is now:
- a minimal Vite/React app under `app/`
- root landing page
- `research-capability` page
- Pages workflow building `app/dist`

This is a real improvement over continuing to invest in ad hoc static HTML as the preferred long-term shape.

### 3. But the external Pages boundary still has not moved
The one-shot verifier still reports:
- Pages root → 404
- research-capability page → 404
- GitHub blob fallback → reachable

And direct public checks still confirm that the Pages URLs are not live yet.

So the app scaffold changed the **internal shape** of the preferred public surface, but it did not yet change the external publication state.

### 4. The workflow/public repo surface still exists
The public workflow page remains visible:
- `Deploy GitHub Pages · Workflow runs · pvtclawn/aens · GitHub`

So this still looks like a repo-admin Pages enablement/publication boundary, not a missing-code boundary.

## Verdict
The eighteenth slice **passes locally/structurally** but does **not** resolve the external blocker.

### What passed
- correct app-shaped landing scaffold now exists
- workflow now targets the app build output
- core ÆNS checks remain green

### What remains blocked
- the cleaner public URL is still not live
- the Pages boundary is still external/repo-admin

## Next-move decision
### Option A — keep building more app surface now
Low value relative to the current blocker.

The app shell is already good enough for the first proof surface.
More local app work will not make the public URL resolve.

### Option B — ignore the Pages boundary and assume the app URL is good enough
Wrong.

The verifier still says the Pages route is not live.

### Option C — keep the current decision rule
**Best next move.**

The current rule remains correct:
1. do the one GitHub Pages admin step
2. rerun `bun run check-public-surface`
3. if Pages is live, use the cleaner app-backed URL
4. if not, use the already-frozen temporary blob fallback for the first live proof

## Bottom line
The Vite/React pivot was the right blocked-path build move.

But it did **not** remove the external Pages blocker.
The next meaningful move is still outside the local code surface: Pages settings/enablement, followed by the existing verifier and fallback rule.
