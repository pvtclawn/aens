# Challenge — capability bootstrap fallback risk (2026-03-19 20:02 UTC)

## Purpose
Red-team the remaining fallback decision under the new role-separation rule:

> if the preferred Vercel capability route remains `404`, can ÆNS still use a capability-scoped bootstrap fallback for the first live proof without degrading into fake public proof?

## Grounded state
Current externally verified state:
- preferred root landing: `200`
- preferred capability route: `404`
- blob/source fallback: reachable

Already decided:
- the generic root landing must **not** be used as a stand-in for `research.pvtclawn.eth`

So the remaining question is narrower:
- not root-vs-child collapse
- but whether a **capability-scoped bootstrap page** is honest enough for the first live proof

## Verdict
### Yes, but only under a stricter bootstrap rule.

A capability-scoped bootstrap fallback is better than repointing the child at the generic root landing.
But it still carries serious credibility risk if used sloppily.

The main failure mode is now:

> **fake-public-proof by overclaiming what a reachable stub actually demonstrates**

## Main risks

### 1. Source-browser masquerade risk
A reachable GitHub blob page is public and under operator control, but it still looks like source browsing rather than a first-class service surface.

**Why it matters:**
Judges/readers may read it as “they pointed the ENS record at a file” rather than “they published a controlled capability surface.”

**Required guardrail:**
If blob/source fallback is used, label it explicitly as a **bootstrap capability surface** and keep the first-proof claim narrow.

### 2. Mutable-main risk
A `blob/main/...` URL can drift as the repository evolves.
That weakens reproducibility unless the exact publication state is captured elsewhere.

**Why it matters:**
Later readers may not see exactly what the first live proof referenced.

**Required guardrail:**
Capture the exact publishing commit hash and URL in the proof artifact. Treat the proof as commit-scoped even if the public fallback URL is branch-based.

### 3. Generic-capability drift risk
A capability-scoped fallback can still fail if its content is too generic and mostly describes the parent project instead of the child capability.

**Why it matters:**
Then the URL is technically child-scoped, but semantically it still collapses back toward identity-only presentation.

**Required guardrail:**
Fallback content must clearly say:
- this is `research.pvtclawn.eth`
- what the capability currently proves
- what it explicitly does **not** prove
- that it is a bootstrap surface pending a stronger endpoint

### 4. Preferred-vs-bootstrap state confusion
The verifier currently reports the preferred Vercel route as not ready.
If publication proceeds on fallback without explicit state language, the project can accidentally talk as if the preferred surface is live when it is not.

**Why it matters:**
That creates contradictory operational truth:
- verification says `not ready`
- social/docs imply the public surface is finished

**Required guardrail:**
Distinguish two states explicitly:
- **preferred surface ready**
- **bootstrap fallback acceptable for first proof**

### 5. Upgrade-drift risk
The first live proof will probably need a later surface upgrade from bootstrap fallback to the preferred child route.

**Why it matters:**
If that transition is silent, the public story becomes muddy and the first proof becomes harder to audit.

**Required guardrail:**
Treat the later child-route switch as a deliberate second maintenance step with its own note/proof capture.

## Acceptance rule
A capability-scoped bootstrap fallback is acceptable for the first live proof only if all of these are true:

1. it is **child-capability scoped**, not the generic root landing
2. it returns `200`
3. it contains explicit capability-specific copy
4. it contains explicit bootstrap-only / proof-scope language
5. the publication artifact records the exact URL used
6. the publication artifact records the git commit hash of the referenced content
7. docs/reports do not describe this as preferred-route success or full invocation readiness

## Rejection rule
Do **not** publish with fallback if any of these are true:
- the fallback content reads like a generic project/about page
- the proof artifact does not capture the exact URL + commit hash
- the team is tempted to describe the fallback as equivalent to a real live capability route

## Bottom line
A capability-scoped fallback can still support the first live ÆNS proof.
But only as a **strictly framed bootstrap artifact**.

The mistake to avoid now is no longer role-collapse into the root landing.
The mistake to avoid is **dressing a temporary capability stub up as more proof than it really is**.
