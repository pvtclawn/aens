# Thirty-first ÆNS slice — ENS-App fallback threshold (2026-03-20 19:34 UTC)

## Purpose
Execute the tiny checklist/root-note clarification plan from:
- `docs/research/PLAN-ENS-APP-FALLBACK-THRESHOLD-2026-03-20-1929.md`

This slice does **not** change the root-phase model, CLI, or publisher-assist behavior.
It only clarifies when the first live root phase should switch from ENS App to `tools.ens.xyz`.

## File changed
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`

## What changed
### 1) The ENS-App-first default now has a concrete switch threshold
The checklist now says the first live root phase should:
1. confirm the resolver tx landed
2. attempt post-resolver record editing in ENS App first
3. allow one reasonable retry/reopen check
4. switch to `tools.ens.xyz` only if required editability still fails

That keeps the primary path real without turning fallback into the default again.

### 2) Fallback is now framed as contingency, not defeat
The checklist now says explicitly:
- treat `tools.ens.xyz` as a contingency surface, not a defeat state

That keeps the session narratively cleaner if the fallback path is needed.

### 3) Switching surfaces now requires naming the failure class
The resolver-landed / root-records-stalled note now says that when fallback is used, the operator should record the exact failure class rather than vague `ENS App weirdness`.
Examples now included:
- `editability missing after resolver update`
- `text-record path unavailable`
- `wrapped-name manager friction`

This keeps the first live session more teachable if the fallback path is actually exercised.

## Verification
At slice time:
- `git status -sb` clean before edit
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes

No code paths changed in this slice.

## Acceptance mapping
Planned threshold target | Result
- minimal ENS-App-first switch threshold | ✅
- exact failure-class capture when fallback is used | ✅
- fallback kept neutral / non-shame-coded | ✅
- no model widening / no CLI change | ✅

## Core delta
None.
No change to the parent/child authorization model.

## Rail delta
Moderate.
This is first-live-session execution/runbook clarification only.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution hardening, not protocol-center progress.

## Result
The first live root phase now has a small but explicit threshold for when ENS App first becomes `tools.ens.xyz` fallback, without reopening the broader model.
