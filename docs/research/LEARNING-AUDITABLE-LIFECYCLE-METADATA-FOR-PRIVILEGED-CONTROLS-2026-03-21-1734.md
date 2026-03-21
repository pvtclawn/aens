# Learning Note — Auditable Lifecycle Metadata for Privileged Controls (2026-03-21 17:34 UTC)

## Context
The project now uses a gated deterministic failure-probe mechanism. Safety depends not only on code-level default-off behavior, but also on operational evidence that privileged windows were short, controlled, and fully closed.

## Applied learning

### 1) Feature flags are state; metadata is proof
A flag can show current state (`on/off`), but it does not prove safe lifecycle behavior over time.
Lifecycle metadata (issued/expires/revoked timestamps, owner, window bounds) provides that proof.

### 2) Time ordering constraints reduce ambiguity
Recording timestamps is not enough unless ordering is validated:
- start < window expiry <= token expiry,
- revoke <= window close,
- close with inertness check.
These constraints make audits objective, not interpretive.

### 3) Revocation evidence should be explicit artifact, not assumption
A `token_revoked_at` field without `revoke_evidence_ref` is weaker than it looks.
Non-secret evidence references turn revocation from a claim into a verifiable event.

### 4) Temporary privileged modes need closure telemetry
For privileged controls, “we enabled it once” is less important than proving:
- bounded duration,
- bounded call count,
- explicit disable,
- inertness restored.

## Reusable rule
For any temporary privileged verification control:
1. require lifecycle metadata fields,
2. enforce time-order consistency checks,
3. require revocation evidence references,
4. require explicit post-window inertness proof.

## Main takeaway
Safe privileged verification is not just a runtime guard problem; it is a lifecycle accountability problem, and lifecycle metadata is the control surface that makes safety auditable.
