# Challenge — Boundary Preservation Rule (2026-03-21 10:34 UTC)

## Target challenged
`docs/research/LEARNING-BOUNDARY-PRESERVATION-UNDER-NO-CHANGE-2026-03-21-1029.md`

## Why challenge now
The rule helps prevent fake progress loops, but can itself become risky if treated as an indefinite waiting policy.

## Main blind spots

### 1) No-change can hide silent context drift
External blocker fields can stay TODO while underlying submission requirements, track guidance, or host access conditions change.

**Mitigation:** add periodic context-validity checks during wait loops:
- verify form requirements are unchanged,
- verify linked canonical surfaces still resolve,
- verify track/metadata assumptions still match current submission form.

### 2) Binary boundary can mask aging evidence
A stable `NO-SUBMIT` decision is correct, but stale evidence notes can mislead if they are not refreshed over long waits.

**Mitigation:** timestamp freshness window for boundary evidence:
- if boundary evidence is older than a set window (e.g., same day / fixed hour window), refresh one concise scan.

### 3) Wait discipline can become passive dependency blind spot
When blockers are external, there is still a risk of never proactively requesting the missing assets from the responsible human workflow.

**Mitigation:** pair wait rule with explicit external dependency prompt cadence:
- keep one concise “required assets still missing” reminder in coordination channel at sensible intervals.

### 4) Technical drift during waiting still possible
Even with no submission-asset change, repo/runtime truth can regress between checks.

**Mitigation:** retain lightweight health baseline in each boundary refresh:
- `git status`, typecheck/tests, and live surface check before reaffirming boundary.

## Red-team verdict
Boundary preservation is necessary to avoid churn, but insufficient on its own.
Without drift, freshness, and dependency-prompt mitigations, it can turn into quiet staleness.

## Stronger rule (proposed)
Preserve `NO-SUBMIT` boundary only when all hold:
1. external required assets still missing,
2. boundary evidence is fresh,
3. core technical baseline remains green,
4. dependency reminder loop is active but non-spammy.
