# First-slice verification — AENS ENS-profile discovery (2026-03-18 23:48 UTC)

## Purpose
Verify whether the first AENS slice is already strong enough to justify the repo direction, and choose the next smallest load-bearing slice.

## Current slice
The repo now has an initial flow that:
- accepts an ENS name,
- resolves core ENS data,
- extracts AENS-specific text records,
- normalizes them into a structured agent/discovery/proof profile,
- and renders a human-readable report.

## What this proves
### 1. ENS is already load-bearing
This is not just a wallet alias demo.
The name is the lookup surface for:
- identity,
- discovery links,
- proof links,
- runtime metadata.

If ENS were removed, the current product would lose its primary entrypoint.
That is the correct shape.

### 2. The repo already has a standalone thesis
The slice reads as:
- discover an agent/service by ENS name,
- inspect its identity/discovery/proof surface,
- decide whether it is interesting or trustworthy enough to continue with.

That stands on its own outside Clawttack.
Clawttack can later consume this as customer-zero.

### 3. The current slice is thin enough
The implementation is still small:
- resolver
- profile model
- report rendering
- CLI
- tests

That is good. It means the repo has not already bloated into an ENS everything-app.

## What is still missing
The current slice tells you **where** discovery/proof surfaces are.
It does not yet tell you much about **whether those proof surfaces are actually valid or useful**.

In other words:
- discovery is now real,
- trust is still mostly linked, not yet interpreted.

## Next-slice decision
### Option A — service invocation next
Tempting, but too early.
That would push the repo toward interaction before the trust/discovery surface is properly tightened.

### Option B — proof-linked records next
Best next move.
If the profile exposes:
- `proofsUrl`
- `receiptsUrl`
- related trust metadata

then AENS should be able to:
- fetch those linked surfaces,
- summarize them,
- and tell a human what trust material is actually present.

That directly strengthens the repo thesis without making the product too large.

## Chosen next slice
# **Proof-linked records**

### Smallest useful shape
Given an ENS name:
1. resolve AENS profile
2. fetch linked proof/receipt documents when present
3. validate basic structure
4. render a compact trust summary

### Why this is the right next step
- keeps ENS load-bearing
- deepens the trust surface without requiring onchain writes yet
- stays standalone
- creates a more convincing Clawttack customer-zero story later

## Explicit anti-goals for the next slice
- no service execution yet
- no payments yet
- no generalized indexer
- no giant schema universe

## Bottom line
The first slice **passes**.
AENS now has a real ENS-native discovery surface.

The next smallest meaningful slice is not more generic profile work and not invocation.
It is:

> **proof-linked records** — turn linked trust URLs into something the user can actually inspect and reason about.
