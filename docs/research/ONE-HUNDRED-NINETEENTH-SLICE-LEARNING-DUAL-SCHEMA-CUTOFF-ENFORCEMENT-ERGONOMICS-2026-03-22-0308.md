# One-Hundred-Nineteenth Slice Learning — Dual-Schema Cutoff Enforcement Ergonomics (2026-03-22 03:08 UTC)

## Context
Dual-schema cutoff boundaries are now defined (`prepare` / `warning` / `hard-cutoff`). The implementation risk is contributor behavior under deadline pressure: if warning/hard-cutoff output is ambiguous, teams either panic-edit fixtures or attempt bypasses.

## Applied learning

### 1) Warning vs hard-cutoff must be unmistakable in first line
If both modes use similar language (“deprecated schema detected”), contributors may misjudge urgency.

**Rule:** first-line status banner must encode phase explicitly:
- `phase=warning` with migration deadline,
- `phase=hard-cutoff` with release-block statement.

No generic combined wording.

### 2) Contributor remediation must be phase-specific
A single generic hint (“upgrade fixture schema”) is too coarse and slows resolution.

**Rule:** remediation text differs by phase:
- warning: “migrate existing deprecated fixtures before cutoff; new deprecated fixtures blocked now,”
- hard-cutoff: “deprecated fixtures rejected; migration required before any parity stage.”

### 3) New deprecated fixture detection needs provenance clarity
Without “first-seen” context, contributors may not understand why one deprecated fixture passes (legacy) while another fails (new addition).

**Rule:** warning-phase failures should include deterministic context fields:
- `fixtureId`
- `firstSeenAt`/`firstSeenSchemaVersion`
- `detectedSchemaVersion`
- `policyPhase`

This avoids perceived arbitrariness.

### 4) Cutoff countdown should be visible but non-spammy
Hidden deadlines cause surprise breakage; noisy countdown logs cause alert fatigue.

**Rule:** show countdown only at meaningful thresholds (e.g., <7d, <72h, <24h) and include exact UTC cutoff.

### 5) CI and local preflight must agree on phase computation
If local tools compute phase differently from CI (timezone or clock drift), contributors lose trust in guidance.

**Rule:** phase computation uses UTC and deterministic evaluator logic in shared module; both CI and local command consume identical function.

### 6) Blocking order should minimize wasted work
If parity runs before cutoff rejection, logs get noisy and obscure the real blocker.

**Rule:** keep enforced gate order strict:
1. policy validity,
2. phase evaluation,
3. deprecated-schema cutoff checks,
4. semantic checks,
5. parity checks.

### 7) Migration windows should reward early cleanup
Teams respond better when warnings show progress toward zero deprecated fixtures.

**Rule:** warning output should include a concise progress metric:
- `deprecatedFixturesRemaining`
- optional trend vs previous run.

This improves behavior without relaxing policy.

## Immediate implementation guidance
- Add shared phase-status formatter with explicit warning/hard-cutoff banners.
- Include first-seen provenance fields in deprecated-new-addition failures.
- Keep strict fail-closed cutoff semantics unchanged; improve only signal clarity and deterministic remediation paths.
