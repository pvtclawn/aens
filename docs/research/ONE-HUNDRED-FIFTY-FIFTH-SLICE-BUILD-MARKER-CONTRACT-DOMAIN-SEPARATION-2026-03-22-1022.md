# One-Hundred-Fifty-Fifth Slice Build — Marker-Contract Domain Separation (2026-03-22 10:22 UTC)

## Goal
Implement Task 1 from `PLAN-MARKER-CONTRACT-HARDENING-V1-2026-03-22-1017.md`:
- domain-separate runtime vs fallback marker contracts,
- add bounded alias metadata,
- add domain-isolation tests and checker wiring.

## Implementation

### 1) Added shared marker-contract module
Created `src/public-surface-marker-contract.ts` with:
- explicit marker domains:
  - `preferred-runtime`
  - `bootstrap-fallback`
- canonical runtime markers (root/research/discover)
- bounded alias metadata (`marker`, `sunsetAt`, `reason`)
- alias activation resolver (`resolveActiveMarkerAliases`) using sunset enforcement.

### 2) Wired checker targets to domain-separated contracts
Updated `src/public-surface.ts`:
- preferred targets now derive from shared runtime marker contracts,
- fallback target now derives from separate bootstrap marker contract,
- added marker matching semantics (`canonical|alias|none`) and matched-marker visibility,
- `surfaceCheckPassed` now accepts canonical or active alias matches at `status=200`.

Updated `src/public-proof-state.ts`:
- `checkSurface` now records marker domain + match class,
- fallback checks use `buildFallbackSurfaceTarget()` instead of inline marker literals.

### 3) Added domain-isolation and bounded-alias tests
Updated tests:
- `src/public-surface.test.ts`
  - verifies role-based target marker contracts,
  - verifies fallback-domain separation,
  - verifies bounded alias behavior before/after sunset,
  - verifies runtime marker checks do not accept fallback marker content.
- `src/public-proof-state.test.ts`
  - updated marker fixtures with domain + match semantics.
- `src/submission-artifacts.test.ts`
  - aligned preferred marker fixtures with current canonical marker strings.

## Verification
- `bunx tsc --noEmit` pass
- targeted suite pass (`29 pass`):
  - `public-surface`
  - `public-proof-state`
  - `submission-artifacts`
  - `primary-lock-integrity`
  - `stage-gate-adapter-parity`
  - `reason-stage-ownership`
  - `machine-payload-parity`
  - `discover-research-service`
- app build pass
- `bun run check-public-surface` now fully green:
  - public root: ok
  - research capability page: ok
  - discover research page: ok
  - preferred public surface ready: yes
  - bootstrap proof ready: no

## Outcome
Task 1 is implemented: marker contracts are domain-separated with bounded alias metadata, runtime/fallback isolation is test-locked, and public-surface checker health is restored under the shared marker contract.