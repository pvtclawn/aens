# Sixty-Sixth Slice Research — Controlled Failure-Probe Enable Procedure (2026-03-21 16:59 UTC)

## Scope
Define a bounded, auditable procedure for safely enabling deterministic failure probes in production for one verification window.

## Preconditions
- Endpoint healthy on normal path (`200` + expected contract).
- Failure probe feature merged but default-off.
- Explicit operator approval for temporary enable window.

## Controlled enable procedure
1. **Prepare short-lived token**
   - Generate one ephemeral token for this window only.
   - Record window start/end and owner.

2. **Enable gate briefly**
   - Set:
     - `AENS_ENABLE_FAILURE_PROBE=1`
     - `AENS_FAILURE_PROBE_TOKEN=<ephemeral>`
   - Redeploy and confirm normal requests unchanged.

3. **Run single probe call**
   - `GET /api/discover-research?name=<valid>&simulateFailure=timeout`
   - Header: `x-aens-probe-token: <ephemeral>`

4. **Capture evidence**
   - status code (`502` expected)
   - payload contains:
     - `reasonCode=lookup-failed`
     - `reasonSchemaVersion=v1`
     - `failureClass`
     - `retryable`
   - preserve one compact evidence artifact.

5. **Immediate disable**
   - unset/clear probe env vars (or set `AENS_ENABLE_FAILURE_PROBE=0`)
   - redeploy
   - confirm probe parameter is inert again on public traffic.

## Safety guardrails
- One-window use only (no persistent enable state).
- Token never reused across windows.
- No extra debug fields in public response beyond contract.
- Explicit rollback path: disable gate + redeploy if anything unexpected appears.

## Outcome criteria
Procedure is successful when failure payload contract is verified once and probe mode is demonstrably disabled immediately after.
