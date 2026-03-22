# One-Hundred-Eighty-First Slice Research — Two-Surface Reset Public Truth Boundary (2026-03-22 19:34 UTC)

## Context
ÆNS product direction was corrected to a simpler truth:
- **ENS Root Explorer**
- **Write Records**

Local repo work now reflects that two-surface model, but live deployment truth must be checked separately before claiming the reset is public.

## Current repo truth
Local repo state during this scan:
- branch state: `main...origin/main [ahead 2]`
- local head: `f7772a3`

That means the two-surface cleanup is currently **local-only / remote-not-yet-updated** unless pushed and redeployed.

## Live public checks
Checked at `https://aens-nine.vercel.app`:

### 1) Root explorer
- URL: `/`
- Result: `HTTP/2 200`
- Title marker: `ÆNS — ENS root explorer`
- Interpretation: live root explorer is still fine.

### 2) Write records
- URL: `/write-records/`
- Result: `HTTP/2 308` to `/write-records`
- Final title marker: `Write ENS capability records — ÆNS`
- Interpretation: live write flow is still fine.

### 3) Legacy research-capability route
- URL: `/research-capability`
- Result: `HTTP/2 308` to `/research`
- Final title marker: `Research endpoint — ÆNS`
- Interpretation: legacy research naming is still publicly present.

### 4) Legacy discover-research route
- URL: `/discover-research`
- Result: `HTTP/2 200`
- Final title marker: `Discover the official research capability for an ENS identity — ÆNS`
- Interpretation: the old discovery surface is still fully public.

## Main insight
The live app is currently in a **split-truth state**:
- the public root explorer and write flow already exist,
- but the legacy research/discovery surfaces are **still live**, so the new two-surface product truth is **not yet the public truth**.

## Practical boundary
Safe wording right now is:
- **implemented locally:** two-surface cleanup
- **live publicly:** root explorer + write flow still exist, but legacy research/discovery surfaces are also still live
- **not yet true publicly:** “ÆNS only exposes root explorer and write records”

## Consequence
Before any public claim that the extra surfaces are gone, the next external step must be:
1. push the current local commits,
2. verify deployment flipped,
3. confirm `/research`, `/research-capability`, and `/discover-research` redirect away or disappear as intended.

Until then, the product reset is real in repo direction but not yet verified as public deployment truth.
