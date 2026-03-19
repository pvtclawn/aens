# First live ÆNS proof-scope template (2026-03-19 20:45 UTC)

## Purpose
Freeze the exact layered wording for the first live ÆNS proof so the story cannot sound more machine-closed than it really is.

This template is especially for the **current bootstrap-mode case**, where:
- the ENS authority path may become live
- the bootstrap fallback may be the only publicly ready capability surface
- the preferred Vercel child route is still blocked by unresolved human control-plane state

## Required top-level structure
Every first-live-proof note should use these sections in this order:

1. **Machine-verifiable scope**
2. **Observed public-alias state (time-scoped)**
3. **Unresolved human control-plane state**
4. **Not yet proven**

## Canonical bootstrap-mode wording

### 1) Machine-verifiable scope
Use wording like:

> This proof establishes one live ENS-backed ÆNS authority path.
> `research.pvtclawn.eth` is configured as a child capability of `pvtclawn.eth`, and the final report shows the child as `parent-authorized`.
> The proof artifacts also record the selected publication mode, exact service URL, repo commit hash, and commit-pinned bootstrap source reference.

Keep this section limited to things grounded by:
- ENS records
- CLI inspection output
- proof artifact fields
- commit-pinned references

Do **not** put deployment/dashboard interpretation here.

### 2) Observed public-alias state (time-scoped)
Use wording like:

> At capture time, the preferred public root was reachable, the preferred child route was not publicly ready, and the bootstrap fallback page was reachable.
> The verifier output at capture time was:
> - `preferred surface ready = no`
> - `bootstrap proof ready = yes`

Important:
- describe this as a **snapshot at capture time**
- do not imply the same URL will always serve the same artifact forever
- do not treat public observation as identical to machine-verifiable closure

### 3) Unresolved human control-plane state
Use wording like:

> The preferred route is still blocked by unresolved human-controlled deployment control-plane state.
> Public evidence shows the preferred alias is stale, but does not prove which exact dashboard-side setting or promotion step is wrong.
> So the preferred route is not yet part of the machine-closed proof path.

Important:
- name the remaining boundary as **human control-plane state**
- do not flatten it into vague phrases like `deployment weirdness` or `basically fixed`
- do not imply the preferred route is “effectively live” just because local code/build state is already correct

### 4) Not yet proven
Use wording like:

> This proof does **not** yet prove invocation, payment flow, runtime auth, or broad production readiness.
> It also does **not** prove that the preferred public child route is live.
> In the current bootstrap-mode case, it proves a narrow ENS-backed authority path plus a publicly reachable bootstrap capability surface.

This section should remain blunt.
The point is to make the current closure boundary easy to see.

## Compact canonical summary for the current bootstrap-mode case
If a short summary is needed, prefer something like:

> The first live ÆNS proof establishes a machine-verifiable ENS authority path for `research.pvtclawn.eth`, while the current public service surface remains a bootstrap-mode fallback observed live at capture time. The preferred child route is still blocked by unresolved human-controlled deployment state, so this proof is intentionally narrower than full invocation or production-readiness proof.

## Phrases to prefer
- `machine-verifiable identity/capability authority`
- `observed public-alias state at capture time`
- `unresolved human control-plane state`
- `bootstrap-mode fallback`
- `narrow first live proof`

## Phrases to avoid
- `fully live end to end`
- `machine-verifiable service stack`
- `preferred route is basically fixed`
- `deployment weirdness`
- `production-ready`
- `this proves the whole model`

## Acceptance rule
A first-live-proof note using bootstrap mode is acceptable only if a reader can clearly tell:
1. what was machine-verified
2. what was only observed publicly at capture time
3. what is still unresolved because a human control plane has not yet promoted the intended build
