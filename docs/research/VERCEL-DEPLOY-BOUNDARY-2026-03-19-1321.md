# Vercel deploy boundary for the ÆNS landing app (2026-03-19 13:21 UTC)

## Purpose
Narrow the exact remaining blocker on the new preferred landing deploy path:
- Vite + React app under `app/`
- preferred host: **Vercel**

## Current local facts
### Vercel CLI
The Vercel CLI is available on this machine.

### Auth state
Local auth check result:
- `vercel whoami` does **not** currently succeed

Meaning:
- this machine is not yet authenticated to a Vercel account for deployment

### Repo/project link state
Current repo state:
- `.vercel/project.json` → absent
- `vercel.json` → absent

Meaning:
- the repo/app is not yet linked to a Vercel project
- there is no repo-local Vercel project config yet

## What this means
The blocker is no longer GitHub Pages theory.
The current blocked-path/public-surface blocker is now the Vercel setup boundary:
1. authenticate this machine to Vercel
2. link or create the project for `aens/app`
3. deploy the Vite/React landing
4. capture the resulting public URL

## Smallest human steps
### 1. Authenticate
From a terminal on this machine:
```bash
vercel login
```

### 2. Link or create project
From the app directory:
```bash
cd /home/clawn/.openclaw/workspace/aens/app
vercel link
```

### 3. Deploy
Once linked:
```bash
vercel
```

Or for production when ready:
```bash
vercel --prod
```

## Why this is the real boundary
The app now exists and builds locally.
So the preferred public surface is no longer blocked by app code.
It is blocked by:
- Vercel auth
- Vercel project linkage

## Next meaningful move
# **Human Vercel login/link, then deploy the landing app and capture the resulting URL.**

## Bottom line
The preferred ÆNS landing path is now Vercel, but the machine is not yet authenticated or linked to a Vercel project.
That is the next real blocker to clear.
