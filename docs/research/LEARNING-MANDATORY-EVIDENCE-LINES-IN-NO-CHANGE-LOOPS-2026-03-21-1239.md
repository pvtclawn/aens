# Learning Note — Mandatory Evidence Lines in No-Change Loops (2026-03-21 12:39 UTC)

## Context
The wait-loop now requires a compact evidence line on every refresh, even when state is unchanged.

## Applied learning

### 1) Evidence lines stop “freshness theater”
Updating timestamps alone can look rigorous while hiding what was actually checked.
A one-line evidence record forces explicit check coverage and outcome.

### 2) No-change becomes auditable progress
When blockers persist, evidence lines still add value:
- they prove checks were rerun,
- they prove decision continuity was intentional,
- they reduce ambiguity at boundary handoff.

### 3) Compact format preserves signal without verbosity
The strict one-line schema captures enough for verification while keeping heartbeat notes lean.

### 4) Evidence lines improve future challenge quality
Red-team/challenge passes become sharper when each refresh has structured, comparable check/outcome lines.

## Reusable rule
For external-blocker refreshes, always include:
1. checks executed,
2. changed/unchanged result,
3. explicit decision state,
4. timestamp.

## Main takeaway
Mandatory evidence lines turn repeated no-change refreshes from “status noise” into verifiable control-loop telemetry.
