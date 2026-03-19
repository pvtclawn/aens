# Seventeenth-slice verification — ÆNS public-surface check command (2026-03-19 12:15 UTC)

## Purpose
Verify whether the new `bun run check-public-surface` command is a reliable one-shot verifier for the current Pages boundary, and decide whether the cleaner Pages URL is live yet or still blocked.

## Checks rerun
- `git status -sb`
- `bun test`
- `bunx tsc --noEmit`
- `bun run check-public-surface`
- `bun run inspect --example parent-authorized-capability`

## Current evidence
### 1. The repo/build surface is clean
`git status -sb` returned a clean branch state.
The slice still passes:
- `bun test`
- `bunx tsc --noEmit`

So the new operational check command did not disturb the core ÆNS surface.

### 2. The new check command does exactly the right thing
`bun run check-public-surface` now gives one clear answer across the three relevant public surfaces:
- Pages root
- Pages research-capability page
- GitHub blob fallback

Current output:
- `pages root: http 404 (https://pvtclawn.github.io/aens/)`
- `research capability page: http 404 (https://pvtclawn.github.io/aens/research-capability/)`
- `github blob fallback: ok (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`
- `Pages surface ready: no (https://pvtclawn.github.io/aens/research-capability/)`

That is the exact boundary answer we need.
The command is neither too optimistic nor too vague.

### 3. The positive example still renders the intended planned URL
The deterministic positive example still renders:
- `Service URL: https://pvtclawn.github.io/aens/research-capability/`

So the command and the example surface are aligned around the same planned public target.

### 4. The current bottleneck is now human/admin, not verification ambiguity
At this point there is no ambiguity about the state:
- the cleaner Pages-backed URL is still not live
- the blob fallback is live
- the verifier works

So the remaining uncertainty is not “how do we check it?”
It is the repo-admin Pages boundary itself.

## Verdict
The seventeenth slice **passes**.

It succeeds at its intended job:
- provide a one-command verifier for the Pages/public-stub boundary.

## Next-move decision
### Option A — add yet another local verifier/helper
Low value.

The verifier is already clear enough.
Adding more local checking logic would not move the public URL closer to being live.

### Option B — treat the cleaner Pages URL as live anyway
Wrong.

The verifier explicitly says it is not live.
We should not overclaim.

### Option C — perform the smallest human/admin Pages step and rerun the verifier
**Best next move.**

The next meaningful action is:
1. open repo **Settings → Pages**
2. confirm or set **Source = GitHub Actions**
3. rerun `bun run check-public-surface`

## Bottom line
The new public-surface check command works.

ÆNS now has a one-shot verifier for the Pages boundary.
The next meaningful move is not more local prep — it is the smallest human/admin Pages settings step, followed immediately by rerunning:

```bash
bun run check-public-surface
```
