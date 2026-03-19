# Eleventh AENS slice — fixture-backed positive capability demo (2026-03-19 04:47 UTC)

## Goal
Make AENS’s positive path visible from the CLI without requiring live ENS writes.

## Slice
Add a deterministic fixture-backed example path that renders a parent-authorized capability surface through the existing CLI/report stack.

## What this adds
- `src/examples.ts` with a deterministic `parent-authorized-capability` scenario
- CLI support for `--example <id>`
- tests for:
  - example registry/scenario
  - example CLI argument parsing
- existing report/auth pipeline reused for the demo path

## Why this matters
AENS already proved positive-path capability logic in tests, but the visible CLI/demo surface mostly showed ordinary ENS / negative-path cases.
This slice turns the happy path into something a user can actually run.

## Example command
```bash
bun run inspect --example parent-authorized-capability
```

## Success criterion
The CLI can now render a deterministic offline report that clearly shows:
- a child capability ENS name
- parent relationship
- `Capability authorization: parent-authorized`
- trust-tier report structure
- callable service surface present

## Scope boundary
This slice does **not** require:
- live ENS writes
- onchain publication
- deployment scripts
- new trust semantics

It is a deterministic demo path only.
