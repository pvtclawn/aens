# Plan — First-Seen Provenance Edge Hardening v1 (2026-03-22 04:18 UTC)

## Goal
Freeze a compact implementation plan that hardens first-seen provenance enforcement against edge-case drift and bypass vectors while preserving deterministic, fail-closed behavior.

Focus areas:
1. migration-lineage graph conflict validation,
2. stage-separated freshness -> identity gating,
3. deterministic field-level mismatch diagnostics contract.

## Smallest shippable milestone
Ship one thin provenance-governance vertical that blocks ambiguous lineage states before semantic/parity checks:
- lineage graph validator rejects cycles/conflicts,
- freshness failures short-circuit identity checks,
- mismatch diagnostics remain machine-deterministic and remediation-oriented.

## Tasks (1–3) with acceptance criteria

### Task 1 — Migration-lineage graph validator + conflict precedence
Implement validator for migration records as a deterministic DAG.

Required checks:
- reject cycles in `oldFixtureId -> newFixtureId` lineage,
- reject multi-target conflicts for same `oldFixtureId` within same epoch/window,
- reject duplicate edge definitions,
- deterministic primary reason precedence for lineage failures.

**Acceptance criteria**
- cyclic lineage fails with deterministic reason code and involved fixture IDs,
- conflicting lineage edges fail with deterministic reason code,
- valid acyclic lineage passes and produces stable topological order,
- tests cover cycle/conflict/valid paths and blocker precedence stability.

---

### Task 2 — Stage-separated freshness -> identity gating contract
Enforce strict stage order in provenance enforcement:
1. registry integrity,
2. registry freshness,
3. identity/migration checks.

Rules:
- if freshness fails, identity checks are marked `not-evaluated` (not silently skipped),
- identity blockers are emitted only when freshness stage passes,
- stage markers included in machine output.

**Acceptance criteria**
- freshness failures block downstream identity evaluation deterministically,
- output contains stage status map (`integrity`, `freshness`, `identity`),
- tests verify no identity blocker leakage when freshness fails,
- CI/local adapters consume same stage-order contract.

---

### Task 3 — Deterministic field-level mismatch diagnostics + remediation mapping
Define centralized diagnostics schema for identity/provenance mismatches.

Required fields:
- `fixtureId`
- `reasonCode`
- `mismatchFieldPath`
- `expectedValueSnippet`
- `observedValueSnippet`
- `remediationHint`

Rules:
- reason-code-specific remediation mapping lives in code constants,
- compact output: one primary blocker line + fixture ID + next action,
- verbose output: full mismatch tuple and stage context.

**Acceptance criteria**
- identical mismatch input produces identical diagnostics output across runs,
- unknown mismatch reason maps fail-closed to deterministic fallback reason,
- tests cover compact and verbose invariant fields,
- diagnostics paths align with registry/identity stage where failure occurred.

## Out of scope (v1)
- migration authoring CLI automation
- policy editing workflows
- localization of human-readable summary text

## Next lane handoff
Lane B: implement Task 1 only (migration-lineage graph validator + deterministic conflict/cycle reason codes + tests), then run focused suite and public-surface checks.
