# Challenge — Tiny Machine-Check Governance Strategy (2026-03-21 18:04 UTC)

## Target challenged
`docs/research/LEARNING-TINY-MACHINE-CHECKS-OVER-HEAVY-POLICY-STACKS-2026-03-21-1759.md`

## Why challenge now
Tiny checks preserve speed, but small validators can create false confidence if coverage and drift controls are weak.

## Main blind spots

### 1) Partial-coverage confidence trap
A validator that checks only checklist presence may pass while critical process failures occur outside its scope.

**Mitigation:** explicitly label validator scope and known non-covered controls; require periodic gap review.

### 2) Validator drift from policy docs
As procedure docs evolve, validators can become outdated and silently accept stale rules.

**Mitigation:** add a version tie between policy docs and validator (`policy_version`), and fail if versions diverge.

### 3) Pass/fail without severity weighting
Not all failures are equal; a missing revocation ref is higher risk than a formatting typo.

**Mitigation:** classify check failures by severity (`critical|warning`) and block high-risk windows on critical failures.

### 4) Local-only validation blind spots
Manual local runs can be skipped; governance checks should not depend on operator memory.

**Mitigation:** require validator run in CI/pre-merge path for probe-governance file changes.

## Red-team verdict
Tiny machine checks are the right direction, but they need explicit scope transparency, version coupling, severity semantics, and enforced execution path to avoid shallow compliance.

## Stronger rule (proposed)
Keep checks lightweight, but require:
1. scope declaration + gap list,
2. policy-version coupling,
3. critical/warning severity classification,
4. CI-enforced execution for relevant changes.
