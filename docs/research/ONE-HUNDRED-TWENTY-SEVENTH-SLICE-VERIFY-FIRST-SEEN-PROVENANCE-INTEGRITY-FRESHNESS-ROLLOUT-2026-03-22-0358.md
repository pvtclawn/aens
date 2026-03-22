# One-Hundred-Twenty-Seventh Slice Verification — First-Seen Provenance Integrity/Freshness Rollout (2026-03-22 03:58 UTC)

## Goal
Verify rollout `df1dfab` against Lane C criteria:
1. integrity mismatch behavior,
2. freshness mismatch behavior,
3. deterministic registry hash metadata,
4. no discover/public-surface regressions.

## Commands run
```bash
git status -sb
bunx tsc --noEmit
bun test src/first-seen-provenance-registry.test.ts src/dual-schema-cutoff-phase.test.ts src/parity-fixture-semantic-consistency.test.ts src/machine-payload-parity.test.ts src/policy-blocker-mapper-output.test.ts src/grace-window-deadline.test.ts src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts src/discover-research-response-golden.test.ts
bun runtime provenance verifier spot-check
curl live discover API + schema assertions
bun run check-public-surface
```

## Results

### 1) Integrity mismatch behavior
- expected-registry-hash mismatch triggers deterministic integrity failure ✅
- duplicate fixture-ID registry records trigger deterministic integrity failure ✅
- runtime probe confirms integrity mismatch path (`reasonCode=fixture-provenance-registry-integrity-invalid`, `path=expectedRegistryHash`) ✅

### 2) Freshness mismatch behavior
- policy-hash mismatch triggers deterministic stale failure (`path=registry.boundPolicyHash`) ✅
- fixture-bundle-hash mismatch triggers deterministic stale failure (`path=registry.boundFixtureBundleHash`) ✅
- freshness status fields expose match booleans and `isFresh` verdict deterministically ✅

### 3) Deterministic registry hash metadata
- repeated verification over equivalent registry content yields stable computed `registryHash` ✅
- success payload includes `registryVersion`, `registryHash`, and freshness metadata ✅

### 4) No discover/public-surface regressions
- discover service + golden response tests pass ✅
- live discover API schema remains stable:
  - `source=aens-discover-research-v1`
  - `reasonSchemaVersion=v1` ✅
- public surface check remains green ✅

## Regression summary
- typecheck: pass
- targeted suite: `54 pass`, `0 fail`
- runtime provenance verifier probe: pass
- public routes: reachable

## Verdict
PASS — first-seen provenance integrity/freshness verifier rollout verified.

Integrity and freshness mismatch handling are deterministic, registry hash/freshness metadata is stable, and no discover/public-surface regressions were observed after `df1dfab`.
