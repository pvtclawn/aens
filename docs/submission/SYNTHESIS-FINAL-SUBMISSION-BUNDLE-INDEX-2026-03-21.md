# Synthesis final submission bundle index — ÆNS (2026-03-21, refreshed 2026-03-22)

Use this as the commit-pinned checklist right before submit/publish.

## Builder-guide constraints
- Submission deadline: **March 22, 11:59 PM PST**
- Each team can submit **up to 3 projects**
- Teams must be **Human + AI**
- Submission begins as a **draft**
- **Publishing is irreversible**
- After publish, the project stays editable until the deadline
- Keep the project **live and accessible** for judges
- Every team member must complete **ERC-8004 self-custody** before publish

## Bundle provenance
- Prepared at (UTC): 2026-03-22 20:14
- submissionCommit: `SET_AT_FINAL_FREEZE`
- Repo: `https://github.com/pvtclawn/aens`
- Deployed app: `https://aens-nine.vercel.app/`
- Official submission skill: `https://synthesis.devfolio.co/submission/skill.md`

## Required draft fields from the guide
- [ ] Project name
- [ ] Description
- [ ] Problem statement
- [ ] GitHub repo URL
- [ ] 1–10 tracks selected
- [x] Conversation log artifact ready
- [ ] Submission metadata ready

## Required publish gates
- [ ] Team is Human + AI
- [ ] Project has a name
- [ ] Project has at least one track
- [ ] Every team member is in ERC-8004 self-custody

## Required assets
### 1) Demo video URL
- Status: TODO (strongly recommended)
- Recorded URL: `SET_BEFORE_PUBLISH`
- Recorded at (UTC): `SET_BEFORE_PUBLISH`
- Commit context: `MATCH_SUBMISSION_COMMIT`
- Integrity check:
  1. root explorer
  2. write-records page
  3. wallet approval boundary

### 2) Conversation log artifact/link
- Status: prepared (required)
- Recorded URL/path: `docs/submission/artifacts/CONVERSATION-LOG-CURATED-2026-03-22.md`
- Public URL: `https://github.com/pvtclawn/aens/blob/main/docs/submission/artifacts/CONVERSATION-LOG-CURATED-2026-03-22.md`
- Recorded at (UTC): `2026-03-22 20:14`
- Commit context: `current prep commit 9b3480f; pin exact final submission commit at freeze`
- Integrity check:
  - shows the human + AI collaboration
  - shows the product narrowing to two honest surfaces
  - aligns with the commit-pinned product surface

## Canonical submitted links and files
- Repo URL: `https://github.com/pvtclawn/aens`
- Deployed URL: `https://aens-nine.vercel.app/`
- Live root explorer: `https://aens-nine.vercel.app/`
- Live write flow: `https://aens-nine.vercel.app/write-records/`
- Submission prep doc: `SYNTHESIS.md`
- Devfolio field map: `docs/submission/SYNTHESIS-DEVFOLIO-FIELD-MAP-2026-03-22.md`
- Canonical verification command: `bun run check-public-surface`

## <5 minute pre-submit checklist
### Presence
- [x] Conversation log link/file is present.
- [ ] Submission metadata is present.
- [ ] Demo video URL is present, or consciously omitted.

### Access
- [x] Conversation log link/file opens from unauthenticated/incognito context.
- [ ] Video URL opens from unauthenticated/incognito context.
- [ ] Live app loads from unauthenticated/incognito context.

### Commit pin
- [ ] `submissionCommit` is set.
- [ ] Video commit context matches `submissionCommit`.
- [ ] Conversation-log commit context matches `submissionCommit`.

### Product truth
- [ ] Root explorer is the live first surface.
- [ ] Write records is the live second surface.
- [ ] Submission copy leads only with the two real surfaces.
- [ ] No submission copy overclaims automatic wallet execution.
- [ ] No submission copy says legacy routes are gone unless live verification proves it.

### Publish boundary
- [ ] Draft contents are final enough before publish.
- [ ] Team understands publish is irreversible.
- [ ] Every team member has completed ERC-8004 self-custody.

## Quick drift check
Confirm these before publishing:
- `https://aens-nine.vercel.app/`
- `https://aens-nine.vercel.app/write-records/`
- removed/legacy routes are either actually retired live, or omitted from any disappearance claim

Current prep-pass note:
- root explorer: live
- write records: live
- `/research` -> `404`
- `/research/` -> `404`
- `/research-capability` -> `404`
- `/discover-research` -> `404`
- route-removal claims are now supported by direct live verification on the canonical alias

## Closure gate
Do not publish unless all are true:
1. Live explorer is correct.
2. Live write flow is correct.
3. Required fields exist.
4. ERC-8004 self-custody is complete for all team members.
5. Wallet boundary is described honestly.
6. The team is ready for irreversible publish.
