# Sixty-Fourth Slice Research — Deterministic Failure Probe Method (2026-03-21 16:36 UTC)

## Scope
Define a safe, repeatable method to validate live 502 failure payload semantics (`failureClass`, `retryable`) without destabilizing production behavior.

## Problem
Current production verification confirms success-path contract, but error-path fields are hard to prove live because failures are intermittent and input-dependent.

## Candidate probe methods

### A) Invalid-query probe
- Send malformed `name` values.
- Weakness: often resolves to deterministic negative success (`child-not-found`) instead of true lookup failure.

### B) Synthetic internal toggle (recommended)
- Add a **guarded debug query flag** for production checks, e.g. `?simulateFailure=timeout`.
- Only active when an explicit allow token header/env is present.
- Returns controlled 502 payload with `reasonCode=lookup-failed` and failure hints.

Benefits:
- deterministic,
- no dependence on RPC flakiness,
- testable and auditable,
- does not alter normal consumer path.

### C) Runtime monkeypatch via deployment config
- Inject transport failure at runtime config level.
- Weakness: high risk and operationally noisy for production.

## Recommended minimal implementation pattern
1. Add guarded simulation branch inside handler (off by default).
2. Require explicit auth guard (header or secret gate) to activate.
3. Emit the same error payload shape used by real catch-path.
4. Verify with one probe request + remove/disable simulation path after validation window.

## Safety constraints
- Never activate simulation path for public unauthenticated traffic.
- Keep simulation branch narrowly scoped to error contract verification only.
- Preserve all existing success-path semantics.

## Next action
Patch a guarded failure simulation mechanism and run one live 502 proof check capturing:
- `reasonCode=lookup-failed`
- `reasonSchemaVersion=v1`
- `failureClass`
- `retryable`
