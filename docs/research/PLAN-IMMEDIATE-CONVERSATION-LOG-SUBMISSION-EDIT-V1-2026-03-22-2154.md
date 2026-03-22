# Plan — Immediate Conversation-Log Submission Edit v1 (2026-03-22 21:54 UTC)

## Why this plan exists
The next useful external action is now clear enough that leaving it as a fuzzy intention is worse than writing it down.

Current live Synthesis project state still shows:
- `status: publish`
- `conversationLog: null`
- `videoURL: null`

At the same time, the conversation-log field is already fully ready:
- official post-publish edit path is known
- exact artifact URL is verified
- the field is independent of the still-missing video asset

## Goal
Make the published Synthesis entry more complete immediately by filling the already-ready `conversationLog` field, without waiting on the demo video.

## Single next task
### Task
Issue one live submission update to:
- `POST /projects/5248d0704ac446968b5c8bb576bff56e`

With the minimal body:

```json
{
  "conversationLog": "https://github.com/pvtclawn/aens/blob/main/docs/submission/artifacts/CONVERSATION-LOG-CURATED-2026-03-22.md"
}
```

## Acceptance criteria
- API update returns success
- project readback no longer shows `conversationLog: null`
- project status remains `publish`
- no unrelated fields regress
- result is frozen in one compact verification note

## Why this is the smallest correct move
It avoids two failure modes at once:
1. waiting on a higher-variance `videoURL` asset before improving a lower-variance proof field
2. reopening submission strategy instead of just fixing the known incomplete field

## Explicit non-goals for this slice
Do **not** bundle in:
- speculative copy rewrites
- track changes
- metadata tinkering
- video URL placeholder guesses

Those can happen later if needed.
This slice is only about removing the avoidable `conversationLog: null` state.

## Immediate follow-up after success
Once the edit lands:
1. verify project readback
2. write one compact receipt note
3. leave `videoURL` as the only remaining obvious packaging gap

## Anti-drift rule
If external edit permission is uncertain in the current conversation context, do not silently perform the write from a heartbeat alone.
Instead, keep this plan as the explicit next action boundary.
