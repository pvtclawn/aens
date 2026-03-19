# Plan — proof-scope wording hardening (2026-03-19 20:42 UTC)

## Purpose
Freeze one narrow next slice so the first live ÆNS proof cannot sound more machine-closed than it really is.

Recent work already fixed the structural model:
- preferred surface readiness is distinct from bootstrap proof readiness
- proof artifacts now capture publication state coherently
- human-controlled deployment dashboards are now treated as part of the service-trust surface

But the latest challenge surfaced the remaining risk clearly:
- the proof story can still sound too machine-verifiable unless it explicitly separates what is proven by machine-verifiable structure, what is only publicly observed at the alias, and what is still unresolved because a human control plane decides public truth

## Decision
### The next slice is: **proof-scope wording hardening**

The goal is not more deployment research.
The goal is to make the first live proof story explicitly layered and harder to misread.

## Exact problem to solve
A reader should not be able to look at the first live proof and walk away with this false summary:
- “the whole service stack is now machine-verifiable end to end”

The current honest state is narrower:
- some claims are machine-verifiable
- some claims are only public-state observations
- some claims are still blocked on unresolved dashboard/control-plane state

That layering needs to appear explicitly in the proof wording itself, not only in scattered research notes.

## Required proof-language layers
The next slice should make every first-live-proof narrative use these exact layers.

### 1) Machine-verifiable scope
This section should contain only claims that can be checked from machine-readable/onchain/repo-grounded evidence.

For the current ÆNS flow, that includes things like:
- ENS root/child record relationship
- `parent-authorized` capability state (once published)
- publication mode recorded in proof artifacts
- exact service URL recorded in proof artifacts
- commit-pinned bootstrap source reference

### 2) Observed public-alias state
This section should contain only claims about what the public alias currently serves at capture time.

For the current flow, that includes things like:
- preferred root returns `200`
- preferred child route returns `404`
- bootstrap fallback is reachable
- `preferred surface ready = no`
- `bootstrap proof ready = yes`

This layer should be described as a **time-scoped observation**, not a timeless truth about the URL forever.

### 3) Unresolved human control-plane state
This section should contain only claims about what still depends on a human-controlled deployment/dashboard action.

For the current flow, that includes:
- the preferred route is still blocked by unresolved Vercel control-plane state
- the exact dashboard-side cause is not proven from public evidence alone
- a later human promotion/redeploy could change the public truth without changing ENS records

## Chosen implementation shape
Keep the next slice small and mostly wording-focused.

### Step 1 — add a reusable proof-scope structure to the live-proof docs
Update the current live-session checklist/operator docs (and any current proof-note template surface) so they explicitly include:
- `Machine-verifiable scope`
- `Observed public-alias state`
- `Unresolved human control-plane state`

### Step 2 — freeze minimal canonical wording
Define the exact narrow phrases the first live proof should use for the current bootstrap-mode case.

Minimum required wording themes:
- bootstrap mode is real but temporary
- current preferred route is not publicly ready
- current bootstrap proof does not imply invocation/payment/runtime closure
- current preferred-route gap is a control-plane issue, not a fresh local route-generation bug

### Step 3 — keep the hard finish-line honest
Update the proof-language checklist so a future live proof note must explicitly say:
- what this proof **does** establish
- what it **does not yet** establish
- what remains unresolved due to the human control plane

## Explicit non-goals
Do **not** expand this slice into:
- more Vercel deployment forensics
- changing the verifier logic again
- redesigning bootstrap mode
- implementing new deployment automation
- solving long-term dashboard evidence capture

Those are separate problems.

## Acceptance criteria
The next slice passes only if all of these are true.

### A. Live-proof wording is visibly layered
The current operator/checklist/proof surfaces must explicitly separate:
1. machine-verifiable scope
2. observed public-alias state
3. unresolved human control-plane state

### B. Bootstrap wording stays narrow
The wording must explicitly prevent these overclaims:
- preferred route is live
- invocation is proven
- payment flow is proven
- runtime auth is proven
- deployment control plane is closed/resolved

### C. Preferred-route gap is named honestly
The wording must describe the preferred-route blocker as unresolved human control-plane state, not vague “deployment weirdness” or “basically fixed.”

### D. The proof remains time-scoped
Observed alias-state language must read as a snapshot at capture time, not as a permanent guarantee about the same URL forever.

### E. Repo health stays clean
- `bun test`
- `bunx tsc --noEmit`

## Next Task
### Build proof-scope wording hardening
Update the first-live-proof docs/checklists so the story explicitly separates:
1. machine-verifiable identity/capability claims
2. observed public-alias state
3. unresolved human control-plane state

and freeze the exact narrow wording for the current bootstrap-mode case.

## Why this is the right next move
The deployment boundary is already narrowed as far as public evidence can take it.
The remaining risk is narrative, not architectural:
- saying something true
- but in a way that still sounds stronger than the real closure level

This slice fixes that without reopening another speculative loop.
