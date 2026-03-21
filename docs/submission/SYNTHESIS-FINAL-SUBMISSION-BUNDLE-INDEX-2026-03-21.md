# Synthesis final submission bundle index — ÆNS (2026-03-21)

Use this as the commit-pinned checklist right before submit.

## Bundle provenance
- Prepared at (UTC): 2026-03-21 09:44
- Commit pin (bundle context): `55fbc0d` (plan baseline), updated by current closure slice commit
- submissionCommit: `TBD` (set this to the exact commit used at submission click)
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
    1) wrapped example artifact,
    2) live research-capability page,
    3) wrapped live artifact,
    4) CLI reproducibility backup,
    5) live discovery route.

2. Conversation log artifact/link
- Status: TODO (required)
- Recorded URL/path: `TBD`
- Recorded at (UTC): `TBD`
- Commit context: `TBD` (must match `submissionCommit`)
- Integrity check:
  - includes deploy recovery checkpoints,
  - includes submission-alignment verification checkpoints,
  - aligns with current commit-pinned truth surface.

## Optional assets
3. Cover image
- Status: optional / not set

## Canonical submitted links and files
- Repo URL: `https://github.com/pvtclawn/aens`
- Deployed URL: `https://aens-nine.vercel.app/`
- Live research page: `https://aens-nine.vercel.app/research-capability/`
- Live discovery route: `https://aens-nine.vercel.app/discover-research/`
- Canonical artifact command: `bun run package-submission-artifacts`
- Canonical artifacts:
  - `docs/submission/artifacts/discover-research-example.json`
  - `docs/submission/artifacts/discover-research-live.json`

## <5 minute pre-submit asset-readiness checklist
### Presence
- [ ] Demo video URL is present (not TODO).
- [ ] Conversation log link/file is present (not TODO).

### Content integrity
- [ ] Video demonstrates the current judge flow order end-to-end.
- [ ] Conversation log includes recovery + verification milestones used in final claims.

### Access integrity
- [ ] Video URL opens from unauthenticated/incognito context.
- [ ] Conversation log link/file opens from unauthenticated/incognito context.

### Commit-pin integrity
- [ ] `submissionCommit` is set.
- [ ] Video/log commit context fields both match `submissionCommit`.
- [ ] Canonical artifact files exist at `submissionCommit`.

### Boundary integrity
- [ ] No wording overclaims liveness vs authorization boundary.

## No-change wait-loop operations (while required assets are still missing)
### Freshness window
- Refresh boundary evidence at least once per 6 hours while status remains `NO-SUBMIT`.
- Also refresh immediately before any submission attempt.

### Per-refresh drift check (quick pass)
- Confirm required asset fields are still TODO or now populated.
- Confirm core submitted links still resolve:
  - `https://aens-nine.vercel.app/`
  - `https://aens-nine.vercel.app/research-capability/`
  - `https://aens-nine.vercel.app/discover-research/`
- Confirm technical baseline is still green (`tsc`, tests, public-surface check).

### Dependency reminder cadence
- If required assets remain missing, send one concise reminder to the operator at most once per freshness window.
- Reminder format: "Still need demo video URL + conversation log link/file to flip SUBMIT-READY."
- Do not repeat reminder if no new state since the last reminder in the same window.

## Closure gate
Do not submit unless all are true:
1. Technical gate: runtime + docs + artifacts aligned.
2. Presence gate: required non-code assets exist (video + log).
3. Integrity gate: required assets pass content + access checks.
4. Commit-pin gate: submission assets map to the same `submissionCommit` context.
