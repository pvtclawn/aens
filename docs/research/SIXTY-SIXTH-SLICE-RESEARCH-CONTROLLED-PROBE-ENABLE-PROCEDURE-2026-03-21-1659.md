# Sixty-Sixth Slice Research — Controlled Failure-Probe Enable Procedure (2026-03-21 16:59 UTC)

## Scope
Define a bounded, auditable procedure for safely enabling deterministic failure probes in production for one verification window.

Companion checklist: `docs/research/PRIVILEGED-PROBE-WINDOW-CHECKLIST.md`

## Preconditions
- Endpoint healthy on normal path (`200` + expected contract).
- Failure probe feature merged but default-off.
- Explicit operator approval for temporary enable window.

## Controlled enable procedure
0. **Open a window control record**
   - Record:
     - `window_owner`
     - `window_started_at`
     - `window_expires_at`
     - `max_probe_calls` (recommended: `1`, hard cap: `3`)
     - `token_issued_at`

1. **Prepare short-lived token**
   - Generate one ephemeral token for this window only.
   - Set explicit expiry and planned revocation timestamp.

2. **Enable gate briefly (fail-closed checks first)**
   - Set:
     - `AENS_ENABLE_FAILURE_PROBE=1`
     - `AENS_FAILURE_PROBE_TOKEN=<ephemeral>`
   - Redeploy.
   - Fail-closed validation:
     - if enable flag is on but token is missing/invalid, disable immediately and redeploy.
   - Confirm normal requests unchanged.

3. **Run bounded probe calls**
   - Allowed call count: `<= max_probe_calls` in this window.
   - Canonical call:
     - `GET /api/discover-research?name=<valid>&simulateFailure=timeout`
     - Header: `x-aens-probe-token: <ephemeral>`

4. **Capture evidence + audit marker**
   - status code (`502` expected)
   - payload contains:
     - `reasonCode=lookup-failed`
     - `reasonSchemaVersion=v1`
     - `failureClass`
     - `retryable`
   - record non-secret audit marker:
     - `probe_mode_activated_at`
     - `deployment_id`
     - `simulateFailure mode`

5. **Immediate disable + lifecycle closeout**
   - unset/clear probe env vars (or set `AENS_ENABLE_FAILURE_PROBE=0`)
   - redeploy
   - record:
     - `token_revoked_at`
     - `window_closed_at`
   - confirm probe parameter is inert again on public traffic.

## Safety guardrails
- One-window use only (no persistent enable state).
- Token never reused across windows.
- Token lifecycle evidence is mandatory (`issued`, `expires`, `revoked`).
- Probe window must remain bounded by both duration and call-count cap.
- No extra debug fields in public response beyond contract.
- Explicit rollback path: disable gate + redeploy if anything unexpected appears.

## Outcome criteria
Procedure is successful when failure payload contract is verified in a bounded window, lifecycle evidence is complete, and probe mode is demonstrably disabled immediately after.
