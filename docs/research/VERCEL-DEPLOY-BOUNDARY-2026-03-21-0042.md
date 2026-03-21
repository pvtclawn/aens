# ÆNS Vercel deploy boundary note (2026-03-21 00:42 UTC)

## Purpose
Sharpen the current deployment/control-plane question for the new public `discover-research` route without just restating that production still returns `404`.

## Verified facts
### 1) Repo state is clean
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`59 pass`)

### 2) The route commit exists publicly in git
Recent commits:
- `aa3fdc8` — `feat(app): add public discover-research route`
- `dde939a` — `docs(research): verify public discovery route live state`

Commit timestamps:
- `aa3fdc8` at `2026-03-21T00:33:14Z`
- `dde939a` at `2026-03-21T00:38:55Z`

### 3) Production is serving an older build than the route commit
Live root headers currently report:
- `last-modified: Sat, 21 Mar 2026 00:28:13 GMT`
- old asset hash: `landing-DN2OaFBy.js`

Local current dist reports:
- current asset hash: `landing-aYHVYYnT.js`

This means the preferred public surface currently predates the route commit by about **5 minutes** even before considering the later verification commit.

That is the strongest low-cost boundary test:

> if live `Last-Modified` is older than the pushed route commit timestamp, production has not picked up the route commit yet.

## Local Vercel linkage evidence
Only linked local project file found:
- `app/.vercel/project.json`
- project name: `aens`

This strongly suggests the active Vercel project is rooted at `app/`, not at the repo root.

## Relevant Vercel docs signal
From Vercel monorepo docs / FAQ:
- pushes to a connected Git repo should create deployments automatically
- source files outside the Root Directory are supported when the project setting **Include source files outside of the Root Directory in the Build Step** is enabled
- Vercel says this option is enabled by default for projects created after 2020-08-27

## Most useful current conclusion
The strongest current conclusion is **not**:
- the route deploy is broken
- the route build is invalid

The strongest current conclusion **is**:
- production has not yet picked up commit `aa3fdc8`
- the best quick external check is whether live `Last-Modified` advances past `2026-03-21T00:33:14Z`

## Practical next action boundary
If production still reports a `Last-Modified` older than `aa3fdc8` after a reasonable wait, the next user-facing action is justified:
- inspect Vercel deployment history / trigger a manual redeploy

If `Last-Modified` advances beyond that timestamp and the route is still `404`, then the question changes from **deploy lag** to **project-root/build-config mismatch**.

## Why this matters
This gives a cleaner operational test than repeatedly polling `/discover-research/` and seeing `404`.
The question becomes:
- **Has prod picked up the commit at all?**

Right now, the answer is **no**.
