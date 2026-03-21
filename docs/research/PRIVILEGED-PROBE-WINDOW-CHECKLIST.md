# Privileged Probe Window Checklist

Use this checklist for any temporary production failure-probe window.

## Window control record
- window_owner:
- window_started_at:
- window_expires_at:
- max_probe_calls (<=3):
- token_issued_at:
- token_expires_at:

### Field format + TTL policy
- Time fields MUST be ISO-8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`).
- Token TTL MUST be short-lived (recommended: <=15 minutes; hard cap: 30 minutes).
- `window_expires_at` MUST be <= `token_expires_at`.
- `window_started_at` < `window_expires_at` < `token_expires_at`.

## Enable phase
- [ ] `AENS_ENABLE_FAILURE_PROBE=1` set
- [ ] `AENS_FAILURE_PROBE_TOKEN` set
- [ ] deployment id after enable:
- [ ] fail-closed check passed (enable+token state valid)
- [ ] normal non-probe request still returns expected success contract

## Probe calls
- probe_call_count:
- [ ] call count <= max_probe_calls
- probe_mode used (`timeout|network|...`):
- [ ] probe response is `502`
- [ ] `reasonCode=lookup-failed`
- [ ] `reasonSchemaVersion=v1`
- [ ] `failureClass` present
- [ ] `retryable` present

## Audit marker (non-secret)
- probe_mode_activated_at:
- deployment_id:
- simulateFailure mode:
- evidence artifact path:

## Disable + closeout
- [ ] `AENS_ENABLE_FAILURE_PROBE=0` or unset
- [ ] `AENS_FAILURE_PROBE_TOKEN` unset/rotated
- token_revoked_at:
- window_closed_at:
- deployment id after disable:
- revoke_evidence_ref (artifact/log proving token invalidated):
- [ ] inertness check passed (`simulateFailure` param has no effect without gate)

### Closeout consistency checks
- [ ] `token_revoked_at` is ISO-8601 UTC.
- [ ] `token_revoked_at` <= `window_closed_at`.
- [ ] `window_closed_at` <= `token_expires_at` (or document expiry-first closeout exception).

## Result
- Decision: PASS / FAIL
- Notes:
