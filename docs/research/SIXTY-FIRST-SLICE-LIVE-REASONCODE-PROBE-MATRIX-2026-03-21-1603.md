# Sixty-First Slice Verification — Live reasonCode Probe Matrix (2026-03-21 16:03 UTC)

## Scope
Run first live probe matrix for reasonCode semantics across differentiated ENS inputs.

## Baseline
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`67 pass`)
- `bun run check-public-surface` green

## Probes
1. `pvtclawn.eth`
2. `vitalik.eth`
3. `randomname123456789.eth`

## Results
### pvtclawn.eth
- `authorization.status`: `not-parent-authorized`
- `reasonSchemaVersion`: `v1`
- `reasonCode`: `child-not-found`
- `endpoint.officialEndpointDeclared`: `false`

### vitalik.eth
- `authorization.status`: `not-parent-authorized`
- `reasonSchemaVersion`: `v1`
- `reasonCode`: `child-not-found`
- `endpoint.officialEndpointDeclared`: `false`

### randomname123456789.eth
- request timed out in this pass (`timeout 12s` guard)

## Interpretation
- Additive semantic field is live and stable for successful responses.
- Current matrix did not yet show differentiated reason variants; first two probes collapse to the same reason code.
- Third probe reliability needs tighter timeout/error handling for consistent matrix completion.

## Next improvement target
- Add explicit timeout/error-class reason handling path in service response (`lookup-failed` consistently surfaced for runtime/RPC timeout conditions).
- Expand probe set with at least one likely parent-authorized name once available to validate reason differentiation beyond `child-not-found`.
