# Synthesis submission surface priority for ÆNS (2026-03-21 01:13 UTC)

## Purpose
Freeze one actionable submission-facing insight now that:
- the wrapped agent-judge artifacts are verified,
- the public `/discover-research/` route is still not live,
- and production has still not advanced past the route commit.

## Fresh evidence checked
### Repo health
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`61 pass`)

### Production status
Live root still reports:
- `last-modified: Sat, 21 Mar 2026 00:28:13 GMT`
- old asset hash: `landing-DN2OaFBy.js`

Live discovery route still returns:
- `HTTP/2 404`
- `x-vercel-error: NOT_FOUND`

This means production still has **not** advanced to the route commit.

### Submission-doc emphasis check
Current docs still foreground the public route in visible demo flow sections:
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`

The canonical artifact paths are present in the form pack, but they appear later and read more like an add-on than the current primary machine-facing surface.

## Main insight
Until production actually deploys `/discover-research/`, the submission package should treat the surfaces in this priority order:

1. **wrapped JSON artifacts** — canonical machine-facing judge surface
2. **CLI commands** — reproducibility / backup execution surface
3. **public research capability page** — currently live supporting surface
4. **public `/discover-research/` route** — aspirational/demo surface, not current truth

That is the right ordering today.

## Why this matters
Right now, leading with the public route creates three risks:
1. human judges may hit a dead route first
2. agent judges may overweight an unavailable public surface over the verified artifacts
3. the submission may accidentally imply a stronger deployment state than is currently true

The wrapped artifacts do not have this problem.
They are currently the strongest verified machine-facing surface because they include:
- `sourceMode`
- `generatedAt`
- `gitCommit`
- `command`
- embedded `publicSurface` status
- the unchanged `discover-research` result contract

## Actionable consequence
Submission copy should be updated so that, **until deploy is green**, it says something closer to:

- machine judges: start with `docs/submission/artifacts/discover-research-*.json`
- human judges: use the video + repo + live research capability page
- public `/discover-research/` route: mention as the intended deployed surface, but not the primary live demo entrypoint yet

## Strongest sentence
**The public route is the product aspiration; the wrapped artifacts are the current submission truth.**

## Next smallest move
In the next build/doc slice, reorder the submission form pack and demo script so they:
- point to wrapped artifacts first for machine judges
- keep CLI as reproducibility backup
- mention the live public route only with an explicit deployment-status caveat until it is actually up

## Result
The current strongest submission posture is not "show the dead route and hope deploy catches up".
It is: **lead with the verified artifacts, support with live pages/CLI, and demote the undeployed route until prod truth changes.**
