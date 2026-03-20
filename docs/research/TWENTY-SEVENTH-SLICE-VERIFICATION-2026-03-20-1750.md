# Twenty-seventh ÆNS slice verification — minimal publisher-assist v1 CLI (2026-03-20 17:50 UTC)

## Purpose
Verify the new read-only publisher-assist CLI against:
- `docs/research/PLAN-MINIMAL-PUBLISHER-ASSIST-STATE-MACHINE-V1-2026-03-20-1731.md`
- `docs/research/CHALLENGE-PUBLISHER-ASSIST-STATE-MACHINE-RISK-2026-03-20-1726.md`

The goals of this verification are:
1. confirm the v1 plan acceptance targets actually landed
2. confirm the new CLI is evidence-derived and still read-only
3. decide whether the slice is cleanly usable as-is or still has one meaningful gap

## Verification inputs
Files checked:
- `src/publish-assist.ts`
- `src/publish-assist.test.ts`
- `package.json`
- `docs/research/PLAN-MINIMAL-PUBLISHER-ASSIST-STATE-MACHINE-V1-2026-03-20-1731.md`
- `docs/research/CHALLENGE-PUBLISHER-ASSIST-STATE-MACHINE-RISK-2026-03-20-1726.md`

Checks run at verification time:
```bash
git status -sb
bunx tsc --noEmit
timeout --kill-after=2 40s bun test src/*.test.ts
timeout --kill-after=2 25s bun run publish-assist; echo EXIT:$?
grep -n "Current publish state\|Human review required before write\|needs-operator-reconcile\|aborted\|proof-captured\|buildCaptureCommand\|resolveAensProfile\|fetchPublicProofState\|findProofArtifacts" src/publish-assist.ts
grep -n "preflight-ready\|needs-operator-reconcile\|needs-parent-authorization\|parent-authorized-verified\|proof-captured" src/publish-assist.test.ts
```

## Current repo/public truth
At verification time:
- `git status -sb` clean after the build slice commit
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`50 pass`)
- `bun run publish-assist` runs successfully on current live data and prints:
  - `Current publish state: preflight-ready`
  - one next legal step
  - explicit human review checks
  - follow-up verification commands
- current public truth remains:
  - preferred root `ok`
  - preferred child route `ok`
  - `Preferred public surface ready: yes`
  - `Bootstrap proof ready: no`

## Plan acceptance target 1 — derive one current publish state from fresh evidence
**Pass.**

Observed in `src/publish-assist.ts`:
- state is derived from fresh ENS reads via `resolveAensProfile(...)`
- current public truth is derived from `fetchPublicProofState(...)`
- proof-artifact detection is derived from actual markdown files under the proof dir via `findProofArtifacts(...)`
- state output is rendered as a single `Current publish state: ...`

Observed in behavior:
- the live invocation currently classifies the real environment as `preflight-ready`

### Verdict
The CLI is not just printing a canned checklist.
It derives a real current state from fresh observed truth.

## Plan acceptance target 2 — print only the next legal step + human-review checkpoint before writes
**Pass.**

Observed in `src/publish-assist.ts`:
- every write-oriented state returns one `nextLegalStep`
- write-oriented states include `humanReviewRequired`
- render output includes `Human review required before write:`
- human-review lines include:
  - wrapped-owner wallet connected
  - expected name/UI target
  - no suspicious gas / contract / UI mismatch

Observed in live behavior:
- current `preflight-ready` output prints one next legal step and the human-review block before the first root write

### Verdict
The tool improves the operator path without implying that wallet prompts are automatically safe.

## Plan acceptance target 3 — print follow-up verification commands
**Pass.**

Observed in `src/publish-assist.ts`:
- the result object carries `followUpVerificationCommands`
- write-oriented states print `bun run inspect ...` and/or `bun run capture-proof ...`
- final-authority states print the expected capture/check commands

Observed in live behavior:
- the `preflight-ready` output prints:
  - `bun run inspect pvtclawn.eth`
  - `AENS_PROOF_PUBLICATION_MODE=preferred ... bun run capture-proof -- post-root`

### Verdict
The CLI points the operator back into the existing verified read/proof path instead of trying to hide it.

## Challenge safeguard check

### Safeguard 1 — evidence-derived transitions only
**Pass.**

Observed load-bearing inputs:
- fresh root ENS read
- fresh child ENS read
- fresh public proof state
- actual proof artifact presence

The CLI does not advance from internal click-memory alone.

### Safeguard 2 — explicit `human review required` before each write
**Pass.**

Observed in render output and state handlers.
This preserves human judgment at the wallet boundary.

### Safeguard 3 — reconcile behavior when observed truth diverges
**Pass.**

Observed in code:
- `needs-operator-reconcile` is a first-class state
- reconcile reasons include public-truth failures, root/child read failures, identity mismatch, unexpected parent/service URL, and out-of-order child progress

Observed in tests:
- there is an explicit test proving `needs-operator-reconcile` when preferred public truth is not ready

### Safeguard 4 — deliberately tiny v1 state set
**Pass.**

Observed state set stays narrow:
- `preflight-ready`
- `root-needs-write`
- `root-verified`
- `child-needs-create-or-write`
- `child-verified-provisional`
- `needs-parent-authorization`
- `parent-authorized-verified`
- `proof-captured`
- `needs-operator-reconcile`
- `aborted`

This is small enough to be useful without turning into a broad wizard framework.

## Read-only / no-wallet-automation check
**Pass.**

Observed in code shape:
- `src/publish-assist.ts` imports read-side building blocks only:
  - `resolveAensProfile`
  - `fetchPublicProofState`
  - proof-artifact file reads
- it does not import or call wallet clients, transaction senders, or ENS write helpers
- package wiring adds only a read-only script:
  - `bun run publish-assist`

### Verdict
The slice stays within the planned guardrail: no writes, no hidden signing, no wallet automation.

## One meaningful remaining gap
There is **one small but real gap**:
- `aborted` exists as a terminal state in the code, but this verification did not demonstrate a realistic, load-bearing path into it the way `needs-operator-reconcile` was demonstrated.

Why this matters:
- the plan/challenge language grouped `reconcile/abort` together as terminal honesty states
- in practice, the current v1 logic strongly prefers `needs-operator-reconcile` for divergence, which is probably fine
- but `aborted` currently looks more like a defensive fallback than a proved, meaningful operator state

### Recommended interpretation
This is **not** a blocker for using v1.
The CLI is already useful and honest.
But the next adjacent refinement should clarify one of two directions:
1. either define one explicit real-world `aborted` condition and test it
2. or narrow the plan language so `needs-operator-reconcile` is the main divergence terminal state for v1

## Core delta
None.
This verification does not change the parent/child authorization model.

## Rail delta
Moderate.
This verifies adjacent post-proof UX tooling.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product/UX verification, not protocol-center progress.

## Verdict
The new read-only publisher-assist CLI **passes** its minimal v1 goals.

It is:
- evidence-derived
- read-only
- judgment-preserving
- small enough to avoid wizard bloat
- useful on current live data

The only meaningful remaining gap is that `aborted` is present but not yet a clearly demonstrated, load-bearing terminal state in the same way `needs-operator-reconcile` is.
