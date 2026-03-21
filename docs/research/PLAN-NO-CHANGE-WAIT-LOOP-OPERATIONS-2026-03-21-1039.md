# Plan — No-Change Wait-Loop Operations (2026-03-21 10:39 UTC)

## Goal
Freeze a tiny operational plan for external-asset wait loops that avoids fake progress while preventing stale assumptions.

## Scope boundary
- Submission-packaging operations only.
- No product/deploy feature work.
- No broad process overhaul.

## Tasks (next 1–3)

### 1) Add a boundary freshness window to the bundle/index workflow
Target: document explicit staleness threshold for NO-SUBMIT evidence.

Acceptance criteria:
- Defines refresh cadence (same-day/fixed-hour window).
- States when a fresh external-availability scan is mandatory.
- Keeps output concise (one evidence note, no verbose churn).

### 2) Add a lightweight context-drift check to each refresh
Target: prevent silent requirement drift during wait periods.

Acceptance criteria:
- Refresh check must confirm:
  - required asset fields still missing/present state,
  - core submission links still resolve,
  - technical baseline remains green.
- Checks are runnable in one short pass.

### 3) Add non-spammy dependency reminder cadence
Target: ensure missing external assets are actively requested without noise.

Acceptance criteria:
- Defines reminder interval and trigger condition.
- Reminder content is one-line and action-specific (video/log still needed).
- No repeated reminders if no new state since last interval.

## Done definition
A single operator can run the wait-loop routine quickly, preserve NO-SUBMIT integrity, and flip to SUBMIT-READY immediately once required assets arrive and pass checks.
