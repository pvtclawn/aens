# One-Hundred-Thirteenth Slice Research — Deterministic Fixture Schema/Versioning Boundary (2026-03-22 02:28 UTC)

## Goal
Freeze a compact boundary for deterministic fixture schema/versioning in the CI/CLI parity harness, with explicit rules for:
1. canonical fixture fields,
2. schema-version mismatch fail-closed semantics,
3. migration policy.

## Current-state grounding
- Canonical machine payload comparator is implemented (`src/machine-payload-parity.ts`).
- Shared blocker reason registry + mapper output schema exists (`policy-blocker-reason-codes`, `policy-blocker-mapper-output`).
- Missing piece: deterministic, versioned fixture contract that prevents volatile fixture drift and ambiguous schema transitions.

## Boundary definition (v1)

### A) Canonical fixture fields (required)
Each parity fixture must include exactly these top-level fields:
- `fixtureId` (string; deterministic, state-encoded)
- `fixtureSchemaVersion` (string; fixture contract version)
- `mapperSchemaVersion` (string; expected mapper output contract version)
- `inputState` (normalized state payload for mapper)
- `expectedMachinePayload` (canonical machine payload contract)

Optional diagnostic field:
- `notes` (string; advisory only, excluded from parity comparison)

Rules:
- unknown top-level fields are rejected in strict mode,
- missing required fields are hard-fail,
- fixture IDs must be unique across the fixture set.

---

### B) Canonical `inputState` shape
`inputState` must be normalized and deterministic (no raw policy blobs).

Required fields:
- `validatorVersionState`
- `schemaVersionState`

Optional fields (only when relevant):
- `secondaryStates` (deterministic array)
- `unknownState` diagnostics source fields used to trigger fail-closed path tests.

Rules:
- no timestamps/random identifiers in `inputState`,
- arrays must be deterministic and semantically ordered,
- unsupported state values fail at fixture-parse phase.

---

### C) Canonical `expectedMachinePayload` shape
`expectedMachinePayload` must map to shared mapper contract fields:
- `primaryBlockerReasonCode`
- `secondaryBlockerReasonCodes`
- `releaseEligibleByPolicy`
- `stateSummary`
- optional `unknownState`

When truncation mode fixtures are used, required metadata fields:
- `truncated`
- `remainingSecondaryCount`

Rules:
- payload is canonicalized before comparison,
- textual summaries are forbidden in fixture payloads,
- reason codes must come from central registry only.

---

### D) Schema-version mismatch fail-closed semantics
Two independent version checks are required:
1. fixture schema compatibility (`fixtureSchemaVersion`)
2. mapper contract compatibility (`mapperSchemaVersion`)

Fail-closed behavior:
- unsupported fixture schema => `fixture-schema-version-unsupported`
- mapper version mismatch => `fixture-mapper-version-mismatch`
- mixed-version fixture bundle => `fixture-bundle-version-inconsistent`

Rules:
- no permissive fallback to latest schema,
- no silent version coercion,
- CI blocks on any version mismatch in blocking parity job.

---

### E) Migration policy (versioned and explicit)
Schema evolution must be intentional and reviewable.

Migration rules:
1. additive/non-breaking fixture changes stay in same `fixtureSchemaVersion` with updated fixture validator tests.
2. breaking fixture-shape changes require new `fixtureSchemaVersion` and migration fixtures.
3. mapper output contract changes require `mapperSchemaVersion` bump and compatibility matrix update.
4. one transition window may allow dual fixture schema support, but only with explicit deprecation deadline.

Required migration artifacts:
- changelog note (`what changed / why / migration steps`),
- old+new fixture conformance tests,
- explicit removal date for deprecated fixture schema support.

---

### F) Deterministic fixture naming policy
Fixture IDs should encode state composition to speed diagnosis:
- `validator-grace-expired_schema-active`
- `validator-unsupported_schema-grace-active`
- `policy-unknown-state`
- `truncation-secondary-3plus`

Rules:
- no ephemeral suffixes (timestamps/random tokens),
- fixture ID lexical ordering used for deterministic test iteration.

---

### G) CI enforcement contract
Parity CI job must:
1. validate fixture schema/versions before running adapter comparisons,
2. stop early on fixture contract violations,
3. emit deterministic failure reason code + fixture ID + field path.

Failure taxonomy extension (fixture branch):
- `fixture-schema-invalid`
- `fixture-schema-version-unsupported`
- `fixture-mapper-version-mismatch`
- `fixture-bundle-version-inconsistent`
- `fixture-id-duplicate`

## Minimal fixture schema matrix
| Case | fixtureSchemaVersion | mapperSchemaVersion | Expected result |
|---|---|---|---|
| valid active fixture | v1 | v1 | pass |
| unknown fixture schema | v2 (unsupported) | v1 | fail (`fixture-schema-version-unsupported`) |
| mapper mismatch | v1 | v2 (unsupported) | fail (`fixture-mapper-version-mismatch`) |
| mixed bundle versions | v1 + v2 | v1 | fail (`fixture-bundle-version-inconsistent`) |

## Next smallest handoff
Lane E/B follow-up:
1. capture fixture-schema ergonomics notes for contributor workflows,
2. implement fixture schema validator + version checks,
3. add CI fixture-parse gate before parity comparison stage.
