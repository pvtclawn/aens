# Synthesis Devfolio field map — ÆNS (2026-03-22)

This is the practical fill-in sheet for the actual Synthesis submission.
It is derived from the builder guide's "What Gets Stored on Devfolio" and submission sections.

## Publish gates from the builder guide
Before publish is allowed:
- the team must be **Human + AI**
- the project must have a **name**
- the project must have **at least one track**
- **every team member** must have transferred their ERC-8004 identity NFT to a wallet they own and control

Important boundary:
- the project starts as a **draft**
- draft creation/editing is reversible
- **publish is irreversible**
- after publish, the project can still be edited until the deadline, but it cannot be unpublished or deleted back into draft

## Required draft fields
### 1) Project name
**ÆNS — ENS Root Explorer + Write Records**

### 2) Short description
ÆNS is a minimal ENS utility for inspecting root identity state and preparing the `aens.*` writes needed to publish capability metadata.

### 3) Problem statement
Most ENS demos for agents either overreach into vague platform claims or bury the useful action behind speculative routes. The useful operator loop is smaller: inspect the current ENS truth for a root identity, then prepare the exact `aens.*` writes needed to publish capability metadata while keeping the wallet boundary explicit.

### 4) GitHub repo URL
- `https://github.com/pvtclawn/aens`

### 5) Tracks (Devfolio allows 1–10)
Recommended submission tracks:
1. **ENS Open Integration**
2. **ENS Identity**

### 6) Conversation log artifact
Status: **prepared**

Prepared artifact:
- path: `docs/submission/artifacts/CONVERSATION-LOG-CURATED-2026-03-22.md`
- public URL: `https://github.com/pvtclawn/aens/blob/main/docs/submission/artifacts/CONVERSATION-LOG-CURATED-2026-03-22.md`

Accepted by guide:
- plain text conversation log, or
- public link to a file containing the conversation

Recommended artifact requirement:
- should show the human + AI collaboration clearly
- should show the product narrowing to the two honest surfaces
- should be publicly accessible if linked

### 7) Submission metadata
#### Agent framework / harness
- OpenClaw main agent workflow

#### Model
- Default development model: `openai-codex/gpt-5.3-codex`
- Current polishing session: `openai-codex/gpt-5.4`

#### Skills + tools used
- tools: `read`, `write`, `edit`, `exec`, `browser`
- referenced builder guide via browser/web fetch
- no special external submission harness used yet in this prep pass

#### Intention
Recommended value:
- `continuing`

## Strongly recommended fields
### Demo video URL
Status: **TODO before publish**

Guide note:
- strongly recommended for judges
- should be publicly accessible

Recommended content:
1. root explorer
2. write records
3. exact planned writes
4. wallet approval boundary

## Optional fields worth filling
### Deployed URL
- `https://aens-nine.vercel.app/`

### Helpful resources
- `https://github.com/pvtclawn/aens`
- `https://aens-nine.vercel.app/`
- `https://aens-nine.vercel.app/write-records/`
- `SYNTHESIS.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-FINAL-SUBMISSION-BUNDLE-INDEX-2026-03-21.md`

### Cover image
Status: optional / not prepared

### Moltbook post URL
Status: optional / not prepared

## Honesty boundary for the actual form
Safe claims:
- root ENS state can be inspected cleanly in-browser
- write flow prepares exact `aens.*` writes
- wallet approval stays explicit
- the product is intentionally narrow
- current live verification shows `/research`, `/research/`, `/research-capability`, and `/discover-research` are not publicly reachable on the canonical alias

Unsafe claims unless re-verified live:
- automatic execution beyond the wallet boundary
- production-complete infrastructure

## Final reminder
Do not publish from draft until all of these are true:
- tracks selected
- conversation log ready
- self-custody complete for all team members
- live project accessible
- route-removal claims, if any, are actually verified live
