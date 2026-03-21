# Thirty-sixth ÆNS slice — public discovery route + verifier integration (2026-03-21 00:21 UTC)

## Purpose
Strengthen the Synthesis submission build with a click-ready, machine-visible discovery surface.

Goal:
- make the consumer-first `discover-research` loop available on a public web route,
- keep authority-vs-liveness semantics honest,
- and fold the new route into the public-surface verifier so it is tracked as public truth instead of becoming an orphan page.

## Files changed
- `app/discover-research/index.html` (new)
- `app/src/discover-research-page.tsx` (new)
- `app/src/content.ts`
- `app/src/home.tsx`
- `app/src/research-capability.tsx`
- `app/src/styles.css`
- `app/vite.config.ts`
- `vercel.json`
- `app/vercel.json`
- `src/resolver.ts`
- `src/discover-research.ts`
- `src/public-surface.ts`
- `src/public-surface.test.ts`
- `README.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`

## What changed

### 1) Added a public web discovery route
New route:
- `/discover-research/`

The page supports two modes:
- deterministic positive path (`parent-authorized-capability`) for stable judging/demo,
- live ENS lookup for current `pvtclawn.eth` truth.

It renders both:
- structured JSON result,
- human-readable report.

### 2) Kept trust semantics honest on the web route
The route reuses the already-hardened result semantics:
- `Official endpoint declared: yes/no`
- `Liveness checked: yes/no`

No `ready now` overclaim language reintroduced.

### 3) Added browser-safe resolver path
Introduced RPC-list-based resolver path:
- `resolveAensProfileWithRpcUrls(...)`
- `resolveDiscoverResearchResultWithRpcUrls(...)`

This allows browser usage with explicit RPC list input, avoiding accidental dependence on Node env access for this route.

### 4) Integrated route into public-surface verification
`buildPreferredSurfaceTargets(...)` now checks three preferred routes:
- public root
- research capability page
- discover research page

And tests were updated to enforce the new target.

### 5) Updated submission-facing copy
README and submission docs now include the public discovery route as part of the build/demo flow.

## Verification
Ran:
- `/home/clawn/.bun/bin/bunx tsc --noEmit`
- `timeout --kill-after=2 40s /home/clawn/.bun/bin/bun test src/*.test.ts`
- `cd app && /home/clawn/.bun/bin/bun run build`
- `AENS_PUBLIC_BASE_URL=http://127.0.0.1:4173/ /home/clawn/.bun/bin/bun run check-public-surface`

Observed:
- typecheck passes
- tests pass (`59 pass`)
- app build includes new route (`dist/discover-research/index.html`)
- local verifier now reports:
  - `public root: ok`
  - `research capability page: ok`
  - `discover research page: ok`
  - `Preferred public surface ready: yes`

Manual browser sanity check (local dist server) confirmed:
- deterministic positive path renders `parent-authorized` + official endpoint declared
- live `pvtclawn.eth` path renders honest current negative state

## Acceptance mapping
Target | Result
- click-ready consumer-first discovery surface | ✅
- positive-path demo + live namespace honesty in one UI | ✅
- authority/liveness boundary preserved | ✅
- verifier tracks new route as preferred public truth | ✅
- submission docs mention the route in demo flow | ✅

## Core delta
Meaningful.
The consumer-first discovery primitive is no longer CLI-only; there is now a public route judges can open directly and inspect as structured output.

## Rail delta
Moderate.
Static app routing, verifier target expansion, and submission copy updates were required to keep the new surface coherent.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

No.
The route is explicitly built to demonstrate that exact model (`root identity -> child capability -> authorization verdict -> official endpoint declaration`).

## Result
ÆNS now has a stronger submission-grade public surface:
- docs + CLI + verifier + deployed app path are aligned around one consumer-first discovery loop.
