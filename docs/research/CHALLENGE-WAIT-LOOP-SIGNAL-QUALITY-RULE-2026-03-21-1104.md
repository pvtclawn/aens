# Challenge — Wait-Loop Signal-Quality Rule (2026-03-21 11:04 UTC)

## Target challenged
`docs/research/LEARNING-SIGNAL-QUALITY-IN-WAIT-LOOPS-2026-03-21-1059.md`

## Why challenge now
The rule improves focus, but can still hide failure modes if “minimal checks” become too shallow or too infrequent.

## Main blind spots

### 1) Reminder under-frequency can delay dependency resolution
A sparse reminder cadence avoids spam, but if too sparse it may delay delivery of required assets.

**Mitigation:** bound reminder silence with a maximum interval:
- if required assets remain TODO, issue at least one concise reminder per freshness window,
- escalate wording only when window count passes a threshold.

### 2) Shallow link checks can pass while practical judge access still fails
A link resolving technically is not equal to judge-readable access (auth walls, region/cookie effects, embed restrictions).

**Mitigation:** add explicit “judge access” check mode:
- verify from unauthenticated context,
- verify at least one non-owner runtime/path can open the asset.

### 3) Binary notes can omit trend visibility
Repeated binary `NO-SUBMIT` notes preserve integrity but can hide time-to-resolution risk.

**Mitigation:** add tiny trend marker in each refresh note:
- `blocked_since`, `windows_elapsed`, and `last_reminder_at`.

### 4) Minimalism can under-detect requirement drift
If checklists only test old known requirements, new submission-field changes could be missed.

**Mitigation:** periodic requirement-sync checkpoint:
- lightweight re-read of current submission requirements at fixed interval,
- explicit “requirements unchanged/changed” line in boundary refresh.

## Red-team verdict
The signal-quality rule is directionally strong, but needs guardrails for reminder timing, real judge accessibility, and drift visibility.

## Stronger rule (proposed)
Keep minimalist wait loops, but require:
1. freshness-window reminder floor,
2. explicit judge-access validation,
3. compact blocked-time trend markers,
4. periodic requirement-sync checkpoint.
