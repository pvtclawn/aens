# Thirty-fifth ÆNS slice — Synthesis submission hardening + consumer-path demo tightening (2026-03-21 00:03 UTC)

## Purpose
Strengthen the actual hackathon submission surface without drifting into pitch-only fluff:
1. sharpen competitive positioning against current Synthesis ENS submissions,
2. produce a copy-paste submission form pack aligned with the Builder Guide,
3. harden the product/demo surface so the CLI no longer implies liveness when only authorization is proven.

## Files changed
- `src/discover-research.ts`
- `src/discover-research.test.ts`
- `README.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-SUBMISSION-BLURB-2026-03-20.md`
- `docs/submission/SYNTHESIS-COMPETITIVE-POSITIONING-2026-03-21.md` (new)
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md` (new)

## What changed
### 1) Tightened `discover-research` so it stops leaking liveness claims
The positive-path output previously printed:
- `Liveness checked: no`
- `Ready to use now: yes`

That was wording drift against the frozen authorization-vs-liveness boundary.

Now the command reports:
- `Official endpoint declared: yes/no`
- `Liveness checked: yes/no`

and uses `officialEndpointDeclared` as the explicit machine field/state.

### 2) Added deterministic example mode to `discover-research`
`discover-research` now supports:
- live mode: `bun run discover-research -- <parent-ens-name>`
- deterministic demo mode: `bun run discover-research -- --example parent-authorized-capability`

This gives a strong, stable consumer-first demo path for submission/judging without pretending the live `pvtclawn.eth` namespace is already fully published.

### 3) Submission documents were rewritten around current truth
The submission core/blurb/demo script now:
- lead with official capability discovery (not generic identity/profile framing),
- stay explicit about what is proven now vs not yet proven,
- avoid claiming that live `pvtclawn.eth` is already fully published as a parent-authorized research capability today,
- keep the differentiator centered on parent-authorized child capability authority.

### 4) Added two new submission support artifacts
- `SYNTHESIS-COMPETITIVE-POSITIONING-2026-03-21.md`
  - competitor-shape analysis
  - wedge language
  - track recommendation
  - copy/do-not-say guidance
- `SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
  - form-ready field text (name, problem, solution, demo, metadata)
  - builder-guide-aligned readiness checklist (video/conversation log/resources)

### 5) README now reflects the stronger demo surface honestly
README now exposes:
- deterministic positive-path consumer demo command for `discover-research`,
- updated submission docs index,
- proof wording that no longer implies full live ENS publication is already complete.

## Verification
Ran:
- `/home/clawn/.bun/bin/bunx tsc --noEmit`
- `timeout --kill-after=2 90s /home/clawn/.bun/bin/bun test src/*.test.ts`
- `/home/clawn/.bun/bin/bun run discover-research -- --example parent-authorized-capability`
- `/home/clawn/.bun/bin/bun run discover-research -- pvtclawn.eth`
- `/home/clawn/.bun/bin/bun run check-public-surface`

Observed:
- typecheck passes
- tests pass (`59 pass`)
- deterministic positive path now reports `Official endpoint declared: yes` while keeping `Liveness checked: no`
- live `pvtclawn.eth` remains honest (`Official endpoint declared: no`)
- preferred public surface remains live (`Preferred public surface ready: yes`)

## Acceptance mapping
Target | Result
- no liveness overclaim in `discover-research` positive output | ✅
- deterministic positive-path consumer demo command | ✅
- strong competitive positioning memo | ✅
- builder-guide-ready form pack | ✅
- submission copy updated to current truth | ✅

## Core delta
Moderate.
The consumer-first capability-discovery interface is now stronger and more truthful because the key command gained a stable positive-path mode and clearer authority-vs-liveness semantics.

## Rail delta
Moderate.
Submission artifacts and positioning docs were substantially upgraded for execution quality under hackathon constraints.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Partly, but not mostly.
The submission docs could still exist, but the CLI hardening and deterministic positive-path mode are specifically valuable because the product’s core claim is the parent/child capability authority primitive.

## Result
ÆNS now has a stronger submission package and a stronger demo surface at the same time:
- sharper pitch,
- form-ready copy,
- cleaner trust semantics,
- and a deterministic consumer-first demo path suitable for judging.
