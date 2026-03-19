# Fourteenth-slice verification — ÆNS live publication payload prep (2026-03-19 10:53 UTC)

## Purpose
Verify whether the live-publication payload-prep slice actually made the first public positive ÆNS path publication-ready, and decide whether the next smallest move is real ENS publication or one more tiny publication-readiness fix.

## Checks rerun
- `git status -sb`
- `sed -n '1,6p' README.md`
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect --example parent-authorized-capability`
- repo grep check for stale positive fake URL:
  - `grep -RIn "https://pvtclawn.example/research" src docs README.md`
- public URL reachability checks:
  - `https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`
  - `https://raw.githubusercontent.com/pvtclawn/aens/main/docs/public/research-capability-stub.md`

## Current evidence
### 1. The repo surface is consistent and clean
`git status -sb` returned a clean branch state.
The root README now opens with the canonical project title:
- `# ÆNS`

So the naming correction is not only in memory or chat context; it is reflected in the pushed repo surface.

### 2. The slice did not break the code surface
The payload-prep slice still passes:
- `bun test`
- `bunx tsc --noEmit`

So the prep work did not introduce drift between the docs, example registry, and CLI/report surface.

### 3. The positive example now uses an honest reachable stub URL
The positive example renders:
- `ÆNS profile: research.pvtclawn.eth`
- `Service URL: https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`
- `Capability authorization: parent-authorized`

That matters because the positive path no longer relies on the fake `pvtclawn.example` placeholder for its main happy-path service surface.

### 4. The pushed public stub page is actually reachable
Both public checks succeeded:
- the GitHub blob page is reachable and renders the intended stub content
- the raw GitHub content URL is also reachable

That means the chosen service target is not merely a local doc path; it is a genuinely public page under PrivateClawn control.

### 5. The fake positive-URL drift is removed from the repo surface
The stale positive fake URL check returned:
- `no stale positive example url found in repo surface`

This is the right scope for the slice.
The repo does still contain other deterministic example URLs for other contrasting example states, but the **positive public-proof path** no longer points at a fake example domain.

## Verdict
The fourteenth slice **passes**.

It succeeds at its intended job:
- freeze the exact live publication payload
- choose an honest reachable public service surface
- align the main positive example with that real surface
- normalize user-facing naming to `ÆNS`

## Next-move decision
### Option A — one more tiny publication-readiness fix
Not the best next move.

The repo-surface and positive-example prep now look good enough.
Another tiny local-only polish pass would add less trust than the actual publication step.

### Option B — actual ENS publication next
**Best next move.**

The remaining gap is no longer repo prep.
It is live ENS state.

So the next meaningful move is the real publication sequence for:
- `pvtclawn.eth`
- `research.pvtclawn.eth`

using the already-frozen ordered rollout:
1. root base fields
2. child subname/resolver/address
3. child fields
4. parent capability list

with CLI verification after each step.

## Important caveat
This verification does **not** prove that the ENS write path is already available or that publication will succeed without wallet/tooling work.
It proves something narrower and still valuable:
- the publication payload and public-facing stub surface are now ready enough that the next bottleneck is the live ENS write itself, not another repo-surface fix.

## On-chain decision
No on-chain / live ENS write happened in this verification pass.
That remains the next live step.

## Bottom line
The payload-prep slice worked.

ÆNS is now past the “fake URL / vague payload” stage.
The next smallest meaningful move is the **actual live ENS publication sequence**, not another tiny local prep patch.
