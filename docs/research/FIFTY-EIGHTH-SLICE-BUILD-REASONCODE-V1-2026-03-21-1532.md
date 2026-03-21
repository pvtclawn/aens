# Fifty-Eighth Slice Build — reasonCode v1 (2026-03-21 15:32 UTC)

## Scope
Implement minimal additive semantic enrichment for discover service (`reasonCode`) with deterministic tests and backward compatibility.

## Change shipped
- Added `reasonCode` classification in API response (`api/discover-research.ts`):
  - `child-not-found`
  - `child-found-not-authorized`
  - `parent-authorized-without-service-url`
  - `parent-authorized-with-service-url`
  - `lookup-failed` (error path)
- Added `reasonSchemaVersion: "v1"`.
- Added deterministic precedence tests:
  - `src/discover-research-reasoncode.test.ts`

## Validation
- `bunx tsc --noEmit` ✅
- `bun test src/*.test.ts` ✅ (`66 pass`)
- `bun run check-public-surface` ✅

## Commit
- `f5fc871` — `feat(service): add additive reasonCode classification`

## Live compatibility check (immediate)
- Current latest ready deployment at check time still returns stable v1 contract without `reasonCode` (rollout lag).
- Existing keys remain present and unchanged.

## Boundary
Feature is shipped and tested in repo; production verification of additive field is pending first deployment containing `f5fc871`.
