# Plan — Final-Hour Stop Rule v1 (2026-03-22 23:40 UTC)

## Why this plan exists
The live Synthesis project is now in the strongest visible state reached tonight:
- published
- 4 tracks attached
- cover image visible
- improved submission-cut demo URL visible
- GitHub-derived proof metadata restored
- `agent.json` and `agent_log.json` present in the repo

That changes the optimization problem.
The next risk is no longer under-shipping.
The next risk is **late mutation damage**.

## Current known platform behavior
Synthesis project updates have behaved inconsistently tonight:
- some full-payload updates improved one field while regressing others
- `conversationLog` still fails to survive readback
- the latest cover-image mutation was good and restored metadata, but earlier updates proved the surface is fragile

So the operating question is:
> when should we stop touching the live project page?

## Decision
Adopt a high-bar stop rule for the remaining hours.

### Default posture
**Do not perform more live Synthesis mutations** unless the proposed change satisfies all three conditions:
1. clearly visible judge-facing upside
2. low regression risk to currently good fields (`coverImageURL`, `videoURL`, `commitCount`, `tracks`, `publish`)
3. no equally good repo-side alternative

If any of those fail, prefer stopping.

## What counts as worth doing
### Worth doing
- a mutation that clearly improves a currently visible high-signal field
- and is unlikely to unset existing visible proof

### Not worth doing
- trying to force `conversationLog` to work again
- speculative copy churn
- repeated full-payload writes without a concrete visible gain
- any update whose main purpose is internal neatness rather than judge impact

## Best remaining moves under this rule
### Safe / higher confidence
1. **Stop mutating the live project page unless a new clearly positive mutation appears**
2. Push any remaining repo-only truth/proof artifacts if needed
3. If there is a final communication need, use the current strong public state as-is

### Unsafe / lower expected value
1. another attempt to fix `conversationLog`
2. another metadata-touching full payload with unclear collateral behavior
3. cosmetic text churn on the live page for marginal gains

## Acceptance criteria for the stop rule
This plan is successful if:
- no further low-value live mutation is performed just to chase completeness
- the current strongest public state remains intact
- any remaining work focuses on preserving or pointing to the already-strong proof surface

## Compact rule
> The project is now good enough that preserving the strongest known public state has higher expected value than squeezing one more fragile field mutation out of Synthesis.
