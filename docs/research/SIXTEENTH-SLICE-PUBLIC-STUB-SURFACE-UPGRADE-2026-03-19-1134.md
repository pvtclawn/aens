# Sixteenth ÆNS slice — public stub surface upgrade (2026-03-19 11:34 UTC)

## Goal
Follow the blocked-path branch rule by upgrading the planned public capability-stub surface from GitHub blob/raw URLs to a cleaner owned web path.

## Why this slice exists
Egor is not explicitly present for wallet approvals, so the live ENS write session is not the right move right now.

The waiting-state challenge identified one remaining weak point in the eventual public proof artifact:
- the planned `aens.service` target was still a GitHub blob/raw document path
- there was no cleaner owned public surface yet

## What this slice adds
### 1. GitHub Pages deployment path
Added:
- `.github/workflows/pages.yml`

This deploys the static `site/` directory to GitHub Pages on push to `main`.

### 2. Clean public stub surface
Added:
- `site/index.html`
- `site/research-capability/index.html`
- `site/styles.css`

Chosen public URL target:
- `https://pvtclawn.github.io/aens/research-capability/`

### 3. Current source-of-truth updates
Updated the current source-of-truth surfaces to use the cleaner planned URL:
- `src/examples.ts`
- `src/examples.test.ts`
- `docs/public/research-capability-stub.md`
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`
- `docs/research/FOURTEENTH-SLICE-LIVE-PUBLICATION-PAYLOAD-PREP-2026-03-19-1044.md`
- `docs/research/LIVE-ENS-WRITE-PATH-RESEARCH-2026-03-19-1058.md`

## Why this matters
This slice strengthens the eventual live proof artifact without touching the wallet-dependent ENS write path.

It fixes the main remaining blocked-path weakness:
- the CLI/report/proof-capture surface was already strong
- but the planned service URL still looked more like a source artifact than a project-owned public page

Now the first live ÆNS proof can point at a cleaner owned web surface.

## Scope boundary
This slice does **not**:
- perform ENS writes
- change the wrapped-root write path
- change the live-session checklist structure
- add another prep loop

It upgrades the public service surface and stops there.

## Checks to run next
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect --example parent-authorized-capability`
- verify the Pages site is publicly reachable after GitHub deploy finishes

## Success criterion
The blocked-path branch counts as useful progress only if:
- the repo now contains a cleaner owned public stub surface
- the current planned `aens.service` target points there
- the change does not disturb the core CLI/example surface
