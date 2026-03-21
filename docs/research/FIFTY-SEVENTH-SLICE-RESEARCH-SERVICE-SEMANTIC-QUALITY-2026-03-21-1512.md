# Fifty-Seventh Slice Research — Discover Service Semantic Quality (2026-03-21 15:12 UTC)

## Scope
Run a narrow product-quality scan of the new discover service response semantics.

## Baseline
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`62 pass`)
- `bun run check-public-surface` green

## Live probes
- `GET /api/discover-research?name=pvtclawn.eth`
- `GET /api/discover-research?name=vitalik.eth`

Both currently return structurally valid v1 responses with:
- `source: aens-discover-research-v1`
- expected top-level fields present
- `authorization.status: not-parent-authorized`
- `endpoint.serviceUrl: null`
- `endpoint.officialEndpointDeclared: false`

## Product-quality finding
The service contract is live and stable, but semantic quality is currently too conservative/flat:
- responses for very different ENS names collapse to the same outcome shape,
- no differentiation between “no research capability exists” vs “capability exists but not parent-authorized” vs “lookup ambiguity/error class”,
- limited consumer guidance for next action.

## Improvement target (next product slice)
Add explicit semantic reason classification in v1 response (without breaking existing keys), e.g.:
- `reasonCode: child-not-found | child-found-not-authorized | parent-missing-capabilities | lookup-failed`.

This would preserve current contract stability while making the service materially more useful for agent consumers.
