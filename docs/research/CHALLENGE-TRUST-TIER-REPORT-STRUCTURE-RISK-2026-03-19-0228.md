# Challenge — trust-tier report structure risk (2026-03-19 02:28 UTC)

## Purpose
Red-team the planned trust-tier report slice before building it.

## Verdict
The direction is correct, but the slice can still fail if it becomes a cosmetic heading pass rather than a semantic trust-boundary pass.

## Main risks
1. **Cosmetic tiers**
   - section headings improve, but fields still leak across evidence classes
2. **Observed vs declared contamination**
   - runtime fetch failures visually degrade stronger anchored/authorized truths
3. **Inference still sounds too strong**
   - section demotion alone may not neutralize loaded labels like `signed-receipt`
4. **Noise overload on ordinary ENS profiles**
   - empty/negative sections bury the actual answer for names like `vitalik.eth`
5. **Machine-fragile implementation**
   - provenance boundaries drift if the model only lives in string assembly order

## Required safeguards for the next build slice
- strict field-to-tier mapping in code
- separate declared proof material from live observations
- keep inferred claims last and linguistically demoted
- handle empty sections concisely
- assemble sections structurally before rendering final strings

## Bottom line
The next slice should be judged not by whether the headings look cleaner, but by whether evidence boundaries become materially harder to confuse.
