# One-Hundred-Eighty-Third Slice Challenge — Two-Surface Reset Verification Path (2026-03-22 20:09 UTC)

## Context
ÆNS is now locally framed as a two-surface product:
- **ENS Root Explorer**
- **Write Records**

But the current live deploy still serves legacy routes that the reset intended to retire.
Fresh live probe at this challenge pass:

- `/` → `200`, title `ÆNS — ENS root explorer`
- `/write-records/` → `200`, title `Write ENS capability records — ÆNS`
- `/research` → `200`, title `Research endpoint — ÆNS`
- `/research/` → `200`, final URL `/research`, title `Research endpoint — ÆNS`
- `/research-capability` → `200`, final URL `/research`, title `Research endpoint — ÆNS`
- `/discover-research` → `200`, title `Discover the official research capability for an ENS identity — ÆNS`

So the kept surfaces are healthy, but the removed surfaces are still publicly alive.

## Main critique
The current verification path is still too optimistic for a **product simplification**.
It is good at proving the surviving surfaces exist.
It is not yet strong enough to prove the removed surfaces are actually gone.

That asymmetry makes disappearance claims unusually easy to overstate.

---

## Weaknesses

### 1) Positive-surface checks can pass while public product shape is still wrong
`bun run check-public-surface` currently proves that `/` and `/write-records/` are good. That is useful, but incomplete after a reset that is defined by **removal**.

A simplification is not verified merely because the kept routes work.
It is verified only when the routes meant to disappear stop behaving like product surfaces.

**Failure mode:** the checker returns green enough to feel like public cleanup, while legacy routes still return `200` and preserve the old product story.

---

### 2) Redirect success and retirement success are being conflated
`/research-capability` resolving to `/research` is not evidence that the research surface is retired. It is evidence that one legacy alias now lands on another still-live legacy surface.

**Failure mode:** route normalization or alias cleanup can look like removal, even though the public product fiction remains intact.

---

### 3) The verification contract does not distinguish route classes strongly enough
For removed routes, these outcomes are meaningfully different:
- hard gone (`404`/`410`)
- redirected to an approved kept surface
- blocked from product interpretation
- still live as legacy product page

Right now the live discussion can collapse these into a fuzzier binary: “not the main route anymore” vs “still there.”

**Failure mode:** one weak form of cleanup gets over-read as full disappearance.

---

### 4) Deploy identity can drift away from repo truth without a hard claim gate
Local repo/docs now encode a two-surface model, but public alias state still exposes the old routes. If submission or status docs are written from repo truth first and deploy truth second, the public claim boundary becomes fragile.

**Failure mode:** local docs silently normalize a future state that the live alias has not yet earned.

---

### 5) Negative verification is missing from the canonical proof loop
The current checker is oriented around preferred readiness, not public decontamination.
That means the critical question after a simplification is still being answered manually:

> “Do the removed routes still behave like product surfaces?”

**Failure mode:** the most important post-reset proof remains ad hoc, so it is easy to skip once the kept surfaces are green.

---

### 6) Legacy routes can preserve stale judge/user understanding even if the homepage is fixed
A judge can land directly on `/discover-research` or `/research` from old links, bookmarks, docs, or indexing. If those still render coherent product pages, then the public product is not really simplified yet.

**Failure mode:** homepage truth and deep-link truth diverge, and the cleaner homepage produces false confidence.

---

## Hardened rule
After any product simplification that removes surfaces, public verification must include **both**:
1. **survivor proof** — intended kept routes work
2. **tombstone proof** — intended removed routes no longer behave like live product surfaces

A reset is not publicly complete without both halves.

---

## Required mitigations

### Mitigation A — Add a negative-route matrix to the proof contract
Create an explicit removed-route check that probes at least:
- `/research`
- `/research/`
- `/research-capability`
- `/discover-research`

And records for each:
- status code
- final URL after redirects
- title / marker summary
- outcome class: `gone | redirected-to-kept-surface | blocked | still-live-legacy-surface`

---

### Mitigation B — Forbid disappearance language unless the negative-route matrix passes
Unsafe phrases until then:
- “legacy routes are gone”
- “public deployment only exposes two surfaces”
- “research/discovery routes are retired publicly”

Safe phrasing until then:
- “two-surface reset is implemented locally”
- “kept surfaces are live”
- “legacy routes are still publicly reachable”

---

### Mitigation C — Treat redirects to legacy pages as failure, not progress
For removed routes, redirecting into another removed route must fail the simplification check.
Only these should count as acceptable outcomes:
- hard absence, or
- redirect to an explicitly approved kept surface

---

### Mitigation D — Make deploy-proof and repo-proof separate first-class states
Status docs and submission docs should keep distinct fields for:
- local repo truth
- live alias truth
- claim-safe public truth

That prevents “ahead of deploy” from quietly becoming “already public.”

---

### Mitigation E — Keep the checker honest about what it does *not* prove
`check-public-surface` can stay a survivor-readiness tool, but its output should not be interpreted as proof that removed routes are gone.
Either extend it, or pair it with a dedicated tombstone check.

---

## Bottom line
The two-surface reset is real in local product intent.
But the current verification path is still vulnerable to a subtle overclaim:

> proving the surviving surfaces are healthy while failing to prove that the removed surfaces actually disappeared.

Until the removed-route matrix passes, the honest public state is still **split truth**, not completed simplification.
