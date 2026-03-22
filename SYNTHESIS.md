# ÆNS → Synthesis submission prep

This file is the practical submission checklist for the current ÆNS product truth.

## Current project truth
ÆNS should be submitted as a **two-surface ENS utility**:
1. **ENS Root Explorer** — inspect current root-state records
2. **Write Records** — prepare the exact `aens.*` writes and stop at the wallet boundary

Do **not** pitch it as research/discovery middleware.

## Canonical links
- Repo: `https://github.com/pvtclawn/aens`
- Live app: `https://aens-nine.vercel.app/`
- Root explorer: `https://aens-nine.vercel.app/`
- Write records: `https://aens-nine.vercel.app/write-records/`

## Builder guide facts to respect
From the Synthesis builder guide reference:
- submission deadline: **March 22, 11:59 PM PST**
- each team can submit **up to 3 projects**
- project submission starts as a **draft** and stays editable until publish
- **publishing is irreversible**
- keep the project **live and accessible** for judges

## Recommended tracks
1. **ENS Open Integration**
2. **ENS Identity**

## Required submission posture
The submission should claim only that ÆNS:
- reads root ENS state clearly
- prepares exact `aens.*` writes clearly
- keeps the wallet boundary explicit

It should **not** claim:
- automatic wallet execution
- completed live write publication for every example name
- runtime auth
- payments
- full production hardening

## Submission asset checklist
Before publish, make sure these exist:
- [ ] final repo link
- [ ] final deployed link
- [ ] short demo video URL
- [ ] conversation log / build log artifact
- [ ] final submission copy pasted from the form pack
- [ ] track selection decided
- [ ] live app checked from incognito

## Pre-publish verification
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run check-public-surface
cd app && bun run build
cd .. && bun run typecheck
```

## Judge demo order
1. Open the root explorer
2. Resolve a real ENS root
3. Show current `aens.*` state
4. Open write records
5. Show the planned writes JSON
6. Stop at the wallet approval boundary unless a live write is intentionally requested

## Files to use
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-FINAL-SUBMISSION-BUNDLE-INDEX-2026-03-21.md`
- `docs/submission/SYNTHESIS-SUBMISSION-BLURB-2026-03-20.md`
- `docs/submission/SYNTHESIS-TRACK-FIT-2026-03-21.md`

## Final one-liner
**ÆNS is the minimal ENS utility for inspecting root identity state and writing the `aens.*` records that matter.**
