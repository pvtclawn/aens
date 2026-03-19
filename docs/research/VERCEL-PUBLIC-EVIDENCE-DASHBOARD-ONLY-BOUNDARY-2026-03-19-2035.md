# Vercel public-evidence boundary is now dashboard-only (2026-03-19 20:35 UTC)

## Purpose
Answer the remaining narrow research question honestly:

> Can public evidence alone narrow the stale Vercel production alias to one specific settings/deployment mismatch?

## Verdict
### No — not honestly.

Public evidence can still prove that the production alias is serving the wrong artifact.
But it cannot cleanly distinguish which dashboard-side cause is responsible.

At this point the boundary is **dashboard-only**, not something worth reopening with more local build speculation or more public curl loops.

## Current public evidence

### 1) The live production root still serves the old artifact
Current root HTML at `https://aens-nine.vercel.app/` still contains:
- `/aens/assets/index-D-e3THa6.js`
- `/aens/assets/index-Bq4GfQQb.css`

That is the old GitHub-Pages-shaped asset base, not the fixed relative-asset multipage build now in `main`.

### 2) The live production route still lacks the child page
Current response for:
- `https://aens-nine.vercel.app/research-capability/`

is still:
- `404`
- `x-vercel-error: NOT_FOUND`

### 3) The stale artifact is not just a transient miss
Current root headers show:
- `last-modified: Thu, 19 Mar 2026 15:09:34 GMT`
- `x-vercel-cache: HIT`
- `etag: "03fa44d27bd6a0d4e9887dff28fa52f3"`

This strongly suggests production is stably serving an older deployment artifact, not merely a momentary race during rollout.

### 4) The repo tip is clearly ahead of that artifact
Recent `main` history includes the later relevant fixes/hardening:
- `95cc062` — narrowed stale Vercel alias boundary
- `600fca1` — alias is public truth
- `b3c5926` — challenge alias-truth proof language risk
- `3199415` — freeze validated proof-state capture slice
- `0f151e9` — validated proof-state capture
- `cb0ea93` — verification of validated proof-state capture

So the externally served artifact and the repo tip are visibly out of sync.

## What public evidence can prove
From public evidence alone, we can still say all of the following with confidence:

1. the current preferred child route is **not publicly ready**
2. the preferred production alias is serving an **older artifact** than the current repo/build state
3. the remaining blocker is **not** a new local Vite route-generation bug
4. the bootstrap fallback remains the only currently honest public capability surface

## What public evidence cannot prove cleanly
From public evidence alone, we cannot honestly distinguish among these dashboard-side causes:

1. **wrong Root Directory** (`app` not selected)
2. **wrong Output Directory** (`dist` not selected)
3. **wrong Production Branch** (not deploying `main`)
4. **production alias still pinned to an older deployment**
5. **latest correct deployment exists but was not promoted to production**

Those different causes all collapse to the same public symptom:
- root alias serves old artifact
- child route 404s

So further public probing is likely to produce more confidence theater, not sharper truth.

## Why this matters
This is exactly where the alias-truth rule helps.
The right question is no longer:
- “Can we infer the exact Vercel setting from the public HTML?”

The right question is:
- “What is the smallest human/dashboard action needed to resolve the mismatch?”

That action is already known.

## Smallest next human action
In the Vercel dashboard, check the project directly:

1. **Root Directory** = `app`
2. **Output Directory** = `dist`
3. **Production Branch** = `main`
4. redeploy or promote the latest correct deployment to production

Then rerun:
```bash
bun run check-public-surface
```

## Practical consequence for ÆNS
Keep the current publication truth stable:
- `preferred surface ready = no`
- `bootstrap proof ready = yes`

Do **not** reopen local proof-capture work or local Vite route speculation based on public symptoms alone.

## Bottom line
Public evidence has already done its job.
It proves the alias is stale.
It does not honestly reveal which exact Vercel dashboard mismatch caused that staleness.

The remaining boundary is now dashboard-only.
