# Challenge — Vercel single-target control-plane risk (2026-03-20 16:15 UTC)

## Purpose
Red-team the current post-cleanup deployment story after removing GitHub Pages from the repo and pinning Vercel config in-repo.

## Current truth
Verified at challenge time:
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes
- preferred public root: `ok`
- preferred `research-capability` route: `404`
- bootstrap GitHub blob fallback: `ok`

So the repo-side cleanup is real, but preferred public truth is still unresolved.

## Weakness 1 — root success is currently over-permissive
The live root can pass the current verifier while still serving the wrong artifact family.

Observed mismatch:
- the root page is reachable and contains the expected title marker
- the live HTML still points at legacy `/aens/assets/...`
- the capability route still 404s

Risk:
- the root `ok` verdict overstates how close the preferred surface really is
- the public-truth split becomes cleaner in tooling than it is on the wire

Mitigation:
- make root success require current intended artifact shape, not just title presence
- reject the legacy `/aens/assets/` path family explicitly
- or embed a simple build marker so the root can prove which generation it serves

## Weakness 2 — dual `vercel.json` files are a defensive hedge, not a closure proof
Adding both `vercel.json` and `app/vercel.json` improves repo-side robustness against uncertain Vercel root selection.
But it still does not prove which root the live project is actually using.

Risk:
- future reasoning can still smuggle in dashboard assumptions as if the repo settled them
- the project may remain operationally ambiguous even while the code looks explicit

Mitigation:
- once access exists, capture one control-plane receipt that records effective root, output directory, build command, production branch, and deployment ID/URL
- after that, collapse to one canonical Vercel config path instead of keeping long-lived root ambiguity

## Weakness 3 — the remaining bootstrap fallback weakens the claimed single-target simplification
GitHub Pages is now removed from the repo path, but the proof system still accepts the GitHub blob stub as a bootstrap-ready public surface.

Risk:
- “Vercel single deploy target” can read stronger than reality
- support rails can keep drifting while the narrative sounds cleaner than the actual reachable surface set

Mitigation:
- keep the fallback explicitly labeled as non-preferred and non-Vercel
- once the preferred route is live, demote the blob fallback from active proof mode to archive/bootstrap history
- until then, avoid wording that implies full Vercel-only public closure

## Weakness 4 — no deployment transition receipt yet
The repo push is causal evidence for source truth, but not enough for public truth.
Right now a correct push has not changed the alias.

Risk:
- when the route eventually changes, the control-plane transition may be hand-waved instead of evidenced
- public-truth change remains less auditable than the authority model deserves

Mitigation:
- require a three-part transition receipt when the Vercel fix happens:
  1. before-state alias snapshot
  2. deployment/control-plane evidence
  3. after-state alias snapshot

## Core delta
None.
This challenge does not change the parent identity / child capability / authorization model.

## Rail delta
High.
It concerns supporting deployment/public-truth machinery only.

## Counterfactual relevance test
Would this challenge still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting work, not protocol-center progress.

## Bottom line
The Pages cleanup was correct.
The remaining risk is now **false clarity from deployment/control-plane ambiguity**, not local app code.

## Best adjacent move if still blocked
If dashboard/CLI access is still unavailable, the most honest adjacent slice is to harden `bun run check-public-surface` so it can distinguish:
- reachable root
- current intended root artifact
- legacy/stale root artifact

That would improve public-truth honesty without pretending the control-plane problem is solved.
