# Thirty-first ÆNS slice verification — ENS-App fallback threshold (2026-03-20 19:39 UTC)

## Purpose
Verify the tiny checklist/root-note clarification slice against:
- `docs/research/PLAN-ENS-APP-FALLBACK-THRESHOLD-2026-03-20-1929.md`

The goals of this verification are:
1. confirm the checklist now defines a minimal ENS-App-first switch threshold
2. confirm fallback is framed neutrally as contingency, not defeat
3. confirm exact failure-class capture is now required when fallback is used
4. confirm no broader model or CLI changes slipped in

## Verification inputs
Files checked:
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/PLAN-ENS-APP-FALLBACK-THRESHOLD-2026-03-20-1929.md`

Checks run at verification time:
```bash
git status -sb
bunx tsc --noEmit
timeout --kill-after=2 40s bun test src/*.test.ts
git diff --name-only HEAD~1..HEAD
grep -n "Default posture for the first live session\|one reasonable retry/reopen check\|switch to `tools.ens.xyz`\|contingency surface, not a defeat state\|failure class" docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md
```

## Current repo health
At verification time:
- `git status -sb` clean after the build slice commit
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes

No code paths changed in this slice itself, but repo health remains clean.

## Plan acceptance target 1 — minimal ENS-App-first switch threshold
**Pass.**

Observed in the checklist:
- the preferred path section now says the first live root phase should:
  1. confirm the resolver tx landed
  2. attempt post-resolver record editing in ENS App first
  3. allow one reasonable retry/reopen check
  4. switch to `tools.ens.xyz` only if required editability still fails

### Verdict
The threshold is now explicit enough to reduce both premature switching and stubborn over-commitment to ENS App.

## Plan acceptance target 2 — fallback is neutral / contingency-coded
**Pass.**

Observed in the checklist:
- it now says:
  - `Treat tools.ens.xyz as a contingency surface, not a defeat state.`

### Verdict
The fallback path is now framed more cleanly as controlled contingency rather than narrative failure.

## Plan acceptance target 3 — exact failure-class capture required
**Pass.**

Observed in the checklist:
- the `If resolver landed but root records stalled` section now says to record the exact blocked point and failure class
- example failure classes are now included:
  - `editability missing after resolver update`
  - `text-record path unavailable`
  - `wrapped-name manager friction`
- the wording avoids vague catch-alls like `ENS App weirdness`

### Verdict
If fallback is exercised in the first live session, the session should now produce more useful learning than a generic frustration note.

## Plan acceptance target 4 — no broader model or CLI changes slipped in
**Pass.**

Observed from commit scope / repo review:
- the slice is checklist/runbook clarification only
- no publisher-assist CLI changes landed
- no state-model changes landed
- no broader proof-model or session-role changes landed

### Verdict
The slice stayed inside the frozen guardrails.

## One honest caveat
This clarification sets a better threshold, but it still has not been exercised in a real live session with Egor present and the wrapped-owner wallet attached.

That is not a gap in the slice.
It is simply the natural boundary of a planning/wording clarification before the real write session exists.

## Does this close the current ENS-App fallback-threshold thread?
**Yes.**

Why:
- the plan was deliberately tiny
- the acceptance targets all landed
- the switching threshold is now explicit
- the fallback path is cleaner and more teachable
- no extra model or product complexity was added

The next meaningful work should not be more wording on this edge unless the real first live session exposes a concrete new failure mode.

## Core delta
None.
This verification does not change the parent/child authorization model.

## Rail delta
Moderate.
This verifies first-live-session execution/runbook clarification only.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution verification, not protocol-center progress.

## Verdict
The ENS-App fallback-threshold clarification slice **passes**.

It satisfies the frozen plan.
And it closes the current fallback-threshold thread cleanly.
