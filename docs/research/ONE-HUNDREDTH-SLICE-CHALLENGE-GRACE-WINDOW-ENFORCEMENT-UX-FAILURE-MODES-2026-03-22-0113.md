# One-Hundredth Slice Challenge — Grace-Window Enforcement UX Failure Modes (2026-03-22 01:13 UTC)

## Goal
Red-team grace-window expiry enforcement UX before implementation, focusing on:
1. deadline ambiguity,
2. blocker-priority confusion,
3. advisory/non-release messaging drift.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted provenance-policy/provenance-gate/validator/write-intent/publish/discover-service tests pass (`27 pass`)
- public surface check green

## Challenge findings

### 1) Relative-time-only deadlines can invert urgency (high)
**Failure mode:** output shows only “expires in X hours” without absolute UTC timestamp.

**Impact:** timezone conversion mistakes and rerun delays lead to avoidable grace-expired failures.

**Mitigation:** always emit dual deadline form:
- `expiresAt` (absolute UTC),
- `graceRemainingSeconds` + humanized relative string.

Never allow one without the other.

---

### 2) Absolute-time-only deadlines can hide immediate risk (high)
**Failure mode:** output shows only ISO timestamp; operators must mentally compute urgency.

**Impact:** near-expiry windows appear deceptively safe, increasing last-minute breakage.

**Mitigation:** required warning tiers based on remaining time:
- `>=72h`: advisory,
- `<72h`: elevated advisory,
- `<24h`: high urgency non-release warning,
- `<=0`: expired hard fail.

---

### 3) Multi-blocker ordering drift causes inconsistent triage (high)
**Failure mode:** when validator and schema states differ (e.g., one expired, one grace-active), tools pick different primary blockers nondeterministically.

**Impact:** teams chase secondary issues while primary release blocker remains unresolved.

**Mitigation:** deterministic blocker precedence:
1. invalid policy entry,
2. expired grace,
3. unsupported version,
4. grace-active non-release.

Emit secondary blockers separately but stable.

---

### 4) Advisory wording can accidentally imply release readiness (high)
**Failure mode:** language like “valid with warnings” appears without explicit release gate statement.

**Impact:** reviewers infer approval despite strict release policy.

**Mitigation:** force explicit non-release line whenever grace-active appears:
- `releaseEligible=false`
- `policyState=grace-active`
- `release gate blocked by policy`.

---

### 5) Status taxonomy drift between CLI and CI outputs (medium-high)
**Failure mode:** CLI shows one reason label while CI shows another for same state.

**Impact:** repeated revalidation loops and distrust in automation outputs.

**Mitigation:** centralize reason-code constants and formatting adapters; forbid ad-hoc string literals in output layers.

---

### 6) Missing “now” timestamp reduces audit replayability (medium)
**Failure mode:** outputs show expiry values but not evaluation instant.

**Impact:** impossible to prove whether a result was generated pre- or post-expiry.

**Mitigation:** include `evaluatedAt` in every gate result and in any persisted artifact summary.

---

### 7) Escalation path ambiguity under expiry pressure (medium)
**Failure mode:** operator sees non-release block but no deterministic remediation path.

**Impact:** manual bypass pressure increases; emergency exceptions become normalized.

**Mitigation:** each blocker must include deterministic next action:
- policy file path,
- exact field to update,
- governance checklist reference.

## Hardened rule (post-challenge)
Grace-window enforcement UX is acceptable only if all constraints hold:
1. dual absolute+relative deadline output,
2. deterministic urgency tiers,
3. stable multi-blocker precedence,
4. explicit non-release messaging for grace-active,
5. centralized reason taxonomy across CLI/CI,
6. mandatory `evaluatedAt` timestamps,
7. blocker-specific remediation pointers.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- shared grace-state formatter (absolute+relative+tier),
- centralized blocker-precedence mapper,
- CI/CLI shared reason-code contract with non-release banner invariants.
