# Thirty-sixth ÆNS slice live verification — public discovery route deployment gap (2026-03-21 00:37 UTC)

## Scope
Verify whether the newly added public `discover-research` route is live on the preferred public surface after commit `aa3fdc8`.

## Commands run
```bash
git status -sb
/home/clawn/.bun/bin/bunx tsc --noEmit
timeout --kill-after=2 30s /home/clawn/.bun/bin/bun test src/*.test.ts
/home/clawn/.bun/bin/bun run check-public-surface
curl -I -s https://aens-nine.vercel.app/discover-research/
curl -s https://aens-nine.vercel.app/ | grep -o 'landing-[A-Za-z0-9_-]*\.js' | head -n 1
grep -o 'landing-[A-Za-z0-9_-]*\.js' app/dist/index.html | head -n 1
curl -s https://aens-nine.vercel.app/ | grep -o 'Open discovery route' | head -n 1 || true
grep -o 'Discover the official research capability for an ENS identity — ÆNS' app/dist/discover-research/index.html | head -n 1
```

## Observed results
### Repo health
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`59 pass`)

### Preferred public-surface verifier
`bun run check-public-surface` now reports:
- `public root: ok`
- `research capability page: ok`
- `discover research page: http 404`
- `Preferred public surface ready: no`
- `Bootstrap proof ready: yes`

This is the key heartbeat result.

### Direct live HTTP check
`curl -I -s https://aens-nine.vercel.app/discover-research/` returns:
- `HTTP/2 404`
- `x-vercel-error: NOT_FOUND`

So the new route is not live on the preferred surface yet.

### Root asset mismatch evidence
Live root currently references:
- `landing-DN2OaFBy.js`

Local current dist references:
- `landing-aYHVYYnT.js`

This is strong evidence that Vercel has **not** rolled the latest build to production yet.

### Root page content mismatch
Live root does **not** yet expose the new `Open discovery route` link marker.

Local `app/dist/discover-research/index.html` does include the expected discovery-route title:
- `Discover the official research capability for an ENS identity — ÆNS`

## Verdict
**Local pass, live fail.**

What is true now:
- repo code is clean
- tests/typecheck pass
- local built app includes the new discovery route and verifier target

What is not true yet:
- the preferred public surface has **not** deployed the new route
- the submission should **not** yet claim the public discovery route is live

## Practical boundary
The blocker is currently deployment/control-plane state, not repo implementation.

## Next smallest move
Wait for or trigger Vercel deployment, then rerun:
```bash
bun run check-public-surface
```
and confirm:
- `discover research page: ok`
- `Preferred public surface ready: yes`

Only after that should the public discovery route be treated as live submission truth.
