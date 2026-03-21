# Eighty-Sixth Slice Build — Validator Issue Prioritization Output (2026-03-21 23:53 UTC)

## Goal
Implement Task 1 from `PLAN-VALIDATOR-ISSUE-PRIORITIZATION-PROVENANCE-GATING-V1-2026-03-21-2348.md`:
- validator issue model,
- deterministic issue prioritization,
- compact truncation output semantics,
- tests.

## Changes shipped

### 1) New issue model + prioritizer
Added `src/write-intent-validation-issues.ts`:
- issue contract:
  - `reasonCode`
  - `path`
  - `severity`
  - `phase`
  - `hint`
- phase order contract:
  - `structure`
  - `payload`
  - `envelope`
  - `canonicalization`
  - `hash`
- deterministic sorter:
  - phase -> severity -> path -> reasonCode -> hint
- truncation API:
  - `primaryIssues`
  - `remainingIssueCount`
  - `allIssues`

### 2) Test coverage
Added `src/write-intent-validation-issues.test.ts`:
- deterministic sort order lock,
- truncation + `remainingIssueCount` semantics,
- compact fail-closed output behavior for zero/invalid limits.

### 3) Export surface
Updated `src/index.ts` to export `write-intent-validation-issues`.

## Validation
```bash
bunx tsc --noEmit
bun test src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- typecheck pass,
- targeted suite pass (`17 pass`),
- public surface check remains green.

## Contract guardrails
- no discover API schema changes,
- no write execution automation,
- phase-aware ordering now guarantees payload/envelope errors are surfaced before hash-phase issues.
