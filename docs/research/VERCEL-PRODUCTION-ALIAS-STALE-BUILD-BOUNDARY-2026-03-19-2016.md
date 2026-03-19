# Vercel production alias stale-build boundary (2026-03-19 20:16 UTC)

## Purpose
Sharpen the current Vercel/publication fork:

> is the remaining `/research-capability/` 404 likely a last route-semantics bug, or is production simply serving the wrong build?

## Short answer
The evidence now points much more strongly to a **stale production deployment / project-config boundary** than to any remaining local route-generation bug.

## Evidence

### 1) Live production root is still serving the old HTML artifact
Current live root HTML at `https://aens-nine.vercel.app/` contains:
```html
<script type="module" crossorigin src="/aens/assets/index-D-e3THa6.js"></script>
<link rel="stylesheet" crossorigin href="/aens/assets/index-Bq4GfQQb.css">
```

That is the **old GitHub-Pages-shaped asset base** (`/aens/...`), not the fixed Vercel-safe relative base.

### 2) Current local build output is different
Current local `app/dist/index.html` contains:
```html
<script type="module" crossorigin src="./assets/landing-DN2OaFBy.js"></script>
<link rel="modulepreload" crossorigin href="./assets/content-DENShTdF.js">
<link rel="stylesheet" crossorigin href="./assets/content-Bq4GfQQb.css">
```

And current local `app/dist/research-capability/index.html` exists with the expected relative asset paths:
```html
<script type="module" crossorigin src="../assets/researchCapability-BD9ORl3V.js"></script>
```

So the current repo/build state already contains the fixed nested page.

### 3) Live response headers also show stale timing
Current production root headers report:
- `last-modified: Thu, 19 Mar 2026 15:09:34 GMT`

That predates the local route/output fix and the later verifier/proof-capture work pushed to `main`.

### 4) Current repo `main` is ahead with the fix
Recent `main` history includes:
- `90fbcd9` — `fix(app): emit research capability route for vercel`
- `ae056a8` — preferred Vercel surface verifier pivot
- `385dc13` — proof capture records publication mode / service URL
- `a0fec29` — verification of the mode-aware proof capture

So the deployed alias and the repo tip are visibly out of sync.

## What this means
The remaining public 404 is no longer best explained by “Vite still fails to emit the child route.”
That local bug is already fixed.

The sharper explanation is now one of these external deployment-state causes:

1. **Production alias is still pinned to an older deployment**
2. **The Vercel project is not building the correct monorepo root (`app/`)**
3. **The Vercel project is not using the expected build/output settings for the app project**
4. **Production branch / git integration is not actually promoting the latest `main` commit to production**

## Relevant Vercel docs signals
From current Vercel docs:
- monorepo projects should explicitly set the **Root Directory** to the directory being deployed
- Git-connected projects should create a new deployment on each commit
- deployments can be manually re-run / redeployed from the dashboard if needed

That matches the observed mismatch: the repo changed, but production is still serving an older artifact.

## Smallest next human action
Do **not** reopen route semantics or add more local deploy speculation yet.

Instead check the Vercel project directly:

### In Vercel Dashboard → Project Settings
Confirm all of:
1. **Root Directory** = `app`
2. **Framework Preset** = Vite (or equivalent static frontend config)
3. **Build Command** = `bun run build` (or detected Vite build command)
4. **Output Directory** = `dist`
5. **Production Branch** = `main`

### Then in Deployments
- redeploy the latest `main` deployment **or** promote the latest correct deployment to production
- then rerun:
```bash
bun run check-public-surface
```

## Decision impact
This research materially narrows the boundary:
- **preferred surface ready** is still **no**
- **bootstrap proof ready** remains **yes, narrowly**
- but the preferred-route blocker is now best treated as a **Vercel production deployment/config sync issue**, not a fresh local app-build problem

## Bottom line
The production alias is serving an old artifact.
The next useful move is a Vercel settings/deployment check, not more local Vite routing work.
