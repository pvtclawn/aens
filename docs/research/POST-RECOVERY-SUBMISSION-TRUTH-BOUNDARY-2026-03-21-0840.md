# Post-Recovery Submission Truth Boundary — 2026-03-21 08:40 UTC

## Purpose
Run one narrow post-recovery check to ensure submission-facing surfaces reflect the newly live preferred public route.

## Checks run
- Repo health:
  - `git status -sb` clean
  - `bunx tsc --noEmit` passes
- Live surface:
  - `bun run check-public-surface` now reports:
    - `discover research page: ok`
    - `Preferred public surface ready: yes`
    - `Bootstrap proof ready: no`
- Submission/docs wording scan:
  - `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md` still says:
    - “Treat the public discovery route as the intended deployed surface while production catches up.”
  - `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md` still closes with:
    - “wedge and intended deployed surface” framing.
- Submission artifacts currently committed under `docs/submission/artifacts/*.json` still embed the old public-surface status (`discover research page: 404`, `bootstrapProofReady: true`).

## Insight
After deploy recovery, the previous “production catching up” framing is stale in multiple submission-facing places. The docs and artifacts are now behind verified live truth.

## Action boundary
Smallest meaningful follow-up slice:
1. Patch the two submission docs to present `/discover-research/` as live current truth (not intended future surface).
2. Regenerate the two submission artifacts so `publicSurface` fields match current live status (`preferredSurfaceReady: true`, `bootstrapProofReady: false`, discovery page `200`).

This is now a consistency/packaging task, not a deploy-debugging task.
