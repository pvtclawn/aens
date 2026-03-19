# Challenge — neutral undeclared collapse risk (2026-03-19 04:00 UTC)

## Purpose
Red-team the planned neutral-undeclared observed-output cleanup before building it.

## Verdict
The direction is correct, but the slice can still fail if the collapse rule does more than compress pure sameness.

## Main risks
1. **Over-collapse**
   - mixed states get flattened when only some lines are `not-declared`
2. **Declared/observed contradiction**
   - collapsed undeclared summary appears even when proof URLs are declared
3. **Lost comparability**
   - per-kind structure disappears too aggressively
4. **Failure-shaped wording**
   - summary sounds like missing work instead of absent declaration
5. **Weak collapse tests**
   - string-only assertions miss the real collapse invariant
6. **Brittle implementation**
   - rule hardcodes today’s proof kinds instead of using the observed-state list generically

## Required safeguards
- collapse only when **all** observed states are `not-declared`
- impossible to collapse if any proof URL is declared
- keep summary wording neutral
- preserve the underlying per-kind state model in code
- test all-undeclared collapse and mixed-state no-collapse directly
- implement the rule generically over the observed-state set

## Bottom line
The next slice should be judged by whether it compresses pure sameness without hiding meaningful differences or contradicting the declared proof surface.
