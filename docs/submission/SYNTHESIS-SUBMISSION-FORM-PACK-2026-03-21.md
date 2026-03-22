# Synthesis submission form pack — ÆNS (2026-03-21, refreshed 2026-03-22)

Use this as the copy-paste pack for the actual submission form, aligned to the current honest product truth and builder-guide requirements.

## Project name
**ÆNS — ENS Root Explorer + Write Records**

## One-line pitch
ÆNS gives agents and operators two clean ENS-native surfaces: inspect a root identity and prepare the `aens.*` writes from a wallet.

## Short description
ÆNS is a minimal ENS utility for agent identity work. It keeps the product honest and narrow: one surface to inspect an ENS root and its `aens.*` text records, and one surface to write `aens.capabilities`, `aens.parent`, and `aens.service` from a browser wallet.

## Problem statement
Most ENS demos for agents either overreach into vague “agent platforms” or bury the actually useful action behind too many speculative routes. The useful core is smaller: see the current ENS truth for a root identity, then prepare the records you need without ceremony.

## Solution / long description
ÆNS does exactly two things:
- **ENS Root Explorer** — resolve an ENS root in-browser and show the current `aens.*` state.
- **Write Records** — prepare and submit `aens.capabilities`, `aens.parent`, and `aens.service` writes from a wallet.

The submission intentionally does **not** pitch a separate research/discovery product surface. The product truth is the explorer plus the write flow.

## What the current build proves
- ENS root state can be resolved directly in the browser.
- The write flow can prepare the exact `aens.*` text-record writes needed for a capability subname.
- The submission pitch can stay narrow and honest instead of pretending to be a bigger endpoint/discovery platform.
- The live public-surface boundary is checked separately; do **not** claim legacy routes are gone unless the public-surface verification passes.

## What it does not overclaim
- automatic wallet signing
- runtime auth
- payments
- full production hardening
- public route removal without live verification

## Builder-guide field coverage
Have these ready in the form:
- GitHub repo URL
- 1–10 tracks
- conversation log artifact
- submission metadata (framework/harness, model, skills/tools, intention)
- deployed URL and public demo video URL if available

Canonical field map:
- `docs/submission/SYNTHESIS-DEVFOLIO-FIELD-MAP-2026-03-22.md`

## Recommended tracks
1. **ENS Open Integration**
2. **ENS Identity**

## Demo flow for judges
1. Open the root explorer:
- `https://aens-nine.vercel.app/`
2. Resolve a root like `theaens.eth` or `vitalik.eth` and inspect the current `aens.*` state.
3. Open the write flow:
- `https://aens-nine.vercel.app/write-records/`
4. Show the planned writes for `aens.capabilities`, `aens.parent`, and `aens.service`.
5. If using a real wallet session, stop at the approval boundary unless the judge explicitly wants the live write.

## Repo URL
- `https://github.com/pvtclawn/aens`

## Deployed URL
- `https://aens-nine.vercel.app/`

## Helpful resources
- repo README
- `SYNTHESIS.md`
- `docs/submission/SYNTHESIS-DEVFOLIO-FIELD-MAP-2026-03-22.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `docs/submission/SYNTHESIS-FINAL-SUBMISSION-BUNDLE-INDEX-2026-03-21.md`

## Tiny judge entry map (30 seconds)
- **User problem:** inspect ENS root truth, then write the right `aens.*` records.
- **Live explorer:** `https://aens-nine.vercel.app/`
- **Live write flow:** `https://aens-nine.vercel.app/write-records/`
- **Boundary:** wallet approval is still the explicit human-controlled step.

## Submission metadata draft
### Agent framework / harness
- OpenClaw main agent workflow

### Model
- Default development model: `openai-codex/gpt-5.3-codex`
- This polishing session used `openai-codex/gpt-5.4`

### Tools used
- file editing (`read`, `write`, `edit`)
- shell execution (`exec`)
- browser inspection (`browser`)

### Intention
- `continuing`

## Best final judge-facing sentence
**ÆNS is the minimal ENS utility for inspecting root identity state and writing the `aens.*` records that make capability naming real.**
