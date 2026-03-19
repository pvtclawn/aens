# Seventeenth ÆNS slice — public surface check command (2026-03-19 12:05 UTC)

## Goal
Add one narrow verification command for the Pages/public-stub boundary so the next human/admin step can be checked with a single command instead of ad hoc URL poking.

## Why this slice exists
The current blocker is no longer local site code.
It is the publication boundary between:
- repo/workflow state
- GitHub Pages settings/publication state
- the actual public URL that the live `aens.service` target should point to

That makes a tiny verification command more useful than another note.

## What this adds
### 1. Shared public-surface constants and checks
Added:
- `src/public-surface.ts`

This centralizes:
- Pages root URL
- Pages research capability URL
- GitHub blob fallback URL
- small pure helpers for pass/fail summarization

### 2. Public-surface check command
Added:
- `src/check-public-surface.ts`
- package script:
  - `bun run check-public-surface`

The command checks:
- `https://pvtclawn.github.io/aens/`
- `https://pvtclawn.github.io/aens/research-capability/`
- blob fallback for comparison

and exits non-zero until the Pages surface is truly live.

### 3. Test coverage for the result interpretation
Added:
- `src/public-surface.test.ts`

This proves the command’s interpretation logic for:
- success
- reachable but wrong content
- HTTP failure

### 4. Example URL source-of-truth cleanup
The deterministic positive example now imports the Pages research-capability URL from the shared public-surface module rather than hardcoding it separately.

## Why this matters
After Egor flips the repo Pages setting, there should be one obvious verification step:
```bash
bun run check-public-surface
```

That is cleaner than manually checking URLs and guessing whether the public surface is actually ready.

## Scope boundary
This slice does **not**:
- change the Pages site content
- change the live ENS write path
- change the runbook logic
- replace the need for the one-time GitHub Pages settings step

It adds a single-purpose verification command for that boundary.

## Checks run
- `bun test`
- `bunx tsc --noEmit`
- `bun run check-public-surface`
- `bun run inspect --example parent-authorized-capability`

## Success criterion
The repo now has a one-command way to answer:
- is the cleaner public Pages surface actually live yet?
