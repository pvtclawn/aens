# Learning Note — Run vs Pass Completeness Split (2026-03-21 13:44 UTC)

## Context
Evidence-line hardening v3 separates `checks_run` from `checks_pass` in no-change refresh lines.

## Applied learning

### 1) Running checks is not equivalent to passing checks
A single completeness token can blur this distinction. Split tokens make intent explicit:
- `checks_run` proves scope execution,
- `checks_pass` proves decision-quality readiness.

### 2) Split tokens reduce false confidence in “unchanged” states
`result=unchanged` is meaningful only if checks both ran and passed. The split prevents “all checks attempted” from being mistaken as “all checks successful.”

### 3) Split tokens improve post-hoc diagnostics
When a future refresh fails, the split helps isolate whether failure came from missing execution coverage or failing checks inside full coverage.

### 4) Split tokens pair naturally with blocker state
In wait loops, high-signal interpretation becomes:
`run completeness + pass completeness + blocker snapshot + decision`.

## Reusable rule
For no-change external-blocker refreshes:
- never allow a decision line without both run and pass completeness tokens.
- treat either incomplete token as an invalid refresh for boundary decisions.

## Main takeaway
Separating run-completeness from pass-completeness makes no-change telemetry more truthful: it distinguishes procedural coverage from actual decision safety.
