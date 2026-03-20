# First live ÆNS proof-scope template (2026-03-19 20:45 UTC)

## Purpose
Freeze the exact layered wording for the first live ÆNS proof so the story cannot sound more machine-closed than it really is.

This template now supports **two honest capture-time branches**:
- `preferred-live`
- `bootstrap/regression`

Both branches are acceptable when chosen honestly from capture-time truth.
The point is not to make one branch look prettier.
The point is to keep the proof note aligned with what was actually true when the proof was captured.

## Branch selection (required)
Before writing section 1, choose exactly **one** branch for the note:

- `Proof branch: preferred-live`
- `Proof branch: bootstrap/regression`

### Branch-lock rule
Once a branch is chosen, keep all branch-sensitive wording aligned to it:
- section 2
- section 3
- section 4
- compact summary

Do **not** mix preferred-live wording in one section with bootstrap/regression wording in another.
No mixed-branch `frankenproofs`.

## When each branch is honest
### `preferred-live`
Use this only when capture-time verifier truth shows:
- the preferred child route is publicly reachable and ready
- `Preferred public surface ready: yes`

### `bootstrap/regression`
Use this when capture-time verifier truth shows:
- the preferred child route is not ready / regressed / blocked at capture time
- the bootstrap fallback is the honest currently reachable public proof surface

This branch is a **narrower honest proof mode**, not a shame branch.

## Required top-level structure
Every first-live-proof note should use these sections in this order:

1. **Machine-verifiable scope**
2. **Observed public-alias state (time-scoped)**
3. **Unresolved human control-plane state**
4. **Not yet proven**

## Section templates

### 1) Machine-verifiable scope
Use wording like:

> This proof establishes one live ENS-backed ÆNS authority path.
> `research.pvtclawn.eth` is configured as a child capability of `pvtclawn.eth`, and the final report shows the child as `parent-authorized`.
> The proof artifacts also record the selected publication mode, exact service URL, and repo commit hash.

#### If `Proof branch: bootstrap/regression`
Add bootstrap-specific wording like:

> The proof artifacts also record the commit-pinned bootstrap source reference used by this narrower public proof mode.

Keep this section limited to things grounded by:
- ENS records
- CLI inspection output
- proof artifact fields
- commit-pinned references (only when bootstrap/regression actually uses them)

Do **not** put deployment/dashboard interpretation here.

### 2) Observed public-alias state (time-scoped)
This section is always **observational**, not machine-closed proof.
Prefer echoing the exact capture-time verifier lines instead of freehand paraphrase alone.

#### If `Proof branch: preferred-live`
Use wording like:

> At capture time, the preferred public root and preferred child route were both publicly reachable.
> The verifier output at capture time was:
> - `preferred surface ready = yes`
> - `bootstrap proof ready = no`

#### If `Proof branch: bootstrap/regression`
Use wording like:

> At capture time, the preferred public root was reachable or partially reachable, the preferred child route was not publicly ready, and the bootstrap fallback page was reachable.
> The verifier output at capture time was:
> - `preferred surface ready = no`
> - `bootstrap proof ready = yes`

Important:
- describe this as a **snapshot at capture time**
- do not imply the same URL will always serve the same artifact forever
- do not treat public observation as identical to machine-verifiable closure

### 3) Unresolved human control-plane state
This section should no longer act like a blocker slot that is always filled.
Its content depends on the chosen branch and what was visible at capture time.

#### If `Proof branch: preferred-live`
Use wording like:

> No unresolved preferred-route blocker was visible at capture time; other non-proven areas remain in section 4.
> The preferred child route was publicly reachable when this proof was captured.
> That public reachability is still observational rather than machine-closed proof, but the earlier deployment/control-plane blocker was not visible at capture time.

#### If `Proof branch: bootstrap/regression`
Use wording like:

> The preferred route was still blocked by unresolved human-controlled deployment/control-plane state at capture time.
> Public evidence showed the preferred route was not ready, but did not prove which exact dashboard-side setting or promotion step was wrong.
> So the preferred route was not part of the machine-closed proof path for this capture.

Important:
- name the remaining boundary as **human control-plane state** when a blocker is actually present
- do not invent a blocker just because this section exists
- do not flatten the boundary into vague phrases like `deployment weirdness` or `basically fixed`
- do not widen this section into broader claims about invocation, payment flow, runtime auth, or production readiness

### 4) Not yet proven
This section should remain blunt in both branches.

#### If `Proof branch: preferred-live`
Use wording like:

> This proof does **not** yet prove invocation, payment flow, runtime auth, or broad production readiness.
> It also does **not** prove end-to-end machine closure of the preferred public child route just because that route was observed reachable at capture time.
> This remains a narrow ENS-backed authority proof plus capture-time public observation.

#### If `Proof branch: bootstrap/regression`
Use wording like:

> This proof does **not** yet prove invocation, payment flow, runtime auth, or broad production readiness.
> It also does **not** prove that the preferred public child route is live.
> In this bootstrap/regression case, it proves a narrow ENS-backed authority path plus a publicly reachable bootstrap capability surface.

## Compact summary rule
If a short summary is needed:
- write it **last**, after sections 1–4 are complete
- derive it from the already chosen branch
- do **not** let it overstate the detailed sections
- if there is any tension between the summary and sections 1–4, weaken the summary

### Compact summary — `preferred-live`
> The first live ÆNS proof establishes a machine-verifiable ENS authority path for `research.pvtclawn.eth`, while the preferred public child route was observed live at capture time. This remains narrower than invocation, payment, runtime-auth, or full end-to-end machine-closure proof.

### Compact summary — `bootstrap/regression`
> The first live ÆNS proof establishes a machine-verifiable ENS authority path for `research.pvtclawn.eth`, while the current public service surface remains a bootstrap-mode fallback observed live at capture time. The preferred child route was still blocked by unresolved human-controlled deployment state, so this proof is intentionally narrower than full invocation or production-readiness proof.

## Phrases to prefer
- `machine-verifiable identity/capability authority`
- `observed public-alias state at capture time`
- `time-scoped public observation`
- `unresolved human control-plane state`
- `narrow first live proof`
- `bootstrap-mode fallback` (only when bootstrap/regression is the chosen branch)

## Phrases to avoid
- `fully live end to end`
- `machine-verifiable service stack`
- `preferred route is basically fixed`
- `deployment weirdness`
- `production-ready`
- `this proves the whole model`

## Acceptance rule
A first-live-proof note is acceptable only if a reader can clearly tell:
1. what was machine-verified
2. what was only observed publicly at capture time
3. whether a preferred-route blocker was visible at capture time or not
4. what still is not proven

If the note blurs those boundaries, the note is too strong.
