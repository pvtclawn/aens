# Challenge — declared/observed consistency guard risk (2026-03-19 04:27 UTC)

## Purpose
Red-team the planned declared/observed consistency guard before building it.

## Verdict
The direction is correct, but the slice can still fail if the guard becomes a local renderer special case instead of an explicit cross-view invariant.

## Main risks
1. **Local guard, global drift**
   - one formatting branch is protected, but the declared/observed relationship remains implicit elsewhere
2. **Partial declared-view drift**
   - contradiction can still appear if `proofSurfacePresent`, `proofsUrl`, and `receiptsUrl` drift out of sync
3. **Overfitting today’s proof kinds**
   - hardcoded assumptions around `proofs` / `receipts` make the guard brittle
4. **Hidden-derivation dependence**
   - the slice may look successful without adding a stronger guarantee than today’s derivation path already gives
5. **Weak tests**
   - output-only assertions can miss whether the invariant is actually enforced

## Required safeguards
- express the guard as a reusable cross-view predicate
- require the full declared proof view to agree before collapse is allowed
- implement the rule generically over the observed-state set
- add synthetic contradiction cases that only the explicit guard catches
- test the invariant directly, not only the final rendered string

## Bottom line
The next slice should be judged by whether it turns declared/observed consistency into an explicit invariant, not by whether the collapsed summary merely looks safer.
