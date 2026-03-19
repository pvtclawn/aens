# Challenge — proof-boundary split risk (2026-03-19 03:02 UTC)

## Purpose
Red-team the planned strict proof-surface boundary split before building it.

## Verdict
The direction is correct, but the slice can still fail if it only rearranges output strings while continuing to render from one mixed-provenance summary object.

## Main risks
1. **Fake separation**
   - declared / observed / inferred headings exist, but all still derive directly from the same mixed summary blob
2. **Loaded summary text**
   - interpretive summary wording may still overclaim even after moving to inferred output
3. **Observed-state ambiguity**
   - one compact line may still blur absent link vs failed fetch vs invalid content vs parsed content
4. **Declared-section overcorrection**
   - declared output can become either noisy or too thin after removing interpretation
5. **String-level tests**
   - the slice can regress if tests do not assert direct boundary membership

## Required safeguards
- derive separate proof views before rendering
- keep summary text in inferred only
- distinguish observed states clearly enough to avoid operational ambiguity
- keep declared output concise but informative
- test boundary membership directly

## Bottom line
The next slice should be judged by whether proof-boundary separation becomes a model boundary, not just a formatting boundary.
