# Vercel deploy result for the ÆNS landing (2026-03-19 14:13 UTC)

## Purpose
Record the first real Vercel deployment result for the preferred ÆNS landing surface.

## Deploy result
- project host: `aens-btwlqtp15-privateclawns-projects.vercel.app`
- production URL: `https://aens-btwlqtp15-privateclawns-projects.vercel.app`
- Vercel ready state: `READY`
- current public HTTP result: `401`

## What this means
The deploy path itself now works:
- local Vercel token worked
- app directory linked to a Vercel project
- production deployment exists and is marked `READY`

But the landing is still **not publicly usable** as-is because the current public response is `401` rather than a normal public `200` with the landing content.

## Current interpretation
The blocker has moved from:
- GitHub Pages / Vercel auth setup

to:
- **public access / protection settings on the Vercel deployment or project**

## Next meaningful move
Inspect and fix the Vercel public-access boundary so the landing URL becomes publicly reachable without auth/protection.

Only after that should the URL be treated as the preferred `aens.service` target for the first live ÆNS proof.
