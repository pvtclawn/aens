# One-Hundred-Fifty-Fourth Slice Challenge — Marker-Contract Implementation Edge Risks (2026-03-22 10:12 UTC)

## Goal
Red-team the upcoming marker-contract implementation update, focusing on:
1) alias-window overreach,
2) fallback/runtime marker conflation,
3) shared-constant drift bypasses.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted suite pass (`16 pass`)
- app build pass
- `bun run check-public-surface` currently fails due marker drift (root/research reachable but stale expected markers)

## Challenge findings

### 1) Alias windows can become permanent hidden bypasses (high)
**Failure mode:** legacy marker aliases remain enabled after transition, allowing old copy to pass indefinitely.

**Impact:** checker loses sensitivity and cannot detect unintended regressions in canonical copy.

**Mitigation:**
- put hard sunset metadata on alias entries (expiry condition/date),
- fail CI when alias window exceeds allowed duration,
- require two consecutive canonical-only green runs before alias removal completion.

---

### 2) Fallback/runtime marker conflation can mask production regressions (high)
**Failure mode:** runtime checker begins accepting fallback stub markers, or fallback marker updates accidentally drive runtime expectations.

**Impact:** `preferredSurfaceReady` can appear healthy even when runtime pages drift or break.

**Mitigation:**
- keep separate marker namespaces/modules for `preferred-runtime` vs `bootstrap-fallback`,
- enforce source-specific marker validation path IDs,
- add tests that reject fallback markers in runtime checks and vice versa.

---

### 3) Shared constants can still drift via local literal escape hatches (high)
**Failure mode:** one checker/test path keeps using inline literals instead of shared constants.

**Impact:** false negatives/positives across environments; parity appears flaky.

**Mitigation:**
- lint/grep guard rejecting marker literals outside constants module,
- snapshot tests referencing exported constants only,
- CI step that fails if canonical marker strings appear outside approved files.

---

### 4) Over-generic role markers can reduce detection precision (medium-high)
**Failure mode:** canonical markers are too short/generic (e.g., just `Research`) and appear in unrelated content.

**Impact:** checker passes pages that are semantically wrong but contain incidental text.

**Mitigation:**
- require minimally specific phrase markers unique per route,
- validate marker uniqueness across all monitored pages,
- keep one secondary sentinel marker for ambiguous pages.

---

### 5) Title-only markers are brittle under SEO/meta edits (medium-high)
**Failure mode:** runtime checks depend only on `<title>` which can change due non-functional edits.

**Impact:** frequent false alarms or relaxed checker pressure.

**Mitigation:**
- use stable in-body route markers for readiness checks,
- treat title markers as supplementary diagnostics,
- include marker location expectations in tests.

---

### 6) Drift classification may collapse into binary pass/fail in downstream reports (medium)
**Failure mode:** wrappers summarize all failures as “not ready” without preserving drift class.

**Impact:** operators cannot quickly distinguish outage from copy mismatch.

**Mitigation:**
- preserve explicit failure class tokens in reports (`http-failure`, `marker-drift`),
- keep per-surface structured diagnostics in machine outputs,
- assert report schema includes classification field.

---

### 7) Rebrand cycles can repeatedly re-break checks without process hook (medium)
**Failure mode:** UI copy changes land without marker-contract update checklist.

**Impact:** repeated avoidable checker incidents and noisy release cycles.

**Mitigation:**
- add PR checklist item: “monitored copy changed -> marker constants/tests updated”,
- require checker run in pre-merge validation for app-copy touching PRs,
- include a small runbook for marker updates.

## Hardened rule (post-challenge)
Marker-contract implementation is acceptable only if:
1. alias windows are temporary, bounded, and enforced,
2. runtime and fallback marker domains remain strictly separate,
3. shared constants are mandatory and literal escape hatches are blocked,
4. canonical markers remain route-specific and collision-resistant,
5. readiness checks prefer stable in-body markers over title-only coupling,
6. drift classifications remain explicit in machine reports,
7. copy-change process includes marker-contract update gates.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- bounded alias-window governance + CI expiry checks,
- strict runtime/fallback marker namespace separation,
- literal-escape prevention and classification-preserving checker/report updates.