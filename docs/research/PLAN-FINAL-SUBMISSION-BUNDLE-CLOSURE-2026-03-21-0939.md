# Plan — Final Submission Bundle Closure (2026-03-21 09:39 UTC)

## Goal
Apply stronger final-mile packaging closure gates without expanding scope beyond submission readiness.

## Scope boundary
- No new product features.
- No deploy/infrastructure changes.
- Focus only on final submission bundle integrity.

## Tasks (next 1–3)

### 1) Create a commit-pinned submission bundle index
Target: add one small repo note enumerating every link/asset to be submitted.

Acceptance criteria:
- Includes: demo video URL, conversation log link/file, deployed URL, repo URL, artifact paths.
- Records commit hash and timestamp used for the final submission package.
- Clearly marks optional vs required assets.

### 2) Add a content-integrity checklist for non-code assets
Target: define one short checklist that validates asset quality, not just existence.

Acceptance criteria:
- Video check confirms current judge flow order is shown.
- Conversation log check confirms recovery/verification milestones are present.
- Checklist can be executed in <5 minutes before submit.

### 3) Patch submission form pack with a tiny judge entry map
Target: append a compact "watch/read first" map for time-constrained judges.

Acceptance criteria:
- 4 lines max: user problem, deterministic artifact, live surface, proof-boundary sentence.
- Wording matches current truth (no stale caveats, no overclaim).
- Linked resources point to current bundle index entries.

## Done definition
A final submitter can run one short pre-submit pass and reliably avoid stale links, mismatched demo flow, or unverifiable packaging artifacts.
