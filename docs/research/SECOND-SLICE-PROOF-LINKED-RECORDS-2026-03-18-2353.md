# Second AENS slice — proof-linked records (2026-03-18 23:53 UTC)

## Goal
Deepen AENS from name-based discovery into name-based trust interpretation.

## Slice
Given an ENS-resolved profile:
- fetch linked `proofsUrl` / `receiptsUrl` documents when present,
- validate that they are at least usable JSON objects/arrays,
- summarize their trust surface in human-readable form.

## Why this slice matters
The first slice proved ENS as the discovery entrypoint.
This slice makes the proof surface more meaningful by turning linked trust URLs into something a human can inspect and reason about.

## What this still avoids
- service invocation
- payments
- full receipt verification
- giant schema universe

## Success criterion
AENS can now say not only “this ENS name points to proof material,” but also “this proof material is reachable, structurally usable, and looks like this.”
