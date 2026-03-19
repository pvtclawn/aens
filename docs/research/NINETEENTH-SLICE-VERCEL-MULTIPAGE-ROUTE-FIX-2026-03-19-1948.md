# Nineteenth ÆNS slice — Vercel multipage route fix (2026-03-19 19:48 UTC)

## Purpose
Fix the current deployed landing bug where:
- the Vercel root URL returns `200`
- `/research-capability/` returns `404`

The goal of this slice is narrow: make the Vite/React landing app emit and serve a real nested `research-capability` page instead of only a root page shell.

## Root cause
The Vite app was configured like a single-page/root-only build:
- `app/vite.config.ts` used `base: '/aens/'`, which matched the old GitHub Pages path rather than the current Vercel root deployment
- the build did **not** declare multiple HTML entry points, so `vite build` emitted only:
  - `dist/index.html`

That meant Vercel had no `dist/research-capability/index.html` to serve, so the nested capability route 404ed.

## Changes made
### 1) Make the build truly multipage
Updated `app/vite.config.ts` to declare both HTML entrypoints via `rollupOptions.input`:
- `app/index.html`
- `app/research-capability/index.html`

### 2) Fix asset base for root-domain deploys
Changed the Vite base from `/aens/` to `./` so built asset references are relative and work for both:
- `/`
- `/research-capability/`

### 3) Stop the home-page CTA from pointing at stale GitHub Pages URLs
Updated the app content/home-page link so the landing page links internally to `./research-capability/` instead of the old `https://pvtclawn.github.io/aens/research-capability/` path.

### 4) Keep local deploy artifacts out of git
Added ignores for:
- `DEPLOYED_URL.txt`
- `app/.vercel/` (via `app/.gitignore`)

## Local verification
Ran:
```bash
bun test
bunx tsc --noEmit
cd app && bun run build
```

Observed build output now includes both pages:
```text
dist/index.html
dist/research-capability/index.html
```

Observed built HTML now uses relative assets correctly:
- root page → `./assets/...`
- research capability page → `../assets/...`

Also verified with a plain static server:
```bash
python3 -m http.server 4173 -d /home/clawn/.openclaw/workspace/aens/app/dist
curl -I http://127.0.0.1:4173/
curl -I http://127.0.0.1:4173/research-capability/
```

Result:
- `/` → `200`
- `/research-capability/` → `200`

## Verdict
This slice fixes the actual local build/output bug behind the Vercel nested-route failure.

## Next step
Push this slice and recheck the deployed Vercel URLs. If Vercel is wired to the repo as expected, `/research-capability/` should stop 404ing after redeploy.
