# ÆNS docs-consistency patch boundary for dead public route (2026-03-21 01:43 UTC)

## Purpose
Sharpen the next docs-consistency slice so it fixes the route-first problem without reopening half the submission package.

## Question answered
Which submission-facing docs still need patching because they present the dead public `/discover-research/` route as a primary demo entrypoint?

## Fresh checks
Repo health before analysis:
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`61 pass`)

Search/check results:
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
  - still has `## Demo flow for judges`
  - step 1 is `Open the public discovery route`
  - this is currently wrong while the live route is still `404`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
  - still says `Open: https://aens-nine.vercel.app/discover-research/`
  - this is also currently wrong as the first demo move
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
  - still mentions `a public web discovery route on the preferred surface`
  - but not as the first instruction or primary current truth surface
- `README.md`
  - still lists the public web discovery route in supported surfaces
  - again, not as the first submission/demo instruction

## Main conclusion
The **smallest meaningful patch boundary is exactly two submission docs**:
1. `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
2. `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`

Why only these two:
- they are the places that currently instruct judges to go to the dead route first
- they directly control demo ordering and judge entrypoint behavior
- patching them is enough to align the active submission flow with the already-frozen surface priority note

## Why not patch more right now?
### `SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
This file still mentions the public discovery route, but as part of the build inventory rather than as the first thing judges should click.

That means it is not the smallest urgent blocker.
If the next tiny patch only fixes demo ordering, this file can remain for now without breaking the current truth boundary too badly.

### `README.md`
README also mentions the route, but it is repo-facing product documentation, not the direct submission flow.

Again: not the smallest urgent blocker.

## Exact patch target
The next docs slice should:
- demote the public route in the form pack demo flow
- demote the public route in the demo script
- foreground instead:
  1. wrapped artifacts first
  2. CLI backup second
  3. live research-capability page third
  4. public discovery route only as intended surface / deployment-pending caveat

## Strongest sentence
**Only two docs still actively mislead judges into starting at the dead route: the form pack and the demo script.**

## Result
The next build/doc slice can stay very small.
Patch just the form pack and demo script first; leave core submission doc and README alone unless a later consistency pass is still needed.
