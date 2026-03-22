# One-Hundred-Sixty-First Slice Verification — Marker `matchMode` Fail-Closed Rollout (2026-03-22 11:01 UTC)

## Goal
Verify rollout of `1b1e134` against Task 1 boundaries from `PLAN-MARKER-MATCH-PRECISION-HARDENING-V1-2026-03-22-1048.md`:
1) unknown-mode fail-closed behavior,
2) normalized overlap guard enforcement,
3) public-surface readiness stability.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted marker/proof/artifact/discover tests pass (`20 pass`)
- `bun run check-public-surface` fully green (`Preferred public surface ready: yes`)

## Verification evidence

### A) Unknown-mode fail-closed boundary (PASS)
Runtime probe:
- `resolveSurfaceMarkerMatch(... matchMode='unknown-mode')`

Observed result:
- `markerMatchType='none'`
- no matched marker emitted

Result: matcher no longer silently falls back to permissive substring behavior on invalid mode values.

---

### B) Normalized overlap guard boundary (PASS)
Runtime probe with synthetic contracts:
- preferred marker `Research Capability`
- fallback marker `Research   Capability   Surface`

Observed result:
- `validateSurfaceMarkerContracts(...)` returns
  - `code='cross-domain-normalized-overlap'`

Separate probe with invalid mode (`mystery`) returns
- `code='match-mode-invalid'`

Result: contract validation now enforces normalized collision detection and strict mode-token validity.

---

### C) Runtime/fallback collision regression check (PASS)
Probe against live contract set:
- runtime research target checked against fallback canonical body

Observed result:
- `markerMatchType='none'`

Result: previous alias-collision leak is no longer reproducible with current marker contracts.

---

### D) Checker readiness stability (PASS)
`bun run check-public-surface` result:
- public root: ok
- research capability page: ok
- discover research page: ok
- github blob fallback: ok
- preferred surface ready: yes
- bootstrap proof ready: no

Result: fail-closed hardening did not regress preferred surface readiness.

## Verdict
**PASS** — Task 1 rollout is verified: unknown modes fail closed, normalized overlap guards enforce collision safety, and current public-surface readiness remains stable.

## Next smallest handoff
Proceed to Lane D to freeze Task 2 boundary:
- sunset-safe alias evaluation guarantees,
- strict failure-class taxonomy (`mode-invalid`, `alias-expired`, `collision-blocked`, `marker-missing`),
- machine-facing diagnostics retention in checker/report outputs.