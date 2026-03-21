# Challenge — Deploy/Truth Recovery Playbook (2026-03-21 09:00 UTC)

## Target challenged
`docs/research/LEARNING-DEPLOY-TRUTH-RECOVERY-LOOP-2026-03-21-0855.md`

## Why challenge now
The recovery loop is useful, but if it becomes ritualized without guardrails it can produce false confidence.

## Main blind spots

### 1) "Green now" can still be time-skewed truth
Current checks prove state at a timestamp, not over a window. A fast rollback, edge cache inconsistency, or region-specific issue can invalidate a single-point green check.

**Mitigation:** add a tiny stability gate before declaring full recovery:
- run two separated public-surface checks (e.g., now + after short delay)
- require both to agree on `discover research page` and `preferredSurfaceReady`

### 2) Artifact regeneration can silently drift from doc claims
Artifacts were regenerated correctly this cycle, but the process currently depends on operator discipline. A future docs edit could land without refreshed artifacts, reintroducing mismatch.

**Mitigation:** add a lightweight consistency guard:
- CI or pre-commit check that fails when submission docs changed but artifact `generatedAt`/content was not refreshed
- or a script that verifies artifact public-surface status matches current `check-public-surface` output shape

### 3) Hidden coupling to external infrastructure assumptions
The playbook assumes Vercel + one preferred domain path. If hosting topology changes (project split, alias swap, env promotion), same checks may pass while intended judge surface points elsewhere.

**Mitigation:** explicitly verify deployment identity in recovery closure:
- include deployment id/url used for closure
- confirm alias mapping for the judged URL
- record this in the final verification note

### 4) Machine truth may still miss human confusion vectors
Even with aligned artifacts/docs/runtime, humans can still misread `officialEndpointDeclared` as operational readiness.

**Mitigation:** keep one fixed human-facing contrast sentence in all judge surfaces:
- authorization truth (`official`) is distinct from runtime liveness (`reachable/healthy`)

## Red-team verdict
The playbook is directionally correct but still vulnerable to **single-snapshot optimism**, **artifact refresh drift**, and **infrastructure identity assumptions**.

## Stronger closure rule (proposed)
Only mark recovery complete when all four hold:
1. stable live checks (at least two consistent samples),
2. docs/artifacts synchronized,
3. deployment identity/alias for judged URL recorded,
4. authorization-vs-liveness boundary explicit in judge-facing copy.
