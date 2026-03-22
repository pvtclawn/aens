# One-Hundred-Thirty-Fourth Slice Learning — Stage-Separated Provenance Gating Ergonomics (2026-03-22 04:38 UTC)

## Context
The freshness->identity stage-separation boundary is now defined. The practical UX risk is that operators may still misread `not-evaluated` as either pass or hidden failure unless outputs are explicit and consistent.

## Applied learning

### 1) `not-evaluated` must be treated as a first-class state, not a blank
When a stage is skipped due to upstream failure, omitting explicit status invites incorrect assumptions.

**Rule:** always emit explicit stage value (`not-evaluated`) plus provenance fields:
- `blockedByStage`
- `blockedByReasonCode`

No implicit/empty placeholders.

### 2) Compact output should prioritize stage clarity over detail density
If compact mode tries to summarize all stage diagnostics, operators may miss the true gate boundary.

**Rule:** compact summary line order:
1. primary blocker + stage,
2. stage-status triad,
3. one deterministic next action.

Everything else stays in verbose payload.

### 3) Upstream-first blocker arbitration reduces triage churn
Mixed diagnostics from later stages can distract from the actual gate that stopped evaluation.

**Rule:** only earliest failing stage contributes primary blocker; downstream reasons may appear only as `suppressedDownstreamReasons` and never as active blockers.

### 4) Stage transition traces improve auditability without adding noise
Auditors and contributors both benefit from seeing where evaluation stopped.

**Rule:** include deterministic trace entries such as:
- `integrity=pass`
- `freshness=fail`
- `identity=not-evaluated (blockedBy=freshness)`

Short trace in compact mode, full trace in verbose mode.

### 5) Reason-code namespace should encode stage ownership
Ambiguous reason ownership reintroduces confusion in mixed outputs.

**Rule:** map every reason code to a unique stage owner in code constants; stage owner is included in machine output to keep adapter rendering consistent.

### 6) Contributor remediation should reference the blocked stage directly
Generic remediation hints (“fix provenance”) slow iteration.

**Rule:** remediation hint must point to stage-scoped next action:
- integrity failures -> registry integrity path,
- freshness failures -> hash/freshness refresh path,
- identity failures -> lineage/migration path.

### 7) Local and CI outputs must preserve the same stage semantics
If local tools collapse `not-evaluated` while CI keeps it explicit, contributors lose trust.

**Rule:** local preflight and CI must share stage-status formatter primitives and machine payload assertions.

## Immediate implementation guidance
- Add shared `stageStatus` formatter with invariant fields for compact/verbose outputs.
- Add tests for impossible/ambiguous stage combinations to ensure fail-closed behavior.
- Keep strict stage ordering unchanged; optimize clarity through deterministic status rendering and stage-scoped remediation hints.
