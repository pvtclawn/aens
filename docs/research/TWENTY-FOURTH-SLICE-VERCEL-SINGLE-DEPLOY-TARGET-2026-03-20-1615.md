# Twenty-fourth ÆNS slice — Vercel single deploy target (2026-03-20 16:15 UTC)

## Purpose
Remove the now-unwanted GitHub Pages path entirely and make the intended Vercel deployment shape explicit in-repo instead of depending on hidden dashboard state.

## Change
### 1) Remove GitHub Pages deployment artifacts
Deleted:
- `.github/workflows/pages.yml`
- `site/`

This stops GitHub from attempting Pages deployments for the repo and removes the stale alternate static-host path.

### 2) Make Vercel build/output config explicit for both root-layout possibilities
Added:
- `vercel.json`
- `app/vercel.json`

Both configs declare:
- Bun install/build commands
- the correct static output directory
- trailing slash support
- explicit rewrites for `/research-capability` and `/research-capability/` to `/research-capability/index.html`

The dual-config approach is intentional: current public evidence still cannot prove whether the Vercel project is using repo root or `app/` as its effective root directory. This change makes either root layout converge on the same deployment result.

### 3) Update the stub doc’s canonical preferred page
Updated:
- `docs/public/research-capability-stub.md`

The canonical preferred public page is now the Vercel capability route:
- `https://aens-nine.vercel.app/research-capability/`

## Verification
Local checks passed:
- `bun test src/*.test.ts`
- `bunx tsc --noEmit`
- `cd app && bun run build`

Observed live state before push remains:
- root landing returns `200`
- `/research-capability/` returns `404`
- root HTML still serves the old `/aens/assets/...` shape publicly

So the repo-side fix is ready, but final live verification still depends on Vercel serving a new deployment from current main.

## Core delta
None.
This slice does not change the parent identity / child capability / authorization model.

## Rail delta
High.
This slice changes only supporting deployment/public-surface machinery.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting work, not protocol-center progress.

## Result
ÆNS now has one intended public deployment path: Vercel.
GitHub Pages is removed from the live repo path.
