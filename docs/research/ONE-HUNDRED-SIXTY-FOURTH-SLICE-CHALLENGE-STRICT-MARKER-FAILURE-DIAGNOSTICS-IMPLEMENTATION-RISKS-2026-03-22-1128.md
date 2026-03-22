# One-Hundred-Sixty-Fourth Slice Challenge — Strict Marker-Failure Diagnostics Implementation Risks (2026-03-22 11:28 UTC)

## Goal
Red-team the upcoming strict marker-failure diagnostics implementation, focusing on:
1) failure-class collapse,
2) alias-expired misclassification,
3) summary/artifact divergence.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted marker/proof/artifact/discover tests pass (`20 pass`)
- `bun run check-public-surface` fully green (`preferredSurfaceReady=yes`)

## Challenge findings

### 1) Failure classes can collapse during reporter aggregation (high)
**Failure mode:** per-surface classes (`alias-expired`, `collision-blocked`, etc.) are collected correctly, then flattened into one generic summary code (`marker-missing`) by aggregation layer.

**Impact:** triage precision is lost even though matcher logic is correct.

**Mitigation:**
- preserve both `surfaceFailureClass` and `overallFailureClass`,
- forbid fallback to generic class when a stricter class is available,
- add tests asserting class preservation from matcher -> checker -> artifact.

---

### 2) `alias-expired` can be misreported as `marker-missing` without near-match checks (high)
**Failure mode:** after alias sunset, matcher just returns no match without checking whether expired alias would have matched.

**Impact:** governance transition appears as unexplained content drift.

**Mitigation:**
- run post-sunset shadow check against expired aliases,
- emit `alias-expired` when expired alias match is detected,
- include expired alias identifier in diagnostics for traceability.

---

### 3) Summary and artifact diagnostics can drift by independent formatter logic (high)
**Failure mode:** CLI summary formatter and artifact formatter map internal classes differently.

**Impact:** operators see one cause in CLI and another in stored artifact.

**Mitigation:**
- centralize class-to-message mapping in one shared formatter primitive,
- prohibit per-surface custom mappings in wrappers,
- add parity test that summary class token equals artifact class token.

---

### 4) Multi-failure surfaces can hide primary class selection ambiguity (medium-high)
**Failure mode:** one surface has both overlap guard issues and marker absence; primary class selection is order-dependent and non-deterministic.

**Impact:** flaky diagnostics across runs/environments.

**Mitigation:**
- define deterministic class precedence (e.g., `mode-invalid` > `collision-blocked` > `alias-expired` > `marker-missing` > `http-failure` as applicable to path),
- encode precedence in tests,
- output secondary classes separately if needed.

---

### 5) `http-failure` and strict matcher classes can be conflated under retries (medium-high)
**Failure mode:** transient fetch failure gets retried and then marker mismatch appears; final report hides transport failure history.

**Impact:** root-cause context lost; teams may chase copy when network was unstable.

**Mitigation:**
- track transport attempts in diagnostics,
- keep final class plus `transportWarnings` history,
- avoid replacing `http-failure` evidence with clean-looking strict matcher result silently.

---

### 6) Strict classes can become too verbose for operators if not tiered (medium)
**Failure mode:** every line includes all diagnostic fields, overwhelming quick triage.

**Impact:** users ignore checker output or miss key class token.

**Mitigation:**
- keep summary tier class-first and short,
- push full details into artifact tier,
- assert no summary line exceeds concise length budget without losing class token.

---

### 7) Legacy consumers may ignore new class fields and infer wrong status (medium)
**Failure mode:** old parsers only read `pass` boolean and generic message.

**Impact:** silent downgrade of strict diagnostics in downstream automation.

**Mitigation:**
- include backward-compatible summary tokens containing class,
- publish compatibility note for consumers,
- add smoke test for legacy parser path to ensure class signal remains recoverable.

## Hardened rule (post-challenge)
Strict marker diagnostics implementation is acceptable only if:
1. class tokens remain preserved end-to-end,
2. alias-expired is explicitly distinguished from marker-missing when applicable,
3. summary and artifact class mappings are shared and parity-tested,
4. primary class precedence is deterministic,
5. transport history is not erased by later matcher outcomes,
6. summary verbosity stays concise but class-explicit,
7. legacy consumer paths retain recoverable class signals.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- deterministic failure-class precedence + preservation pipeline,
- alias-expired detection via post-sunset shadow matching,
- unified summary/artifact formatter mapping with parity tests.