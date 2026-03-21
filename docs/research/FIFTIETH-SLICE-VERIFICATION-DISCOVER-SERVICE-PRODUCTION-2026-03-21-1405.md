# Fiftieth Slice Verification — Discover Service on Production (2026-03-21 14:05 UTC)

## Scope
Verify the newly shipped service endpoint on production:
`/api/discover-research?name=<ens-root>`.

## Baseline
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`62 pass`)
- `bun run check-public-surface` green

## Production checks
Request:
- `GET https://aens-nine.vercel.app/api/discover-research?name=pvtclawn.eth`

Observed behavior:
1. `308` redirect to trailing-slash path:
   - `/api/discover-research/?name=pvtclawn.eth`
2. final response at redirected path:
   - `404 NOT_FOUND`
   - body: `The page could not be found`

## Verification result
Service endpoint is implemented in repo (`api/discover-research.ts`) and covered by unit tests, but is not currently live/served on production surface.

## Likely boundary
Current Vercel setup serves static build output (`outputDirectory: app/dist`) and does not currently expose the function route from repo root `api/` in the live deploy path.

## Decision
- Product/service implementation: ✅ shipped in code
- Production service availability: ❌ not yet live

## Next smallest fix
Adjust deployment config so API functions are included/exposed on the deployed surface, then re-run this production verification and freeze green contract evidence.
