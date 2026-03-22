# One-Hundred-Sixty-Sixth Slice Verification — Strict Failure-Class Precedence + Preservation (2026-03-22 11:44 UTC)

## Goal
Verify rollout of `87d31ad` against Task 1 boundaries from `PLAN-STRICT-MARKER-FAILURE-DIAGNOSTICS-HARDENING-V1-2026-03-22-1133.md`:
1) deterministic class precedence under mixed signals,
2) no-downgrade class preservation into artifacts,
3) public-surface readiness stability.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted marker/proof/artifact/discover tests pass (`21 pass`)
- `bun run check-public-surface` fully green (`Preferred public surface ready: yes`)

## Verification evidence

### A) Deterministic precedence under mixed signals (PASS)
Probe payload (`status=200`, `markerMatchType=none`, `contractIssueCode=cross-domain-normalized-overlap`, `failureClass=collision-blocked`) resolves to:
- `resolvedMixed = collision-blocked`

Control payload with weaker injected hint (`failureClass=marker-missing`) but same overlap signal resolves to:
- `resolvedDowngraded = collision-blocked`

Result: precedence remains deterministic and stricter class wins over weaker fallback hints.

---

### B) No-downgrade preservation into artifacts (PASS)
Artifact build probe from the same mixed-signal surface result returns:
- `failureClass = collision-blocked`
- `passed = false`
- summary: `marker collision blocked`

Result: strict class is preserved from resolver -> artifact surface check and is not downgraded to generic `marker-missing`.

---

### C) Summary mapping consistency (PASS)
For the mixed-signal failure probe:
- `summarizeSurfaceCheck(...)` emits `marker collision blocked`
- artifact summary uses the same class mapping text

Result: summary and artifact remain aligned on strict class interpretation for this path.

---

### D) Public-surface readiness stability (PASS)
`bun run check-public-surface` remains green:
- public root: ok
- research capability page: ok
- discover research page: ok
- github blob fallback: ok
- preferred surface ready: yes
- bootstrap proof ready: no

Result: strict class-preservation hardening did not regress deployed preferred-surface readiness.

## Verdict
**PASS** — Task 1 rollout is verified: deterministic precedence holds, strict classes are preserved end-to-end (including artifacts), and current public-surface readiness remains stable.

## Next smallest handoff
Proceed to Lane D to freeze Task 2 boundary:
- alias-expired shadow-detection semantics,
- stable strict failure-class taxonomy output contracts,
- summary-vs-artifact diagnostic retention guarantees.