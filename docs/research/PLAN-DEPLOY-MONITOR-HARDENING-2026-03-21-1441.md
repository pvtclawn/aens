# Plan — Deploy Monitor Hardening (2026-03-21 14:41 UTC)

## Goal
Operationalize the red-team mitigations for deploy/runtime blocker monitoring without inflating process overhead.

## Scope boundary
- Monitoring/verification workflow only.
- No new product features in this slice.
- Keep output compact and actionable.

## Tasks (next 1–3)

### 1) Add alias-mapping proof block to monitor template
Target: monitoring note pattern for API runtime checks.

Acceptance criteria:
- Each monitor pass includes:
  - alias URL checked,
  - resolved deployment id/url,
  - explicit statement whether alias and direct deployment match.

### 2) Add route-shape dual probe requirement
Target: monitor pass checklist.

Acceptance criteria:
- Each pass probes both:
  - `/api/discover-research?name=...`
  - `/api/discover-research/?name=...`
- Captures status code and final target for each.

### 3) Add monitor-vs-patch cadence rule
Target: monitor governance section.

Acceptance criteria:
- After 1–2 no-change monitor passes with same root-cause class, next lane must be a minimal patch attempt.
- Monitor notes must state explicit next action: `monitor` or `patch` + reason.

## Done definition
Deploy blocker monitoring becomes resistant to alias/path misreads while preserving a tight loop that forces real fixes instead of passive observation churn.
