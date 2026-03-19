# Tenth AENS slice — declared/observed consistency guard (2026-03-19 04:32 UTC)

## Goal
Make the collapsed undeclared observed summary an explicit cross-view invariant rather than a local renderer assumption.

## Slice
Add a reusable predicate over the declared proof view and observed proof view that allows the collapsed undeclared observed summary only when:
- the declared proof view is fully empty
- and every observed state is `not-declared`

Then route the observed renderer through that predicate and add contradiction tests.

## What this adds
- reusable cross-view guard predicate in `src/report.ts`
- contradiction tests for:
  - all-undeclared + empty declared view → collapse allowed
  - all-undeclared + non-empty declared view → collapse forbidden
  - mixed observed states → collapse forbidden

## Why this matters
This hardens the declared/observed relationship into an explicit invariant instead of relying only on the current derivation path.

## Scope boundary
This slice does **not** add:
- new observed states
- additional wording changes
- broader report restructuring

## Success criterion
The collapsed undeclared observed summary can only render when both source-of-truth views explicitly agree that no proof material exists.
