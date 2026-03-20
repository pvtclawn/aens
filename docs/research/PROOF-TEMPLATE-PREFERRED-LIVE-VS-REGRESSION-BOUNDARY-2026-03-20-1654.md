# Proof template preferred-live vs regression boundary (2026-03-20 16:54 UTC)

## Purpose
Freeze the exact wording boundary the standalone first-live-proof template should adopt now that the preferred Vercel child route is live.

This is not a broad new research note.
It is a narrow doc-boundary clarification so the next build slice can patch the template cleanly without re-arguing the state model.

## Current truth at note time
- `Preferred public surface ready: yes`
- `Bootstrap proof ready: no`
- the standalone proof template is still written as if the `current bootstrap-mode case` were the universal default

So the template now lags behind the verified public truth and the already-patched runbooks.

## Core decision
The standalone template should keep the **same four top-level sections**:
1. `Machine-verifiable scope`
2. `Observed public-alias state (time-scoped)`
3. `Unresolved human control-plane state`
4. `Not yet proven`

But it should stop treating the bootstrap-blocked story as the universal default.
Instead, it should define **two explicit allowed branches**:
- **Preferred-live branch**
- **Bootstrap/regression branch**

## Branch rule
### Preferred-live branch
Use this when capture-time verifier truth shows:
- preferred child route reachable and ready
- `Preferred public surface ready: yes`

### Bootstrap/regression branch
Use this when capture-time verifier truth shows:
- preferred child route not ready / regressed / blocked
- bootstrap fallback is the honest currently reachable public proof surface

## Section-by-section wording boundary

### 1) Machine-verifiable scope
This section stays structurally the same across both branches:
- live ENS-backed authority path
- child is `parent-authorized`
- selected publication mode
- exact service URL
- repo commit hash

#### Preferred-live rule
Do **not** force bootstrap-specific material into this section.
If the session is preferred-mode, the section should not mention a `commit-pinned bootstrap source reference` as if it were universally present.

#### Bootstrap/regression rule
Include the commit-pinned bootstrap source reference when bootstrap mode is actually used.

### 2) Observed public-alias state (time-scoped)
This section must remain explicitly observational, not machine-closed proof.

#### Preferred-live wording boundary
The template should allow wording like:
> At capture time, the preferred public root and preferred child route were both publicly reachable.
> The verifier output at capture time was:
> - `preferred surface ready = yes`
> - `bootstrap proof ready = no`

Important:
- still call this a snapshot at capture time
- do not imply the URL will always remain live
- do not upgrade public observation into machine closure

#### Bootstrap/regression wording boundary
Keep the existing narrow bootstrap-style wording, but as a separate branch:
> At capture time, the preferred public root was reachable or partially reachable, the preferred child route was not publicly ready, and the bootstrap fallback page was reachable.
> The verifier output at capture time was:
> - `preferred surface ready = no`
> - `bootstrap proof ready = yes`

### 3) Unresolved human control-plane state
This is the section that must change most.
It should no longer act like a blocker slot that is always filled.

#### Preferred-live wording boundary
Allow wording like:
> No unresolved preferred-route control-plane blocker was visible at capture time.
> The preferred child route was publicly reachable when this proof was captured.
> That public reachability is still observational rather than machine-closed proof, but the earlier deployment/control-plane blocker was not visible at capture time.

Important:
- do not invent a blocker just because the section exists
- keep the distinction between public observation and machine closure
- do not widen this into broader claims about invocation/payment/runtime behavior

#### Bootstrap/regression wording boundary
Keep the earlier narrow blocker wording, but only here:
> The preferred route was still blocked by unresolved human-controlled deployment/control-plane state at capture time.
> Public evidence showed the preferred route was not ready, but did not prove which exact dashboard-side setting or promotion step was wrong.
> So the preferred route was not part of the machine-closed proof path for this capture.

### 4) Not yet proven
This section stays blunt in both branches.

#### Preferred-live rule
The template should say the proof still does **not** prove:
- invocation
- payment flow
- runtime auth
- broad production readiness
- end-to-end machine closure of the live public route just because it was observed reachable at capture time

#### Bootstrap/regression rule
Keep the current narrower bootstrap wording:
- no invocation/payment/runtime auth/broad production readiness
- preferred child route not proven live
- proof remains a narrow ENS-backed authority path plus reachable bootstrap capability surface

## Compact summary boundary
The template should no longer offer only one canonical bootstrap summary.
It should offer two compact summaries.

### Preferred-live compact summary
> The first live ÆNS proof establishes a machine-verifiable ENS authority path for `research.pvtclawn.eth`, while the preferred public child route was observed live at capture time. This remains narrower than invocation, payment, runtime-auth, or full end-to-end machine-closure proof.

### Bootstrap/regression compact summary
> The first live ÆNS proof establishes a machine-verifiable ENS authority path for `research.pvtclawn.eth`, while the current public service surface remains a bootstrap-mode fallback observed live at capture time. The preferred child route was still blocked by unresolved human-controlled deployment state, so this proof is intentionally narrower than full invocation or production-readiness proof.

## Acceptance rule for the patched template
The updated template is acceptable only if a reader can clearly tell:
1. what was machine-verified
2. what was only observed publicly at capture time
3. whether a preferred-route control-plane blocker remained visible at capture time or not
4. what still is not proven in either branch

## Bottom line
The next template patch should **not** change the proof model.
It should change the default story from:
- `bootstrap-blocked case as universal default`

to:
- `same four-section proof model, with preferred-live vs bootstrap/regression branching based on capture-time truth`
