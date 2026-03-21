# Deploy Recovery Verification — 2026-03-21 08:35 UTC

## Objective
Verify that the deploy blocker is resolved and the preferred public discovery surface is now live.

## Preconditions
- Root cause previously pinned in `VERCEL-DEPLOY-FAILURE-ROOT-CAUSE-2026-03-21-0830.md`.
- Recovery fixes shipped in:
  - `bf6148e` — add `viem` to `app/package.json`
  - `8ab2d31` — install root deps in Vercel install command (`bun install && cd app && bun install`)

## Verification
1. Repo health (`aens/`):
   - `git status -sb` clean
   - `bunx tsc --noEmit` passes
   - `bun test src/*.test.ts` passes (`61 pass`)
2. Live public surface:
   - `bun run check-public-surface`
   - Results:
     - `public root: ok`
     - `research capability page: ok`
     - `discover research page: ok`
     - `Preferred public surface ready: yes`
     - `Bootstrap proof ready: no`
3. Deploy timeline sanity (authenticated Vercel checks run in-session):
   - New production deployment reached `Ready` after recovery patch.

## Conclusion
The previous blocker is cleared. `/discover-research/` is now live on the preferred public surface, and the stale bootstrap fallback is no longer the active truth path for this flow.

## Practical boundary now
The deployment/config mismatch that caused repeated production failures is resolved. Next work should move back to product/submission execution rather than deploy triage.
