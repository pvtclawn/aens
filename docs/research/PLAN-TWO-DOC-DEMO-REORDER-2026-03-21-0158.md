# Plan — two-doc demo reorder for ÆNS submission (2026-03-21 01:58 UTC)

## Why this plan exists
The latest challenge note found a real presentation weakness in the current artifact-first wording:

- artifact-first is correct for truth,
- but the proposed sequence can still feel too indirect for human judges,
- because it keeps them inside proof surfaces for too long before they see a living public surface.

So the next slice should not debate the whole submission again.
It should do one tiny, concrete thing:

> reorder the two docs that still control judge entrypoints.

## Smallest shippable milestone
Patch exactly two submission-facing docs so the demo order becomes:
1. wrapped **example artifact** first
2. live **research-capability page** second
3. wrapped **live artifact** third
4. **CLI** fourth as reproducibility backup
5. public **`/discover-research/` route** last, with explicit deployment-status caveat

This keeps truth first while restoring product feeling earlier.

## Docs in scope
Patch only:
1. `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
2. `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`

Do not touch for this slice unless strictly forced by consistency:
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `README.md`

## Crisp tasks

### Task 1 — reorder the form-pack demo flow
Replace the current route-first order with a demo flow that:
- starts at the wrapped example artifact as the clearest current proof of target discovery flow
- moves immediately to the live research-capability page as the first human-facing visual/public anchor
- then uses the wrapped live artifact to show current namespace truth honestly
- keeps CLI in backup/evidence position
- mentions `/discover-research/` only as the intended deployed surface while production catches up

### Task 2 — reorder the 2-minute demo script
Patch the demo script so the 0:30–1:05 section no longer opens with `/discover-research/`.

Instead it should:
- open the wrapped example artifact first
- move to the live research-capability page early
- reserve the live artifact and CLI for truth/reproducibility support
- demote `/discover-research/` to a deployment-pending/intended-surface mention

### Task 3 — keep wording non-apologetic
Use the frozen wording rule:
- upgrade the strongest verified surface
- do not apologize for the undeployed route
- frame the route as the intended deployed surface rather than as a broken fallback

## Acceptance criteria
This plan passes only if all of the following are true:

1. `SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md` no longer instructs judges to start with `/discover-research/`
2. `SYNTHESIS-DEMO-SCRIPT-2026-03-20.md` no longer opens the demo with `/discover-research/`
3. Both docs now order the human-facing flow as:
   - example artifact
   - live research-capability page
   - live artifact
   - CLI backup
   - intended `/discover-research/` route with caveat
4. The patch does **not** sound apologetic or like damage control
5. The patch does **not** overclaim the route as live while production still serves `404`
6. Scope remains limited to those two docs only

## Explicit non-goals
Do **not** use this slice to:
- rewrite the core submission document
- rewrite the README
- revisit track fit
- revisit artifact schema
- fix Vercel deployment

Those are separate threads.

## One clearly defined next task
**Patch the form pack and demo script so the demo starts with the wrapped example artifact, brings the live research-capability page in as the first public visual anchor, and demotes the undeployed `/discover-research/` route to an intended-surface mention with caveat.**

## Why this is the right next step
It is:
- smaller than another broad submission rewrite,
- directly justified by the fresh challenge note,
- enough to stop judges from being sent to a dead route first,
- and strong enough to improve product feel without sacrificing truth.
