# Twenty-ninth ÆNS slice — publisher-assist pre-write gate UX tightening (2026-03-20 18:44 UTC)

## Purpose
Execute the tiny output-only UX tightening plan from:
- `docs/research/PLAN-PUBLISHER-ASSIST-PRE-WRITE-GATE-UX-TIGHTENING-2026-03-20-1839.md`

This slice does **not** change the publisher-assist state model.
It only tightens how write-oriented output communicates the tool’s role.

## Files changed
- `src/publish-assist.ts`
- `src/publish-assist.test.ts`

## What changed
### 1) Write-oriented output now says what it is
For states that lead into a real ENS write, render output now includes a short:
- `Phase-boundary guidance:` block

That block says explicitly:
- use this **after verification and before the next write**
- this is **not a replacement for the runbook**
- return to the operator steps for exact write/browser details

This reduces the risk that `next legal step` gets mistaken for the entire phase script.

### 2) Human review is now visibly tied to the guidance block
The write-oriented review header now reads:
- `Human review required before write (guidance only — this tool does not approve wallet prompts):`

This keeps the non-permission boundary explicit right where the operator is most likely to over-trust the CLI.

### 3) Non-write states stay clean
The new phase-boundary guidance is not injected into non-write states like:
- `parent-authorized-verified`
- `proof-captured`

So the tool becomes clearer without turning every output into extra ceremony.

## Tests added
`src/publish-assist.test.ts` now proves:
1. write-oriented output includes:
   - phase-boundary guidance
   - runbook handoff cue
   - non-permission human-review wording
2. non-write states do **not** get the pre-write guidance block

## Verification
At slice time:
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`53 pass`)
- `bun run publish-assist` runs successfully on current live data and now prints:
  - current state = `preflight-ready`
  - one next legal step
  - `Phase-boundary guidance`
  - `Human review required before write (guidance only — this tool does not approve wallet prompts)`
  - runbook handoff cue

## Acceptance mapping
Planned UX-tightening target | Result
- explicit phase-boundary guidance for write states | ✅
- guidance says after verification / before next write | ✅
- guidance says not a replacement for runbook | ✅
- human review remains visually tied to the next step | ✅
- minimal runbook handoff cue | ✅
- no state-model expansion | ✅

## Core delta
None.
No change to the parent/child authorization model or publisher-assist state machine.

## Rail delta
Moderate.
This is adjacent publisher-assist v1 UX tightening.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting tool/UX hardening, not protocol-center progress.

## Result
Publisher-assist v1 is now slightly harder to misuse in the first live session:
- it still provides a clear next legal step
- but it now more clearly frames itself as a pre-write gate, not the whole session guide and not a machine permission slip
