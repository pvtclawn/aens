# Challenge — ÆNS front-door framing risk (2026-03-20 20:59 UTC)

## Purpose
Red-team the newly frozen plain-English / front-door framing stack before it hardens into README or submission copy.

Current stack:
1. value first
2. mechanism second
3. proof boundary third

This is the right direction.
But it still carries specific product-copy risks.

## Weakness 1 — value-first can become too generic
The simplest current framing says:
- `ÆNS lets an ENS name act like a verified profile that can publish official tools and pages.`

Risk:
- this can sound like a verified profile page, Linktree, or generic subdomain manager
- the differentiator (`parent ENS identity authorizes child capabilities`) can disappear from the front door

Mitigation:
- keep the first sentence simple
- make the second sentence restore the core differentiator immediately
- do not let the hero stop at `profile + tools/pages` alone

## Weakness 2 — `verified` can imply the wrong kind of verification
`Verified profile` is intuitive but ambiguous.
It can suggest social/KYC/reputation-style verification rather than ENS-native authorization.

Risk:
- readers may infer a broader promise than ÆNS is actually making

Mitigation:
- ground `verified` immediately in ENS authorization language
- or replace it with wording like `official ENS home base` if testing shows persistent confusion

## Weakness 3 — proof boundary can still get buried too far down
The new framing stack correctly avoids poisoning the opener with caveats.
But if the proof boundary sits too low, the copy may sound more finished than the evidence supports.

Risk:
- the project can read cleaner than it really is
- the first live session / current proof status can disappear beneath product polish

Mitigation:
- place a short `current proof status` / `what is proven now` layer immediately below the first two sentences
- do not bury the caveat boundary in late-page detail

## Weakness 4 — broad copy can underplay the agent/capability angle
`Official tools and pages` is accessible but broad.
If left alone, it underplays the more interesting claim:
- child capabilities under a parent ENS identity

Risk:
- ÆNS becomes easier to understand but less distinctive
- it starts sounding like a nicer ENS microsite pattern instead of a capability-authorization primitive

Mitigation:
- keep sentence 1 broad
- use sentence 2 or the first concrete example to introduce `child capabilities` explicitly
- surface `research.pvtclawn.eth`-style examples early

## Weakness 5 — clearer copy can still overstate product maturity
`Publish official tools and pages` sounds polished and finished.
The actual current product truth is narrower and more proof-dependent.

Risk:
- clarity turns into accidental overclaiming

Mitigation:
- keep the third layer blunt:
  - current proof shows ENS-backed authorization of child capabilities
  - it does not yet prove every child service is fully live end-to-end

## Core delta
None.
This challenge does not change the parent/child authorization model.

## Rail delta
Moderate.
This is product-copy / README / submission framing critique.

## Counterfactual relevance test
Would this challenge still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product framing work, not protocol-center progress.

## Bottom line
The new front-door framing stack is correct in structure, but it will fail if it becomes too generic, too ambiguous about `verified`, or too polished to show the current proof boundary.

## Best next move
If copy work continues, the safest structure is:
1. simple value sentence
2. immediate differentiator sentence (`parent ENS identity authorizes child capabilities`)
3. immediate proof-boundary layer
4. early concrete example
