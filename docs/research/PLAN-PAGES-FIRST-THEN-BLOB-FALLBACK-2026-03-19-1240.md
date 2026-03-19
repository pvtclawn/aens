# Plan — Pages first, then blob fallback if still blocked (2026-03-19 12:40 UTC)

## Purpose
Turn the Pages-vs-fallback critique into an explicit execution rule so the first live ÆNS proof does not remain blocked by indecision around the service URL.

## Current situation
Right now:
- the preferred public stub surface is the cleaner Pages URL:
  - `https://pvtclawn.github.io/aens/research-capability/`
- the Pages URLs still 404
- the GitHub blob stub is reachable
- the one-shot verifier exists:
  - `bun run check-public-surface`

That means the project needs a hard rule for what happens **after** the one Pages admin attempt.

## Hard rule
### Step 1 — try the smallest Pages unblock action first
Human-admin action:
- open `https://github.com/pvtclawn/aens/settings/pages`
- under **Build and deployment**
- set **Source = GitHub Actions**
- or toggle/re-save if already set

### Step 2 — rerun the verifier immediately
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run check-public-surface
```

## Branch outcome
### Branch A — Pages becomes live
If the verifier succeeds:
- keep `https://pvtclawn.github.io/aens/research-capability/` as the planned `aens.service` target
- proceed with the first live ÆNS publish using the Pages URL
- do not fall back to the blob URL

### Branch B — Pages still does not become live
If the verifier still reports:
- Pages root 404 and/or
- research-capability page 404

then do **not** let the first live authority proof remain blocked indefinitely.

Allow a temporary bootstrap fallback to the reachable GitHub blob stub URL:
- `https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

## Why this is the right rule
### What matters most for the first live proof
The first live ÆNS proof needs to establish:
- root identity
- child capability
- parent authorization
- public inspectability

A cleaner service URL is useful, but it is not the core thesis.
So polish should not hold the core proof hostage forever.

### Why the blob fallback is acceptable
The blob URL is:
- real
- reachable
- honest
- under project control

That makes it acceptable as a **temporary bootstrap stub** if the cleaner Pages route remains blocked by repo-admin settings.

## Guardrails for fallback use
If the blob fallback is used:
1. it must be explicitly labeled as **bootstrap-only** in the proof artifact
2. the exact first-publish `aens.service` value must be recorded
3. later upgrade to the cleaner Pages route should be treated as a small follow-up maintenance step
4. do not silently replace the service URL without updating proof artifacts

## What this plan prevents
- endless delay waiting for a prettier URL
- silent fallback without explicit decision
- accidental overclaim that the Pages surface is already live
- local oscillation between two acceptable-but-different publication targets

## Acceptance criteria
1. There is exactly one preferred service target order:
   - Pages first
   - blob fallback only if Pages still fails after the one admin attempt
2. The verifier command is the gate.
3. The fallback is explicitly temporary and documented.
4. The first live authority proof is not delayed indefinitely by service-surface polish.

## Next task
# **Do the one GitHub Pages admin step, rerun `bun run check-public-surface`, and then commit to either Pages or bootstrap blob fallback with no further oscillation.**

## Bottom line
Preferred target remains the cleaner Pages URL.
But if that one-step admin fix still does not make it live, the first live ÆNS proof should proceed with the reachable blob stub rather than waiting indefinitely.
