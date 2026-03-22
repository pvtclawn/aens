# One-Hundred-Thirty-First Slice Build — Migration-Lineage Graph Validator (2026-03-22 04:23 UTC)

## Goal
Implement Task 1 from `PLAN-FIRST-SEEN-PROVENANCE-EDGE-HARDENING-V1-2026-03-22-0418.md`:
- migration-lineage graph validator,
- deterministic cycle/conflict blocker reason precedence,
- focused tests.

## Changes shipped

### 1) New migration-lineage validator module
Added `src/migration-lineage-graph.ts`:
- `validateMigrationLineageGraph(records)`
- deterministic issue model with reason codes:
  - `fixture-provenance-id-migration-cycle-detected`
  - `fixture-provenance-id-migration-conflict`
- normalization and validation of migration records,
- conflict detection:
  - duplicate edge detection,
  - multi-target old-ID conflict detection,
- cycle detection on normalized lineage graph,
- deterministic issue sorting and blocker selection.

### 2) Deterministic blocker precedence
Implemented fixed precedence:
1. cycle detected,
2. conflict.

Output includes:
- `primaryBlockerReasonCode`
- `secondaryBlockerReasonCodes`
- deterministic ordered `issues[]`.

### 3) Focused tests
Added `src/migration-lineage-graph.test.ts` covering:
- acyclic happy path,
- deterministic conflict detection,
- deterministic cycle detection,
- mixed cycle+conflict input with stable primary/secondary reason ordering.

### 4) Export surface update
Updated `src/index.ts` to export `migration-lineage-graph`.

## Validation
```bash
bunx tsc --noEmit
bun test src/migration-lineage-graph.test.ts src/first-seen-provenance-registry.test.ts src/dual-schema-cutoff-phase.test.ts src/parity-fixture-semantic-consistency.test.ts src/machine-payload-parity.test.ts src/policy-blocker-mapper-output.test.ts src/grace-window-deadline.test.ts src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

## Contract guardrails
- no discover/public API schema changes,
- no migration-record storage/authoring automation in this slice,
- deterministic lineage conflict/cycle blocker semantics now codified for downstream freshness->identity gate integration.
