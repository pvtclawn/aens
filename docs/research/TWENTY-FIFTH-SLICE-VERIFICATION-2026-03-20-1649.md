# Twenty-fifth ÆNS slice verification — preferred-mode runbook hardening (2026-03-20 16:49 UTC)

## Purpose
Verify the preferred-mode runbook hardening slice against the frozen plan from:
- `docs/research/PLAN-PREFERRED-MODE-LIVE-SESSION-DOC-HARDENING-2026-03-20-1638.md`

This verification is specifically for the first build step from that plan:
- patch the two live-session runbooks first
- confirm the three acceptance targets landed
- decide whether the standalone proof-template update is now the only meaningful unresolved doc-hardening gap

## Verification inputs
Runbook files checked:
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`

Template checked:
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

Repo/public-truth checks at verification time:
```bash
git status -sb
bunx tsc --noEmit
bun test src/*.test.ts
bun run check-public-surface
```

## Current repo/public truth
At verification time:
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes
- `bun run check-public-surface` reports:
  - preferred root `ok`
  - preferred child route `ok`
  - `Preferred public surface ready: yes`
  - `Bootstrap proof ready: no`

So the runbooks are being verified against the correct current preferred-live state, not an older bootstrap-blocked state.

## Plan acceptance target 1 — preferred mode is the mainline path
**Pass.**

Observed in the patched runbooks:
- the checklist now names the preferred child route as the `preferred mainline target` and explicitly says it is the default when `Preferred public surface ready = yes`
- the checklist explicitly says the preferred target is the honest current default and says not to downgrade to bootstrap mode unless the verifier says the preferred route is not currently ready
- the operator steps now define a `Mainline path — preferred route live` and a separate `Regression path — preferred route not live`
- stale bootstrap-default wording was removed from the mainline runbook path

### Verdict
The mainline publication-mode story now matches current public truth.

## Plan acceptance target 2 — final public-surface recheck is mandatory
**Pass.**

Observed in the patched runbooks:
- both runbooks still require the baseline `bun run check-public-surface`
- both runbooks now require `bun run check-public-surface` again immediately before `bun run capture-proof -- final`
- both runbooks now say clearly that if `Preferred public surface ready` is no longer `yes` for a preferred-mode session, the run should stop and be treated as an abort or explicit regression/bootstrap restart
- both runbooks now say explicitly that final proof cannot rely on stale baseline truth alone

### Verdict
The preferred-mode live session now fails closed against mid-session public-truth regression.

## Plan acceptance target 3 — pre-authorization child state is explicitly provisional
**Pass.**

Observed in the patched runbooks:
- the checklist now says the child state before parent authorization is `PROVISIONAL — not yet parent-authorized`
- the operator steps repeat the same provisional label at the child checkpoint
- both runbooks now forbid drafting the final proof note or taking celebratory screenshots before the final authority check

### Verdict
The runbooks no longer let intermediate child coherence masquerade as final success.

## Remaining unresolved gap from the broader plan
The standalone proof-scope template is still written for the earlier bootstrap-blocked reality.

Observed in:
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

Current stale boundary in that file:
- it still says the template is especially for the `current bootstrap-mode case`
- it still says the preferred route is blocked by unresolved human control-plane state
- it still treats bootstrap-mode wording as the canonical default story

### Decision
Yes — after this runbook verification, the standalone proof-template update is the only meaningful remaining doc-hardening gap from the current plan.

That next slice should:
1. add an explicit preferred-live branch
2. retain bootstrap/regression wording as a separate branch instead of the universal default
3. keep the same top-level four-section structure while making section 3 depend on capture-time truth

## Core delta
None.
This verification does not change the parent identity / child capability / authorization model.

## Rail delta
High.
This verifies supporting runbook/proof-scope hardening only.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting verification work, not protocol-center progress.

## Verdict
The preferred-mode runbook hardening slice **passes**.

The three planned runbook acceptance targets landed.
The remaining meaningful gap is now isolated cleanly:
- update the standalone proof-scope template so it no longer defaults to the obsolete bootstrap-blocked story.
