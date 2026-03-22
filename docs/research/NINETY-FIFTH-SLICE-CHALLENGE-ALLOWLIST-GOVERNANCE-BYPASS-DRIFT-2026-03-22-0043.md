# Ninety-Fifth Slice Challenge — Allowlist Governance Bypass & Drift Risk (2026-03-22 00:43 UTC)

## Goal
Red-team commit/version allowlist enforcement design for governance-bypass and policy-churn risks, with focus on:
1) shadow allowlists,
2) stale grace windows,
3) CI context drift.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted provenance/validator/write-intent/publish/discover-service tests pass (`22 pass`)
- public surface check green

## Challenge findings

### 1) Shadow allowlists can silently supersede canonical policy (high)
**Failure mode:** teams introduce local override files, env-driven allowlists, or duplicated policy fragments in scripts that diverge from canonical `provenance-policy` source.

**Impact:** release decision semantics differ across environments while appearing policy-compliant.

**Mitigation:**
- single canonical policy path required in CI and local tooling,
- reject runs when multiple policy sources are detected,
- print `policySourcePath` and policy hash in every gate result.

---

### 2) Stale grace windows can become permanent weak mode (high)
**Failure mode:** grace entries for older validator/schema versions linger past intended migration windows without enforcement.

**Impact:** non-release-safe versions continue to pass advisory checks and gradually normalize in release workflows.

**Mitigation:**
- grace entries must include hard `expiresAt`,
- CI fails closed once expiry passes,
- policy linter rejects grace entries missing expiry,
- weekly policy aging report flags near-expiry entries.

---

### 3) CI context drift can mismatch commit authority (high)
**Failure mode:** expected commit source differs by CI event type (PR head vs merge commit vs manual rerun), leading to accidental pass/fail variance.

**Impact:** provenance checks may validate against wrong commit context, undermining trust in artifact binding.

**Mitigation:**
- event-specific commit-resolution contract (PR, push, release) documented and encoded,
- gate output must include `ciEventType`, `expectedCommitSource`, `expectedCommit`, `validatedCommit`,
- fail closed when commit source cannot be resolved unambiguously.

---

### 4) Policy-hash omission weakens audit replayability (medium-high)
**Failure mode:** artifacts record policy version label only; label can be reused or patched without obvious detection.

**Impact:** later audits cannot prove which exact allowlist content was enforced.

**Mitigation:**
- include deterministic `policyHash` in every validation artifact,
- reject artifacts missing policy hash in release gate,
- require policy hash to match checked-in policy bytes at gate time.

---

### 5) Multi-branch cherry-pick drift can break governance parity (medium-high)
**Failure mode:** code changes and policy updates land on different branches/cherry-picks, producing inconsistent allowlist behavior across deployment tracks.

**Impact:** one branch treats version as allowed while another blocks, causing noisy release posture and operator bypass attempts.

**Mitigation:**
- require policy + validator version updates in the same PR/commit set,
- add CI check asserting allowlist contains current validator/schema constants,
- fail release if constants and policy diverge.

---

### 6) Human override pressure under deadlines can bypass strict gate intent (medium)
**Failure mode:** maintainers manually bypass checks to unblock urgent releases when policy updates lag.

**Impact:** emergency pathways become normalized, eroding trust boundary over time.

**Mitigation:**
- formal emergency override path with signed rationale + expiry,
- override artifacts non-default and prominently labeled,
- mandatory retroactive reconciliation task to remove override and update policy.

## Hardened rule (post-challenge)
Allowlist governance is acceptable only if all constraints hold:
1. single canonical policy source with source-path + hash visibility,
2. grace windows are explicit and auto-expiring,
3. CI commit authority is event-resolved and unambiguous,
4. policy hash is embedded and verified in artifacts,
5. validator constants and allowlist entries are parity-checked,
6. emergency overrides are explicit, time-bounded, and auditable.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- canonical policy loader + policy-hash binding,
- grace-window expiry enforcement/linting,
- CI event-specific commit-resolution contract with fail-closed ambiguity handling.
