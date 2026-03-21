# Plan — Chain-First Source Labels + Write-Intent + Paired Verification v1 (2026-03-21 22:48 UTC)

## Goal
Freeze a compact implementation plan that hardens chain-first trust boundaries for the next build slice:
1) runtime source-label contract in UI,
2) dogfooding write-intent manifest schema,
3) paired deterministic/live verification template.

## Smallest shippable milestone
Ship one thin vertical that makes trust provenance explicit without changing discover API schema:
- UI displays data-source labels bound to runtime result metadata,
- operator workflow has explicit write-intent artifact,
- verification output always shows deterministic + live sections side-by-side.

## Tasks (1–3) with acceptance criteria

### Task 1 — Source-label contract (runtime-bound, not copy-bound)
Define a source enum and plumb it through discovery UI render path.

Proposed source values:
- `demo-fixture`
- `live-chain-direct`
- `live-chain-via-service`

**Acceptance criteria**
- UI result card always displays one source label derived from runtime value.
- Example mode renders `demo-fixture`; live resolver path renders `live-chain-direct`.
- Unknown source value fails closed (shows explicit warning state, not silent default).
- Tests assert label mapping and fail on accidental fallback to static text.

---

### Task 2 — Write-intent manifest schema (dogfooding publication)
Define a compact machine-readable manifest for intended ENS updates prior to execution.

Required fields (v1):
- `schemaVersion`
- `timestamp`
- `rootName`
- `capabilityName`
- `targetRecords` (key/value pairs)
- `expectedPostState` (minimum: expected reason/status + endpoint URL)
- `operatorNotes`

**Acceptance criteria**
- Schema doc exists with required/optional fields and one valid example.
- Manifest validator (or strict parser) rejects missing required fields.
- Publish flow docs require manifest generation before execution step.

---

### Task 3 — Paired deterministic/live verification template
Define one report template that always separates contract proof from live truth.

Sections:
1. deterministic fixture matrix,
2. live chain probe snapshot,
3. explicit mismatch/convergence statement.

**Acceptance criteria**
- Template doc is added and referenced by submission/demo docs.
- Verification checklist forbids reporting deterministic results without live probe section.
- Reason semantics in report are coupled to `reasonSchemaVersion` and include schema value.

## Out of scope (v1)
- direct ENS write automation in production
- API contract changes
- full multi-tenant frontend redesign

## Next lane handoff
Lane B: implement Task 1 only (runtime source-label contract + minimal tests) with no API schema changes and existing discover behavior preserved.
