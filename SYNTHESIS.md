# ÆNS → Synthesis submission prep

This file is the practical submission control doc for the current ÆNS product truth.
Use it together with the form pack and final bundle index.

## Current project truth
ÆNS should be submitted as a **two-surface ENS utility**:
1. **ENS Root Explorer** — inspect current root-state records
2. **Write Records** — prepare the exact `aens.*` writes and stop at the wallet boundary

Do **not** pitch it as research/discovery middleware.
Do **not** claim legacy routes are publicly gone unless the live route check actually proves that.

## Canonical links
- Repo: `https://github.com/pvtclawn/aens`
- Live app: `https://aens-nine.vercel.app/`
- Root explorer: `https://aens-nine.vercel.app/`
- Write records: `https://aens-nine.vercel.app/write-records/`

## Builder guide facts to respect
From the Synthesis builder guide reference:
- submission deadline: **March 22, 11:59 PM PST**
- each team can submit **up to 3 projects**
- teams must be **Human + AI**
- project submission starts as a **draft** and stays editable until publish
- after publish, the project remains editable until the deadline, but **publishing is irreversible**
- before publishing, **every team member must transfer their ERC-8004 identity NFT to a wallet they own and control**
- keep the project **live and accessible** for judges
- a **public demo video URL** is strongly recommended

## Required Devfolio submission data
Have these ready before the final submission pass:
- project name
- short description
- problem statement
- GitHub repo URL
- **1–10 tracks**
- conversation log artifact (plain text or public link)
- submission metadata:
  - agent framework / harness
  - model
  - skills + tools used
  - intention (`continuing`, `exploring`, or `one-time`)

Optional but useful:
- deployed URL
- video URL
- cover image
- helpful resources
- Moltbook post URL

See the fill-in map:
- `docs/submission/SYNTHESIS-DEVFOLIO-FIELD-MAP-2026-03-22.md`

## Recommended tracks
1. **ENS Open Integration**
2. **ENS Identity**

Devfolio allows 1–10 tracks, but ÆNS should stay disciplined and submit under the strongest 1–2, not spray everywhere.

## Current live deploy boundary
Latest public checks after pushing `4fa7e88` to `origin/main` and sampling the canonical alias twice:
- `/` → ok
- `/write-records/` → ok
- `/research` → `404`
- `/research/` → `404`
- `/research-capability` → `404`
- `/discover-research` → `404`

That means the live alias now matches the intended two-surface product shape. It is safe to say the old research/discovery routes are no longer publicly reachable on the canonical deployment.

## Required submission posture
The submission should claim only that ÆNS:
- reads root ENS state clearly
- prepares exact `aens.*` writes clearly
- keeps the wallet boundary explicit
- stays intentionally narrow instead of pretending to be a broader agent platform

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
- [ ] submission metadata filled
- [ ] final submission copy pasted from the form pack
- [ ] track selection decided
- [ ] every team member is in ERC-8004 self-custody
- [ ] live app checked from incognito
- [ ] legacy-route claim checked honestly (either verified gone live, or omitted)

## Pre-publish verification
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run check-public-surface
cd app && bun run build
cd .. && bun run typecheck
```

Interpretation rule:
- with the current verified state, route-removal claims are allowed on the canonical alias
- if legacy routes ever reappear or another alias diverges, immediately fall back to split-truth wording until re-verified

## Judge demo order
1. Open the root explorer
2. Resolve a real ENS root
3. Show current `aens.*` state
4. Open write records
5. Show the planned writes JSON
6. Stop at the wallet approval boundary unless a live write is intentionally requested

Do **not** demo legacy research/discovery routes.

## Files to use
- `docs/submission/SYNTHESIS-DEVFOLIO-FIELD-MAP-2026-03-22.md`
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-22.md`
- `docs/submission/SYNTHESIS-FINAL-SUBMISSION-BUNDLE-INDEX-2026-03-21.md`
- `docs/submission/SYNTHESIS-SUBMISSION-BLURB-2026-03-20.md`
- `docs/submission/SYNTHESIS-TRACK-FIT-2026-03-21.md`
- `docs/submission/SYNTHESIS-COMPETITIVE-POSITIONING-2026-03-21.md`

## Official submission-skill reference
- `https://synthesis.devfolio.co/submission/skill.md`

## Final one-liner
**ÆNS is the minimal ENS utility for inspecting root identity state and writing the `aens.*` records that matter.**
