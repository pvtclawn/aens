# One-Hundred-Thirty-Eighth Slice Learning — Reason→Stage Ownership Diagnostics Ergonomics (2026-03-22 08:22 UTC)

## Context
Reason-stage ownership boundary is now frozen. The next reliability risk is not the mapping concept itself, but operator interpretation under failure (`unmapped`, `mismatch`) across compact and verbose surfaces.

## Applied learning

### 1) Unknown-code failures need explicit ownership-state labels, not generic contract errors
When operators only see “contract invalid,” they cannot tell if the issue is missing registry entry vs malformed payload.

**Rule:** include explicit ownership status in machine output:
- `stageOwnerResolutionStatus: unmapped | mismatch | resolved`
- `resolvedPrimaryStageOwner` only when status is `resolved`

This preserves deterministic triage without guessing.

### 2) Compact output should keep one-line clarity, but must encode ownership failure class
Compact output can stay terse if it carries the failure class directly.

**Rule:** compact line order for ownership failures:
1. primary blocker reason,
2. ownership status token (`unmapped`/`mismatch`),
3. one remediation hint.

Avoid dumping full registry data in compact mode.

### 3) Mismatch diagnostics should report both claimed and canonical stage owners
A mismatch without both values turns debugging into speculation.

**Rule:** verbose diagnostics must include:
- `claimedStageOwner`,
- `canonicalStageOwner`,
- `reasonCode`,
- registry version/hash context.

This creates reproducible adapter parity diffs.

### 4) Remediation hints should be failure-class specific and minimal
Operators need the next action, not policy prose.

**Rule:**
- `unmapped` -> “add reason to canonical registry before emitting it,”
- `mismatch` -> “align emitted stage with canonical owner from registry,”
- keep hints single-step and deterministic.

### 5) Registry provenance fields are only useful if stable across surfaces
If CLI and CI show different registry version/hash metadata, trust erodes quickly.

**Rule:** all surfaces must reuse shared formatter primitives for:
- `reasonStageRegistryVersion`,
- `reasonStageRegistryHash` (if available),
- ownership status tokens.

### 6) Fail-closed behavior needs a non-overridable precedence slot
Ownership resolution errors should not be buried under downstream stage-specific blockers.

**Rule:** ownership resolution failures must preempt stage-specific blocker rendering and become the primary blocker source for that run.

### 7) Optional diagnostics should remain non-breaking but still test-locked
Backward compatibility and deterministic trust can coexist if optional fields are contract-tested.

**Rule:** add parity tests asserting optional ownership diagnostics, when present, are schema-valid and deterministic; absence must not alter existing discover/public-surface contracts.

## Immediate implementation guidance
- Add shared ownership-diagnostic formatter primitives (compact + verbose).
- Add tests for unmapped/mismatch rendering determinism and remediation hint correctness.
- Keep ownership failure precedence explicit and fail-closed before stage-level adapter rendering.