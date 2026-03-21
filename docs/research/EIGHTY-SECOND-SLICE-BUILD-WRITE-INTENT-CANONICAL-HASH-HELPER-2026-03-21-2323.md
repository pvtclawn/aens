# Eighty-Second Slice Build — Write-Intent Canonical Hash Helper (2026-03-21 23:23 UTC)

## Goal
Implement Task 1 from `PLAN-WRITE-INTENT-CANONICAL-HASH-AND-CONVERGENCE-V1-2026-03-21-2318.md`:
- canonical hash helper,
- deterministic serialization rules,
- locked golden vectors,
- drift-failing tests.

## Changes shipped

### 1) New canonical hash module
Added `src/write-intent-hash.ts` with:
- `buildIntentPayloadForHash(...)`
- `canonicalJsonStringify(...)`
- `hashWriteIntentPayload(...)`
- pinned algorithm marker: `keccak256-utf8-canonical-json-v1`

Normalization/canonicalization rules implemented:
- ENS names normalized to lowercase + trimmed,
- URL values normalized to trim + no trailing slash,
- `targetRecords` normalized and sorted by `(targetName, key, value)`,
- object keys serialized in deterministic lexical order.

### 2) Golden vector coverage
Added `src/write-intent-hash.test.ts` with vector-locked assertions:
- fixed canonical JSON outputs,
- fixed hash outputs,
- fixed UTF-8 byte lengths.

Vectors now fail loudly on canonicalization drift.

### 3) Export surface update
Updated `src/index.ts` to export `write-intent-hash` module.

## Validation
```bash
bunx tsc --noEmit
bun test src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-source-label.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- Typecheck pass.
- Targeted tests pass (`18 pass`).
- Public surface check remains green.

## Contract guardrails
- No discover service schema changes.
- No wallet/write automation added.
- Hash drift now detectable through vector-locked tests.
