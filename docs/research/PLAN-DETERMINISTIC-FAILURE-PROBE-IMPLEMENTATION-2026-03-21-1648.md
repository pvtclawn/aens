# Plan — Deterministic Failure Probe Implementation (2026-03-21 16:48 UTC)

## Goal
Implement a minimal, safe failure-probe mechanism to verify live 502 semantic payload fields (`failureClass`, `retryable`) without exposing public abuse surface.

## Scope boundary
- Probe infrastructure only for verification.
- No changes to default success-path behavior.
- Default-off, tightly gated activation.

## Tasks (next 1–3)

### 1) Add default-off gated probe switch in API handler
Target: `api/discover-research.ts`

Acceptance criteria:
- Probe requires both:
  - explicit query flag (e.g., `simulateFailure=timeout`), and
  - valid shared secret header (env-backed).
- If gate is not satisfied, handler behavior is unchanged.
- No probe-only details exposed in normal responses.

### 2) Route simulated failure through existing catch-path error shaping
Target: same API handler.

Acceptance criteria:
- Simulation throws into the same error-classification path used for real failures.
- Returned payload uses standard 502 schema (`reasonCode`, `reasonSchemaVersion`, `failureClass`, `retryable`, existing fields).
- No duplicate/parallel error serializer is introduced.

### 3) Add expiry/removal note and verification checklist
Target: docs (`docs/research/*`).

Acceptance criteria:
- Includes owner, enable timestamp, and removal deadline.
- Includes one command to run deterministic probe and one command to disable/remove after proof capture.
- Ensures probe window is short and auditable.

## Done definition
A single authenticated probe request can deterministically produce a live 502 semantic payload for verification, with minimal operational risk and explicit cleanup path.
