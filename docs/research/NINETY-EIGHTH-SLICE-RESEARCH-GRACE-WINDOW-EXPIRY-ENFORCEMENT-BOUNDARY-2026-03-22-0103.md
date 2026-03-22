# Ninety-Eighth Slice Research — Grace-Window Expiry Enforcement Boundary (2026-03-22 01:03 UTC)

## Goal
Freeze a compact boundary for provenance-policy grace-window expiry enforcement, covering:
1. expiry semantics,
2. advisory vs release behavior,
3. deterministic fail-closed reason taxonomy.

## Current-state grounding
- Canonical policy loader is implemented (`src/provenance-policy.ts`) with typed grace entries (`version`, `expiresAt`) and strict timestamp parsing.
- Provenance gate core exists (`src/provenance-gate.ts`) but does not yet evaluate policy grace-window lifecycle outcomes.
- Allowlist governance boundaries are documented; operational expiry enforcement remains to be codified.

## Boundary definition (v1)

### A) Expiry semantics (authoritative)
For a candidate version (validator or schema), evaluate in this order:
1. if in `active` => state `active`,
2. else if in `grace` and `now <= expiresAt` => state `grace-active`,
3. else if in `grace` and `now > expiresAt` => state `grace-expired`,
4. else => state `unsupported`.

Rules:
- `expiresAt` is mandatory for every grace entry.
- timestamp comparison uses UTC instant semantics (no local-time interpretation).
- duplicate grace entries for same version are invalid unless explicitly versioned by policy format.

---

### B) Advisory vs release behavior
Grace state must never blur release eligibility semantics.

Required behavior matrix:
- `active`:
  - release gate: potentially eligible (subject to other strict predicates)
  - advisory: none required
- `grace-active`:
  - release gate: **not eligible** by default in strict release mode
  - advisory: explicit migration warning + expiry deadline required
- `grace-expired`:
  - release gate: hard fail
  - advisory: include expiry overrun duration
- `unsupported`:
  - release gate: hard fail
  - advisory: include remediation hint (policy update path)

Rule:
- grace may assist local migration workflows, but release pathways remain strict and non-release for grace versions unless policy explicitly elevates state with documented governance change.

---

### C) Deterministic fail-closed reason taxonomy
Standardize blocker reason codes for version-state failures:
- `artifact-validator-version-grace-active-nonrelease`
- `artifact-validator-version-grace-expired`
- `artifact-validator-version-unsupported`
- `artifact-schema-version-grace-active-nonrelease`
- `artifact-schema-version-grace-expired`
- `artifact-schema-version-unsupported`
- `artifact-policy-grace-entry-invalid` (missing/invalid expiry, duplicates)

Deterministic precedence order:
1. policy-entry validity (`artifact-policy-grace-entry-invalid`),
2. expired grace,
3. unsupported,
4. grace-active non-release.

This prevents inconsistent blocker selection under multiple simultaneous issues.

---

### D) Output/audit requirements
Every gate evaluation should emit:
- `versionState` per axis (`validatorVersionState`, `schemaVersionState`),
- `evaluatedAt` UTC timestamp,
- `graceExpiresAt` when applicable,
- `graceRemainingSeconds` (non-negative for active grace),
- `primaryBlockerReasonCode`.

This enables deterministic troubleshooting and policy-aging telemetry.

---

### E) Policy hygiene constraints
To avoid grace-policy drift:
1. policy linter rejects grace entries without valid UTC expiry,
2. policy linter rejects duplicate grace entries per version,
3. CI must fail if `grace-expired` entry remains in policy beyond optional tolerated staleness window (if configured),
4. policy updates must include migration note when adding grace entries.

## Minimal evaluation matrix
| Version state | Release gate | Advisory output | Reason code |
|---|---|---|---|
| active | pass-eligible | optional | null |
| grace-active | fail (non-release) | migration warning + deadline | `*-grace-active-nonrelease` |
| grace-expired | fail | expiry overrun details | `*-grace-expired` |
| unsupported | fail | policy update hint | `*-unsupported` |

## Next smallest handoff
Lane E/B follow-up:
1. capture ergonomics learning for grace-window UX in CI output,
2. implement version-state evaluator using this taxonomy,
3. add deterministic tests for state precedence and advisory metadata fields.
