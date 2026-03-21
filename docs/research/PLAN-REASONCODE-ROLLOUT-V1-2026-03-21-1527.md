# Plan — reasonCode Rollout v1 (2026-03-21 15:27 UTC)

## Goal
Ship a minimal, backward-compatible semantic improvement to the live discover service by adding a single `reasonCode` field.

## Scope boundary
- Keep existing response keys unchanged.
- Add one new field only (`reasonCode`).
- Keep taxonomy small and deterministic.

## Tasks (next 1–3)

### 1) Add minimal reason taxonomy + precedence
Target: `api/discover-research.ts` response shaping.

Acceptance criteria:
- Introduce `reasonCode` with v1 taxonomy:
  - `child-not-found`
  - `child-found-not-authorized`
  - `parent-authorized-without-service-url`
  - `parent-authorized-with-service-url`
  - `lookup-failed`
- Apply explicit precedence and keep reasons mutually exclusive.

### 2) Add deterministic unit tests for reason classification
Target: new/extended tests around service response shaping.

Acceptance criteria:
- Tests prove reason-code mutual exclusivity.
- Tests prove precedence order for overlapping conditions.
- Existing response contract tests remain passing.

### 3) Verify live backward compatibility
Target: production endpoint contract check.

Acceptance criteria:
- Existing keys remain present and unchanged semantics.
- New key appears as additive field.
- Endpoint returns `200` JSON with stable `source` field.

## Done definition
Service becomes more decision-useful for agents via one additive semantic field, without breaking existing consumers.
