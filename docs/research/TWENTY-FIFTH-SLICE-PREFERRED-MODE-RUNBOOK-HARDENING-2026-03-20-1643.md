# Twenty-fifth ÆNS slice — preferred-mode runbook hardening (2026-03-20 16:43 UTC)

## Purpose
Execute the first build step from the preferred-mode live-session doc-hardening plan.

This slice hardens the two main live-session runbooks so they match current truth now that the preferred Vercel child route is live.

## Files changed
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`

## Change
### 1) Preferred mode is now the mainline path
The runbooks now treat:
- `AENS_PROOF_PUBLICATION_MODE=preferred`
- `AENS_PROOF_SERVICE_URL=https://aens-nine.vercel.app/research-capability/`

as the default honest path when `Preferred public surface ready: yes`.

Bootstrap mode remains available only as an explicit regression path, not as the default narrative.

### 2) Final public-surface recheck is now mandatory
Both runbooks now require:
```bash
bun run check-public-surface
```
again immediately before final proof capture.

They now fail closed if the preferred-mode story no longer matches the capture-time public truth.
That prevents final proof capture from leaning on stale baseline truth alone.

### 3) Pre-authorization child state is explicitly provisional
The child checkpoint now says plainly that the pre-parent-authorization state is:
- `PROVISIONAL — not yet parent-authorized`

It also forbids drafting the final proof note or taking celebratory screenshots before the final authority check.

### 4) Section-3 proof wording is no longer implicitly stale in the runbooks
Without changing the standalone proof template yet, the operator-facing docs now explicitly tell the writer to branch section 3 honestly:
- preferred route live at capture time → no unresolved preferred-route blocker visible
- preferred route blocked/regressed at capture time → narrow control-plane wording

## Why this matters
The main remaining risk after the hosting fix was no longer deployment reachability first.
It was operator-state drift:
- stale bootstrap wording in a preferred-live world
- no mandatory recheck before final proof capture
- intermediate child coherence reading like success

This slice narrows those risks without changing the underlying parent/child authorization model.

## Verification
At slice time, repo health and current public truth were reconfirmed:
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes
- `bun run check-public-surface` reports:
  - preferred root `ok`
  - preferred child route `ok`
  - `Preferred public surface ready: yes`
  - `Bootstrap proof ready: no`

## Core delta
None.
This slice does not change the parent identity / child capability / authorization model.

## Rail delta
High.
This is runbook/proof-scope hardening around the live preferred-mode session.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution hardening, not protocol-center progress.

## Result
The live-session runbooks now better match the actual current preferred-mode reality and fail more honestly if that reality changes during the session.
