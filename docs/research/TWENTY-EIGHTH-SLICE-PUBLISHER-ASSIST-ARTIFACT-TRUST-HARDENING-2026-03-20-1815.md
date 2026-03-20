# Twenty-eighth ÆNS slice — publisher-assist artifact-trust hardening (2026-03-20 18:15 UTC)

## Purpose
Execute the first build step from:
- `docs/research/PLAN-PUBLISHER-ASSIST-ARTIFACT-TRUST-HARDENING-2026-03-20-1810.md`

Harden publisher-assist v1 so `proof-captured` requires a strong final-proof artifact match instead of a weak local-markdown heuristic.

## Files changed
- `src/publish-assist.ts`
- `src/publish-assist.test.ts`

## What changed
### 1) Strong final-proof artifact contract
`src/publish-assist.ts` now classifies local proof artifacts with a stronger contract.
A local artifact only promotes state to `proof-captured` if it is a **strong final match**.

Required signals now include:
- structurally expected proof header fields
- final-phase label (`final`)
- expected publication mode / service URL alignment
- current repo commit match
- current child ENS name in the artifact
- explicit `Capability authorization: parent-authorized` result in the captured child inspection output

So `proof-captured` is no longer triggered by loose substring presence alone.

### 2) Weak artifact matches are advisory only
Artifacts that still look related but do not satisfy the full final-proof contract are now treated as:
- `advisory proof artifact candidate`

These advisory matches remain visible in evidence output, but they do **not** flip the terminal state.
If current live truth is `parent-authorized` and artifact evidence is weak, the state now remains:
- `parent-authorized-verified`

### 3) Snapshot resolution now respects the current commit boundary
The snapshot path now reads the current repo commit and uses it when classifying proof artifacts.
That reduces the chance that stale historical artifacts are mistaken for current terminal proof completion.

## Tests added/updated
`src/publish-assist.test.ts` now proves:
1. strong final-proof artifact body → `strong-final-match`
2. weak/stale artifact body → `advisory-candidate`
3. current parent-authorized live state with no/weak artifact → stays `parent-authorized-verified`
4. current parent-authorized live state with strong artifact → `proof-captured`

## Verification
At slice time:
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`51 pass`)
- `bun run publish-assist` still runs cleanly on current live data and reports:
  - `Current publish state: preflight-ready`
  - `Final proof artifact match detected: no`
  - `Advisory proof artifact candidate detected: no`

## Acceptance mapping
Planned hardening target | Result
- strong final-proof artifact contract | ✅
- weak/stale artifact matches become advisory only | ✅
- parent-authorized remains honest non-terminal state without strong final match | ✅
- tests prove strong vs weak artifact behavior | ✅

## Core delta
None.
No change to the parent/child authorization model.

## Rail delta
Moderate.
This is adjacent publisher-assist v1 hardening.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting tool/UX hardening, not protocol-center progress.

## Result
Publisher-assist v1 now treats local proof artifacts more skeptically.
Fresh ENS/public truth remains load-bearing, and local disk evidence only earns terminal-state authority when it matches a strong final-proof contract.
