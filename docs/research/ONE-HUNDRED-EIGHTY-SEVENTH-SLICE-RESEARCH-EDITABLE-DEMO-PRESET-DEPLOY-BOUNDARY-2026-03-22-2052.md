# One-Hundred-Eighty-Seventh Slice Research — Editable Demo Preset Deploy Boundary (2026-03-22 20:52 UTC)

## Question
After the fix for the hardcoded `theaens.eth` demo mapping was pushed as `88881bd`, what is the **current public truth** on the canonical deployed write surface?

## Health baseline
Repository state at check time:
- `git status -sb` -> `## main...origin/main`

So there is no longer any local-vs-remote ambiguity for this slice.

## Live probe
Canonical write page checked:
- `https://aens-nine.vercel.app/write-records/`

Observed deploy behavior:
- edge returns `308` from `/write-records/` -> `/write-records`
- final page loads successfully on the canonical alias

## Live UI truth
The deployed page now clearly exposes the **editable demo-preset** model rather than the earlier hardcoded/product-truth mistake.

### New live markers present
The live write page now says:
- `This page starts from a theaens.eth demo preset ... but the capability ENS names and service URLs are fully editable before wallet approval.`
- `Use the demo preset if useful, then edit the capability child names and service URLs to match the real namespace you want to publish.`
- button text: `Write configured capabilities`
- secondary button: `Reset demo preset`
- status copy: `Demo defaults are only a starting point; the form will write exactly what is shown above.`

### New live editable controls present
The live page now exposes editable fields for:
- root ENS
- capability ENS name (demo landing capability)
- service URL (demo landing capability)
- capability ENS name (demo write capability)
- service URL (demo write capability)

This is the important boundary change: the deployed surface is no longer pretending that
- `explore.<root>` and `write.<root>` are universal product semantics, or that
- `/` and `/write-records/` are mandatory capability endpoints for everyone.

They are now clearly exposed as a **demo preset**.

## Practical interpretation
The product truth is now tighter and more honest:
- `theaens.eth` + `/` + `/write-records/` remain a helpful preset for demoing the flow
- capability child names and service URLs are operator-configurable
- the write planner is now generic enough for real use instead of only the demo story

## Actionable insight
The main deploy-risk question for this fix is now closed.

The remaining boundary is no longer deploy wording or rollout lag. It is product/UX quality inside the editable form itself:
- whether the current two-row demo preset is enough
- whether adding/removing arbitrary capability rows is desirable
- whether stronger validation is needed before wallet signature

## Verdict
**Pass.** The canonical deployed write surface now reflects the intended correction:
**demo preset, not hardcoded product law.**
