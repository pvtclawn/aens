# One-Hundred-Seventy-Second Slice Verification — Immutable Class-Template Mapping Rollout (2026-03-22 12:04 UTC)

## Goal
Verify rollout of `a21fc99` against Task 1 boundaries from `PLAN-TASK2-STRICT-DIAGNOSTICS-HARDENING-V1-2026-03-22-1159.md`:
1) shared class-template mapping stability,
2) summary/artifact class-token parity,
3) public-surface readiness non-regression.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted marker/proof/artifact/discover tests pass (`23 pass`)
- `bun run check-public-surface` fully green (`Preferred public surface ready: yes`)

## Verification evidence

### A) Shared class-template mapping stability (PASS)
Runtime probe confirms immutable centralized cue map contains all strict classes with deterministic wording:
- `mode-invalid` -> `invalid marker match mode`
- `collision-blocked` -> `marker collision blocked`
- `alias-expired` -> `alias expired (canonical marker required)`
- `marker-missing` -> `reachable but missing expected marker`
- `http-failure` -> `http failure`

Result: one shared map is active and stable for strict-class summaries.

---

### B) Summary/artifact class-token parity (PASS)
Probe using a strict failure sample (`failureClass=collision-blocked`) produced:
- resolved class: `collision-blocked`
- summary: `research capability page: marker collision blocked (...)`
- artifact surface check:
  - `failureClass=collision-blocked`
  - identical class-consistent summary text

Result: summary and artifact paths stay class-token aligned for strict failure cases.

---

### C) Test-suite parity guard coverage (PASS)
Relevant tests green:
- `public-surface.test.ts` includes centralized-template usage assertions
- `submission-artifacts.test.ts` includes class-token/summary parity checks

Result: mapping and parity invariants are locked by tests.

---

### D) Public-surface readiness non-regression (PASS)
`bun run check-public-surface` output:
- public root: ok
- research capability page: ok
- discover research page: ok
- github blob fallback: ok
- preferred surface ready: yes
- bootstrap proof ready: no

Result: shared template hardening introduced no runtime readiness regressions.

## Verdict
**PASS** — Task 1 rollout is verified: strict class-template mapping is centralized/stable, summary+artifact class parity holds, and public-surface readiness remains green.

## Next smallest handoff
Proceed to Lane D for Task 2 execution boundary freeze:
- alias-expired shadow-detection implementation contract,
- strict class-token visibility guarantees in terse output,
- summary/artifact parity retention under aggregation.