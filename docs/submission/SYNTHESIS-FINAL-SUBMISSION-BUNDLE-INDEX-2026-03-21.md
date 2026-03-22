# Synthesis final submission bundle index — ÆNS (2026-03-21)

Use this as the commit-pinned checklist right before submit.

## Bundle provenance
- Prepared at (UTC): 2026-03-21 09:44
- submissionCommit: `TBD`
- Repo: `https://github.com/pvtclawn/aens`
- Deployed app: `https://aens-nine.vercel.app/`

## Required assets
1. Demo video URL
- Status: TODO (required)
- Recorded URL: `TBD`
- Recorded at (UTC): `TBD`
- Commit context: `TBD` (must match `submissionCommit`)
- Integrity check:
  - shows judge flow in current order:
    1) root explorer,
    2) write-records page,
    3) wallet approval boundary.

2. Conversation log artifact/link
- Status: TODO (required)
- Recorded URL/path: `TBD`
- Recorded at (UTC): `TBD`
- Commit context: `TBD` (must match `submissionCommit`)
- Integrity check:
  - includes route cleanup / truth-alignment checkpoints,
  - aligns with current commit-pinned product surface.

## Canonical submitted links and files
- Repo URL: `https://github.com/pvtclawn/aens`
- Deployed URL: `https://aens-nine.vercel.app/`
- Live root explorer: `https://aens-nine.vercel.app/`
- Live write flow: `https://aens-nine.vercel.app/write-records/`
- Canonical verification command: `bun run check-public-surface`

## <5 minute pre-submit asset-readiness checklist
### Presence
- [ ] Demo video URL is present (not TODO).
- [ ] Conversation log link/file is present (not TODO).

### Content integrity
- [ ] Video demonstrates the current judge flow order end-to-end.
- [ ] Conversation log includes route cleanup + verification milestones used in final claims.

### Access integrity
- [ ] Video URL opens from unauthenticated/incognito context.
- [ ] Conversation log link/file opens from unauthenticated/incognito context.

### Commit-pin integrity
- [ ] `submissionCommit` is set.
- [ ] Video/log commit context fields both match `submissionCommit`.

### Boundary integrity
- [ ] No wording overclaims wallet automation or live writes.
- [ ] No wording resurrects retired research/discovery surfaces.

## Quick drift check
Confirm these still resolve correctly before any submit:
- `https://aens-nine.vercel.app/`
- `https://aens-nine.vercel.app/write-records/`
- legacy extra routes redirect away instead of surfacing product fiction

## Closure gate
Do not submit unless all are true:
1. Live explorer is correct.
2. Live write flow is correct.
3. Required external assets exist (video + log).
4. Wallet approval boundary is described honestly.
