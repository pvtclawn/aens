# Seventh AENS slice — separate proof evidence views (2026-03-19 03:12 UTC)

## Goal
Make the proof-boundary split a model boundary rather than a formatting trick.

## Slice
Derive explicit proof evidence views in the report layer for:
- declared proof material
- observed proof fetch state
- inferred proof interpretation

Then render the proof-related sections from those views instead of rendering directly from one mixed `LinkedRecordSummary`-style shape.

## What this adds
- `src/proof-evidence.ts`
- explicit report-layer proof views
- report rendering that consumes those views
- tests that assert direct proof-boundary membership

## Why this matters
This removes the remaining semantics leak where interpretive summary text could still appear in the declared proof section even after the trust-tier model existed.

## Scope boundary
This slice does **not** yet fully solve:
- richer observed-state vocabulary
- concise declared-output tuning
- inferred-language demotion

Those remain follow-up refinements.

## Success criterion
A synthetic linked-proof case now proves:
- declared proof section contains only proof presence + URLs + concise declaration note
- observed section contains only fetch/runtime state
- inferred section contains parsed interpretation such as summary text, shapes, proof strength, counts, and field deductions
