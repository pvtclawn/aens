# One-Hundred-Ninety-First Slice Verification — Public Synthesis Publish Surface (2026-03-22 21:24 UTC)

## Purpose
Verify the public-facing Synthesis publish surface after the internal publish receipt was already frozen.

This note answers a slightly different question from the previous receipt:
> not just "did publish return success?" but "does the current published project still resolve through the public Synthesis surfaces with the expected identity and custody state?"

## Repo health at verification time
- `git status -sb` -> `## main...origin/main [ahead 5]`

This note is a fresh local evidence slice added after publication.

## Verified inputs
### Project UUID
- `5248d0704ac446968b5c8bb576bff56e`

### Expected canonical project identity
- Name: `ÆNS — ENS Root Explorer + Write Records`
- Slug: `ns-ens-root-explorer-write-records-b053`
- Repo: `https://github.com/pvtclawn/aens`
- Deployed app: `https://aens-nine.vercel.app/`

## Verification results
### 1) Direct public project readback
Public `GET /projects/5248d0704ac446968b5c8bb576bff56e` returned:
- `status: publish`
- `slug: ns-ens-root-explorer-write-records-b053`
- expected repo URL
- expected deployed URL

This confirms the project is still publicly readable as a published entry.

### 2) Public listing inclusion
Public `GET /projects?page=1&limit=100` contains the same UUID.

This matters because it confirms the project is not merely individually readable by UUID — it is also present in the main public listing surface used for discovery/judging.

### 3) Authenticated custody truth
Authenticated `GET /participants/me` returned:
- `custodyType: self_custody`
- `ownerAddress: 0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `selfCustodyVerifiedAt: 2026-03-22T21:09:35.202Z`

This closes the loop between:
- public published project state
- and private participant/custody state

## Verdict
**Pass.** The current Synthesis surface is coherent across the three relevant checks:
1. project readback says `publish`
2. public listing includes the project UUID
3. participant state confirms `self_custody`

## Compact claim now safe to make
> ÆNS is not merely drafted or privately marked complete; it is a published Synthesis project with public listing presence and completed self-custody.

## Boundaries that still remain
This verification does **not** solve:
- demo video quality
- judge-facing walkthrough clarity
- post-publish visibility

So the next useful slice still shifts away from submission proof and toward the minimal honest demo artifact.
