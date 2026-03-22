# One-Hundred-Tenth Slice Challenge — CI/CLI Parity Harness Edge-Case Drift (2026-03-22 02:13 UTC)

## Goal
Red-team CI/CLI machine-payload parity harness design for edge-case drift before implementation, focusing on:
1. canonicalization mismatches,
2. fixture fragility,
3. truncation metadata desync.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted blocker/grace/provenance/validator/write-intent/publish/discover-service tests pass (`36 pass`)
- public surface check green

## Challenge findings

### 1) Canonicalization mismatch can create false parity failures (high)
**Failure mode:** CI and CLI produce semantically identical machine payloads but serialize with different key ordering or optional-field omission behavior.

**Impact:** parity harness reports drift even though machine meaning is identical; teams lose trust in parity checks and may disable them.

**Mitigation:**
- parity harness compares canonicalized payload objects (stable key ordering, explicit null/undefined normalization),
- canonicalization helper versioned and shared by both adapter tests,
- include canonicalization digest in parity debug output.

---

### 2) Fixture fragility can turn parity checks into churn generator (high)
**Failure mode:** fixtures encode incidental details (timestamps, non-deterministic IDs, prose wording) instead of pure state transitions.

**Impact:** harmless evolutions trigger broad fixture rewrites; contributors bypass or ignore failing parity tests.

**Mitigation:**
- fixture schema only allows deterministic machine fields,
- volatile fields moved to optional adapter-local snapshot tests,
- fixture IDs encode policy state only (no time/random components).

---

### 3) Truncation metadata desync can hide real adapter divergence (high)
**Failure mode:** adapters agree on truncated secondary list but disagree on `remainingSecondaryCount` / `truncated` flags.

**Impact:** UI/CI summaries appear aligned while actual triage context differs; users under-estimate unresolved blockers.

**Mitigation:**
- parity contract treats truncation metadata as first-class required fields when truncation mode is active,
- fail if list length, `remainingSecondaryCount`, or `truncated` flag diverges,
- verify `sort-before-truncate` with input permutations.

---

### 4) Optional unknown-state diagnostics can degrade to partial payload parity (medium-high)
**Failure mode:** one adapter emits full unknown diagnostics while another omits `mapperVersion` or remediation hint.

**Impact:** fail-closed semantics weaken in one surface, creating asymmetric operator behavior.

**Mitigation:**
- unknown-state diagnostic fields become required as a group when primary blocker is `artifact-policy-state-unknown`,
- parity harness checks field presence + non-empty values,
- missing fields trigger dedicated parity reason code.

---

### 5) Parity harness itself can drift from mapper contract (medium-high)
**Failure mode:** mapper schema evolves but parity harness fixture validator lags.

**Impact:** harness may pass stale assumptions or fail valid new outputs unpredictably.

**Mitigation:**
- generate fixture validation schema from exported mapper output types/constants,
- include mapper schema version in fixture header,
- fail closed on version mismatch with explicit migration hint.

---

### 6) Overfitting to byte-equality can block safe schema evolution (medium)
**Failure mode:** harness enforces exact byte-equality across versions without version-gated compatibility strategy.

**Impact:** additive safe fields require brittle fixture mass updates; engineering slows and pressure mounts to weaken checks.

**Mitigation:**
- enforce strict equality within same mapper schema version,
- require explicit schema-version bump and migration fixtures for intentional changes,
- keep backward-compat fixtures for one transition window.

---

### 7) Failure diagnostics may be too coarse for fast repair (medium)
**Failure mode:** parity failures only say “payload mismatch” without field path/fixture context.

**Impact:** debugging cycles lengthen; contributors may patch around symptoms.

**Mitigation:**
- parity failure output must include:
  - fixture ID,
  - differing field path,
  - expected vs observed canonical value snippet,
  - recommended module to update.

## Hardened rule (post-challenge)
Parity harness design is acceptable only if all constraints hold:
1. canonicalized machine comparison with shared helper,
2. deterministic, non-volatile fixture schema,
3. required truncation metadata parity checks,
4. grouped unknown-state diagnostic invariants,
5. harness schema tied to mapper contract/version,
6. version-aware strictness for intentional schema evolution,
7. field-level parity failure diagnostics.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- canonical parity comparator contract,
- deterministic fixture schema + versioning policy,
- truncation/unknown-state parity assertion suite with field-level diagnostics.
