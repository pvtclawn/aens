# Sixth AENS slice — semantic trust-tier section model (2026-03-19 02:38 UTC)

## Goal
Make the trust-tier report structure semantic in code rather than cosmetic in formatting.

## Slice
Replace the flat report line assembly with an explicit section model and map current report fields into ordered trust sections.

## What this adds
- structured report sections for:
  - identity anchor
  - capability authority
  - linked proof material
  - live observations
  - inferred claims / caveats
- tier + source headings rendered in trust-question order
- tests that assert section membership, not just raw substring presence

## Why this matters
This is the smallest slice that makes evidence boundaries real in code.
Without it, the trust-tier report could still drift into cosmetic epistemology.

## Scope boundary
This slice does **not** yet fully solve:
- declared vs observed proof-surface cleanup
- inferred-language demotion
- concise empty-state tuning

Those remain next-layer refinements.

## Success criterion
AENS now builds sections structurally first, then renders them, and both ordinary ENS profiles and capability-authorized cases preserve the intended trust-tier boundaries.
