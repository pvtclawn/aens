# One-Hundred-Third Slice Research — Deterministic Blocker-Precedence Mapper Boundary (2026-03-22 01:33 UTC)

## Goal
Freeze a compact boundary for deterministic blocker-precedence mapping over grace-window policy states, with:
1. primary/secondary ordering invariants,
2. shared reason-code mapping contract for CI/CLI outputs.

## Current-state grounding
- Grace deadline formatter is now shared and deterministic (`src/grace-window-deadline.ts`).
- Policy and provenance core logic exist, but blocker selection rules for mixed policy states are still distributed across docs rather than codified in a single mapper contract.
- Risk: CI and CLI can drift in how they choose/summarize primary blockers under the same state inputs.

## Boundary definition (v1)

### A) Canonical policy-state inputs
Mapper operates on normalized per-axis state (validator + schema):
- `active`
- `grace-active`
- `grace-expired`
- `unsupported`
- `policy-invalid` (structural invalidity / duplicate/invalid grace entries)

Optional contextual fields:
- `expiresAt`
- `graceRemainingSeconds`
- `evaluatedAt`

Rule:
- state normalization occurs before precedence mapping; mapper never receives raw policy JSON.

---

### B) Deterministic precedence invariants
Primary blocker selection order (highest severity first):
1. `policy-invalid`
2. any `grace-expired`
3. any `unsupported`
4. any `grace-active` (non-release)
5. no blocker (`active` only)

Secondary blocker ordering invariants:
- same severity group ordered deterministically by axis (`validator` before `schema`),
- tie-break by reason-code lexical order when needed,
- no duplicates in secondary list.

This guarantees identical inputs produce identical primary + secondary blocker lists.

---

### C) Shared reason-code mapping contract (CI + CLI)
Define one reason-code table consumed by both CI and CLI adapters.

Required mapping (minimum):
- `policy-invalid` -> `artifact-policy-grace-entry-invalid`
- `validator.grace-expired` -> `artifact-validator-version-grace-expired`
- `schema.grace-expired` -> `artifact-schema-version-grace-expired`
- `validator.unsupported` -> `artifact-validator-version-unsupported`
- `schema.unsupported` -> `artifact-schema-version-unsupported`
- `validator.grace-active` -> `artifact-validator-version-grace-active-nonrelease`
- `schema.grace-active` -> `artifact-schema-version-grace-active-nonrelease`

Rule:
- CI and CLI must not define parallel freeform reason labels; they map from shared constants only.

---

### D) Output contract shape
Mapper output should be machine-first with concise summary support:
- `primaryBlockerReasonCode: string | null`
- `secondaryBlockerReasonCodes: string[]`
- `releaseEligibleByPolicy: boolean`
- `stateSummary: { validatorVersionState, schemaVersionState }`

Optional diagnostics:
- `precedenceTrace` (debug/verbose mode only)

Release eligibility policy result:
- `true` only when both axes are `active` and no policy-invalid state exists.

---

### E) CI/CLI adapter invariants
Both adapters must preserve mapper semantics:
1. primary blocker reason code unchanged,
2. secondary list ordering unchanged,
3. `releaseEligibleByPolicy` unchanged,
4. non-release banner for `grace-active` derived from mapper output (not ad-hoc heuristics).

Adapter rule:
- human wording can vary, but machine reason-code output must be exact and stable.

---

### F) Fail-closed behavior
If mapper receives unknown/unsupported normalized state:
- primary blocker => `artifact-policy-state-unknown`
- `releaseEligibleByPolicy=false`
- include diagnostic pointer to offending axis/state.

This prevents silent pass on taxonomy drift.

## Minimal deterministic matrix
| Validator | Schema | Primary blocker | Release eligible |
|---|---|---|---|
| active | active | null | true |
| grace-active | active | `artifact-validator-version-grace-active-nonrelease` | false |
| grace-expired | grace-active | `artifact-validator-version-grace-expired` | false |
| unsupported | grace-expired | `artifact-schema-version-grace-expired` (higher precedence than unsupported when schema expired) | false |
| policy-invalid | active | `artifact-policy-grace-entry-invalid` | false |

## Next smallest handoff
Lane E/B follow-up:
1. capture mapper ergonomics learning for CI/CLI messaging consistency,
2. implement centralized blocker-precedence mapper constants + function,
3. add deterministic tests for primary/secondary ordering and unknown-state fail-closed path.
