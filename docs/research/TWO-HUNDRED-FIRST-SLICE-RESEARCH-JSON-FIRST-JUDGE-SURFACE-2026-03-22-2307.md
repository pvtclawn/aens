# Two-Hundred-First Slice Research — JSON-First Judge Surface (2026-03-22 23:07 UTC)

## Why this note exists
The live Synthesis project slug surface is behaving less like a polished project page and more like a JSON payload viewer.

That changes what the last-hour optimization should target.

The useful question is no longer just:
- which submission fields are theoretically supported?

It is:
- **which fields actually survive onto the current judge-facing surface?**

## Fresh observed surface behavior
After the full project update payload was posted:
- mutation response preserved `publish`
- mutation response included the `conversationLog` URL
- mutation response included enriched `submissionMetadata` (`commitCount`, `contributorCount`, commit timestamps, tools, skills)

But the public/authenticated `GET /projects/:uuid` still returned:
- `conversationLog: null`

And the slug page currently renders the same project JSON directly, including:
- `name`
- `description`
- `problemStatement`
- `repoURL`
- `deployedURL`
- `submissionMetadata`
- `tracks`

while still omitting `conversationLog`.

## Main insight
The current effective judge surface is **JSON-first**.

That means the highest-leverage remaining edits are the ones that survive the JSON surface the judge is most likely to see.

## Fields that currently appear useful on the live surface
### Strong / visible
- `name`
- `description`
- `problemStatement`
- `repoURL`
- `deployedURL`
- `submissionMetadata.helpfulResources`
- `submissionMetadata.tools`
- `submissionMetadata.skills`
- `submissionMetadata.commitCount`
- `submissionMetadata.firstCommitAt`
- `submissionMetadata.lastCommitAt`
- attached `tracks`

### Weak / unreliable
- `conversationLog`
- likely any field that is accepted by mutation but not present in readback

## Practical implication for the remaining hours
If the public judge surface remains JSON-first, then the best way to improve the visible submission is:

1. **Put machine-readable evidence where the JSON surface already shows it**
   - add `agent.json` and later `agent_log.json` URLs into `submissionMetadata.helpfulResources`
   - optionally reference them in `description` / `problemStatement` if wording stays honest

2. **Favor fields with proven round-trip visibility**
   - sharpen `description`
   - sharpen `problemStatement`
   - enrich `helpfulResources`
   - ensure metadata fields stay populated

3. **Treat `conversationLog` as non-authoritative for visibility planning**
   - keep it set if possible
   - but do not rely on it as the main visible proof link

## Concrete next-step consequence
For prize-facing impact, the next artifacts should not just exist in the repo.
They should also be added to the fields that the JSON-first surface already exposes well.

That means:
- `agent.json` should likely be added to `submissionMetadata.helpfulResources`
- `agent_log.json` should likely be added there too once it exists

This is probably higher ROI than spending more time trying to force `conversationLog` to render through inconsistent API semantics.

## Compact applied rule
> Optimize the submission for the judge surface that actually exists, not the one the docs imply should exist.
