# Plan — Trend-Marker Hardening v2 (2026-03-21 11:39 UTC)

## Goal
Apply red-team mitigations to trend-marker wait-loop usage while staying strictly within submission-packaging operations.

## Scope boundary
- Submission wait-loop control only.
- No product/deploy feature changes.
- No broader process redesign.

## Tasks (next 1–3)

### 1) Add explicit blocker-severity line to marker block
Target: bundle index marker section.

Acceptance criteria:
- Adds `decision_severity: NO-SUBMIT (required assets missing)`.
- Explicitly states severity is independent of `windows_elapsed` value.

### 2) Add marker freshness + requirement-source reference fields
Target: marker section in bundle index.

Acceptance criteria:
- Adds `marker_updated_at` field (must update every refresh).
- Adds `requirements_source_ref` field (URL/page/version checked).
- Refresh notes fail validation if these fields are stale/missing.

### 3) Add reminder acknowledgment marker
Target: marker section in bundle index + refresh-note usage.

Acceptance criteria:
- Adds `reminder_ack` (`yes` / `no` / `pending`).
- Distinguishes reminder sent vs acknowledged.
- Keeps reminder cadence non-spammy (still max one per freshness window unless state changes).

## Done definition
Each no-change refresh can report severity, freshness, requirement provenance, and reminder acknowledgment in one compact marker block, reducing false confidence without adding noise.
