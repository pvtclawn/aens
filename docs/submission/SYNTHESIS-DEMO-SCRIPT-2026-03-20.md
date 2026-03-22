# Synthesis demo script — ÆNS (2 minutes)

## Goal
Show the real product clearly:
- root explorer
- write records
- explicit wallet boundary

## Pre-demo gate
Before recording or final judging, run the public-surface check.
If legacy routes still respond publicly, do **not** say they are gone — just keep the demo on the two real surfaces.

## 2-minute script

### 0:00–0:20 — Open with the user question
"If I’m looking at an ENS identity, what records are there now, and how do I write the missing `aens.*` ones cleanly?"

### 0:20–0:40 — State the thesis plainly
"ÆNS is intentionally narrow now: one page to inspect a root ENS identity, one page to write the records that make the naming scheme useful. No fake extra surfaces in the pitch."

### 0:40–1:05 — Show the root explorer
Open:
- `https://aens-nine.vercel.app/`

Narrate:
"This page resolves the root ENS name and shows the current `aens.parent`, `aens.service`, and `aens.capabilities` state directly from chain-backed reads."

### 1:05–1:35 — Show the write flow
Open:
- `https://aens-nine.vercel.app/write-records/`

Narrate:
"This is the action surface. It prepares the exact text-record writes for `aens.capabilities`, `aens.parent`, and `aens.service`, and it keeps the wallet approval as the explicit human boundary."

### 1:35–1:50 — Show the planned writes
Point directly to:
- root ENS field
- capability ENS field
- service URL field
- planned writes JSON block

Say:
"The point is clarity: you can see exactly what will be written before anything is signed."

### 1:50–2:00 — Close on the product truth
Say:
"That’s ÆNS now: inspect the root, prepare the write, and keep the wallet boundary honest. The submission is about those two useful surfaces, not old route clutter."

## Do not overclaim
Avoid saying this demo proves:
- automatic wallet execution
- runtime auth
- payments
- full production hardening
- public route removal unless you verified it live first

## Good final one-liner
"ÆNS is the minimal ENS utility for reading root identity state and writing the `aens.*` records that matter."
