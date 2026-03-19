# First AENS slice — ENS profile + discovery/proof surface (2026-03-18 23:43 UTC)

## Goal
Ship the smallest end-to-end slice where ENS is clearly load-bearing.

## Slice
Resolve an ENS name into an AENS profile/report that surfaces:
- agent identity
- discovery links
- proof/receipt links
- runtime metadata

## Why this slice first
- ENS is the entrypoint, not decoration
- standalone story is easy: discover an agent/service by ENS name
- Clawttack can use it later as customer-zero without becoming the thesis

## What this proves
AENS can make ENS names materially useful for autonomous agents by turning them into a structured discovery + trust surface instead of just a wallet alias.

## Non-goals
- onchain writes
- service invocation
- payments
- generalized registry logic
