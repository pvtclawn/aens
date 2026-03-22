# Ninetieth Slice Challenge — Strict/Compat Provenance Spoof & Workflow-Bypass Risk (2026-03-22 00:13 UTC)

## Goal
Red-team strict/compat provenance-gating design for spoof and workflow-bypass risk before implementation, focusing on:
1) forged `releaseEligible` claims,
2) commit-mismatch blind spots,
3) compat-overuse drift.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted validator/write-intent/publish/discover-service tests pass (`17 pass`)
- public surface check green

## Challenge findings

### 1) Forged release-eligibility field can bypass intent (high)
**Failure mode:** artifact includes `releaseEligible=true` and downstream tooling trusts the flag directly without recomputing eligibility predicates.

**Impact:** non-strict or stale artifacts can be presented as release-ready.

**Mitigation:**
- treat `releaseEligible` as derived output only,
- ignore user-provided eligibility booleans,
- recompute from strict predicates in CI gate and stamp signed result artifact.

---

### 2) Commit-mismatch blind spot in shallow or detached contexts (high)
**Failure mode:** validator records a commit hash from local state that differs from CI merge commit or detached checkout context; gate compares loosely and passes.

**Impact:** artifact provenance may not correspond to code actually being released.

**Mitigation:**
- require exact commit match against CI-resolved target SHA,
- include both `validatedCommit` and `expectedCommit` in gate output,
- fail closed on missing/ambiguous git metadata.

---

### 3) Compat-overuse drift under deadline pressure (high)
**Failure mode:** teams normalize `compat` mode for speed and never return to strict, while artifacts still circulate as if equivalent.

**Impact:** strict policy exists nominally but practical quality/security floor drops.

**Mitigation:**
- track compat usage as metric (`compatRuns/strictRuns`) and alert when ratio exceeds threshold,
- require explicit expiry window for compat allowances,
- block release if latest validation in chain is compat-only.

---

### 4) Mixed-artifact replay can fake clean validation chain (medium-high)
**Failure mode:** a strict artifact from one manifest is paired with compat artifact from another run; report tooling merges them without binding checks.

**Impact:** observers see apparently complete validation history that never occurred for one payload.

**Mitigation:**
- bind artifacts by `intentPayloadHash` + `intentId` + `validatedCommit`,
- gate rejects mixed chains with mismatched binding tuple,
- show tuple in every summary line.

---

### 5) Downgrade attack via unrecognized validator version fallback (medium-high)
**Failure mode:** unsupported validator version causes fallback to permissive behavior instead of hard fail.

**Impact:** strict guarantees silently collapse during tooling transitions.

**Mitigation:**
- fail closed on unknown `validatorVersion`,
- require explicit allowlist in CI config,
- version bumps must ship migration note + new allowlist entry in same PR.

---

### 6) Human-readable summary can still overclaim gate state (medium)
**Failure mode:** summaries state “validation passed” without indicating gate scope (manifest only vs full convergence chain).

**Impact:** stakeholders infer stronger guarantees than provided.

**Mitigation:**
- enforce scoped language templates:
  - `manifest-valid` only,
  - `execution-verified` pending,
  - `poststate-converged` pending,
- disallow generic “passed” in release notes unless full gate chain complete.

## Hardened rule (post-challenge)
Provenance gating is acceptable only if all constraints hold:
1. release eligibility is computed, never trusted from artifact input,
2. strict commit binding is exact and fail-closed,
3. compat usage is time-bounded + measurable + non-release,
4. artifact chains are bound by hash+intent+commit tuple,
5. validator version allowlist is strict with no permissive fallback,
6. status messaging is scope-accurate and gate-specific.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- provenance gate evaluator (computed eligibility + tuple binding),
- commit/version allowlist enforcement in CI,
- compat-usage telemetry + expiry policy checks.
