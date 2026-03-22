# One-Hundred-Ninth Slice Learning — CI/CLI Machine-Payload Parity Harness Ergonomics (2026-03-22 02:08 UTC)

## Context
The parity boundary is now defined, but developer workflow quality will decide whether teams preserve strict machine-level parity or drift into ad-hoc adapter behavior. The key challenge is making parity checks strict for machines while keeping human outputs short and actionable.

## Applied learning

### 1) Parity harness should fail on machine drift, not wording drift
If parity checks compare full text output, harmless copy edits trigger noisy failures and teams start bypassing tests.

**Rule:** parity harness must compare canonical machine payload only:
- reason codes,
- ordered secondary list,
- release eligibility,
- normalized state summary,
- unknown-state diagnostics.

Human summary text should be validated only for invariant presence.

### 2) Compact human output needs one blocker and one next action
Verbose parity diagnostics overwhelm operators under pressure.

**Rule:** compact mode shows:
1. primary blocker reason code,
2. release impact (`releaseEligibleByPolicy`),
3. one deterministic next action.

Secondary details remain in machine JSON or verbose mode.

### 3) Secondary truncation must stay explainable
Truncation is useful for readability, but can hide important context if not disclosed.

**Rule:** every truncated response must include:
- `truncated=true`,
- `remainingSecondaryCount`,
- stable ordering preserved from full list.

### 4) Unknown-state diagnostics should be first-class in UX
Unknown-state conditions are integration hazards; burying them in debug logs increases silent policy drift.

**Rule:** when primary blocker is `artifact-policy-state-unknown`, summaries must elevate:
- offending axis/state,
- mapper version,
- explicit remediation pointer.

### 5) CI and CLI should share one formatter core with thin wrappers
Separate formatting stacks quickly diverge, even with shared reason constants.

**Rule:** keep a shared formatting core that both adapters call; wrappers only add transport-specific framing.

### 6) Deterministic fixture naming helps triage speed
Parity failures are easier to diagnose when fixtures communicate the exact state mix.

**Rule:** fixture IDs should encode policy state shape, e.g.:
- `validator-grace-expired_schema-active`
- `validator-unsupported_schema-grace-active`
- `unknown-policy-state-schema`.

### 7) CI failure messages should point to contract location
Without direct pointers, contributors fix symptoms instead of root mapping rules.

**Rule:** parity failure output includes:
- failing fixture ID,
- differing machine field path,
- contract doc/path reference,
- suggested repair target module.

## Immediate implementation guidance
- Build parity harness around canonical JSON comparison of machine payload.
- Add concise summary renderer that preserves invariant lines only.
- Keep strict fail-closed machine checks; optimize operator ergonomics by improving fixture naming and failure pointers, not by loosening parity criteria.
