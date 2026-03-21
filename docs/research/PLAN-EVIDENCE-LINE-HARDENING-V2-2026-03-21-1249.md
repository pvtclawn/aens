# Plan — Evidence-Line Hardening v2 (2026-03-21 12:49 UTC)

## Goal
Strengthen mandatory evidence-line usage so schema compliance reliably implies substantive refresh checks.

## Scope boundary
- Submission wait-loop docs/ops only.
- No product/deploy changes.
- Keep updates compact and low-noise.

## Tasks (next 1–3)

### 1) Add explicit check-completeness token to evidence-line schema
Target: bundle index evidence-line section.

Acceptance criteria:
- Evidence line includes compact completeness token, e.g. `checks=4/4`.
- Expected check-set is frozen (`tsc`, `tests`, `public-surface`, `asset fields`).
- `unchanged` status is invalid without full completeness token.

### 2) Require blocker snapshot inside evidence line
Target: evidence-line schema and refresh-note examples.

Acceptance criteria:
- Every line includes `video_status` and `log_status` snapshot.
- Decision state references this blocker snapshot explicitly.

### 3) Require marker-linkage token in evidence line
Target: evidence-line schema and marker block workflow.

Acceptance criteria:
- Evidence line includes `marker_updated_at` linkage value.
- Refresh is incomplete if marker timestamp and evidence-line linkage diverge.
- Keep line single-row, parseable, and human-readable.

## Done definition
Each no-change refresh line can be audited for completeness, blocker truth, and marker linkage without opening verbose logs.
