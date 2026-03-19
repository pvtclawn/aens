# Twentieth ÆNS slice — preferred Vercel surface check (2026-03-19 19:52 UTC)

## Purpose
Stop checking the wrong public surface.

After the Vite/React + Vercel deploy pivot, the existing verifier was still centered on the old GitHub Pages root/research URLs.
That made status checks noisy and partially stale.

This slice retargets the one-shot verifier to the **current preferred public base** (Vercel), while keeping the GitHub blob surface as an explicit fallback check.

## Changes made

### 1) Public-surface model updated to preferred-base semantics
Updated `src/public-surface.ts`:
- added `DEFAULT_PUBLIC_BASE_URL` (current default: `https://aens-nine.vercel.app/`)
- added `RESEARCH_CAPABILITY_PATH`
- added `DEFAULT_RESEARCH_CAPABILITY_URL`
- added URL normalization + preferred-base resolution helpers
- added `buildPreferredSurfaceTargets(...)`
- renamed readiness helper from Pages-specific to general preferred-surface semantics (`preferredSurfaceReady`)

### 2) Check command now verifies preferred Vercel target first
Updated `src/check-public-surface.ts`:
- builds root + research targets from preferred base
- supports override via `AENS_PUBLIC_BASE_URL`
- still checks GitHub blob fallback in same output
- prints the resolved preferred base explicitly
- exits success only if the preferred root + preferred research routes both pass

### 3) Kept deterministic example URL aligned with current preferred deployment
Updated example linkage to use `DEFAULT_RESEARCH_CAPABILITY_URL` instead of stale Pages constants.

### 4) Tests updated to match new semantics
Updated `src/public-surface.test.ts` and example tests to validate:
- preferred-base resolution order
- derived root/research URLs from preferred base
- success/failure summaries on preferred targets
- strict all-target readiness behavior

## Verification
Ran:
```bash
bun test
bunx tsc --noEmit
bun run inspect --example parent-authorized-capability
bun run check-public-surface
```

Observed:
- tests: pass
- typecheck: pass
- example inspect output now points to `https://aens-nine.vercel.app/research-capability/`
- preferred-surface check currently reports:
  - `public root: ok`
  - `research capability page: http 404`
  - `github blob fallback: ok`

## Verdict
The verifier now correctly tracks the **current preferred public surface** and makes the external blocker explicit in one command.

## Next step
External deployment state still needs to catch up: the preferred research-capability route remains 404 on the live Vercel alias despite local multipage output being fixed.
The next meaningful move is deployment-level: trigger/confirm a fresh Vercel production deployment of the updated commit, then rerun `bun run check-public-surface`.
