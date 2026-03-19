# Thirteenth AENS slice — README / demo-surface cleanup (2026-03-19 10:20 UTC)

## Goal
Make AENS self-explanatory from the repo surface now that the CLI/example coverage is strong enough to support a concise standalone entrypoint.

## Slice
Add a top-level `README.md` that explains:
- what AENS is today
- what ENS records it reads
- which commands to run first
- how to interpret the capability-authority states
- what is implemented now vs not yet

## What this adds
- root `README.md`
- quickstart commands for:
  - `bun run inspect vitalik.eth`
  - `bun run inspect --example parent-authorized-capability`
  - `bun run inspect --example unlisted-child-capability`
  - `bun run inspect --example identity-mismatch-capability`
- plain-language explanations for:
  - `parent-authorized`
  - `unlisted-child`
  - `identity-mismatch`
  - `not-a-capability-surface`
- explicit product-boundary section so the repo does not overclaim unfinished protocol surfaces

## Why this matters
The authority model is now visible enough from the CLI.
The remaining gap was that the repo itself still did not tell a new reader what the project currently is.

This slice fixes that without adding a second input mode or pretending unfinished features already exist.

## Checks run
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect --example parent-authorized-capability`
- `bun run inspect --example unlisted-child-capability`
- `bun run inspect --example identity-mismatch-capability`

## Success criterion
A new reader can now land on the repo, understand the current product truth quickly, and run the first useful commands without reading source or chat history.

## Scope boundary
This slice does **not** add:
- a second input mode
- live ENS publication
- invocation/payment flow
- new trust semantics
- UI work beyond the repo surface
