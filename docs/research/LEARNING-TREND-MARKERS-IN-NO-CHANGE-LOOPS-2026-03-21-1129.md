# Learning Note — Trend Markers in No-Change External-Blocker Loops (2026-03-21 11:29 UTC)

## Context
The wait-loop now tracks `blocked_since`, `windows_elapsed`, `last_reminder_at`, and `requirements_sync` while required external assets remain missing.

## Applied learning

### 1) Trend markers convert static "still blocked" into operational state
Without markers, each refresh looks identical. With markers, each refresh communicates:
- how long the block has lasted,
- whether reminder cadence is being honored,
- whether requirement assumptions were revalidated.

### 2) Markers reduce ambiguity without increasing noise
A short marker block carries more decision value than extra narrative text. This preserves low-noise heartbeat behavior while strengthening auditability.

### 3) Requirement-sync checks protect against stale waiting
`requirements_sync` prevents silent drift where teams keep waiting on old assumptions even if submission requirements changed.

### 4) Reminder timing should be measurable, not implicit
Tracking `last_reminder_at` makes reminder discipline inspectable (too frequent = spam risk, too sparse = dependency drag).

## Reusable rule
For external-asset waits, every refresh should include:
1. binary asset state,
2. trend marker block,
3. unchanged/changed requirement status,
4. explicit decision (`NO-SUBMIT` / `SUBMIT-READY`).

## Main takeaway
Trend markers are a lightweight control surface: they keep no-change loops informative, auditable, and actionable without reopening implementation churn.
