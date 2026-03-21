# Privileged Probe Window Checklist

Use this checklist for any temporary production failure-probe window.

## Window control record
- window_id (globally unique):
- window_owner:
- window_started_at:
- window_expires_at:
- max_probe_calls (<=3):
- token_issued_at:
- token_expires_at:
- token_fingerprint (non-secret hash/prefix):
- token_issue_evidence_ref:
- canonical_time_source (`provider-utc|deployment-utc|local-utc`):
- allowed_clock_skew_ms (default: 5000):

### Field format + TTL policy
- Time fields MUST be ISO-8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`).
- Token TTL MUST be short-lived (recommended: <=15 minutes; hard cap: 30 minutes).
- `window_expires_at` MUST be <= `token_expires_at`.
- `window_started_at` < `window_expires_at` < `token_expires_at`.
- Ordering checks MUST cite `canonical_time_source` and note when `allowed_clock_skew_ms` was applied.
- `window_id` and `token_fingerprint` MUST be unique per window.

## Enable phase
- [ ] `AENS_ENABLE_FAILURE_PROBE=1` set
- [ ] `AENS_FAILURE_PROBE_TOKEN` set
- [ ] deployment id after enable:
- enable_deploy_evidence_ref:
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
- disable_deploy_evidence_ref:
- revoke_evidence_ref (artifact/log proving token invalidated):
- [ ] inertness check passed (`simulateFailure` param has no effect without gate)

### Closeout consistency checks
- [ ] `token_revoked_at` is ISO-8601 UTC.
- [ ] `token_revoked_at` <= `window_closed_at`.
- [ ] `window_closed_at` <= `token_expires_at` (or document expiry-first closeout exception).
- [ ] no prior window uses this `window_id`.
- [ ] no prior window uses this `token_fingerprint`.
- [ ] all critical lifecycle timestamps have provenance refs (`token_issue_evidence_ref`, `enable_deploy_evidence_ref`, `revoke_evidence_ref`, `disable_deploy_evidence_ref`).

## Result
- Decision: PASS / FAIL
- Notes:
