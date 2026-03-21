# Plan — Severity/Freshness Hardening v3 (2026-03-21 12:14 UTC)

## Goal
Apply the latest red-team mitigations to submission wait-loop interpretation while staying strictly in packaging/control scope.

## Scope boundary
- Submission wait-loop docs/ops only.
- No product feature changes.
- No deploy changes.

## Tasks (next 1–3)

### 1) Add per-refresh evidence line schema
Target: bundle index + refresh-note template guidance.

Acceptance criteria:
- Requires one line per refresh: command/check run + result + timestamp.
- Line is mandatory for marker updates.
- Keeps note overhead minimal (single compact line).

### 2) Add blocker-vector detail to severity section
Target: marker block in bundle index.

Acceptance criteria:
- Explicitly tracks each required blocker separately:
  - `video_status: missing|present`
  - `log_status: missing|present`
- Severity interpretation references blocker vector (not a generic label only).

### 3) Add requirement-summary timestamp + coordination split markers
Target: marker block and refresh usage.

Acceptance criteria:
- Adds `requirements_checked_at` + one-line summary field.
- Splits reminder coordination into:
  - `reminder_ack` (yes/no/pending)
  - `eta_signal` (none/tentative/committed)
- Keeps non-spam reminder cadence unchanged.

## Done definition
Wait-loop refreshes can be interpreted with lower ambiguity: fresh evidence, explicit blocker vector, timestamped requirement context, and clearer coordination signal quality.
