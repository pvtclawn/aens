# One-Hundred-Fifty-Sixth Slice Verification — Marker-Contract Domain-Separation Rollout (2026-03-22 10:22 UTC)

## Goal
Verify rollout of `3a46e01` against Task 1 boundaries from `PLAN-MARKER-CONTRACT-HARDENING-V1-2026-03-22-1017.md`:
1) runtime/fallback domain isolation,
2) bounded alias semantics,
3) checker status restoration.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted suite pass (`29 pass`)
- app build pass
- `bun run check-public-surface` green (`Preferred public surface ready: yes`)

## Verification evidence

### A) Bounded alias semantics (PASS)
Runtime probe on root marker contract:
- canonical marker: `ÆNS — ENS root explorer`
- active alias before sunset: `ÆNS live ENS root explorer`
- alias match before sunset => `markerMatchType=alias`
- same alias after `2026-06-02T00:00:00.000Z` => `markerMatchType=none`

Result: alias windows are bounded by explicit sunset metadata.

---

### B) Checker status restoration (PASS)
`bun run check-public-surface` now reports:
- public root: `ok`
- research capability page: `ok`
- discover research page: `ok`
- github blob fallback: `ok`
- preferred public surface ready: `yes`
- bootstrap proof ready: `no`

Result: the stale preferred-marker drift is cleared under current runtime copy.

---

### C) Runtime/fallback domain isolation (FAIL: alias collision leak)
Probe:
- runtime target: research capability page
- fallback body: `PrivateClawn Research Capability Surface`
- runtime aliases still include `PrivateClawn Research Capability`

Observed result:
- `markerMatchType=alias`
- `matchedMarker=PrivateClawn Research Capability`

This means fallback marker content can still satisfy runtime research marker matching via substring collision, despite domain separation in target definitions.

Result: domain metadata exists, but **semantic isolation is incomplete** because matcher remains raw substring-based and runtime alias text overlaps fallback content.

---

## Verdict
**PARTIAL PASS** — checker health is restored and alias windows are bounded, but runtime/fallback isolation is not yet trustworthy because fallback content can still trigger a runtime alias match on the research route.

## Next smallest handoff
Proceed to Lane D to freeze the precision boundary for marker matching:
- route-specific collision-resistant markers,
- exact/anchored matching strategy or marker-location constraints,
- alias policy that forbids overlap with fallback marker domain content.
