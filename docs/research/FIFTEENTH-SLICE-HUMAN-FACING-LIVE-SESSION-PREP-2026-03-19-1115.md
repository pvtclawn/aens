# Fifteenth ÆNS slice — human-facing live session prep (2026-03-19 11:15 UTC)

## Goal
Prepare the first live ÆNS write session for a human-in-the-loop run without attempting any ENS writes while the wallet owner is not explicitly present.

## Why this slice exists
The checklist for the first live session is now frozen, but the session still needed two practical things:
1. a concise operator path Egor can actually follow in one sitting
2. a simple proof-capture helper so baseline / checkpoint / final CLI artifacts are not forgotten during wallet approvals

## What this slice adds
### 1. Proof-capture helper
Added:
- `scripts/capture-live-proof.sh`
- package script:
  - `bun run capture-proof -- <label>`

Behavior:
- captures `bun run inspect pvtclawn.eth`
- captures `bun run inspect research.pvtclawn.eth`
- writes a timestamped markdown artifact
- defaults to `docs/proof/live-session/`
- supports `AENS_PROOF_DIR=/tmp/...` for dry-run verification

### 2. Human-facing operator sequence
Added:
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`

The full checklist remains the source of truth, but the operator note makes the live session easier to run by centering three capture moments:
- `baseline`
- `post-root`
- `final`

with one reusable command:
```bash
bun run capture-proof -- baseline
bun run capture-proof -- post-root
bun run capture-proof -- final
```

## Why this matters
The live session is now constrained by human-wallet coordination, not missing local product work.
So the highest-leverage prep is not another offline feature; it is reducing operator error during the first real publication.

## Scope boundary
This slice does **not** perform ENS writes.
It prepares the session that will perform them.

## Checks run
- `bun test`
- `bunx tsc --noEmit`
- `AENS_PROOF_DIR=/tmp/aens-proof-test bash scripts/capture-live-proof.sh baseline`

## Success criterion
When Egor is present, the first live session can be run with:
- a frozen step sequence
- a reusable proof-capture command
- less risk of forgetting baseline/final artifacts while approving wallet transactions
