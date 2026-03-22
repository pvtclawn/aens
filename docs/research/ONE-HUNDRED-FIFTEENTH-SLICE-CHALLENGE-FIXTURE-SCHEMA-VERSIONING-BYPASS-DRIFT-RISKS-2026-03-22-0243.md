# One-Hundred-Fifteenth Slice Challenge — Fixture Schema/Versioning Bypass & Drift Risks (2026-03-22 02:43 UTC)

## Goal
Red-team deterministic fixture schema/versioning rollout for bypass and drift risks, focusing on:
1) template misuse,
2) dual-schema window abuse,
3) fixture-lint/parity gate ordering regressions.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted machine-parity/blocker/grace/provenance/validator/write-intent/publish/discover-service tests pass (`40 pass`)
- public surface check green

## Challenge findings

### 1) Template misuse can create “valid-looking but semantically stale” fixtures (high)
**Failure mode:** contributors generate fixtures from template defaults and forget to align `expectedMachinePayload` with actual `inputState` semantics.

**Impact:** fixture files pass superficial shape checks but encode incorrect parity expectations, producing misleading CI failures or false confidence.

**Mitigation:**
- add semantic consistency checks between `inputState` and `expectedMachinePayload` (e.g., state->primary blocker mapping sanity),
- require template-generated fixtures to include explicit `filledBy` markers removed by linter before merge,
- fail if placeholder/default sentinel values remain.

---

### 2) Dual-schema migration windows can be abused as permanent compatibility loopholes (high)
**Failure mode:** old fixture schema support remains enabled indefinitely and new fixtures keep landing in deprecated format.

**Impact:** governance hardening stalls; strictness regresses into long-term multi-schema ambiguity.

**Mitigation:**
- dual-schema support requires explicit `deprecatesAt` deadline in policy/config,
- CI warns before deadline and hard-fails after deadline for deprecated schema additions,
- block new fixtures using deprecated schema once migration window enters warning phase.

---

### 3) Fixture-lint/parity gate ordering regressions can mask root causes (high)
**Failure mode:** parity comparison runs before fixture schema/version lint in some paths (local or CI), yielding noisy mismatch errors for fixtures that should have been rejected early.

**Impact:** debugging time increases; contributors bypass checks rather than fix fixture contract violations.

**Mitigation:**
- enforce strict pipeline order:
  1. fixture schema/version lint,
  2. fixture semantic consistency checks,
  3. parity comparator,
- CI fails if stages are executed out-of-order or skipped.

---

### 4) Version label spoofing via manual edits can bypass intended migration controls (medium-high)
**Failure mode:** fixture `fixtureSchemaVersion` field is manually set to current version while payload still follows older shape.

**Impact:** schema-version checks pass label-wise but parsing logic may degrade or accept malformed semantics.

**Mitigation:**
- schema validator must verify structural invariants tied to version, not just version label presence,
- include version-specific required/forbidden field assertions,
- emit dedicated reason code for “declared version does not match structure.”

---

### 5) Duplicate fixture IDs across directories can create non-deterministic fixture selection (medium-high)
**Failure mode:** two files share same `fixtureId`; loader order determines which one is used.

**Impact:** parity outcomes vary by filesystem/glob order, causing flaky CI and local/CI disagreement.

**Mitigation:**
- fixture registry build step must fail on duplicate IDs globally,
- output collision report with both file paths,
- prohibit shadowing by path precedence.

---

### 6) Deprecated-schema fixtures may leak into release path through cached artifacts (medium)
**Failure mode:** CI reuses stale fixture bundles generated before migration cutoff.

**Impact:** release gate may evaluate outdated fixture schema despite current policy restrictions.

**Mitigation:**
- include fixture bundle hash + schema-version manifest in build artifacts,
- invalidate cache on policy/schema version changes,
- release gate verifies bundle manifest freshness against current policy hash.

---

### 7) Contributor UX pressure can trigger manual fixture bypasses under deadline (medium)
**Failure mode:** teams skip fixture-lint stage locally and rely on later CI retries.

**Impact:** repeated failed pipelines, longer feedback loops, and temptation to weaken strict checks.

**Mitigation:**
- provide fast local preflight command that runs fixture-lint + concise remediation output,
- keep strict CI enforcement unchanged,
- surface top blocker and exact fix path in first failure line.

## Hardened rule (post-challenge)
Fixture schema/versioning rollout is acceptable only if all constraints hold:
1. template-to-semantic consistency checks (not shape-only),
2. time-bounded dual-schema windows with enforced cutoff behavior,
3. fixed gate ordering (lint -> semantic checks -> parity),
4. version-structure coherence validation,
5. global duplicate fixture-id rejection,
6. cache/artifact freshness checks tied to policy+schema hashes,
7. fast local preflight UX while preserving strict CI fail-closed gates.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- fixture semantic-consistency validator,
- dual-schema cutoff enforcement + deprecated-schema add-blocks,
- enforced stage-order checks and duplicate fixture-id global registry gate.
