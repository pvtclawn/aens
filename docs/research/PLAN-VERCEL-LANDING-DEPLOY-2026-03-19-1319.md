# Plan — deploy the ÆNS landing on Vercel (2026-03-19 13:19 UTC)

## Purpose
Freeze the deploy-target pivot for the blocked-path/public-surface work.

## Trigger
Egor explicitly pushed back on GitHub Pages and clarified the preferred shape:
- use a real landing/app surface
- deploy it on **Vercel**
- current app shape should be **Vite + React**

## Decision
### Preferred public landing target
The ÆNS / PrivateClawn landing should now be treated as:
- Vite + React app (`app/`)
- deployed on **Vercel**

### What this replaces
GitHub Pages is no longer the preferred deployment direction for the landing surface.
The existing Pages work remains useful as scaffolding/history, but it is no longer the main path to unblock the first credible public service URL.

## Why this is the right pivot
1. **Better fit for the actual surface**
   - the landing is now an app-shaped Vite/React surface, not a throwaway static stub
2. **Avoids the current Pages admin bottleneck**
   - the project should not stay blocked on repo Pages settings if the preferred host is now Vercel
3. **Better long-term evolution path**
   - landing page now, richer app later
   - without throwing away the initial work

## Immediate consequence
The current “Pages setting → verifier → maybe fallback” loop is no longer the preferred blocked-path path.

The new blocked-path/public-surface path is:
1. deploy `app/` on Vercel
2. get a stable public Vercel URL
3. use that as the preferred landing/service surface for the first live proof
4. update the planned `aens.service` target accordingly

## Minimal next slice
# **Prepare and verify a first Vercel deployment for `aens/app/`.**

### Smallest useful shape
- configure Vercel for the Vite app under `app/`
- confirm the app builds/deploys there
- capture the resulting public URL
- update the preferred service-surface target away from Pages if the deployment succeeds

## Acceptance criteria
1. The preferred deploy target is explicitly Vercel, not GitHub Pages.
2. The next build work focuses on `app/` deployment rather than more Pages troubleshooting.
3. The first live proof can use a real Vercel-hosted landing URL if deployment succeeds.
4. If Vercel deployment is blocked by auth/project setup, the blocker is made explicit rather than silently reverting to Pages theory.

## Bottom line
The blocked-path/public-surface direction is now:

> **deploy the Vite/React ÆNS landing on Vercel.**

That is the next meaningful path to a credible public service URL.
