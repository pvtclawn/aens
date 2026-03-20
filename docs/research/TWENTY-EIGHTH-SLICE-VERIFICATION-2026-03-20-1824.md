# Twenty-eighth ÆNS slice verification — publisher-assist artifact-trust hardening (2026-03-20 18:24 UTC)

## Purpose
Verify the publisher-assist artifact-trust hardening slice against:
- `docs/research/PLAN-PUBLISHER-ASSIST-ARTIFACT-TRUST-HARDENING-2026-03-20-1810.md`

The goals of this verification are:
1. confirm `proof-captured` now requires a strong final-proof artifact match
2. confirm weak/stale artifact matches remain advisory only
3. confirm `parent-authorized-verified` remains the honest non-terminal state without a strong match
4. decide whether this closes the current publisher-assist v1 artifact-trust thread

## Verification inputs
Files checked:
- `src/publish-assist.ts`
- `src/publish-assist.test.ts`
- `docs/research/PLAN-PUBLISHER-ASSIST-ARTIFACT-TRUST-HARDENING-2026-03-20-1810.md`

Checks run at verification time:
```bash
git status -sb
bunx tsc --noEmit
timeout --kill-after=2 40s bun test src/*.test.ts
timeout --kill-after=2 25s bun run publish-assist
grep -n "classifyProofArtifactBody\|Final proof artifact match detected\|Advisory proof artifact candidate detected\|strong-final-match\|advisory-candidate" src/publish-assist.ts src/publish-assist.test.ts
```

## Current repo/public truth
At verification time:
- `git status -sb` clean after the build slice commit
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`51 pass`)
- `bun run publish-assist` runs successfully on current live data and reports:
  - `Current publish state: preflight-ready`
  - `Final proof artifact match detected: no`
  - `Advisory proof artifact candidate detected: no`
- current public truth remains preferred-live:
  - preferred root `ok`
  - preferred child route `ok`
  - `Preferred public surface ready: yes`
  - `Bootstrap proof ready: no`

## Plan acceptance target 1 — strong final-proof artifact contract
**Pass.**

Observed in `src/publish-assist.ts`:
- artifact classification is now explicit via `classifyProofArtifactBody(...)`
- strong promotion requires:
  - structurally parsed proof fields
  - final-phase label (`final`)
  - publication mode / service URL alignment
  - current repo commit match
  - current child inspect command presence
  - explicit `Capability authorization: parent-authorized` evidence in the artifact body

Observed in tests:
- `classifyProofArtifactBody requires a strong final-proof artifact contract`
- strong final artifact body → `strong-final-match`
- post-root/stale artifact body → `advisory-candidate`

### Verdict
`proof-captured` is no longer driven by loose markdown-marker heuristics.

## Plan acceptance target 2 — weak/stale artifact matches are advisory only
**Pass.**

Observed in `src/publish-assist.ts`:
- weak artifact matches are stored separately as `proofArtifactCandidatePaths`
- render output exposes them as:
  - `Advisory proof artifact candidate detected: ...`
- weak matches do not promote state to `proof-captured`

Observed in tests:
- weak/stale artifact bodies classify as `advisory-candidate`
- parent-authorized current truth plus advisory candidate remains non-terminal

### Verdict
Local disk evidence remains visible, but it no longer silently overstates completion.

## Plan acceptance target 3 — `parent-authorized-verified` remains the honest non-terminal state without a strong match
**Pass.**

Observed in `src/publish-assist.ts`:
- when current live authority is `parent-authorized` and no strong final match exists, the tool returns:
  - `state: 'parent-authorized-verified'`
- the summary says final proof capture is the remaining legal step
- advisory candidates may still be shown in evidence lines, but they do not flip the terminal state

Observed in tests:
- no artifact match + current parent authorization → `parent-authorized-verified`
- weak artifact match + current parent authorization → `parent-authorized-verified`
- strong final artifact match + current parent authorization → `proof-captured`

### Verdict
The non-terminal honest state is now preserved correctly.

## Plan acceptance target 4 — tests prove the strong-vs-weak split
**Pass.**

Observed in `src/publish-assist.test.ts`:
- strong final artifact path covered
- weak/stale artifact path covered
- no-artifact-but-authorized path covered
- terminal-vs-non-terminal distinction covered

### Verdict
The slice is test-backed in the right place.

## Read-only / state-model scope check
**Pass.**

Observed in code shape:
- no new workflow states were added
- no writes or wallet automation were added
- no session-memory semantics were introduced
- the hardening is confined to artifact classification and state promotion rules

### Verdict
The slice stayed inside the planned guardrails.

## One honest caveat
The strong-final-match path is currently demonstrated by tests rather than by a real live final proof artifact on disk, because the first live ENS publication session has not happened yet.

This is **not** a blocker for the slice itself.
It simply means the live branch still awaits real-world exercise after the human-wallet session exists.

## Does this close the current artifact-trust thread?
**Yes.**

Why:
- the identified trust weakness was specific: weak local artifacts could over-promote completion
- the new contract fixes that specific problem
- the tests prove the intended split
- live CLI behavior remains sane after hardening
- no new scope or fake state-model complexity was introduced

The next meaningful work should not be more artifact-trust theory.
It should return either to:
- actual live ENS publication/proof capture when Egor is present
- or adjacent publisher-assist/product improvements beyond this trust-hardening boundary

## Core delta
None.
This verification does not change the parent/child authorization model.

## Rail delta
Moderate.
This verifies adjacent publisher-assist v1 hardening.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting tool/UX verification, not protocol-center progress.

## Verdict
The publisher-assist artifact-trust hardening slice **passes**.

It satisfies the frozen plan.
Weak/stale artifacts are advisory only.
And it closes the current publisher-assist v1 artifact-trust thread cleanly.
