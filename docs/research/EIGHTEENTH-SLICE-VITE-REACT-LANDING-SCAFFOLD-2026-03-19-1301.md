# Eighteenth ÆNS slice — Vite/React landing scaffold (2026-03-19 13:01 UTC)

## Goal
Follow the new blocked-path direction and replace the preferred ad hoc static-stub path with a proper Vite/React landing app scaffold for ÆNS / PrivateClawn.

## Trigger
Egor explicitly clarified the desired shape for the service surface:
- `just a vite app... vite/react`

## What this slice adds
### 1. Landing app scaffold
Added a minimal Vite + React app under:
- `app/`

The app currently includes:
- root landing page
- research-capability landing page
- shared content/constants
- shared shell/styles

### 2. Clean multi-page structure
Pages are split as:
- `app/index.html`
- `app/research-capability/index.html`

So the first app shell can support:
- `/aens/`
- `/aens/research-capability/`

without pretending we already need a full dashboard/router-heavy app.

### 3. Pages workflow pivot
Updated `.github/workflows/pages.yml` so GitHub Pages now builds the Vite app and uploads:
- `app/dist`

instead of shipping the old hand-written `site/` directory as the preferred surface.

## Why this matters
This changes the blocked-path build direction from:
- throwaway static HTML stub

to:
- minimal app surface we can keep growing

That is a better fit for:
- agent landing page
- future publisher-assist UX
- future capability UI work

## Scope boundary
This slice does **not**:
- change the live ENS authority model
- change the live write runbook
- remove the already-frozen Pages-first / blob-fallback decision rule
- build a full app/dashboard

It only scaffolds the correct app-shaped landing surface.

## Checks to run
- `cd app && bun install`
- `cd app && bun run build`
- repo `bun test`
- repo `bunx tsc --noEmit`
- repo `bun run inspect --example parent-authorized-capability`

## Success criterion
ÆNS now has a minimal Vite/React landing app shell that can become the canonical public service surface instead of investing more in ad hoc static Pages files.
