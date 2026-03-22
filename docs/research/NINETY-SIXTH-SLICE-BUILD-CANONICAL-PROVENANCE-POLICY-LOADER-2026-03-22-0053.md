# Ninety-Sixth Slice Build — Canonical Provenance-Policy Loader (2026-03-22 00:53 UTC)

## Goal
Implement Task 1 from `PLAN-CANONICAL-POLICY-LOADER-HASH-EXPIRY-CI-COMMIT-SOURCE-V1-2026-03-22-0048.md`:
- canonical provenance-policy loader,
- policy-hash binding metadata,
- strict source-collision validation,
- tests.

## Changes shipped

### 1) Canonical policy file added
- Added `config/provenance-policy.json` with explicit policy contract:
  - `policyVersion`
  - `allowedValidatorVersions.active/grace`
  - `allowedSchemaVersions.active/grace`

### 2) New loader module
Added `src/provenance-policy.ts`:
- `loadProvenancePolicy(...)` resolves and validates canonical policy source,
- strict source-collision detection (multiple existing policy sources => fail closed),
- strict schema validation with unsupported-key rejection,
- canonical hash binding metadata:
  - `policySourcePath`
  - `policyHash`
  - `policyByteLength`

### 3) Test coverage
Added `src/provenance-policy.test.ts`:
- canonical load success path + metadata checks,
- stable hash on identical policy bytes,
- malformed structure rejection,
- source-collision rejection,
- unsupported top-level key rejection.

### 4) Export surface update
- Updated `src/index.ts` to export `provenance-policy` module.

## Validation
```bash
bunx tsc --noEmit
bun test src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

## Expected guardrails
- no discover/public API schema changes,
- no write execution automation,
- policy source ambiguity now fails closed before release-gate evaluation uses policy data.
