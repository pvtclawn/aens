# Challenge — Trend-Marker Wait Loops (2026-03-21 11:34 UTC)

## Target challenged
`docs/research/LEARNING-TREND-MARKERS-IN-NO-CHANGE-LOOPS-2026-03-21-1129.md`

## Why challenge now
Trend markers improve observability, but can still create false confidence if interpreted mechanically.

## Main blind spots

### 1) `windows_elapsed = 0` can mask urgency
A zero-window status may look "safe" even when blockers are critical and immediately blocking submission.

**Mitigation:** always pair window count with explicit gating severity:
- if required assets missing, decision remains `NO-SUBMIT` regardless of window count.

### 2) Marker freshness can drift silently
Markers can become stale if not updated at each refresh, producing pseudo-precision.

**Mitigation:** require marker update timestamp and fail refresh note if timestamp not updated.

### 3) Requirement-sync may be treated as checkbox theater
`requirements_sync = unchanged` can be set without actually checking current external requirements.

**Mitigation:** include lightweight source reference per sync check (e.g., form page/version checked).

### 4) Reminder metrics can hide ineffective communication
`last_reminder_at` only tracks sending, not whether the reminder reached the right person or produced action.

**Mitigation:** add optional `reminder_ack` marker (`yes/no/pending`) to distinguish sent vs acknowledged.

## Red-team verdict
Trend markers are useful, but they need interpretation guardrails to avoid superficial certainty.

## Stronger rule (proposed)
Use trend markers only alongside:
1. explicit NO-SUBMIT severity state,
2. per-refresh marker timestamp update,
3. source-referenced requirement-sync check,
4. reminder acknowledgment signal (when available).
