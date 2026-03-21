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
- [ ] At least one non-owner access check is recorded for both required assets.

### Commit-pin integrity
- [ ] `submissionCommit` is set.
- [ ] Video/log commit context fields both match `submissionCommit`.
- [ ] Canonical artifact files exist at `submissionCommit`.

### Boundary integrity
- [ ] No wording overclaims liveness vs authorization boundary.

### Per-refresh evidence line (mandatory)
- [ ] Record one compact evidence line for each wait-loop refresh in the paired research note.
- [ ] Evidence line must include completeness token: `checks=4/4` where the expected set is:
  1) `tsc`, 2) `tests`, 3) `public-surface`, 4) `asset-fields`.
- [ ] `result=unchanged` is invalid unless `checks=4/4` is present.
- [ ] Evidence line must include blocker snapshot (`video_status`, `log_status`) and marker-linkage token (`marker_updated_at`).
- [ ] Canonical line format:
  - `<timestamp> | checks=4/4[tsc,tests,public-surface,asset-fields] | video_status=<missing|present> | log_status=<missing|present> | marker_updated_at=<ts> | result=<changed|unchanged> | decision=<NO-SUBMIT|SUBMIT-READY>`

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
- If required assets remain missing, send at least one concise reminder per freshness window.
- Do not send more than one reminder in the same window unless state changes.
- Reminder format: "Still need demo video URL + conversation log link/file to flip SUBMIT-READY."

## Wait-loop trend + requirement-sync markers
- decision_severity: `NO-SUBMIT (required assets missing)`
- blocker_vector: `video_status=missing, log_status=missing`
- blocked_since: `2026-03-21T09:54:00Z`
- windows_elapsed: `0` (6h windows elapsed since blocked_since; does not reduce blocker severity)
- last_reminder_at: `2026-03-21T10:54:00Z`
- reminder_ack: `pending` (`yes` | `no` | `pending`)
- eta_signal: `none` (`none` | `tentative` | `committed`)
- marker_updated_at: `2026-03-21T13:04:00Z`
- requirements_sync: `unchanged @ 2026-03-21T13:04:00Z`
- requirements_checked_at: `2026-03-21T13:04:00Z`
- requirements_summary: `Builder Guide required assets still include demo video URL + conversation log.`
- requirements_source_ref: `https://synthesis.md/hack/ (Builder Guide / submission requirements)`

## Closure gate
Do not submit unless all are true:
1. Technical gate: runtime + docs + artifacts aligned.
2. Presence gate: required non-code assets exist (video + log).
3. Integrity gate: required assets pass content + access checks.
4. Commit-pin gate: submission assets map to the same `submissionCommit` context.
