# Seventy-Fifth Slice Build — Discover Multi-Example Fixtures (2026-03-21 22:26 UTC)

## Goal
Implement Task 1 from `PLAN-DISCOVER-MULTI-EXAMPLE-ROLLOUT-V1-2026-03-21-2221.md` by adding discover-specific deterministic fixtures for partial-authorization and missing-child outcomes, with no API contract changes.

## Changes shipped
1. `src/discover-research.ts`
   - Added discover-specific example support:
     - `research-unlisted-child-capability`
     - `research-missing-child-capability`
   - Kept existing `parent-authorized-capability` behavior unchanged.
   - Extended CLI usage text to show the two new discover examples.

2. `src/discover-research.test.ts`
   - Added coverage for both new discover-specific fixture IDs.
   - Asserted outcome semantics:
     - unlisted fixture → `authorizationStatus=unlisted-child`
     - missing fixture → `authorizationStatus=missing-child`

## Validation
```bash
bunx tsc --noEmit
bun test src/discover-research.test.ts src/examples.test.ts
bun run discover-research -- --example research-unlisted-child-capability --json
bun run discover-research -- --example research-missing-child-capability --json
bun test src/*.test.ts
bun run check-public-surface
```

Results:
- Typecheck pass.
- Discover/example targeted tests pass.
- Full test suite pass (`78 pass`).
- Public surface check remains green.

## Contract/scope guardrails
- No API schema changes.
- Existing authority fixture registry for `inspect` remains untouched.
- Discover path now has deterministic coverage for positive + partial + missing outcomes without mutating legacy authority fixtures.
