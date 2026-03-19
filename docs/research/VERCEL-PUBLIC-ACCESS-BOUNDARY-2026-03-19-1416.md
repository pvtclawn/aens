# Vercel public-access boundary for the ÆNS landing (2026-03-19 14:16 UTC)

## Purpose
Narrow the exact public-access blocker on the newly deployed Vercel landing.

## Current observed facts
### Deploy path
- local Vercel token works
- `aens/app` is linked to a Vercel project
- first production deployment exists
- deployment ready state: `READY`

### Public access result
- deployed landing returns **HTTP 401** instead of a public `200`

### Project settings signal
The Vercel project metadata includes:
- `ssoProtection` present
- `passwordProtection` not present
- `protectionBypass` not present

## Most likely interpretation
This no longer looks like a generic hosting failure.
It looks like the Vercel project/deployment is protected by **Vercel authentication / SSO protection**, which makes the deployment exist and be healthy while still denying public anonymous access.

That fits the observed pattern well:
- deployment is `READY`
- public request gets `401`
- no password protection is configured
- an SSO/auth protection setting is present

## Why this matters
The blocker is no longer:
- app code
- Vercel auth/login
- project linking
- build/deploy success

It is now specifically:
- **public anonymous access to the Vercel landing**

Until that is removed or relaxed, the deployed URL cannot be used as the first live public `aens.service` target.

## Next meaningful move
The next fix should target the Vercel access setting directly:
- inspect Vercel project protection / authentication settings
- disable or relax the public-access blocker for this landing
- verify the URL returns a public `200`

## Bottom line
The ÆNS landing is deployed on Vercel, but the current live blocker is almost certainly **Vercel authentication/SSO protection**, not deployment failure.
