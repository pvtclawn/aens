# Plan — pivot the ÆNS public surface to Vite/React (2026-03-19 12:57 UTC)

## Purpose
Freeze the product pivot from ad hoc static stub pages to a proper Vite/React landing surface for the first live ÆNS capability.

## Trigger
Egor explicitly clarified the desired shape:
- **"just a vite app... vite/react"**

This changes the blocked-path/public-surface direction.

## What changes
### Old blocked-path direction
- static `site/` pages
- GitHub Pages as a simple stub host
- enough for an honest public stub, but still structurally throwaway

### New blocked-path direction
# **Use a Vite + React app as the canonical landing/service surface**

Meaning:
- `research.pvtclawn.eth` should point to a proper app surface, not improvised static HTML
- the first version can still be minimal, but it should already live inside the structure we actually want to keep growing

## Why this is better
### 1. It matches the real product trajectory
The agent likely needs a real landing surface anyway.
Starting with Vite/React avoids building a disposable stub that we immediately outgrow.

### 2. It reduces waste
The current static Pages work was useful for clarifying the service-surface problem, but it is not the ideal long-term shape.
A minimal Vite/React app can absorb the same content and then evolve into:
- richer landing page
- publisher-assist surface
- capability UI
- later interactive product features

### 3. It clarifies the line between bootstrap and product
The first live proof still needs a minimal honest service surface.
But that surface can live inside the real app shell instead of a dead-end static page.

## Immediate effect on the current blocker
This pivot does **not** magically remove the current Pages/public-hosting boundary.
The public service surface still needs a deploy target.

But it **does** change what we should build next on the blocked path:
- not more static Pages polishing
- instead: scaffold the Vite/React landing app

## Hard rule after this pivot
### If the immediate live proof must ship before the app is ready
Allow the temporary bootstrap fallback rule to remain:
- Pages preferred if it becomes live
- blob fallback allowed if Pages remains blocked and the first live proof must proceed

### But for active blocked-path build work
Do **not** invest more in the static `site/` path.
Invest in the Vite/React app path instead.

## Smallest useful next slice
# **Scaffold a minimal Vite + React app for the ÆNS landing surface**

### Minimum useful contents
- project shell
- landing page for ÆNS / PrivateClawn
- research capability route/page
- honest scope language
- links to repo / proof / identity surfaces

### Non-goals for the first app slice
- auth
- dashboard
- invocation UI
- payment flow
- runtime controls

## Relationship to the live proof path
The first live ENS publication path remains:
- root identity
- child capability
- parent authorization

This plan only changes the preferred **service-surface implementation**.
It does not invalidate the authority model or the runbook.

## Bottom line
The blocked-path/public-surface direction is now:

> **Vite/React app first, not more ad hoc static stub work.**

The first live proof can still use a temporary fallback if necessary, but the next real build slice should start the app surface we actually want to keep.
