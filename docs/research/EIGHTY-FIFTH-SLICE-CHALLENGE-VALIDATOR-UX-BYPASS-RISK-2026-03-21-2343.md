# Eighty-Fifth Slice Challenge — Validator UX Bypass Risk (2026-03-21 23:43 UTC)

## Goal
Red-team payload/envelope split validator UX before implementation, focusing on bypass risk from:
1) error overload,
2) mode confusion,
3) false confidence between `manifest-valid` and `poststate-converged`.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted write-intent/publish/discover-service tests pass (`14 pass`)
- public surface check green

## Challenge findings

### 1) Error-overload collapse can drive manual bypass (high)
**Failure mode:** validator emits long, noisy error lists without prioritization; operators stop fixing root causes and start disabling checks or editing around failures.

**Impact:** strict controls exist on paper but are bypassed in practice; trust boundary degrades under time pressure.

**Mitigation:**
- cap fatal output to top-N primary issues with deterministic ordering,
- include `remainingIssueCount` for full context,
- require `--verbose` to print full issue tree.

---

### 2) Mode confusion (`strict` vs `compat`) can normalize weak validation (high)
**Failure mode:** local workflows default to `compat` and those artifacts are reused in CI/release claims, silently weakening guarantees.

**Impact:** operators think artifacts are compliant while CI-grade constraints were never applied.

**Mitigation:**
- CI must hard-pin `strict` and reject manifests stamped by `compat` mode,
- manifest output should include `validationMode` metadata,
- `compat` mode should print explicit non-release warning banner.

---

### 3) Terminology drift creates false completion confidence (high)
**Failure mode:** human-facing summaries conflate “schema/hash valid” with “execution complete”.

**Impact:** teams claim success before tx evidence and post-write chain semantics are verified.

**Mitigation:**
- lock three distinct states in output contract:
  1. `manifest-valid`
  2. `execution-verified`
  3. `poststate-converged`
- forbid using `converged` unless all three gates pass.

---

### 4) Hash-mismatch first reporting can hide root payload defects (medium-high)
**Failure mode:** hash mismatch shown before payload normalization/type errors; operators chase digest differences while structure remains invalid.

**Impact:** troubleshooting loops lengthen, increasing bypass temptation.

**Mitigation:**
- never emit hash mismatch as primary failure until structure/payload validity checks pass,
- output should include phase marker (`phase=payload-validation` vs `phase=hash-check`).

---

### 5) Copy-paste remediation hints can become accidental mutation scripts (medium)
**Failure mode:** “quick fix” snippets overwrite fields broadly and unintentionally alter intent semantics.

**Impact:** repaired manifest passes schema but changes intended write set.

**Mitigation:**
- remediation hints should be field-scoped, not whole-document rewrites,
- show before/after diff at affected JSON path,
- require explicit confirmation when fix changes hash-scope fields.

---

### 6) Unknown-key strictness can break migration windows unless versioned (medium)
**Failure mode:** strict unknown-key rejection blocks gradual rollout and leads teams to temporary validator forks.

**Impact:** fragmented validators and incompatible artifact ecosystems.

**Mitigation:**
- tie unknown-key policy to `schemaVersion` + migration window,
- provide `schema-upgrade` helper output for known transitions,
- disallow ad-hoc local schema patches in release path.

## Hardened rule (post-challenge)
Validator UX is acceptable only if all constraints hold:
1. prioritized deterministic issue output with controlled verbosity,
2. strict-mode provenance enforcement in CI,
3. explicit three-gate status taxonomy,
4. phase-ordered failure reporting (payload before hash),
5. field-scoped remediation with hash-change confirmation,
6. version-governed migration policy for strictness evolution.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- `ValidationIssue` prioritization/output policy,
- strict/compat provenance gating rules,
- three-gate status contract (`manifest-valid`/`execution-verified`/`poststate-converged`) and acceptance checks.
