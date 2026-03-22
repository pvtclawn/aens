# One-Hundred-Sixteenth Slice Build — Fixture Semantic-Consistency Validator (2026-03-22 02:53 UTC)

## Goal
Implement Task 1 from `PLAN-FIXTURE-SCHEMA-VERSIONING-HARDENING-V1-2026-03-22-0248.md`:
- fixture semantic-consistency validation beyond shape checks,
- deterministic reason/path diagnostics,
- tests.

## Changes shipped

### 1) New semantic-consistency validator module
Added `src/parity-fixture-semantic-consistency.ts`:
- `validateParityFixtureSemanticConsistency(...)`
- deterministic issue contract:
  - `reasonCode`
  - `path`
  - `hint`

Checks implemented:
1. **Primary blocker coherence** against normalized state precedence.
2. **Release eligibility coherence** (`releaseEligibleByPolicy` aligns with derived blocker expectation).
3. **Unknown-state diagnostics invariant**:
   - required when primary blocker is `artifact-policy-state-unknown`,
   - rejected when present for non-unknown primary blockers.
4. **Template/sentinel placeholder detection** across fixture ID, input state, and expected payload.

### 2) Test coverage
Added `src/parity-fixture-semantic-consistency.test.ts`:
- coherent active fixture passes,
- primary/release mismatch detection,
- unknown-state diagnostics missing/unexpected detection,
- placeholder/sentinel value detection.

### 3) Export surface update
Updated `src/index.ts` to export `parity-fixture-semantic-consistency` module.

## Validation
```bash
bunx tsc --noEmit
bun test src/parity-fixture-semantic-consistency.test.ts src/machine-payload-parity.test.ts src/policy-blocker-mapper-output.test.ts src/grace-window-deadline.test.ts src/provenance-policy.test.ts src/provenance-gate.test.ts src/write-intent-validation-issues.test.ts src/write-intent-hash.test.ts src/publish-assist.test.ts src/discover-research-service.test.ts
bun run check-public-surface
```

Results:
- typecheck pass,
- targeted suite pass (`44 pass`),
- public surface check remains green.

## Contract guardrails
- no discover/public API schema changes,
- no fixture schema migration mechanics added in this slice,
- semantic fixture drift can now be detected before parity-comparison stages.
