# Eighty-Ninth Slice Learning — Strict/Compat Provenance Ergonomics (2026-03-22 00:08 UTC)

## Context
The strict/compat provenance-gating boundary is frozen. The remaining practical risk is operator behavior: if strict mode blocks too abruptly, teams route around it; if compat mode is too convenient, release guarantees get diluted.

## Applied learning

### 1) Compatibility is a migration rail, not a trust tier
`compat` should help users move forward, but it must never look equivalent to strict validation.

**Rule:** treat compat outputs as advisory artifacts with explicit non-release metadata:
- `validationMode=compat`
- `releaseEligible=false`
- `compatWarnings[]` required when deviations were tolerated.

### 2) Release eligibility must be derived, not asserted
Allowing tools/users to directly set `releaseEligible=true` creates spoof surface.

**Rule:** compute release eligibility only from gated predicates in CI:
- strict mode,
- recognized validator/schema versions,
- commit match,
- `status=manifest-valid`.

Never trust a manually provided eligibility flag.

### 3) One command should support both local usability and strict truth
Separate commands for compat and strict can cause accidental wrong-path usage under pressure.

**Rule:** default command should run strict first, then optional compat fallback preview with explicit warning block.

Suggested behavior:
1. strict pass -> success artifact,
2. strict fail + `--allow-compat-preview` -> emit compat advisory + non-release banner,
3. CI forbids compat preview path.

### 4) Provenance fields need anti-ambiguity constraints
If metadata fields are loosely defined, downstream gates can disagree.

**Rule:** lock field shapes tightly:
- `validatedAt`: UTC RFC3339 format,
- `sourceCommit`: full hex commit id,
- `validatorVersion` + `schemaVersion`: exact string match against allowlist.

### 5) Warning volume must not hide release blockers
Large compat warning lists can obscure the single reason release is blocked.

**Rule:** always surface one primary blocker line first:
- `primaryBlockerReasonCode`
- then summarized warning counts by class.

### 6) Human confidence increases when state transitions are explicit
Users often conflate “manifest valid” with “safe to ship.”

**Rule:** always print gate progression line:
`manifest-valid -> execution-verified -> poststate-converged`
with current gate highlighted and future gates marked pending.

## Immediate implementation guidance
- Add typed provenance artifact parser with strict field validation.
- Add release-eligibility evaluator that derives outcome from predicates (not user flags).
- Add CLI output contract with primary blocker + gate progression summary.
- Keep compat pathway available for local migration, but impossible to pass release gate.
