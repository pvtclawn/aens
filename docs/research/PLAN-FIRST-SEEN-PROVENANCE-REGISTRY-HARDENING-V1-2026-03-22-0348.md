# Plan — First-Seen Provenance Registry Hardening v1 (2026-03-22 03:48 UTC)

## Goal
Freeze a compact implementation plan that makes first-seen provenance enforcement non-bypassable while keeping diagnostics deterministic and contributor-usable.

Focus areas:
1. integrity + freshness verifier,
2. fixture-ID immutability + migration checks,
3. deterministic field-level mismatch diagnostics with remediation mapping.

## Smallest shippable milestone
Ship one thin provenance vertical before semantic/parity stages:
- verify provenance registry integrity/freshness first,
- block on identity/provenance conflicts deterministically,
- emit reason-code-specific diagnostics with explicit fix paths.

## Tasks (1–3) with acceptance criteria

### Task 1 — Provenance integrity + freshness verifier
Implement shared verifier for provenance registry loading/evaluation.

Required checks:
- registry integrity verification (policy-bound hash/signature contract),
- freshness verification against bound inputs:
  - `registryHash`
  - `policyHash`
  - `fixtureBundleHash`
  - schema/version context,
- deterministic fail-closed outcomes.

**Acceptance criteria**
- verifier returns deterministic blocker reason for integrity mismatch,
- verifier returns deterministic blocker reason for stale registry mismatch,
- output includes `registryVersion`, `registryHash`, freshness verdict,
- tests cover valid registry, integrity-fail, freshness-fail paths.

---

### Task 2 — Fixture-ID immutability + migration-record checks
Implement identity consistency checks for first-seen provenance.

Required behavior:
- fixture IDs are immutable once first-seen recorded,
- duplicate fixture ID detection across bundle,
- explicit migration record required for legitimate ID transitions (`oldId -> newId`),
- content/path provenance continuity checks for rename/refactor scenarios.

**Acceptance criteria**
- ID mutation without migration record fails closed,
- duplicate IDs fail with both file paths/records in diagnostics,
- valid migration record path passes with traceable audit metadata,
- tests cover mutation, duplicate, and valid migration cases.

---

### Task 3 — Deterministic mismatch diagnostics + remediation mapping
Define structured diagnostics contract for provenance mismatches.

Required output fields per blocked fixture:
- `fixtureId`
- `reasonCode`
- `mismatchFieldPath`
- `expectedValueSnippet`
- `observedValueSnippet`
- `remediationHint`

Rules:
- reason-code-specific remediation mapping in code (not prose-only),
- compact output shows primary blocker + fixture ID + next action,
- verbose output includes full provenance tuple and decision trace.

**Acceptance criteria**
- diagnostics deterministic across repeated runs,
- same mismatch yields same reason/path/remediation mapping,
- unknown mismatch fields fail closed to explicit catch-all reason,
- tests validate compact + verbose diagnostic invariants.

## Out of scope (v1)
- policy editing automation
- full provenance registry signing infrastructure rollout
- adapter prose localization

## Next lane handoff
Lane B: implement Task 1 only (integrity + freshness verifier module + deterministic reason codes + tests), then run focused suite and public-surface checks.
