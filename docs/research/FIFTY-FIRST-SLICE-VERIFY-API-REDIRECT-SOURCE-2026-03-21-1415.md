# Fifty-First Slice Verification — API Redirect Source (2026-03-21 14:15 UTC)

## Scope
Verify why `/api/discover-research` still redirects/404s after disabling `trailingSlash` in root `vercel.json`.

## Baseline
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`62 pass`)
- `bun run check-public-surface` green

## Production evidence
1. Current production alias still behavior:
   - `GET /api/discover-research?name=pvtclawn.eth`
   - `308` → `/api/discover-research/?name=pvtclawn.eth`
   - redirected target returns `404 NOT_FOUND`

2. Latest deployment alias check (`aens-5cb6wkhy3-...`) shows identical behavior (`308` then `404`).

3. `vercel project inspect aens` confirms project root is `.` and framework preset `Vite`; deployment inspect for latest build reports only one build unit (`Builds: .`) with no visible function build entries.

## Interpretation
The issue is not simply stale deploy propagation from the previous commit.
Current production still behaves like a static-served surface where the API function route is not being served as expected, and trailing-slash redirect behavior is still enforced upstream of the desired handler path.

## Concrete fix path (smallest likely)
1. Ensure API path is deployed as a function surface in the same project/runtime context that serves `aens-nine` (not just committed in repo).
2. Remove/override slash-normalization for `/api/*` explicitly (if platform-level/project-level rule still applies).
3. Re-verify live with a contract check:
   - status `200`
   - JSON parseable
   - `source === "aens-discover-research-v1"`

## Boundary
Feature code exists and tests pass locally; production service exposure is still blocked by deployment/runtime routing configuration.
