# Twenty-sixth ÆNS slice — standalone proof-template patch (2026-03-20 17:08 UTC)

## Purpose
Execute the standalone proof-template patch plan and close the last isolated doc-hardening gap in the current preferred-mode proof/runbook chain.

Plan executed from:
- `docs/research/PLAN-STANDALONE-PROOF-TEMPLATE-PATCH-2026-03-20-1706.md`

## File changed
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

## Change
### 1) The template now has explicit branch selection
The standalone proof template no longer treats the bootstrap-blocked story as the universal default.
It now requires the writer to choose exactly one branch near the top:
- `Proof branch: preferred-live`
- `Proof branch: bootstrap/regression`

It also adds a branch-lock rule so section 2, section 3, section 4, and the compact summary cannot be mixed across branches.

### 2) The same four-section proof model is preserved
The template still uses the same top-level structure:
1. `Machine-verifiable scope`
2. `Observed public-alias state (time-scoped)`
3. `Unresolved human control-plane state`
4. `Not yet proven`

So the patch changes the default story, not the proof model.

### 3) Section 3 is no longer a mandatory stale blocker slot
The preferred-live branch now says, in the same paragraph, that:
- no unresolved preferred-route blocker was visible at capture time
- other non-proven areas remain in section 4
- public reachability is still observational rather than machine-closed proof

The bootstrap/regression branch keeps the earlier narrow blocker wording, but only when that branch is the honest capture-time state.

### 4) Compact summaries are now branch-safe
The template now provides one compact summary per branch and explicitly says:
- write the summary last
- derive it from the already chosen branch
- do not let it overstate sections 1–4
- if there is tension, weaken the summary rather than strengthening the body

### 5) Bootstrap/regression is kept honest but not shamed
The template explicitly says both branches are acceptable when chosen honestly from capture-time truth.
That prevents the preferred-live path from becoming the only socially acceptable-looking note even when reality regresses.

## Why this matters
Before this slice:
- the standalone template still defaulted to the obsolete bootstrap-blocked story
- section 3 risked inventing a blocker even when the preferred route was live
- compact summaries risked drifting stronger than the careful four sections

After this slice:
- the template matches the already-patched runbooks
- preferred-live and bootstrap/regression are both available as honest branches
- machine-verifiable facts, public observation, remaining blockers, and non-proven areas stay more legible

## Verification
At slice time:
- `git status -sb` shows only the intended template edit before commit
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes
- `bun run check-public-surface` reports:
  - preferred root `ok`
  - preferred child route `ok`
  - `Preferred public surface ready: yes`
  - `Bootstrap proof ready: no`

## Core delta
None.
This slice does not change the parent identity / child capability / authorization model or the four-section proof model.

## Rail delta
High.
This is documentation/proof-scope hardening around the first live proof note.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting documentation hardening, not protocol-center progress.

## Result
The standalone first-live-proof template now matches the preferred-live reality without collapsing public observation into machine-closed proof, and without treating bootstrap/regression as an embarrassing fallback story.
