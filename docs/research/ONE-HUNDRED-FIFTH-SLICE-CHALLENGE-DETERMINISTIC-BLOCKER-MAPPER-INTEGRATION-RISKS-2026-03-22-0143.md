# One-Hundred-Fifth Slice Challenge — Deterministic Blocker-Mapper Integration Risks (2026-03-22 01:43 UTC)

## Goal
Red-team integration risks before implementing the centralized blocker-precedence mapper, focusing on:
1. CI/CLI adapter drift,
2. secondary-list truncation misordering,
3. unknown-state fail-closed messaging regressions.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted grace/provenance/validator/write-intent/publish/discover tests pass (`31 pass`)
- public surface check green

## Challenge findings

### 1) CI/CLI adapter drift can reintroduce semantic divergence (high)
**Failure mode:** CI and CLI consume shared mapper output but each adapter transforms reason codes or list ordering independently.

**Impact:** same policy state yields different blocker stories per surface, eroding operator trust and causing contradictory triage actions.

**Mitigation:**
- expose one adapter-neutral machine payload contract,
- enforce adapter conformance tests that compare CI vs CLI machine payload byte-for-byte,
- prohibit freeform adapter-side reason remapping.

---

### 2) Secondary-list truncation can accidentally reorder or mask critical context (high)
**Failure mode:** compact mode truncates before deterministic sort or uses unstable iteration order.

**Impact:** secondary blockers appear in non-deterministic order; users may chase the wrong follow-up issue and miss higher-priority secondary states.

**Mitigation:**
- always sort full secondary list first, then truncate,
- include `remainingSecondaryCount` and `truncated=true` flags,
- test deterministic ordering under varied input permutations.

---

### 3) Unknown-state fail-closed paths may degrade into vague generic errors (high)
**Failure mode:** adapter converts `artifact-policy-state-unknown` into generic “validation failed,” dropping axis/state diagnostics.

**Impact:** taxonomy drift becomes hard to diagnose; teams may bypass checks rather than fix normalizer/mapping updates.

**Mitigation:**
- unknown-state outputs must include invariant fields:
  - `offendingAxis`
  - `offendingState`
  - `mapperVersion`
  - explicit remediation hint,
- block release if any invariant field is missing.

---

### 4) Primary-blocker precedence can be accidentally inverted by presentation logic (medium-high)
**Failure mode:** UI layer promotes friendlier warning text (e.g., grace-active) above stricter blockers (e.g., grace-expired) due to severity badge heuristics.

**Impact:** root-cause diagnosis is delayed; remediation sequence becomes noisy.

**Mitigation:**
- adapters must respect mapper-provided `primaryBlockerReasonCode` as authoritative,
- display layers may annotate but cannot override blocker priority,
- add invariant test: if primary changes after formatting, fail.

---

### 5) Multi-axis mixed-state summaries can produce ambiguous remediation guidance (medium-high)
**Failure mode:** summary mentions both validator/schema blockers without indicating which action is first.

**Impact:** operators attempt broad policy edits, increasing error surface and churn.

**Mitigation:**
- primary remediation action must map 1:1 with primary blocker,
- secondary actions listed separately and explicitly marked “after primary.”

---

### 6) Reason-code namespace drift across roadmap slices (medium)
**Failure mode:** new reason codes added in docs or code without central registry update.

**Impact:** adapters and dashboards silently drop unknown codes or map them incorrectly.

**Mitigation:**
- enforce centralized reason-code registry module,
- CI fails on unknown/unregistered reason codes,
- include reason-code registry version in mapper output.

---

### 7) Snapshot-heavy tests can hide machine-contract drift (medium)
**Failure mode:** human-summary snapshot tests pass while machine payload subtly changes (ordering, missing flags).

**Impact:** automation consumers break despite green test suite.

**Mitigation:**
- prioritize structured assertion tests on machine fields/order,
- keep summary snapshots minimal and invariant-focused only.

## Hardened rule (post-challenge)
Mapper integration is acceptable only if all constraints hold:
1. CI/CLI machine payload parity checks,
2. sort-before-truncate secondary list contract,
3. invariant-rich unknown-state fail-closed outputs,
4. presentation cannot override primary blocker,
5. primary-first remediation mapping,
6. centralized reason-code registry enforcement,
7. machine-contract assertions as test source-of-truth.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- centralized reason-code registry + mapper output schema,
- adapter parity and sort-before-truncate conformance tests,
- unknown-state invariant output contract enforcement.
