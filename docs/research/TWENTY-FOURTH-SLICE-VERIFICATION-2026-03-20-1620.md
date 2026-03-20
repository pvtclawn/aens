# Twenty-fourth ÆNS slice verification — Vercel single deploy target (2026-03-20 16:20 UTC)

## Purpose
Verify whether the repo-side deployment cleanup actually changed public truth after the Vercel project was connected to the repo and redeployed from `main`.

## Verification commands
```bash
git rev-parse --short HEAD
bun run check-public-surface
curl -I -s https://aens-nine.vercel.app/
curl -I -s https://aens-nine.vercel.app/research-capability/
curl -s https://aens-nine.vercel.app/ | sed -n '1,20p'
```

## Results
Current repo commit at verification time:
- `76e3958`

`bun run check-public-surface` now reports:
- `public root: ok (https://aens-nine.vercel.app/)`
- `research capability page: ok (https://aens-nine.vercel.app/research-capability/)`
- `github blob fallback: ok (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`
- `Preferred public surface ready: yes (https://aens-nine.vercel.app/research-capability/)`
- `Bootstrap proof ready: no (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`

HTTP checks now show both preferred routes returning `200` with fresh timestamps:
- root `last-modified: Fri, 20 Mar 2026 16:20:25 GMT`
- research route `last-modified: Fri, 20 Mar 2026 16:20:25 GMT`

The root HTML now serves the intended relative Vercel-safe asset shape:
- `./assets/landing-DN2OaFBy.js`
- `./assets/content-DENShTdF.js`
- `./assets/content-Bq4GfQQb.css`

This replaces the earlier legacy `/aens/assets/...` artifact family.

## Verdict
The preferred Vercel public surface is now genuinely live.
The earlier deployment/control-plane blocker is cleared.

## Scope
What this verification proves:
- the repo-to-Vercel deployment path is now functioning for the preferred public surface
- the preferred `research-capability` route is now publicly reachable
- the preferred surface is now the active public truth

What it does **not** prove:
- ENS records have been updated live to use the preferred route
- full invocation/payment/runtime behavior
- broader production readiness beyond the landing/capability surface

## Core delta
None.
This is verification of public-surface/deployment truth, not a change to the parent identity / child capability / authorization model.

## Rail delta
High.
This verifies supporting public-truth/deployment machinery.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting verification work, not protocol-center progress.

## Bottom line
ÆNS now has a working preferred Vercel public surface:
- `https://aens-nine.vercel.app/`
- `https://aens-nine.vercel.app/research-capability/`

The GitHub blob remains reachable as historical/bootstrap fallback material, but it is no longer the active proof path.
