# One-Hundred-Thirty-Ninth Slice Challenge — Reason→Stage Ownership Implementation Edge Risks (2026-03-22 08:27 UTC)

## Goal
Red-team the planned reason-stage ownership implementation for edge-case drift and trust leaks, focusing on:
1) registry drift/shadowing,
2) mismatch precedence bypass,
3) optional-diagnostics ambiguity across adapters.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted parity/provenance/discover tests pass (`21 pass`)
- public surface check green

## Challenge findings

### 1) Registry shadowing can silently fork stage ownership across runtimes (high)
**Failure mode:** one adapter resolves ownership from a local copy/env override while another uses canonical registry.

**Impact:** same reason code gets different stage owner across CLI/CI/UI; parity checks become non-reproducible.

**Mitigation:**
- enforce single registry import path and prohibit runtime owner overrides,
- expose registry identity metadata (`version`, optional hash) in outputs,
- fail closed if registry identity cannot be resolved.

---

### 2) Mismatch errors can be demoted below stage blockers by legacy sorter pipelines (high)
**Failure mode:** existing blocker sorters prioritize severity/path and allow stage-specific reasons to remain primary even when owner mismatch exists.

**Impact:** operators chase downstream stage issues while ownership contract is already invalid.

**Mitigation:**
- hard-precedence ownership contract failures before stage-level blockers,
- add explicit regression tests asserting `mismatch/unmapped` preemption,
- disallow adapter-level re-sorting after canonical arbitration.

---

### 3) Unknown reason handling can fail open via fallback stage defaults (high)
**Failure mode:** unmapped reasons are auto-assigned to a default stage (often identity) for display compatibility.

**Impact:** unknown reasons appear legitimate and can bypass governance gate intended by canonical registry.

**Mitigation:**
- forbid default-owner fallback behavior,
- require deterministic unmapped contract reason (`fixture-provenance-stage-reason-unmapped`),
- block release paths when unmapped status appears.

---

### 4) Optional diagnostics can create truth divergence when omitted inconsistently (medium-high)
**Failure mode:** some surfaces emit ownership diagnostics (`status`, `canonicalOwner`, `claimedOwner`) while others omit them, yet all are interpreted as equally authoritative.

**Impact:** cross-surface audits become ambiguous; mismatches may only be visible in one environment.

**Mitigation:**
- define required-minimum diagnostics for failure states (even if optional in pass states),
- lock compact/verbose contracts with parity tests,
- surface explicit `diagnosticsOmitted` marker when omission is intentional.

---

### 5) Reason namespace collisions can blur policy vs provenance ownership semantics (medium-high)
**Failure mode:** similarly named reasons from policy mapping and provenance mapping are coalesced by generic adapter formatting.

**Impact:** remediation hints point to wrong subsystem; teams apply incorrect fixes.

**Mitigation:**
- namespace ownership registries clearly by domain,
- include domain tag in ownership diagnostics,
- enforce domain-aware reason validation in stage-gate path.

---

### 6) Cached ownership metadata can survive registry updates and produce stale mismatches (medium)
**Failure mode:** adapters cache owner-resolution map longer than process lifetime or across deploy boundaries.

**Impact:** transient false mismatches/unmapped errors and noisy triage after legitimate registry updates.

**Mitigation:**
- tie caches to registry version/hash,
- invalidate cache on registry identity change,
- include resolved registry identity in each diagnostic payload.

---

### 7) Partial entrypoint adoption can leave bypass paths around ownership validation (medium)
**Failure mode:** new registry validation is enforced in one output path but not in secondary utility/CLI adapter entrypoints.

**Impact:** inconsistent enforcement and possible bypass by invoking legacy path.

**Mitigation:**
- centralize owner-resolution in shared primitive and require all entrypoints to consume it,
- add integration tests across every stage-gate-emitting entrypoint,
- fail closed when entrypoint cannot provide ownership status.

## Hardened rule (post-challenge)
Reason-stage ownership implementation is acceptable only if all constraints hold:
1. one canonical registry source is used everywhere,
2. unmapped/mismatch ownership failures always preempt stage-level blockers,
3. unknown reasons cannot receive fallback stage assignment,
4. failure-state diagnostics are minimally required across surfaces,
5. reason-domain boundaries (policy vs provenance) stay explicit,
6. registry identity is visible and cache-safe,
7. all emitting entrypoints enforce the same ownership validation primitive.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- shared ownership validator rollout across all entrypoints,
- deterministic mismatch/unmapped precedence enforcement,
- required failure-state diagnostics contract + cache/registry-identity safeguards.
