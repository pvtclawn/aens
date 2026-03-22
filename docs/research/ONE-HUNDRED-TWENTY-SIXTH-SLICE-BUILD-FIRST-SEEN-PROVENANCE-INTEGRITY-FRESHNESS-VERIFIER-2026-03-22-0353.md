# One-Hundred-Twenty-Sixth Slice Build — First-Seen Provenance Integrity/Freshness Verifier (2026-03-22 03:53 UTC)

## Goal
Implement Task 1 from `PLAN-FIRST-SEEN-PROVENANCE-REGISTRY-HARDENING-V1-2026-03-22-0348.md`:
- integrity + freshness verifier module,
- deterministic blocker reason codes,
- registry hash/freshness metadata output,
- focused tests.

## Changes shipped

### 1) New first-seen provenance verifier module
Added `src/first-seen-provenance-registry.ts` with:
- registry model:
  - `registryVersion`
  - `boundPolicyHash`
  - `boundFixtureBundleHash`
  - `records[]`
- verifier:
  - `verifyFirstSeenProvenanceRegistry(...)`

Verifier behavior includes:
- deterministic normalization (record sorting + hash normalization),
- integrity checks (required fields, duplicate fixture IDs, optional expected registry hash match),
- freshness checks against expected policy/bundle hashes,
- deterministic fail-closed reason codes:
  - `fixture-provenance-registry-integrity-invalid`
  - `fixture-provenance-registry-stale`.

### 2) Metadata-rich verification output
Success output now includes:
- `registryVersion`
- computed `registryHash`
- freshness details:
  - expected vs observed policy hash
  - expected vs observed fixture bundle hash
  - match booleans
  - combined `isFresh` verdict.

Failure output includes deterministic diagnostics:
- `reasonCode`
- `path`
- `message`
- and, where available, `registryVersion` / `registryHash` / freshness context.

### 3) Focused test coverage
Added `src/first-seen-provenance-registry.test.ts` covering:
- fresh success path with deterministic hash behavior,
- expected-registry-hash integrity mismatch,
- stale policy-hash detection,
- stale fixture-bundle-hash detection,
- duplicate fixture-ID integrity rejection.

### 4) Export surface update
Updated `src/index.ts` to export `first-seen-provenance-registry`.

## Validation
```bash
bunx tsc --noEmit
bun test src/first-seen-provenance-registry.test.ts src/dual-schema-cutoff-phase.test.ts src/parity-fixture-semantic-consistency.test.ts src/machine-payload-parity.test.ts src/policy-blocker-mapper-output.test.ts src/grace-window-deadline.test.ts src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- typecheck pass,
- targeted suite pass (`53 pass`),
- public surface check remains green.

## Contract guardrails
- no discover/public API schema changes,
- no first-seen migration-record flow yet (next tasks),
- provenance integrity/freshness now has deterministic fail-closed foundation with machine-usable diagnostics.
