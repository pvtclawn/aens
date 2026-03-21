# Learning Note — Severity + Freshness Beats Window Count (2026-03-21 12:04 UTC)

## Context
With hardened markers in place, wait-loop status now carries explicit severity (`NO-SUBMIT`) and freshness (`marker_updated_at`) alongside `windows_elapsed`.

## Applied learning

### 1) `windows_elapsed` is context, not clearance
A low/zero window count can look reassuring, but it says nothing about whether blockers are gone.
Only asset presence/integrity can clear the gate.

### 2) Explicit severity prevents false calm
`decision_severity: NO-SUBMIT` anchors interpretation and prevents "still early, probably fine" thinking when required assets are still missing.

### 3) Freshness timestamps preserve trust in no-change loops
`marker_updated_at` proves the boundary state was checked recently, not inherited from stale context.

### 4) Marker combinations beat single metrics
The useful interpretation comes from the set:
- severity,
- freshness,
- blocker fields,
- reminder/ack state,
not from any single marker value.

## Reusable rule
In external-asset wait loops, treat this as the minimum high-signal set:
1. explicit severity,
2. fresh marker timestamp,
3. current blocker fields,
4. clear decision line.

## Main takeaway
For submission readiness, "how long" is secondary; "blocked or not, and freshly verified" is the real control signal.
