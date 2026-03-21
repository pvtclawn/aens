# Plan — Timeout Semantics Patch v1 (2026-03-21 16:22 UTC)

## Goal
Ship a minimal, backward-compatible failure-path semantic improvement for discover service timeout/error handling.

## Scope boundary
- Error-path payload enrichment only.
- Keep success-path contract unchanged.
- No broad refactors.

## Tasks (next 1–3)

### 1) Add bounded failure hint fields to 502 path
Target: `api/discover-research.ts` catch branch.

Acceptance criteria:
- Keep existing fields (`error`, `message`, `name`, `reasonCode`, `reasonSchemaVersion`).
- Add additive fields:
  - `failureClass` (small controlled vocab, e.g. `rpc-timeout|rpc-unavailable|lookup-error`)
  - `retryable` (`true|false`)
- Ensure response remains JSON and backward-compatible.

### 2) Add deterministic error-class mapping tests
Target: new tests for failure hint classification.

Acceptance criteria:
- Timeout-like errors map to retryable class.
- Non-timeout fatal parse/class errors map to non-retryable class.
- Existing reasonCode behavior (`lookup-failed`) remains unchanged.

### 3) Run focused live/error verification
Target: contract check using probe matrix/error simulation where possible.

Acceptance criteria:
- Success responses unchanged.
- 502 path includes `reasonCode=lookup-failed` + new hints.
- Old consumers still parse unchanged required keys.

## Done definition
Failure-path semantics become machine-actionable for agents (class + retry hint) without breaking existing contract consumers.
