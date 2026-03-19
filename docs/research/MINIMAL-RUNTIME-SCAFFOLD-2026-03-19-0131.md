# Minimal AENS runtime scaffold (2026-03-19 01:31 UTC)

## Goal
Turn `aens/` from a loose source directory into a minimally runnable standalone TypeScript/Bun repo.

## What this slice adds
- initializes a real git repo in `aens/`
- adds `package.json`
- adds `tsconfig.json`
- adds `.gitignore`
- defines a stable `inspect` script
- installs explicit dependencies for the current code path
- produces a lockfile
- adds multi-RPC fallback + request timeout for ENS resolution so a single flaky public RPC does not hang or fail the CLI path

## Why this slice matters
The previous AENS slices proved useful product direction, but the repo was still operationally fragile:
- no repo-local dependency manifest
- no typecheck surface
- no named runtime entrypoint
- no lockfile
- no git history in the repo itself

That made the CLI/runtime path unreliable and undermined the standalone thesis.

## Success criteria
This slice passes if all of the following work:
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect vitalik.eth --with-links`

## Non-goals
- no new trust-surface features
- no invocation flow
- no onchain action
- no schema expansion beyond current code requirements

## Standalone thesis impact
This is not cosmetic repo hygiene.
AENS cannot honestly claim to be a standalone ENS-native developer tool until a fresh clone can install dependencies, run tests, typecheck, and execute the inspection CLI predictably.
