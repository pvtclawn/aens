# Fourth AENS slice — parent-authorized capability surfaces (2026-03-19 01:54 UTC)

## Goal
Make ENS more than a discovery entrypoint by giving AENS an explicit authority model for capability surfaces.

## Slice
Add the smallest parent/child capability relation that lets AENS classify whether a queried capability surface is officially authorized by its parent ENS identity.

## What this adds
- parent capability declarations via `aens.capabilities`
- child capability declaration via `aens.parent`
- capability-authorization classification:
  - `parent-authorized`
  - `unlisted-child`
  - `identity-mismatch`
  - `not-a-capability-surface`
- CLI/report output for capability authority
- tests for all four states

## Why this matters
This is the smallest slice that upgrades AENS from:
- ENS profile aggregation

toward:
- ENS-authorized agent/capability discovery.

## Non-goals
- no invocation flow yet
- no payment logic yet
- no cryptographic proof corroboration yet
- no full trust-tier report remodel yet

## Success criterion
AENS can now say whether a capability surface is explicitly parent-authorized, merely a child-shaped surface, identity-mismatched, or not a capability surface at all.
