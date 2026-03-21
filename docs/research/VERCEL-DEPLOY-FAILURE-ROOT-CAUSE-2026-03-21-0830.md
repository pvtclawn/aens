# Vercel Deploy Failure Root Cause — 2026-03-21 08:30 UTC

## Context
`/discover-research/` remained `404` despite fresh commits and an explicit empty trigger commit (`9ec0b32`).

## Verification steps
1. Confirmed repo health in `aens/`:
   - `git status -sb` clean
   - `bunx tsc --noEmit` passes
   - `bun test src/*.test.ts` passes (`61 pass`)
2. Confirmed live public state still failing discovery route:
   - `bun run check-public-surface` => `discover research page: http 404`
3. Authenticated Vercel CLI and inspected latest production deployment:
   - Deployment URL: `https://aens-1gey1xikz-privateclawns-projects.vercel.app`
   - Deployment ID: `dpl_9nkh54NHVhnjWBe61sM2SR2vfFSm`
   - Commit: `9ec0b32`
   - Status: `Error`
4. Pulled build logs with `vercel inspect <deploy-url> --logs`.

## Root cause (from build logs)
Build fails during Vite build due to unresolved root dependency from app-only install context:

- Build installs in app only: `cd app && bun install`
- Build command: `cd app && bun run build`
- Error:
  - `[vite]: Rollup failed to resolve import "viem" from "/vercel/path0/src/resolver.ts"`

This means the app build path resolves/imports code from repo-root `src/`, but dependency `viem` is declared in root `package.json` and is not available in the `app/` install context used by Vercel.

## Boundary update
The blocker is no longer generic deploy lag. It is a reproducible deployment configuration/dependency-resolution mismatch.

## Practical next move
Ship one small build-surface fix so Vercel build context and dependency graph are aligned (either install/build from repo root with app output wiring, or isolate app imports from root `src/` dependencies).
