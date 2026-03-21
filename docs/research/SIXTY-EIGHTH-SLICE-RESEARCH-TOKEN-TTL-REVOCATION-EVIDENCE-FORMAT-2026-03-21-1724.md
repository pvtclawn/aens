# Sixty-Eighth Slice Research — Token TTL & Revocation Evidence Format (2026-03-21 17:24 UTC)

## Scope
Run a bounded research pass to specify concrete token lifecycle evidence format for privileged probe windows and freeze template fields.

## Baseline
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`72 pass`)
- `bun run check-public-surface` green

## Changes made
Updated controlled-probe procedure + checklist to enforce explicit lifecycle formatting rules:

### 1) Time format standardization
- All lifecycle time fields now explicitly require ISO-8601 UTC:
  - `YYYY-MM-DDTHH:MM:SSZ`

### 2) Token TTL policy
- Recommended token TTL: `<= 15 minutes`
- Hard cap: `30 minutes`
- Ordering constraint added:
  - `window_started_at < window_expires_at <= token_expires_at`

### 3) Revocation evidence capture
- Added mandatory closeout field:
  - `revoke_evidence_ref`
- This anchors revocation proof to a concrete artifact/log for auditability.

### 4) Closeout consistency checks
- Added explicit checks ensuring time ordering and lifecycle closure consistency:
  - `token_revoked_at <= window_closed_at`
  - window closure not exceeding token expiry (or documented exception).

## Outcome
Privileged probe lifecycle templates now include concrete, machine-auditable lifecycle semantics (format, TTL, revocation evidence), reducing ambiguity and long-lived privileged-mode risk.
