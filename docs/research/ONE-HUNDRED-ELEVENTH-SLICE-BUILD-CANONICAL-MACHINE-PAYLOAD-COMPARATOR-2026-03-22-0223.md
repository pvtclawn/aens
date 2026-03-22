# One-Hundred-Eleventh Slice Build — Canonical Machine Payload Comparator (2026-03-22 02:23 UTC)

## Goal
Implement Task 1 from `PLAN-CI-CLI-PARITY-HARNESS-EDGE-CASE-GUARDRAILS-V1-2026-03-22-0218.md`:
- canonical machine payload comparator,
- deterministic canonicalization,
- field-level mismatch diagnostics with tests.

## Changes shipped

### 1) Canonical comparator module
Added `src/machine-payload-parity.ts` with:
- `compareCanonicalMachinePayloads({ expected, observed })`
- canonical normalization behavior:
  - deterministic object-key ordering,
  - optional undefined-vs-missing normalization,
  - stable array traversal,
- canonical payload serialization using existing canonical JSON helper,
- deterministic field-level mismatch extraction:
  - `fieldPath`
  - `expectedValueSnippet`
  - `observedValueSnippet`

### 2) Mismatch summary helper
Added `formatMachinePayloadMismatchSummary(...)`:
- compact, deterministic mismatch summary lines,
- bounded output with explicit `... N more mismatch(es)` tail.

### 3) Test coverage
Added `src/machine-payload-parity.test.ts` covering:
- equality under key-order changes and optional undefined/missing normalization,
- nested field-path mismatch detection,
- array ordering mismatch detection,
- deterministic limited mismatch summary output.

### 4) Export surface update
Updated `src/index.ts` to export `machine-payload-parity`.

## Validation
```bash
bunx tsc --noEmit
bun test src/machine-payload-parity.test.ts src/policy-blocker-mapper-output.test.ts src/grace-window-deadline.test.ts src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- typecheck pass,
- targeted suite pass (`40 pass`),
- public surface check remains green.

## Contract guardrails
- no discover/public API schema changes,
- no adapter-specific text coupling,
- comparator now provides deterministic machine-level drift diagnostics for upcoming CI/CLI parity harness integration.
