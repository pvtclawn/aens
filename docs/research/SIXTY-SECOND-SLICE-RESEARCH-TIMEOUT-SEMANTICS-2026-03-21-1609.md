# Sixty-Second Slice Research — Timeout/Error-Path Semantics (2026-03-21 16:09 UTC)

## Scope
Narrow product-quality follow-up on timeout/error-path behavior for discover service.

## Baseline
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`67 pass`)
- `bun run check-public-surface` green

## Live probes (2 runs each)
- `randomname123456789.eth` → `200` both runs, `reasonCode=child-not-found`
- `noexist1234567890.eth` → `200` both runs, `reasonCode=child-not-found`
- `pvtclawn.eth` → transport timeout in both runs under `curl -m 12` guard (`http=000`)

## Finding
Service semantics are consistent for missing/unknown-name cases (`child-not-found`), but request reliability is not uniform across names under tight timeout windows.

Current limitation:
- timeout outcomes at transport layer bypass JSON error contract,
- consumers may receive no body (timeout) instead of explicit `lookup-failed` payload.

## Minimal patch target
Add explicit timeout/error-path robustness in API handler so lookup timeout conditions consistently surface:
- HTTP `502`
- `reasonCode: lookup-failed`
- stable error payload keys (`error`, `message`, `name`, `reasonSchemaVersion`)

## Boundary
Semantic differentiation exists and is live, but timeout-path consistency remains a product-quality gap for agent consumers under degraded network/RPC conditions.
