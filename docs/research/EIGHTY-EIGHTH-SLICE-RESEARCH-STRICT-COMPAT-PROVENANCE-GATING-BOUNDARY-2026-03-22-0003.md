# Eighty-Eighth Slice Research — Strict/Compat Provenance-Gating Boundary (2026-03-22 00:03 UTC)

## Goal
Freeze a compact boundary for strict/compat provenance gating of validator artifacts so release claims cannot be made from relaxed local validation outputs.

## Current-state grounding
- Deterministic issue prioritization is now implemented (`src/write-intent-validation-issues.ts`).
- Manifest hash discipline is implemented (`src/write-intent-hash.ts`).
- No validator artifact provenance contract exists yet (no explicit `validationMode` stamp in a release gate path).

## Boundary definition (v1)

### A) Artifact metadata contract (required)
Every validator artifact must carry machine-readable provenance metadata:
- `validationMode`: `strict` | `compat`
- `validatorVersion`: semantic version string
- `schemaVersion`: manifest schema id
- `validatedAt`: ISO-8601 UTC
- `sourceCommit`: git commit hash used for validation
- `status`: `manifest-valid` | `manifest-invalid`

Optional but recommended:
- `profile`: e.g. `ci-release`, `local-dev`
- `compatWarnings`: string[] (required when mode=`compat` and warnings exist)

Rule:
- missing metadata => artifact is non-release by default.

---

### B) CI release policy (strict-only)
Release/merge-proof paths must enforce strict provenance:
1. `validationMode` MUST be `strict`
2. `status` MUST be `manifest-valid`
3. `validatorVersion` and `schemaVersion` MUST be recognized
4. `sourceCommit` MUST match current CI commit (or explicit allowlist policy)

Failure behavior:
- any mismatch => hard fail with machine reason code (`artifact-provenance-invalid`)
- compat artifacts are always rejected for release claims.

---

### C) Compat mode semantics (local/migration only)
Compat mode exists to reduce migration breakage, not to authorize release decisions.

Required semantics:
- compat output MUST include explicit non-release banner/flag:
  - `releaseEligible=false`
  - `compatWarning=true`
- compat can emit `manifest-valid` only in local context, but MUST NOT imply any higher gate (`execution-verified` or `poststate-converged`).
- compat artifacts should carry `compatWarnings` payload describing tolerated deviations.

---

### D) Three-gate status interaction
Provenance gating must align with status gates:
1. validator may attest `manifest-valid` only,
2. execution subsystem may attest `execution-verified`,
3. verification subsystem may attest `poststate-converged`.

Rule:
- strict-mode provenance is necessary but not sufficient for convergence claims.
- no component may escalate directly from `manifest-valid` to `poststate-converged`.

---

### E) Fail-closed reason taxonomy (provenance branch)
Add/standardize reason codes for provenance failures:
- `artifact-provenance-missing`
- `artifact-provenance-invalid`
- `artifact-mode-not-release-eligible`
- `artifact-validator-version-unsupported`
- `artifact-schema-version-unsupported`
- `artifact-source-commit-mismatch`

## Minimal policy matrix
| Context | Allowed mode | Release eligible | Required output |
|---|---|---|---|
| Local dev | strict, compat | no (default) | metadata + warnings when compat |
| Local preflight (manual) | strict, compat | no | metadata + explicit banner |
| CI PR checks | strict preferred, compat allowed for advisory lane only | no | must label advisory vs blocking |
| CI release/main gate | strict only | yes (if status valid) | strict metadata + commit/version checks |

## Next smallest handoff
Lane E/B follow-up should implement:
1. typed artifact metadata schema,
2. provenance-gate evaluator with fail-closed reason codes,
3. CI check script that rejects non-strict release artifacts.
