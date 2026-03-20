# Challenge — publisher-assist local artifact trust risk (2026-03-20 18:05 UTC)

## Purpose
Red-team whether publisher-assist v1 actually preserves its new source-of-truth rule in practice, especially around stale proof artifacts on disk.

## Current truth
At challenge time:
- publisher-assist v1 is read-only and stateless
- live ENS/public-state inputs are fresh on each run
- the recent plan refinement says workflow state must be derived from external truth rather than soft session memory
- however, the CLI still treats local proof artifacts as part of current-state derivation

This is reasonable in principle.
But the current artifact logic is still weaker than the rest of the source-of-truth story.

## Weakness 1 — `proof-captured` currently depends on a weak artifact heuristic
Current code promotes the state to `proof-captured` when:
- current authority is `parent-authorized`
- any markdown file under the proof dir contains:
  - `## Public truth snapshot`
  - the child ENS name

Risk:
- this does not prove the file is a **final** proof artifact
- it does not prove the file matches the current publication mode/service URL/commit boundary
- a baseline or post-root artifact can look like terminal proof completion

Mitigation:
- require a stronger final-proof match before emitting `proof-captured`
- examples:
  - explicit final-phase marker
  - publication mode/service URL match
  - artifact metadata proving it came from the real capture path
- otherwise keep the state at `parent-authorized-verified`

## Weakness 2 — local disk evidence currently gets a stronger role than the source-of-truth rule implies
The refined plan says source of truth should be ordered roughly as:
1. live ENS reads
2. live public-surface truth
3. proof artifacts on disk

Risk:
- any matching artifact can still flip the tool into a terminal-looking state
- this gives disk evidence more power than the plan language suggests
- the UX may sound more final than the evidence actually is

Mitigation:
- demote artifact presence to supporting evidence unless it satisfies a strict final-proof contract
- or introduce a softer non-terminal output such as `final-proof-artifact-candidate-detected`

## Weakness 3 — historical artifacts are naturally sticky across retries
The proof directory is intentionally persistent.
That is good for auditability but dangerous for current-state inference.

Risk:
- old artifacts survive retries and future runs
- repeated use of the same child name lets historical files match again
- state classification can become more complete-looking than the actual current run

Mitigation:
- add a freshness boundary to artifact-sensitive logic:
  - latest matching artifact only
  - current commit match
  - current publication mode/service URL match
  - or operator-provided explicit artifact path

## Weakness 4 — the artifact matcher is too easy to satisfy adversarially
The current finder trusts loose textual markers in markdown content.

Risk:
- malformed or fabricated files can satisfy the heuristic cheaply
- this weakens the tool’s claim to be evidence-derived
- local file optimism can sneak back in under the label of statelessness

Mitigation:
- parse proof artifacts structurally instead of scanning for loose markers
- require concrete fields emitted by the real proof-capture path
- if structure is weak or incomplete, fail closed to `parent-authorized-verified` or `needs-operator-reconcile`

## Core delta
None.
This challenge does not change the parent/child authorization model.

## Rail delta
Moderate.
This is a critique of the adjacent publisher-assist v1 UX/tooling rail.

## Counterfactual relevance test
Would this challenge still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting tool/UX challenge work, not protocol-center progress.

## Bottom line
Publisher-assist v1 is strong on fresh ENS/public reads but still too trusting of local proof artifacts when deciding whether the workflow is already `proof-captured`.

## Best next move
Before any state-model expansion, tighten one thing:
- make `proof-captured` require a **strong final-proof artifact match**
- otherwise demote local artifact presence to advisory evidence and keep the terminal state at `parent-authorized-verified`
