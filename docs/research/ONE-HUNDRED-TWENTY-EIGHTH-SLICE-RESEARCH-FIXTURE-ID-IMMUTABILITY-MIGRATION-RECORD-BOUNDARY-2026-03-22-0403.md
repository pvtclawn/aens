# One-Hundred-Twenty-Eighth Slice Research — Fixture-ID Immutability + Migration-Record Boundary (2026-03-22 04:03 UTC)

## Goal
Freeze a compact boundary for fixture identity continuity in first-seen provenance enforcement, covering:
1. fixture-ID immutability rules,
2. explicit migration-record handling,
3. deterministic mutation/duplicate reason taxonomy.

## Current-state grounding
- First-seen registry integrity/freshness verifier is implemented.
- Dual-schema phase classification is implemented and deterministic.
- Remaining gap: explicit, enforceable rules for fixture-ID continuity and legitimate ID transitions.

## Boundary definition (v1)

### A) Fixture identity model
Fixture identity in blocking provenance path is defined as:
- `fixtureId` (primary identity key),
- `firstSeenSchemaVersion`,
- `firstSeenContentHash`,
- `firstSeenPath` (contextual, not sole identity).

Rule:
- `fixtureId` is immutable once first-seen recorded unless an explicit migration record is present.

---

### B) Immutability rules
For every fixture in evaluation bundle:
1. if `fixtureId` exists in provenance registry, it must resolve to exactly one first-seen record,
2. if current fixture content/path/schema diverges from expected continuity constraints without migration, fail,
3. adding a duplicate `fixtureId` in same bundle is immediate hard fail.

Continuity checks (without migration):
- schema evolution allowed only by policy (not by silent ID reassignment),
- path changes allowed if ID and content continuity policy permits,
- content-hash drift must not imply hidden identity replacement.

---

### C) Migration-record contract (explicit and auditable)
Legitimate ID transitions require migration record with required fields:
- `oldFixtureId`
- `newFixtureId`
- `migrationCommit`
- `migrationReason`
- `approvedBy`
- `effectiveAt`
- optional `contentContinuityHash` / mapping hints

Rules:
- migration records are append-only,
- each `oldFixtureId` can map forward once per migration epoch,
- migration must preserve audit trace from old to new identity.

Validation behavior:
- missing required migration fields => fail closed,
- cyclic or conflicting ID mappings => fail closed,
- migration applied outside allowed policy phase => fail closed.

---

### D) Rename/path-change handling
Path-only changes are not identity changes by default.

Rules:
- if `fixtureId` unchanged and provenance continuity checks pass, rename is allowed with audit note,
- if `fixtureId` changes, migration record is mandatory even when content hash is identical,
- identical content under new ID without migration is treated as mutation bypass attempt.

---

### E) Deterministic mismatch reason taxonomy
Standardize identity/migration reason codes:
- `fixture-provenance-id-duplicate`
- `fixture-provenance-id-mutation-detected`
- `fixture-provenance-id-migration-record-missing`
- `fixture-provenance-id-migration-record-invalid`
- `fixture-provenance-id-migration-conflict`
- `fixture-provenance-record-conflict`

Precedence order:
1. duplicate ID,
2. migration record invalid/conflict,
3. mutation detected,
4. migration record missing,
5. generic record conflict.

This keeps primary blocker selection deterministic under mixed identity issues.

---

### F) Reporting contract for identity failures
Blocking diagnostics must include:
- `fixtureId`
- `reasonCode`
- `mismatchFieldPath`
- `expectedValueSnippet`
- `observedValueSnippet`
- `migrationHint`
- optional migration context (`oldFixtureId`, `newFixtureId`, `migrationCommit`).

Compact mode:
- one-line blocker with fixture ID + reason code + next action.

Verbose mode:
- full identity lineage and migration decision trace.

---

### G) CI gate ordering (identity branch)
Before semantic/parity stages:
1. verify registry integrity/freshness,
2. enforce fixture-ID uniqueness and immutability,
3. validate migration records and lineage consistency,
4. classify identity blockers with deterministic reason precedence,
5. only then proceed to semantic/parity checks.

---

## Minimal decision matrix
| Scenario | Migration record | Result |
|---|---|---|
| same ID, same lineage, allowed drift | n/a | pass |
| same ID appears twice in bundle | n/a | fail (`fixture-provenance-id-duplicate`) |
| new ID replacing old without migration | missing | fail (`fixture-provenance-id-migration-record-missing`) |
| new ID with malformed migration record | invalid | fail (`fixture-provenance-id-migration-record-invalid`) |
| new ID with valid migration lineage | valid | pass (with migration trace) |

## Next smallest handoff
Lane E/B follow-up:
1. capture contributor-facing ergonomics for migration-record authoring and review,
2. implement identity immutability + migration-record validator,
3. add deterministic tests for duplicate/mutation/migration-valid/migration-invalid paths.
