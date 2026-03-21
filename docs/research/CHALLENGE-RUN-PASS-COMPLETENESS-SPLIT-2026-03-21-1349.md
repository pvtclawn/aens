# Challenge — Run/Pass Completeness Split (2026-03-21 13:49 UTC)

## Target challenged
`docs/research/LEARNING-RUN-VS-PASS-COMPLETENESS-SPLIT-2026-03-21-1344.md`

## Why challenge now
Splitting `checks_run` and `checks_pass` is stronger than a single token, but still vulnerable to ambiguous pass criteria and overclaimed pass-state.

## Main blind spots

### 1) Pass token can overclaim success semantics
`checks_pass=4/4` says all checks passed, but does not encode pass thresholds/criteria (e.g., what counts as surface pass).

**Mitigation:** pair pass token with checkset criteria versioning:
- `checkset_version=v1`
- `pass_criteria_ref=<doc/path>`

### 2) Mixed-severity pass outcomes can be flattened
Some checks may pass with warnings/degraded confidence while token still reports full pass.

**Mitigation:** add optional pass-quality marker:
- `pass_quality=clean|warn|degraded`
- `NO-SUBMIT` if degraded touches required blocker checks.

### 3) Token parity can hide stale input windows
`checks_run=4/4` and `checks_pass=4/4` can be true for an earlier window if evidence anchors are copied.

**Mitigation:** require refresh-window uniqueness:
- evidence anchor must include current refresh timestamp and be compared against `marker_updated_at`.

### 4) Run/pass split can still ignore dependency readiness
All local checks may pass while external required assets remain missing; token success may be misread as submit readiness.

**Mitigation:** keep explicit decision precedence:
- required asset blockers dominate (`NO-SUBMIT`) regardless of run/pass pass-state.

## Red-team verdict
Run/pass split improves telemetry, but needs criteria linkage, pass-quality nuance, refresh-window anchoring, and explicit blocker precedence to avoid overconfidence.

## Stronger rule (proposed)
Treat run/pass completeness as valid for boundary interpretation only when accompanied by:
1. criteria reference,
2. pass-quality marker,
3. refresh-window anchor linkage,
4. explicit blocker-precedence decision rule.
