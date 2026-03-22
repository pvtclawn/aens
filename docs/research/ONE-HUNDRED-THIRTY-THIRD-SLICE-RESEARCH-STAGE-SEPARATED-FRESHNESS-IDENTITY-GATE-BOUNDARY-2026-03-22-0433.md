# One-Hundred-Thirty-Third Slice Research — Stage-Separated Freshness→Identity Gate Boundary (2026-03-22 04:33 UTC)

## Goal
Freeze a compact boundary for stage-separated provenance gating so freshness failures cannot be conflated with downstream identity outcomes.

Focus:
1. explicit `not-evaluated` semantics for downstream identity checks,
2. deterministic stage-status contract,
3. reason-code precedence across stages.

## Current-state grounding
- First-seen provenance integrity/freshness verifier exists and emits deterministic fail-closed reasons.
- Migration-lineage validator exists and emits deterministic cycle/conflict blockers.
- Remaining risk: mixed reporting can blur whether identity checks were truly evaluated when freshness fails.

## Boundary definition (v1)

### A) Mandatory stage order (hard contract)
Provenance pipeline stages must execute strictly in this order:
1. `integrity`
2. `freshness`
3. `identity`

Rule:
- each stage may run only if all upstream stages are `pass`.
- downstream stage status must be `not-evaluated` (not `pass`/`fail`) when blocked by upstream failure.

---

### B) Deterministic stage-status contract
Each run emits a machine status object:
```json
{
  "stageStatus": {
    "integrity": "pass|fail",
    "freshness": "pass|fail|not-evaluated",
    "identity": "pass|fail|not-evaluated"
  }
}
```

Deterministic constraints:
- `integrity=fail` => `freshness=not-evaluated`, `identity=not-evaluated`
- `integrity=pass`, `freshness=fail` => `identity=not-evaluated`
- `integrity=pass`, `freshness=pass` => `identity` may be `pass|fail`

Any impossible combination fails closed as pipeline-contract violation.

---

### C) Primary reason selection across stages
Primary blocker must be selected from the earliest failing stage only.

Precedence by stage:
1. integrity-stage reasons
2. freshness-stage reasons
3. identity-stage reasons

Within a stage, use existing deterministic reason precedence.

Implication:
- if freshness fails, identity blockers must not appear as primary even if computed elsewhere.
- identity reasons may appear only in `suppressedDownstreamReasons` metadata when stage not evaluated is intentionally enforced.

---

### D) Reason taxonomy alignment
Recommended stage-classified reason families:
- **Integrity**
  - `fixture-provenance-registry-integrity-invalid`
- **Freshness**
  - `fixture-provenance-registry-stale`
- **Identity**
  - `fixture-provenance-id-duplicate`
  - `fixture-provenance-id-mutation-detected`
  - `fixture-provenance-id-migration-record-missing`
  - `fixture-provenance-id-migration-record-invalid`
  - `fixture-provenance-id-migration-conflict`
  - `fixture-provenance-id-migration-cycle-detected`

Rule:
- every reason code maps to exactly one stage for primary-blocker arbitration.

---

### E) Explicit `not-evaluated` semantics
`not-evaluated` means the stage was intentionally skipped due to upstream blocker, not an unknown/errored state.

Required metadata when stage is `not-evaluated`:
- `blockedByStage`
- `blockedByReasonCode`

Example:
```json
{
  "stageStatus": {
    "integrity": "pass",
    "freshness": "fail",
    "identity": "not-evaluated"
  },
  "identity": {
    "blockedByStage": "freshness",
    "blockedByReasonCode": "fixture-provenance-registry-stale"
  }
}
```

---

### F) Reporting invariants (compact + verbose)
Compact output must include:
1. primary blocker reason code,
2. stage-status summary,
3. one next action tied to primary stage.

Verbose output must include:
- full stage-status object,
- stage-specific diagnostics,
- suppressed downstream reasons (if any),
- deterministic evaluation trace.

Rule:
- compact output must never imply downstream stage failure when stage is `not-evaluated`.

---

### G) CI gate behavior
CI blocking decision uses stage-first contract:
- fail when first failing stage exists,
- do not run or trust downstream checks when marked `not-evaluated`,
- fail if stage contract invariants are violated.

Deterministic pipeline contract reason code (recommended):
- `fixture-provenance-stage-contract-invalid`

---

## Minimal decision matrix
| Integrity | Freshness | Identity | Primary source stage | Identity status |
|---|---|---|---|---|
| fail | not-evaluated | not-evaluated | integrity | not-evaluated |
| pass | fail | not-evaluated | freshness | not-evaluated |
| pass | pass | fail | identity | fail |
| pass | pass | pass | none | pass |

## Next smallest handoff
Lane E/B follow-up:
1. capture operator ergonomics for stage-status rendering,
2. implement stage-status envelope + contract validator,
3. add tests asserting impossible-stage combinations fail closed and primary blocker follows earliest-fail stage precedence.
