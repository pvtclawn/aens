# Plan — Wait-Loop Hardening v2 (2026-03-21 11:09 UTC)

## Goal
Apply the latest red-team mitigations to the submission wait-loop without expanding scope beyond packaging operations.

## Scope boundary
- Submission packaging control loop only.
- No product feature work.
- No deploy/infrastructure modifications.

## Tasks (next 1–3)

### 1) Add reminder floor semantics to wait-loop docs
Target: update bundle index wait-loop section.

Acceptance criteria:
- At least one concise reminder per freshness window when required assets remain missing.
- Preserve non-spam rule (no duplicate reminders inside same window without new state).
- Keep reminder text action-specific (video URL + conversation log still needed).

### 2) Add explicit judge-access validation requirement
Target: extend checklist with stronger accessibility checks.

Acceptance criteria:
- Requires unauthenticated/incognito open-check for both required external assets.
- Requires at least one non-owner access confirmation note.
- Failing access check keeps state at NO-SUBMIT.

### 3) Add compact trend + requirement-sync markers
Target: add tiny boundary-tracking fields to refresh notes/index.

Acceptance criteria:
- Include `blocked_since`, `windows_elapsed`, `last_reminder_at` markers.
- Add periodic “requirements unchanged/changed” checkpoint line.
- Keep note overhead minimal (single short block).

## Done definition
The wait-loop can remain low-noise while still surfacing stale assumptions, access failures, and dependency lag early enough to avoid last-minute submission surprises.
