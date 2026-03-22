# One-Hundred-Eighteenth Slice Research — Dual-Schema Cutoff Enforcement Boundary (2026-03-22 03:03 UTC)

## Goal
Freeze a compact boundary for dual-schema cutoff enforcement in fixture schema/versioning rollout, with explicit rules for:
1. warning vs hard-cutoff semantics,
2. deprecated-schema new-fixture block policy,
3. deterministic reason taxonomy.

## Current-state grounding
- Fixture schema/versioning boundary exists and is strict by default.
- Semantic fixture validator now detects state/payload drift before parity.
- Missing piece: explicit lifecycle policy for temporary dual-schema support and deterministic enforcement outcomes.

## Boundary definition (v1)

### A) Dual-schema lifecycle states
A schema pair (`current`, `deprecated`) may coexist only through explicit lifecycle phases:
1. **prepare**: both schemas accepted for existing fixtures; new deprecated fixtures blocked by default.
2. **warning**: deprecated fixtures allowed only if already present before cutoff baseline; additions blocked.
3. **hard-cutoff**: deprecated schema rejected universally.

Required metadata in policy/config:
- `fixtureSchemaCurrent`
- `fixtureSchemaDeprecated` (optional)
- `deprecatedSchemaWarningFrom`
- `deprecatedSchemaCutoffAt`
- `cutoffPolicyVersion`

Rule:
- no implicit dual-schema mode; lifecycle must be explicit and timestamped.

---

### B) Warning vs hard-cutoff semantics

#### Warning phase (`now >= warningFrom` and `< cutoffAt`)
- Existing deprecated fixtures may still validate.
- New deprecated fixtures are blocked.
- Output must include migration warning + cutoff deadline context.

#### Hard-cutoff phase (`now >= cutoffAt`)
- All deprecated-schema fixtures fail closed.
- No grandfathering in blocking parity path.
- Migration required before parity comparison runs.

Rule:
- warning never implies release eligibility; it is migration advisory only.

---

### C) Deprecated-schema new-fixture block policy
To prevent abuse where teams add new deprecated fixtures late in migration:
- maintain deterministic baseline registry (`fixtureId` -> first-seen schema version),
- if a fixture first appears in warning phase with deprecated schema, reject,
- if existing fixture mutates from current -> deprecated, reject.

Deterministic checks:
1. `firstSeenSchemaVersion` must be stable per fixture ID.
2. New fixture IDs must use `fixtureSchemaCurrent` in warning phase.
3. Any deprecated schema fixture added after `warningFrom` gets hard fail in blocking job.

---

### D) Deterministic reason taxonomy
Add/standardize reason codes for cutoff enforcement:
- `fixture-schema-warning-deprecated-present`
- `fixture-schema-deprecated-new-addition-blocked`
- `fixture-schema-deprecated-hard-cutoff`
- `fixture-schema-version-unsupported`
- `fixture-schema-cutoff-policy-invalid`

Deterministic precedence:
1. policy invalid,
2. hard-cutoff violations,
3. deprecated new-addition block,
4. generic unsupported version,
5. warning advisory.

This keeps blocker selection stable across CI and local preflight.

---

### E) CI execution contract
Pipeline ordering for schema cutoff enforcement:
1. load/validate cutoff policy metadata,
2. classify lifecycle phase,
3. enforce deprecated-schema addition/mutation rules,
4. enforce hard-cutoff rejections,
5. emit deterministic reason code + fixture list,
6. only then run semantic/parity stages.

Rule:
- cutoff checks are preconditions; parity stage must not run on unresolved cutoff blockers.

---

### F) Audit output requirements
Every cutoff evaluation should emit:
- `evaluatedAt`
- `cutoffPolicyVersion`
- `lifecyclePhase`
- `deprecatedSchemaDetected` (bool)
- `violatingFixtureIds[]`
- `primaryReasonCode`

Optional advisory fields:
- `cutoffRemainingSeconds` (warning phase)
- `migrationHint`

## Minimal policy matrix
| Phase | Deprecated fixture exists | New deprecated fixture added | Result |
|---|---|---|---|
| prepare | yes | yes | advisory/warn allowed by policy |
| warning | yes (pre-existing) | no | advisory + migrate |
| warning | no (new) | yes | fail (`fixture-schema-deprecated-new-addition-blocked`) |
| hard-cutoff | any | any | fail (`fixture-schema-deprecated-hard-cutoff`) |

## Next smallest handoff
Lane E/B follow-up:
1. capture ergonomics for contributor-facing cutoff messages,
2. implement cutoff policy evaluator with lifecycle classification,
3. add fixture baseline registry checks for new/additional deprecated usage.
