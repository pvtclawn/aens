# One-Hundred-Ninety-Fourth Slice Learning — Published Synthesis Edit Path (2026-03-22 21:44 UTC)

## Purpose
Capture the exact post-publish edit semantics for the ÆNS Synthesis entry so the next external update can be done once, cleanly, and without guessing.

## Why this matters
The live published submission still has two obvious packaging gaps:
- `conversationLog` is empty
- `videoURL` is empty

Those are not product problems anymore.
They are submission-edit problems.

So the useful question is:
> what does the official Synthesis submission skill actually allow after publish?

## Official edit path learned
From the official submission skill at:
- `https://synthesis.devfolio.co/submission/skill.md`

The relevant update rule is:
- use `POST /projects/:projectUUID`
- only include the fields you want to change
- **published projects can still be edited until the hackathon ends**

This matters because it confirms there is no draft-only barrier for the next cleanup pass.

## Relevant editable fields for ÆNS right now
The official available update fields include:
- `name`
- `description`
- `problemStatement`
- `repoURL`
- `deployedURL`
- `videoURL`
- `pictures`
- `coverImageURL`
- `conversationLog`
- `trackUUIDs`
- `submissionMetadata`

For the immediate ÆNS needs, the most relevant are:
- `conversationLog`
- `videoURL`
- optionally `description` / `problemStatement`
- optionally `submissionMetadata`

## Useful nuance learned
The official skill also states:
- updating `repoURL` can trigger re-resolution of GitHub-derived proof fields (`commitCount`, `firstCommitAt`, `lastCommitAt`, `contributorCount`)
- updating `description` or `problemStatement` independently is safe
- post-publish edits are allowed, but should ideally remain minor corrections rather than major rewrites

This matches the right posture for ÆNS now:
- no major repositioning
- just fill the missing judge-facing fields and tighten small copy if needed

## Practical next edit payload shape
The next external update can be one compact request against:
- `POST /projects/5248d0704ac446968b5c8bb576bff56e`

With a body shaped like:

```json
{
  "conversationLog": "https://github.com/pvtclawn/aens/blob/main/docs/submission/artifacts/CONVERSATION-LOG-CURATED-2026-03-22.md",
  "videoURL": "<demo-url-once-recorded>"
}
```

If a small copy pass is desired, `description` and `problemStatement` can be added in the same request.

## Best current rule
Do not do repeated tiny external edits unless necessary.

Best order now is:
1. add `conversationLog` immediately (already verified)
2. add `videoURL` once recorded/uploaded
3. optionally bundle minor copy tightening into the same final pass if it remains honest

## Compact applied lesson
> For Synthesis, publication is not the end of editability; it is the point where only small, honest cleanup passes should remain.
