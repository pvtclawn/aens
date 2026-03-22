# One-Hundred-First Slice Build — Shared Grace-Window Deadline Formatter (2026-03-22 01:23 UTC)

## Goal
Implement Task 1 from `PLAN-GRACE-WINDOW-ENFORCEMENT-UX-CONTRACT-V1-2026-03-22-0118.md`:
- shared deadline formatter,
- deterministic urgency tiers,
- boundary tests.

## Changes shipped

### 1) New shared formatter module
Added `src/grace-window-deadline.ts`:
- `formatGraceWindowDeadline({ evaluatedAt, expiresAt })`
- returns:
  - `evaluatedAtUtc`
  - `expiresAtUtc`
  - `graceRemainingSeconds`
  - `relativeLabel`
  - `urgencyTier`

Deterministic urgency thresholds implemented:
- `advisory` when remaining >= 72h
- `elevated` when 24h <= remaining < 72h
- `high` when 0 < remaining < 24h
- `expired` when remaining <= 0

Formatter now guarantees dual absolute+relative deadline output in all states.

### 2) Test coverage
Added `src/grace-window-deadline.test.ts` covering:
- absolute + relative fields always present,
- threshold boundary behavior (exact 72h / 24h / 0s edges),
- deterministic expired label output,
- fail-closed invalid timestamp handling.

### 3) Export surface update
Updated `src/index.ts` to export `grace-window-deadline` module.

## Validation
```bash
bunx tsc --noEmit
bun test src/grace-window-deadline.test.ts src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- typecheck pass,
- targeted suite pass (`31 pass`),
- public surface check remains green.

## Contract guardrails
- no discover/public API schema changes,
- no policy mutation automation,
- grace deadline representation now deterministic and shared for downstream CI/CLI integration work.
