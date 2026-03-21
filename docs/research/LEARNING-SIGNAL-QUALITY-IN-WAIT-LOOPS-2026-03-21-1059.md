# Learning Note — Signal Quality in Repeated Wait-Loop Refreshes (2026-03-21 10:59 UTC)

## Context
When required external assets remain missing for multiple refresh cycles, the main risk shifts from technical failure to operator-fatigue noise.

## Applied learning

### 1) Keep each refresh binary and evidence-backed
A refresh should answer one question only: did required asset state change?
If not, preserve `NO-SUBMIT` and record one short evidence note.

### 2) Preserve trust by keeping technical baseline checks lightweight but constant
Even in no-change loops, include minimal health checks (status, typecheck/tests, live surface) so the boundary does not drift on stale assumptions.

### 3) Prevent fatigue with reminder cadence discipline
One concise reminder per freshness window beats repeated nudges.
This maintains action pressure without reducing message credibility.

### 4) Treat no-change documentation as reliability work, not dead time
High-signal wait-loop notes make the eventual boundary flip auditable and fast when assets arrive.

## Reusable rule
For repeated external-asset waits:
1. run short baseline + asset-state check,
2. update boundary once,
3. send at most one reminder per window,
4. avoid unrelated edits that do not affect gating conditions.

## Main takeaway
Signal quality in wait loops comes from disciplined minimalism: short checks, binary decisions, sparse reminders, and auditable boundary continuity.
