# Ninety-Fourth Slice Learning — Commit/Version Allowlist Governance Ergonomics (2026-03-22 00:38 UTC)

## Context
The commit/version allowlist boundary is now frozen. The remaining risk is operational: strict allowlists can protect release integrity, but unmanaged policy churn can either block healthy upgrades or encourage unsafe bypass patterns.

## Applied learning

### 1) Policy updates should be coupled to code upgrades by construction
If validator/schema upgrades land without allowlist updates (or vice versa), CI churn and emergency patching become routine.

**Rule:** require an atomic change set for upgrade PRs:
1. code/version bump,
2. allowlist update,
3. migration note + expected compatibility window,
4. CI fixture updates.

### 2) “Unknown version hard-fail” needs fast-path remediation UX
Hard-fail is correct for trust, but poor error guidance causes rollback thrash under deadlines.

**Rule:** unsupported-version blocker must include deterministic next action:
- expected allowlist file path,
- current policy version,
- missing version value,
- exact checklist item to unblock.

### 3) Commit binding must be CI-resolved, not user-supplied
Operator-provided commit fields are useful for evidence but unsafe as authority.

**Rule:** derive `expectedCommit` from CI context and compare exactly against artifact `validatedCommit`; never accept commit hints from manual input as gate truth.

### 4) Allowlist scope should be narrow and explicit
Broad semver ranges reduce churn but create hidden trust expansion.

**Rule:** prefer explicit approved versions over wildcard ranges for release gates; use controlled migration windows instead of permissive matching.

### 5) Churn control comes from staged policy windows, not relaxed strictness
Teams often over-relax strict mode when frequent upgrades happen.

**Rule:** keep strict gate invariant, but add staged policy windows:
- `active` versions (release-eligible),
- `grace` versions (visible warning, non-release),
- `deprecated` versions (hard fail).

This preserves trust while smoothing upgrades.

### 6) Governance visibility reduces accidental drift
When policy changes are scattered across docs and code, people miss implications.

**Rule:** publish a single policy digest in CI logs for every gate run:
- `policyVersion`,
- active allowlists,
- evaluated artifact version/commit,
- blocker reason (if any).

### 7) Release-block churn should be measured, not guessed
Without metrics, teams may optimize for fewer red builds by weakening controls.

**Rule:** track and review:
- block counts by reason code,
- mean time to unblock allowlist failures,
- ratio of version-mismatch failures to total release checks.

Use data to improve governance workflow, not to loosen trust predicates.

## Immediate implementation guidance
- Add machine-readable policy file with explicit active/grace/deprecated version buckets.
- Add CI helper that prints deterministic remediation hints for unsupported versions.
- Keep strict fail-closed semantics unchanged; optimize only the unblock path and policy update workflow.
