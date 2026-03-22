# One-Hundred-Forty-Sixth Slice Verification — Ownership-Precedence Token Enforcement Rollout (2026-03-22 09:21 UTC)

## Goal
Verify rollout of `644d78f` against Task 1 boundaries from `PLAN-OWNERSHIP-PRECEDENCE-ENFORCEMENT-V1-2026-03-22-0911.md`:
1) required suppression/context token presence,
2) ownership-contract primary rendering under preemption,
3) no discover/public-surface regressions.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted suite pass (`13 pass`)
- app build pass
- `bun run check-public-surface` green

## Verification evidence

### A) Token presence invariants (PASS)
Runtime probes show deterministic token presence in all modes:
- resolved:
  - `ownershipFailureClass=none`
  - `stagePrimarySuppressed=false`
  - `stageStatusContextOnly=false`
- mismatch:
  - `ownershipFailureClass=mismatch`
  - `stagePrimarySuppressed=true`
  - `stageStatusContextOnly=true`
- unmapped:
  - `ownershipFailureClass=unmapped`
  - `stagePrimarySuppressed=true`
  - `stageStatusContextOnly=true`

Result: suppression/context tokens are always present and match ownership-failure state.

---

### B) Ownership-contract primary rendering under preemption (PASS)
Probe summaries confirm ownership failures never render stage-formatted primary tokens:
- mismatch summary primary:
  - `primary=ownership-contract:fixture-provenance-stage-owner-mismatch`
- unmapped summary primary:
  - `primary=ownership-contract:fixture-provenance-stage-reason-unmapped`

Resolved case remains stage-formatted:
- `primary=freshness:fixture-provenance-registry-stale`

Result: preemption mode correctly swaps to ownership-contract primary rendering.

---

### C) Stage triad retained as context-only (PASS)
All probe summaries preserve `stages=...` while preemption tokens indicate suppression/context-only behavior.

Result: stage visibility is preserved for context without stage-primary wording in ownership-failure runs.

---

### D) Test boundary coverage (PASS)
Targeted suite remains green:
- `stage-gate-adapter-parity.test.ts`
- `reason-stage-ownership.test.ts`
- `machine-payload-parity.test.ts`
- `discover-research-service.test.ts`

Result: token enforcement introduced no regressions in parity or resolver/discover contracts.

---

### E) Public-surface regression boundary (PASS)
`bun run check-public-surface` remains fully green:
- public root: ok
- research capability page: ok
- discover research page: ok
- Preferred public surface ready: yes
- Bootstrap proof ready: no

Result: rollout is non-breaking for public/discover surfaces.

## Verdict
**PASS** — ownership-precedence token enforcement rollout is verified and evidence-backed for all Task 1 boundaries.

## Next smallest handoff
Proceed to Lane D to freeze Task 2 boundary research for immutable primary-lock and source-tag parity guarantees (post-arbitration sorter bypass prevention).