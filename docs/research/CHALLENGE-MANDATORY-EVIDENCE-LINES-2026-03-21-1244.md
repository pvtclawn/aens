# Challenge — Mandatory Evidence Lines (2026-03-21 12:44 UTC)

## Target challenged
`docs/research/LEARNING-MANDATORY-EVIDENCE-LINES-IN-NO-CHANGE-LOOPS-2026-03-21-1239.md`

## Why challenge now
Mandatory evidence lines improve traceability, but they can still degrade into schema-compliant noise without substantive checks.

## Main blind spots

### 1) Schema compliance without check quality
A line can be filled mechanically while underlying checks are partial or stale.

**Mitigation:** require explicit minimum check-set tokens in each line:
- `tsc`, `tests`, `public-surface`, and `asset fields`.

### 2) “unchanged” can hide partial reruns
Operators may rerun only one check and still mark `unchanged`.

**Mitigation:** include `checks_passed_count/expected_count` marker or equivalent compact completeness flag.

### 3) Timestamp truth without source linkage
A fresh evidence timestamp may not link to marker updates, enabling drift between note and bundle index.

**Mitigation:** require `marker_updated_at` to equal (or be derived from) the evidence-line timestamp in the same refresh.

### 4) Decision label can outlive blocker reality
If one asset changes state but decision label remains static, evidence lines can appear consistent while meaning shifts.

**Mitigation:** require blocker-vector snapshot in every evidence line (`video_status`, `log_status`) so decision is tied to state.

## Red-team verdict
Mandatory evidence lines are useful, but not sufficient alone.
Without check completeness, marker linkage, and blocker-state coupling, they can become formalism.

## Stronger rule (proposed)
Every evidence line should include:
1. minimum check-set completeness,
2. explicit blocker vector,
3. marker timestamp linkage,
4. explicit decision.
