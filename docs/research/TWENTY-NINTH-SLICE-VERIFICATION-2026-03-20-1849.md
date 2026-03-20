# Twenty-ninth ÆNS slice verification — publisher-assist pre-write gate UX tightening (2026-03-20 18:49 UTC)

## Purpose
Verify the publisher-assist pre-write-gate UX tightening slice against:
- `docs/research/PLAN-PUBLISHER-ASSIST-PRE-WRITE-GATE-UX-TIGHTENING-2026-03-20-1839.md`

The goals of this verification are:
1. confirm write-oriented output now clearly reads as phase-boundary guidance
2. confirm `human review required` stays visually tied to that guidance
3. confirm non-write states remain clean
4. confirm no state-model expansion slipped in

## Verification inputs
Files checked:
- `src/publish-assist.ts`
- `src/publish-assist.test.ts`
- `docs/research/PLAN-PUBLISHER-ASSIST-PRE-WRITE-GATE-UX-TIGHTENING-2026-03-20-1839.md`

Checks run at verification time:
```bash
git status -sb
bunx tsc --noEmit
timeout --kill-after=2 40s bun test src/*.test.ts
timeout --kill-after=2 25s bun run publish-assist
```

## Current repo/public truth
At verification time:
- `git status -sb` clean after the build slice commit
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`53 pass`)
- `bun run publish-assist` runs successfully on current live data and reports:
  - `Current publish state: preflight-ready`
  - one next legal step
  - `Phase-boundary guidance:` block
  - explicit non-permission human-review wording
  - runbook handoff cue

## Plan acceptance target 1 — explicit phase-boundary guidance for write-oriented states
**Pass.**

Observed in `src/publish-assist.ts`:
- write-oriented output now includes a `Phase-boundary guidance:` block
- the block says:
  - `Use this after verification and before the next write.`
  - `This is guidance for the next phase boundary, not a replacement for the runbook.`
- the block also includes a minimal operator-steps handoff path

Observed in live CLI behavior:
- current `preflight-ready` output shows the new guidance block directly under `Next legal step`

### Verdict
The output now communicates role boundaries more clearly without drowning the next step in extra prose.

## Plan acceptance target 2 — human review remains visually tied to guidance
**Pass.**

Observed in `src/publish-assist.ts`:
- the review header now reads:
  - `Human review required before write (guidance only — this tool does not approve wallet prompts):`
- it is rendered immediately after the phase-boundary guidance block for write-oriented states

Observed in tests:
- `renderPublishAssistResult keeps write-oriented guidance bounded and tied to human review`

### Verdict
The CLI still gives guidance, but it is now slightly harder to misread as machine permissioning.

## Plan acceptance target 3 — minimal runbook handoff cue
**Pass.**

Observed in `src/publish-assist.ts`:
- the guidance block points back to:
  - `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`
- it does so without turning the CLI into a payload-heavy phase script

### Verdict
The tool now hands the operator back to the real phase script instead of sounding self-sufficient.

## Plan acceptance target 4 — non-write states remain clean
**Pass.**

Observed in tests:
- `renderPublishAssistResult does not add pre-write guidance to non-write states`
- the test proves non-write states like `parent-authorized-verified` do not get the pre-write guidance block or the write-review header

### Verdict
The UX tightening stayed focused and did not turn every output into extra ceremony.

## State-model expansion check
**Pass.**

Observed in code shape:
- no new workflow states were added
- no new session-memory behavior was added
- the change is limited to render/output wording and lightweight tests

### Verdict
The slice stayed inside the frozen guardrails.

## One honest caveat
The UX tightening reduces misuse risk, but it cannot by itself guarantee correct operator behavior in the real first live ENS session.
That still depends on:
- Egor following the runbook
- using publisher-assist at phase boundaries rather than after every click
- preserving human judgment at wallet approval time

This is not a gap in the slice.
It is simply the real boundary of what output wording can do.

## Does this close the current pre-write-gate UX tightening thread?
**Yes.**

Why:
- the plan was deliberately tiny and output-only
- the acceptance targets all landed
- live output now frames the tool’s role more honestly
- no state-model or scope creep slipped in

The next meaningful work should not be more copy polishing on this boundary.
It should return to:
- the real live ENS session when Egor is present
- or adjacent product/tooling improvements beyond this specific misuse-risk surface

## Core delta
None.
This verification does not change the parent/child authorization model or the publisher-assist state machine.

## Rail delta
Moderate.
This verifies adjacent publisher-assist v1 UX tightening.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting tool/UX verification, not protocol-center progress.

## Verdict
The publisher-assist pre-write-gate UX tightening slice **passes**.

It satisfies the frozen plan.
And it closes the current role/UX tightening thread cleanly.
