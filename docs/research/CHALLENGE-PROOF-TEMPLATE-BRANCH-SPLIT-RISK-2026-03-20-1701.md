# Challenge — proof template branch-split risk (2026-03-20 17:01 UTC)

## Purpose
Red-team the upcoming standalone first-live-proof template patch now that the preferred-live vs bootstrap/regression split has been frozen conceptually.

## Current truth
At challenge time:
- repo health clean on the deterministic check path
- preferred public child route live
- the next likely slice is a doc patch that gives the standalone proof template two explicit branches while keeping the same four top-level sections

This is probably the right direction.
But the patch can still fail in subtle presentation-layer ways even if its high-level model is correct.

## Weakness 1 — mixed-branch notes can still happen
If the template simply offers two branches in one file, the final proof note can still become a hybrid:
- preferred-live wording in section 2
- bootstrap/regression wording in section 4
- or an old bootstrap compact summary copied into an otherwise preferred-live note

Risk:
- the final proof becomes internally inconsistent while still sounding polished
- readers can no longer tell which capture-time world the note is actually describing

Mitigation:
- require branch choice explicitly near the top before section 1 begins
- add one clear rule: choose exactly one branch and keep all branch-sensitive wording aligned to it
- include a small marker such as `Proof branch: preferred-live` or `Proof branch: bootstrap/regression`

## Weakness 2 — preferred-live section 3 can sound more reassuring than it is
Keeping section 3 as `Unresolved human control-plane state` while allowing it to say `no unresolved preferred-route blocker was visible at capture time` is better than inventing a stale blocker.
But it can still read as if nothing meaningful remains unresolved.

Risk:
- the heading carries more weight than the qualification
- a rushed reader may hear `no blocker` and miss the narrow scope `preferred-route ... at capture time`
- the note can become emotionally stronger than the evidence warrants

Mitigation:
- require the preferred-live branch to include an immediate scope-limiting sentence:
  - `No unresolved preferred-route blocker was visible at capture time; other non-proven areas remain in section 4.`
- keep `observational rather than machine-closed proof` in the same paragraph, not elsewhere in the note

## Weakness 3 — the branch split can over-trust the verifier snapshot
The new boundary note correctly treats preferred-route reachability as an observation.
But the patched template could still drift into overconfidence if section 2 relies on paraphrase instead of exact capture-time evidence.

Risk:
- `preferred surface ready = yes` can get retold as a broader or more durable claim than it really is
- the proof note may sound tighter than the underlying artifact

Mitigation:
- require the exact verifier lines to appear in the proof artifact and strongly prefer echoing them in section 2
- keep section 2 tied to capture-time evidence rather than freehand narrative alone
- derive the compact summary after the detailed sections are written, not before

## Weakness 4 — bootstrap/regression can accidentally become a shame branch
If the rewrite centers the preferred-live path too aggressively, the bootstrap/regression branch can start reading like a failure state rather than an honest narrower proof mode.

Risk:
- authors may avoid the branch even when it is the truthful one
- the template would then create social pressure toward overclaiming

Mitigation:
- state explicitly that both branches are acceptable when chosen honestly from capture-time truth
- keep bootstrap/regression wording neutral and scoped, not apologetic
- make the acceptance rule branch-neutral: honesty beats aesthetics

## Weakness 5 — compact summary drift can undo the whole careful split
The planned patch likely adds two compact summaries.
That is useful, but also dangerous.

Risk:
- summaries are what people quote or repost
- if the summary is stronger or blurrier than sections 1–4, the detailed honesty work is effectively canceled

Mitigation:
- require the compact summary to be written last
- require it to preserve the same chosen branch and the same `not yet proven` boundary as the detailed sections
- if there is any mismatch, weaken the summary rather than strengthening the body

## Core delta
None.
This challenge does not change the parent/child authorization model or the four-section proof model.

## Rail delta
High.
This is proof-scope/presentation hardening around the next standalone template patch.

## Counterfactual relevance test
Would this challenge still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting challenge work, not protocol-center progress.

## Bottom line
The next template patch can still fail as **presentation-layer ambiguity** even if the underlying branch split is conceptually correct.

## Best next move
When building the patch, add three structural safeguards:
1. explicit branch selection near the top
2. scope-limiting sentence in preferred-live section 3
3. explicit rule that the compact summary is derived last from the chosen branch and cannot overstate the detailed sections
