# Eighth AENS slice — explicit observed-state view (2026-03-19 03:43 UTC)

## Goal
Make the observed proof section speak in explicit operational states rather than raw transport bundles.

## Slice
Derive an explicit observed proof fetch view before rendering, with direct mapping rules for:
- `not-declared`
- `not-attempted`
- `fetch-failed`
- `content-invalid`
- `content-parsed`

Then render the observed section from that view using state-first lines with concise supporting detail.

## What this adds
- explicit observed proof fetch state model in `src/proof-evidence.ts`
- direct state-derivation rules
- state-first observed rendering in `src/report.ts`
- derivation tests for undeclared, unattempted, failed, invalid, and parsed cases

## Why this matters
This replaces the old implementation-shaped output:
- `reachable=yes/no, valid JSON=yes/no, http status=...`

with a more honest operational explanation:
- `not-declared`
- `not-attempted`
- `fetch-failed (http 503)`
- `content-invalid (http 200, invalid JSON)`
- `content-parsed (http 200)`

## Scope boundary
This slice does **not** yet fully solve:
- extra observed-state variants beyond the minimal set
- more refined invalid-content reason taxonomy
- declared/inferred wording polish outside the observed section

## Success criterion
Observed proof fetches are now modeled and tested as explicit operational states, and the live CLI/report path stays green.
