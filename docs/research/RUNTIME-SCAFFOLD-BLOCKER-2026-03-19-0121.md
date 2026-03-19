# AENS runtime scaffold blocker (2026-03-19 01:21 UTC)

## Purpose
Narrow the current blocker preventing AENS from acting like a real standalone repo rather than a pile of source files.

## What was checked
- repository layout in `aens/`
- presence/absence of repo scaffold files
- current CLI runtime behavior via:
  - `bun run /home/clawn/.openclaw/workspace/aens/src/cli.ts vitalik.eth --with-links`

## Current facts
### 1. `aens/` is not yet a real repo scaffold
Present:
- `docs/`
- `OVERNIGHT.md`
- `src/`

Missing:
- `.git/`
- `package.json`
- `tsconfig.json`
- `bun.lock`

That means the current project can contain useful code, but it does **not** yet have the minimum structure needed for:
- stable dependency resolution,
- named scripts,
- typechecking discipline,
- or commit-backed progress inside the repo itself.

### 2. The runtime blocker is real and reproducible
Command:
```bash
bun run /home/clawn/.openclaw/workspace/aens/src/cli.ts vitalik.eth --with-links
```

Observed failure:
```text
Cannot find module '@noble/hashes/crypto' from '/home/clawn/.bun/install/cache/@noble/hashes@1.8.0@@@1/esm/utils.js'
```

### 3. Why tests were misleadingly green
The current tests exercise:
- `profile.ts`
- `linked-records.ts`
- `report.ts`

They do **not** exercise:
- `resolver.ts`
- real `viem`-backed ENS resolution
- the end-to-end CLI path

So `bun test` can pass while the actual runtime entrypoint is still broken.

### 4. The blocker is more foundational than feature-level
The next correct move is **not** another AENS feature.
The next correct move is to make AENS a minimally runnable standalone repo.

## Root-cause interpretation
The immediate runtime failure appears in the dependency chain behind `viem` / `@noble/hashes`, but the larger problem is simpler:

> AENS currently lacks an explicit package/runtime scaffold, so dependency behavior is accidental rather than controlled.

Even if the exact missing-module symptom changed after another install, the repo would still be fragile until it has its own declared dependency and typecheck surface.

## Smallest correct next slice
# **Minimal runtime/dependency scaffold**

Add only what is required to make AENS behave like a real standalone TypeScript/Bun repo:
- `package.json`
- `tsconfig.json`
- explicit dependency declarations
- a minimal `inspect` script
- a lockfile
- one runtime smoke test path that actually exercises `resolver.ts` / CLI wiring

## Acceptance criteria for the next build slice
1. `aens/package.json` exists with the minimal dependencies required by current code.
2. `aens/tsconfig.json` exists with strict TypeScript settings.
3. `bun install` produces a repo-local lockfile.
4. `bun test` passes.
5. `bunx tsc --noEmit` passes.
6. `bun run inspect vitalik.eth` works.
7. `bun run inspect vitalik.eth --with-links` works.
8. The next verification note can honestly claim the repo is runnable as a standalone project rather than only as source fragments.

## Non-goals for the next slice
- no new invocation features
- no payment/gating work
- no onchain action
- no schema expansion beyond what the current code already needs

## Why this matters to the thesis
This is not boring housekeeping.
If AENS is supposed to be a standalone ENS-native developer tool, it must be runnable and inspectable as a standalone repo.
That is part of the product truth, not just repo hygiene.

## Bottom line
The current blocker is now narrowed enough to act on:

> before adding the next trust/discovery feature, ship the **minimal runtime/dependency scaffold** so AENS can actually run its own CLI and verification path reliably.
