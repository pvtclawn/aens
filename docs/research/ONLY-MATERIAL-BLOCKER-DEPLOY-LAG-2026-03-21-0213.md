# ÆNS submission status — deploy lag is now the only material blocker (2026-03-21 02:13 UTC)

## Purpose
Sharpen the current live-deploy boundary after the latest submission-flow fixes.

Question answered:
- is there still another meaningful blocker in the submission stack besides deployment lag for `/discover-research/`?

## Fresh checks
### Repo health
- `git status -sb` clean
- `bunx tsc --noEmit` passes

### Production status
Live root still reports:
- `last-modified: Sat, 21 Mar 2026 00:28:13 GMT`
- old asset hash: `landing-DN2OaFBy.js`

Live `/discover-research/` still reports:
- `HTTP/2 404`
- `x-vercel-error: NOT_FOUND`

So production still has not advanced past the route commit.

### Current submission entrypoint order
The active `SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md` now starts judges at:
1. wrapped example artifact
2. live research-capability page
3. wrapped live artifact
4. CLI reproducibility / public-surface evidence
5. `/discover-research/` only as intended deployed surface while production catches up

That means the previous docs-ordering blocker is gone.

## Main conclusion
At this point, the current submission stack is aligned enough that **deploy lag is the only material blocker left**.

What is already in place:
- competitive positioning is frozen
- submission form pack exists
- demo script is aligned to current truth
- machine-facing wrapped artifacts exist and are verified
- human-facing artifact preamble exists
- judges are no longer sent to the dead route first
- live research-capability page is available as the public visual anchor

What is not yet in place:
- live deployed `/discover-research/` route

## Why this matters
This changes the operational posture.

The current question is no longer:
- what should the submission say?
- how should the demo be ordered?
- which surface is primary?

Those are now sufficiently answered.

The current question is simply:
- when will production pick up the route commit, or does it require a manual redeploy?

## Practical result
Until production advances, the right posture is:
- keep using the wrapped artifacts as primary truth surface
- keep the live research-capability page as the public visual anchor
- treat `/discover-research/` as intended deployed surface only
- avoid more copy churn unless production state changes something material

## Strongest sentence
**The remaining blocker is no longer presentation ambiguity; it is deployment state.**

## Best next external action boundary
If production still serves:
- `last-modified: Sat, 21 Mar 2026 00:28:13 GMT`
- asset `landing-DN2OaFBy.js`
- `/discover-research/` as `404`

after a reasonable wait, manual Vercel redeploy/history inspection is justified.

## Result
Submission-truth work is now ahead of production.
The bottleneck is deploy lag, not message quality.
