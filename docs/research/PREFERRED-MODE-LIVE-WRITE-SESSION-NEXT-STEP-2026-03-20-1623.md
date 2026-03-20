# Preferred-mode live write session — next step (2026-03-20 16:23 UTC)

## Purpose
Freeze the exact next live publication move now that the preferred Vercel child route is publicly reachable.

This is a narrow research/update note, not a new build slice.
The question is no longer:
- should the first live ÆNS proof use bootstrap mode because the preferred route is blocked?

The new question is:
- what is the smallest honest next live session now that the preferred route is actually live?

## Current public truth
At note time:
- `bun run check-public-surface` reports:
  - `public root: ok`
  - `research capability page: ok`
  - `Preferred public surface ready: yes`
  - `Bootstrap proof ready: no`
- the preferred child route is publicly reachable:
  - `https://aens-nine.vercel.app/research-capability/`

So the publication-state split has changed materially.
The preferred route is no longer blocked by unresolved deployment control-plane state.

## Decision
### The next real live ENS write session should run in `preferred` mode by default.

Set:
```bash
export AENS_PROOF_PUBLICATION_MODE=preferred
export AENS_PROOF_SERVICE_URL=https://aens-nine.vercel.app/research-capability/
```

Do **not** default to the GitHub blob fallback anymore.
Treat the blob only as historical/bootstrap reference material unless the preferred route regresses again.

## Why this matters
The earlier bootstrap-mode logic was correct when the preferred route was still not publicly ready.
But keeping bootstrap-mode assumptions around after the preferred route is live would now create a new honesty bug:
- the public surface would be stronger than the proof mode
- the first live write session would underuse the real preferred path
- the service URL on `research.pvtclawn.eth` could lag behind the best currently reachable public truth

## Exact next session shape
The smallest honest next move is now:
1. Egor present with the wrapped-owner wallet
2. baseline capture with `preferred` mode
3. resolver modernization + root records on `pvtclawn.eth`
4. create/populate `research.pvtclawn.eth`
5. set parent capability list last
6. final proof capture in `preferred` mode

## Applied trust-engineering rule
A live preferred-mode session is not trustworthy just because the service URL is better.
It also has to keep the operator oriented.

Applied from `004_building_ethereum_products_and_protocols.pdf` (`Principle of Trust` + information architecture + error handling): every checkpoint in this session should make four things explicit before the next write:
1. current publication mode
2. exact service URL
3. current verifier truth (`Preferred public surface ready` / `Bootstrap proof ready`)
4. exact failed checkpoint if something breaks

That means:
- no stale bootstrap-default wording once the preferred route is live
- no vague `deployment weirdness` language
- no silent continuation after a failed checkpoint
- no ambiguity about why the chosen service URL is the honest current target

## Proof-note implication
The final proof note should still keep the same top-level structure:
1. `Machine-verifiable scope`
2. `Observed public-alias state (time-scoped)`
3. `Unresolved human control-plane state`
4. `Not yet proven`

But section 3 must now reflect the new truth honestly.

### Updated rule for section 3
If the preferred route remains live at capture time, the note should **not** repeat stale wording about an unresolved control-plane blocker.
Instead it should say plainly that no unresolved preferred-route control-plane blocker remained visible at capture time, while still avoiding broader claims about invocation/payment/runtime behavior.

## Acceptance criteria for the next live session
Treat the next session as correctly scoped only if all of these are true:
- baseline verifier shows `Preferred public surface ready: yes`
- `AENS_PROOF_PUBLICATION_MODE=preferred`
- `AENS_PROOF_SERVICE_URL=https://aens-nine.vercel.app/research-capability/`
- child `aens.service` is set to the preferred Vercel child route
- final child result is `parent-authorized`
- final note does not reuse stale blocked-route wording

## Core delta
None.
This note does not change the parent/child authorization model.

## Rail delta
Moderate.
It sharpens the honest execution mode for the next live publication session.

## Counterfactual relevance test
Would this note still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting research/execution work, not protocol-center progress.

## Bottom line
The next live ÆNS publication session should now be a **preferred-mode live write session**, not a bootstrap-mode workaround.
