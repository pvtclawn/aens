# Challenge — Check-Completeness Token Reliance (2026-03-21 13:14 UTC)

## Target challenged
`docs/research/LEARNING-CHECK-COMPLETENESS-TOKENS-IN-NO-CHANGE-LOOPS-2026-03-21-1309.md`

## Why challenge now
`checks=4/4` improves clarity, but token presence alone can be spoofed or drift from actual check semantics.

## Main blind spots

### 1) Token spoofing risk
Operators can paste `checks=4/4` without actually running all checks.

**Mitigation:** require a compact evidence anchor in the same refresh note:
- `evidence_anchor=<tsc:test:surface run timestamp block>`
- or include command-run timestamp tuple that maps to the refresh window.

### 2) Stale expected-set assumptions
The fixed check-set may become outdated if operational requirements change.

**Mitigation:** version the expected set:
- `checkset_version=v1` in schema,
- update version and docs when expected checks change.

### 3) Pass/fail opacity inside completeness token
`4/4` says checks were run, not whether each passed before decision.

**Mitigation:** add a pass-state compact token:
- `checks_pass=4/4` (or equivalent),
- keep decision invalid if pass token is incomplete.

### 4) Token can detach from blocker truth
A complete check token can coexist with stale blocker fields if asset-state checks are cached or not refreshed.

**Mitigation:** require blocker snapshot timestamp alignment with marker timestamp:
- `blocker_checked_at` equals `marker_updated_at` for unchanged decisions.

## Red-team verdict
Completeness tokens are a good baseline, but insufficient alone.
Without anti-spoof anchors, checkset versioning, pass-state clarity, and blocker-timestamp linkage, they can still under-signal risk.

## Stronger rule (proposed)
Treat evidence-line completeness as valid only when all are present:
1. `checkset_version`,
2. run completeness + pass completeness,
3. blocker snapshot with timestamp linkage,
4. compact evidence anchor for the refresh window.
