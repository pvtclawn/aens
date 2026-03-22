# One-Hundred-Eightieth Slice Verification — Research Route Live Deploy Truth (2026-03-22 19:18 UTC)

## Context
ÆNS publication target `a350fe6` was pushed to `origin/main` after the route/layout fix that made `/research/` the canonical public research surface and demoted `/research-capability` to a redirect/legacy path. The required verification task is to prove what the public deployment actually serves, not what local code/builds claim.

## Verification target
Check the intended live public routes from the publish/deploy boundary plan:
- `/`
- `/research/`
- `/research-capability`
- `/write-records/`

## Method
- Confirm remote publication truth via `git status -sb` and current head.
- Run two live URL samples against `https://aens-nine.vercel.app` separated by a short wait.
- Record both edge response behavior and final rendered page markers after following redirects.

## Remote publication truth
- Repo state before live verification: `## main...origin/main`
- Published head: `a350fe6`

This is sufficient to treat the route/layout slice as **pushed remotely** before checking deploy truth.

## Live samples

### Sample 1
- `/` → `HTTP/2 200`, title marker: `ÆNS — ENS root explorer`
- `/research/` → `HTTP/2 308` to `/research`, final title/marker: `Research endpoint — ÆNS`
- `/research-capability` → `HTTP/2 308` to `/research`, final title/marker: `Research endpoint — ÆNS`
- `/write-records/` → `HTTP/2 308` to `/write-records`, final title/marker: `Write ENS capability records — ÆNS`

### Sample 2
- `/` → `HTTP/2 200`, title marker: `ÆNS — ENS root explorer`
- `/research/` → `HTTP/2 308` to `/research`, final title/marker: `Research endpoint — ÆNS`
- `/research-capability` → `HTTP/2 308` to `/research`, final title/marker: `Research endpoint — ÆNS`
- `/write-records/` → `HTTP/2 308` to `/write-records`, final title marker: `Write ENS capability records — ÆNS`

## Verdict
**Pass.** The live public surface now reflects the canonical route shift away from `/research-capability`:
- `/research-capability` no longer serves the old standalone page; it redirects to `/research`.
- The rendered destination is the new `Research endpoint — ÆNS` page in two consecutive samples.
- Root explorer and write-records routes are also live and coherent with the current app naming.

## Boundary update
The route/layout fix is no longer only local or only remote truth; it now has **verified public/deploy truth** on `aens-nine.vercel.app`.

## Consequence for next step
Wallet-signature guidance may safely advance to the ENS write step for `theaens.eth` / `research.theaens.eth`, because the service URL now points at a live verified public surface rather than a local-only or stale deployment target.
