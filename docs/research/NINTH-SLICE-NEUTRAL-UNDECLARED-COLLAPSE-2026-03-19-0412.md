# Ninth AENS slice — neutral undeclared observed-output collapse (2026-03-19 04:12 UTC)

## Goal
Make ordinary ENS profiles quieter by collapsing repeated neutral undeclared observed states, without hiding meaningful differences.

## Slice
Add a strict all-undeclared collapse predicate to the observed proof section:
- if all observed proof states are `not-declared`, render one neutral summary line
- otherwise keep per-kind observed lines

## What this adds
- strict collapse predicate in `src/report.ts`
- direct tests for:
  - all-undeclared collapse
  - mixed-state no-collapse
- observed output now collapses pure sameness while preserving meaningful contrasts

## Why this matters
The explicit observed-state model is already correct.
This slice improves readability on ordinary ENS profiles without weakening the state model or hiding mixed operational states.

## Scope boundary
This slice does **not** yet add:
- declared/observed contradiction guard logic beyond the current state model
- extra invalid-detail wording refinement
- broader report simplification outside the observed section

## Success criterion
For profiles with no proof material declared, the observed section collapses to one neutral line.
For any mixed state set, per-kind observed lines remain visible.
