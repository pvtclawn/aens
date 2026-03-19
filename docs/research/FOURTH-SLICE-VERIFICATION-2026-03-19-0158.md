# Fourth-slice verification — AENS parent-authorized capability surfaces (2026-03-19 01:58 UTC)

## Purpose
Verify whether the new capability-authority slice actually strengthens the standalone AENS thesis and choose the next smallest load-bearing move.

## Checks rerun
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect vitalik.eth --with-links`

## Current evidence
### 1. Local authority model works
The new test surface passes with explicit coverage for all four states:
- `parent-authorized`
- `unlisted-child`
- `identity-mismatch`
- `not-a-capability-surface`

That means AENS now has a real authority model rather than only a generic linked-record parser.

### 2. CLI/report path stays stable on live ENS names
The live inspect path still works end-to-end for ordinary ENS names like `vitalik.eth`.
This matters because the authority slice did not break the standalone repo scaffold or real ENS resolution path.

### 3. The slice materially improves the thesis
Before this slice, AENS could mostly say:
- this ENS name resolves
- these linked documents exist
- this document shape resembles a proof surface

After this slice, AENS can also say:
- this surface is not merely a child-shaped name or linked profile
- it is or is not explicitly authorized by a parent ENS identity

That is a real upgrade from ENS-as-entrypoint toward ENS-as-authority.

## What this slice still does **not** prove
### 1. No live positive capability example yet
The current live CLI verification uses a normal ENS name (`vitalik.eth`) and therefore correctly reports:
- `Capability authorization: not-a-capability-surface`

That demonstrates the negative path in production-like conditions, but not yet a live positive parent-authorized capability on ENS.

So the authority model is proven locally and architecturally, but not yet through a real-world public capability name.

### 2. Discovery semantics are still too loose
The live output currently says both:
- `Discovery surface present: yes`
- `Capability authorization: not-a-capability-surface`

That is the most important remaining contradiction.

It means the report still conflates:
- ordinary ENS profile richness,
- generic discovery signals,
- and actual agent/service authority.

So although the authority slice is real progress, the presentation layer still overstates what has been found.

## Verdict
The fourth slice **passes**.

It succeeds at the thing it was supposed to add:
- explicit parent-authority classification for capability surfaces.

That makes ENS more load-bearing than before.

But the verification also exposes the clearest remaining gap:
- the current discovery/report semantics are still too generous.

## Next-slice decision
### Option A — trust-tiered report model next
Good and needed, but slightly broader than necessary as the immediate fix.

### Option B — sharper discovery semantics next
Best next move.

The live output already proves why:
- `Discovery surface present: yes` currently means too many different things.

AENS should split this into sharper states such as:
- identity anchor present
- callable service surface present
- proof surface present
- capability-authorized surface present

### Option C — proof-language demotion next
Also needed, but downstream of the more immediate discovery semantics problem.

## Chosen next slice
# **Sharper discovery semantics**

### Smallest useful shape
Replace the current over-broad discovery boolean with clearer state reporting that separates:
1. ENS identity anchor
2. callable service surface
3. proof surface
4. capability authority

### Why this is next
- directly fixes the contradiction visible in live CLI output
- makes the new authority slice legible instead of buried under a generous boolean
- strengthens ENS truthfulness without requiring a larger report overhaul yet

## On-chain decision
No on-chain action needed for this verification pass.
The current slice is an offchain trust/discovery interpretation layer, and the most valuable next move remains interface semantics rather than gas spend.

## Bottom line
The capability-authority slice is real progress.

AENS now has a real ENS authority concept.

But the next smallest load-bearing move is not more authority logic yet — it is making the report stop implying that any rich ENS profile is already a meaningful discovery surface.
