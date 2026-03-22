# One-Hundred-Twenty-Third Slice Research — Tamper-Resistant First-Seen Provenance Registry Boundary (2026-03-22 03:33 UTC)

## Goal
Freeze a compact boundary for tamper-resistant first-seen provenance in dual-schema cutoff enforcement, covering:
1. registry source-of-truth,
2. spoof-resistance checks,
3. deterministic mismatch reason taxonomy.

## Current-state grounding
- Dual-schema phase evaluator is implemented and deterministic (`prepare`/`warning`/`hard-cutoff`).
- Enforcement plan depends on reliable “first-seen” provenance to distinguish legacy deprecated fixtures from newly added deprecated fixtures.
- Current risk: if first-seen metadata is mutable or cache-stale, deprecated new-addition blocks can be bypassed.

## Boundary definition (v1)

### A) Source-of-truth model
First-seen provenance must come from an immutable or strongly verifiable source, not mutable fixture fields.

Required registry record per fixture:
- `fixtureId`
- `firstSeenCommit`
- `firstSeenSchemaVersion`
- `firstSeenPath`
- `firstSeenContentHash`
- `registryVersion`

Acceptable source derivation approaches:
1. deterministic git-history derivation at build time, or
2. signed/committed registry artifact generated in trusted CI.

Rule:
- inline fixture metadata claiming first-seen provenance is advisory only and never authoritative.

---

### B) Tamper-resistance checks
For each fixture at evaluation time:
1. locate authoritative first-seen record by `fixtureId`,
2. validate registry integrity (hash/signature/policy binding),
3. compare current fixture schema/path/content-hash against provenance constraints.

Required guards:
- fixture ID collision detection (global),
- fixture ID mutation/rename detection,
- first-seen schema downgrade/flip detection,
- registry freshness check against current policy/schema hashes.

Fail closed when:
- record missing for existing fixture under warning/hard-cutoff policy,
- record conflicts with observed fixture identity,
- registry integrity/freshness validation fails.

---

### C) Deprecated new-addition decision logic
Deterministic classification for deprecated-schema fixtures:
- **legacy-allowed (warning phase only):** first-seen schema is deprecated and record predates warning policy boundary.
- **new-deprecated-blocked:** first-seen record absent or indicates first seen during/after warning boundary with deprecated schema.
- **hard-cutoff-blocked:** any deprecated-schema fixture in hard-cutoff phase.

Rule:
- hard-cutoff supersedes legacy allowance.

---

### D) Deterministic mismatch reason taxonomy
Standardize provenance mismatch reason codes:
- `fixture-provenance-record-missing`
- `fixture-provenance-record-conflict`
- `fixture-provenance-id-duplicate`
- `fixture-provenance-id-mutation-detected`
- `fixture-provenance-registry-stale`
- `fixture-provenance-registry-integrity-invalid`
- `fixture-schema-deprecated-new-addition-blocked`
- `fixture-schema-deprecated-hard-cutoff`

Deterministic precedence:
1. registry integrity invalid,
2. registry stale,
3. ID duplicate/mutation,
4. record missing/conflict,
5. hard-cutoff,
6. deprecated new-addition block.

This ensures stable blocker selection and triage ordering.

---

### E) Audit and diagnostics contract
Every enforcement run must output:
- `evaluatedAtUtc`
- `policyPhase`
- `registryVersion`
- `registryHash`
- `blockingFixtureIds[]`
- `primaryReasonCode`

For each blocked fixture (verbose mode):
- `fixtureId`
- `observedSchemaVersion`
- `firstSeenSchemaVersion` (if present)
- `firstSeenCommit` (if present)
- `reasonCode`
- remediation hint (e.g., migration path or provenance registry repair step)

---

### F) CI gating order (provenance branch)
Before semantic/parity comparisons:
1. load and validate provenance registry integrity/freshness,
2. enforce first-seen provenance checks,
3. classify deprecated fixture status (legacy/new/hard-cutoff),
4. block on deterministic provenance/cutoff reason codes,
5. only then continue to semantic/parity stages.

---

## Minimal decision matrix
| Phase | Deprecated fixture | First-seen authoritative record | Result |
|---|---|---|---|
| warning | yes | pre-warning deprecated first-seen | advisory/migrate |
| warning | yes | missing/conflict/new-first-seen | fail (`fixture-schema-deprecated-new-addition-blocked` or provenance reason) |
| hard-cutoff | yes | any | fail (`fixture-schema-deprecated-hard-cutoff`) |
| any | any | registry integrity invalid | fail (`fixture-provenance-registry-integrity-invalid`) |

## Next smallest handoff
Lane E/B follow-up:
1. capture contributor-facing ergonomics for provenance mismatch diagnostics,
2. implement provenance registry loader/validator and mismatch classifier,
3. add deterministic tests for spoof/missing/stale/conflict provenance cases.
