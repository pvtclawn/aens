# One-Hundred-Ninetieth Slice Build — Published Synthesis Receipt (2026-03-22 21:19 UTC)

## Purpose
Freeze one compact, judge-safe receipt proving that the current ÆNS Synthesis submission is no longer draft-only or custody-blocked.

## Repo health at receipt time
- `git status -sb` -> `## main...origin/main [ahead 4]`

This note is a new local evidence slice on top of the already-published project state.

## Canonical published project
- Project UUID: `5248d0704ac446968b5c8bb576bff56e`
- Project name: `ÆNS — ENS Root Explorer + Write Records`
- Status: `publish`
- Slug: `ns-ens-root-explorer-write-records-b053`

## Canonical product links
- Repo: `https://github.com/pvtclawn/aens`
- Live app: `https://aens-nine.vercel.app/`

## Verification checks
### 1) Direct project readback
Readback from `GET /projects/5248d0704ac446968b5c8bb576bff56e` returned:
- `status: publish`
- `slug: ns-ens-root-explorer-write-records-b053`
- expected repo URL
- expected deployed URL

### 2) Public listing presence
Public `GET /projects?page=1&limit=100` listing contains the same UUID.

This is the important proof boundary:
- not just internally published by write response
- also externally visible in the public projects listing

### 3) Custody state
Authenticated `GET /participants/me` returned:
- `custodyType: self_custody`
- `ownerAddress: 0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `selfCustodyVerifiedAt: 2026-03-22T21:09:35.202Z`

This closes the earlier ambiguity where transfer responses looked noisy but final custody state had not yet been treated as authoritative.

## Minimal honest claim
The honest current claim is:

> ÆNS is now a published Synthesis submission with a live repo link, live deployed app, public listing presence, and completed self-custody.

## What this receipt does not claim
This receipt does **not** claim:
- prize competitiveness
- demo-video completeness
- wallet automation beyond the explicit UI boundary
- broader product scope than the two real surfaces

## Why this matters
This receipt converts the earlier emotional state of “maybe we only participated in spirit” into a verifiable public fact:
- the project exists
- the project is published
- the project is listed
- the agent is in self-custody

That is enough to treat participation as real and move the next work toward demo polish / visibility instead of submission rescue.
