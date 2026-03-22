# One-Hundred-Forty-Ninth Slice Challenge — Immutable Primary-Lock / Source Diagnostics Edge Risks (2026-03-22 09:36 UTC)

## Goal
Red-team the upcoming immutable primary-lock/source diagnostics implementation, focusing on:
1) lock mutation leakage,
2) source-glossary drift,
3) compact verbosity regressions.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted suite pass (`13 pass`)
- app build pass
- public surface check green

## Challenge findings

### 1) Lock can be semantically mutated without field mutation (high)
**Failure mode:** downstream adapters keep `primaryLocked=true` unchanged but rewrite primary reason/source text aliases (e.g., `ownership-contract` -> `ownership`) and effectively change operator interpretation.

**Impact:** contract appears intact to schema checks while human and automation semantics drift.

**Mitigation:**
- lock invariants must compare canonical token values, not just presence,
- add canonical enum guards for `primarySource` and `primarySelectionReason`,
- parity checks should fail on aliasing as `primary-lock-integrity-violation`.

---

### 2) Glossary drift across surfaces can invert remediation behavior (high)
**Failure mode:** UI glossary maps `stage-gate` as “policy gate failure,” while CLI maps it as “earliest failing stage.”

**Impact:** teams fix wrong subsystem depending on where they read diagnostics.

**Mitigation:**
- centralize glossary constants in shared module,
- enforce docs/UI/CLI snapshot parity on glossary text,
- block release if glossary checksum differs across renderers.

---

### 3) Compact-mode token pressure can collapse critical lock/source fields (high)
**Failure mode:** compact formatter drops `primarySelectionReason` or `primaryLocked` during truncation/character-budget paths.

**Impact:** shortest output (often most used in logs/alerts) loses immutability context.

**Mitigation:**
- treat lock/source/reason as non-droppable minimum set,
- trim secondary diagnostics first,
- add max-length fixtures proving required trio survives compression.

---

### 4) Serializer reorder can imply mutable priority accidentally (medium-high)
**Failure mode:** reordered fields place stage context before lock/source header in verbose output.

**Impact:** operators interpret stage as primary and lock as optional metadata.

**Mitigation:**
- fixed ordering contract (lock -> source -> reason -> stage context),
- order-specific snapshot tests,
- linter check for canonical diagnostic section order.

---

### 5) “None” source path can be over-locked by generic wrappers (medium-high)
**Failure mode:** shared wrappers stamp `primaryLocked=true` globally, including `primarySource=none` runs.

**Impact:** false immutability claims with no actual primary selection.

**Mitigation:**
- explicit invariant: `primarySource=none` implies `primaryLocked=false`,
- guard function rejects contradictory tuple,
- fixtures for no-failure runs across compact+verbose modes.

---

### 6) Lock violation signaling can be downgraded to cosmetic warnings (medium)
**Failure mode:** adapter reports locked-primary mutation as warning-level diff instead of contract failure.

**Impact:** CI passes despite primary-integrity breach.

**Mitigation:**
- classify lock mutations as hard-fail severity,
- reserve warning level for non-lock cosmetic differences only,
- add policy test to ensure lock violations fail pipeline.

---

### 7) Cross-version clients can misread new lock/source fields silently (medium)
**Failure mode:** older clients ignore `primarySelectionReason` and infer source from stage fields.

**Impact:** mixed fleet behavior with contradictory conclusions.

**Mitigation:**
- include diagnostics schema version and minimum reader expectations,
- emit compatibility warning when client lacks lock/source awareness,
- keep backward compatibility but mark inferred-source mode as non-authoritative.

## Hardened rule (post-challenge)
Immutable primary-lock/source diagnostics are acceptable only if:
1. canonical token values (not just field presence) are parity-locked,
2. glossary text is shared and checksum-verifiable across surfaces,
3. compact output preserves non-droppable lock/source/reason trio,
4. verbose ordering is fixed and test-enforced,
5. `primarySource=none` cannot be locked,
6. lock mutations are hard-fail integrity violations,
7. cross-version inference modes are explicitly non-authoritative.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- canonical enum+tuple integrity guards,
- glossary parity enforcement and checksum checks,
- compact non-droppable lock/source/reason retention tests.
