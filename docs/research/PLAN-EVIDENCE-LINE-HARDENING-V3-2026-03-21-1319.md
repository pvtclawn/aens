# Plan — Evidence-Line Hardening v3 (2026-03-21 13:19 UTC)

## Goal
Strengthen evidence-line semantics so completeness tokens are resistant to spoofing and semantic drift.

## Scope boundary
- Submission wait-loop control docs only.
- No product/deploy code changes.
- Keep format compact and parseable.

## Tasks (next 1–3)

### 1) Version the expected check set + split run/pass completeness
Target: bundle index evidence-line schema.

Acceptance criteria:
- Adds `checkset_version=v1` token.
- Adds both `checks_run=4/4[...]` and `checks_pass=4/4` tokens.
- `unchanged` and `NO-SUBMIT` decisions require both tokens to be complete.

### 2) Add blocker timestamp linkage requirement
Target: marker + evidence-line schema.

Acceptance criteria:
- Adds `blocker_checked_at=<ts>` token in evidence line.
- Requires `blocker_checked_at == marker_updated_at` for unchanged decisions.
- Keeps blocker snapshot (`video_status`, `log_status`) mandatory.

### 3) Add compact anti-spoof evidence anchor
Target: evidence-line schema and refresh-note usage.

Acceptance criteria:
- Adds `evidence_anchor=<tsc_ts|test_ts|surface_ts>` (or equivalent compact tuple).
- Anchor must correspond to the refresh window.
- Line remains one-row, human-readable, and script-parseable.

## Done definition
Each refresh line can be audited for checkset version, run/pass completeness, blocker-timestamp linkage, and anti-spoof anchoring without expanding note noise.
