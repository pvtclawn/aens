# Plan — counterfactual relevance test rule (2026-03-19 22:00 UTC)

## Purpose
Freeze one narrow follow-up rule that prevents the new `Core delta / Rail delta` planning structure from decaying into process theater.

Recent anti-drift work already established:
- supporting trust rails must stay subordinate to the protocol core
- future slices should state `Core delta` and `Rail delta` separately

But the latest challenge found the remaining loophole:
- a slice can comply with those headings formally while still being mostly rail-heavy in substance

This plan closes that loophole with one harder question.

## Decision
### Pair `Core delta / Rail delta` with a **counterfactual relevance test**.

Every future slice that uses the new planning rule should answer this explicit question:

> **Would this slice still mostly make sense if the `child capability under parent identity` model were removed?**

If the answer is **yes**, the slice is almost certainly rail-dominant.
It may still be worth shipping, but it should be labeled and prioritized as **supporting work**, not protocol-center progress.

## Why this works
`Core delta / Rail delta` headings are useful, but they can still be gamed:
- add a token `Core delta`
- keep most of the real work in support rails
- still narrate the slice as balanced or central

The counterfactual relevance test is harder to game because it asks whether the ÆNS wedge is actually doing real explanatory work.

If the slice would still mostly make sense without:
- parent identity
- child capability
- authorization relationship

then the slice is not really centered on the protocol core, even if the note mentions those words.

## Exact rule for future slice planning
When scoping or reviewing a future slice, require these three declarations together:

### 1) Core delta
What concrete change does this make to the parent/child capability authority model?

### 2) Rail delta
What concrete change does this make to supporting proof/public-state/provenance rails?

### 3) Counterfactual relevance test
Would this slice still mostly make sense if the `child capability under parent identity` model were removed?
- If **yes** → label as supporting work
- If **no** → the slice may qualify as protocol-center progress, assuming the core delta is also meaningful

## Priority rule
### Protocol-center slice
Treat a slice as protocol-center progress only if all of these are true:
- `Core delta` is meaningful
- the counterfactual relevance test answers **no**
- the slice would lose most of its reason to exist without the child-capability authority model

### Supporting slice
Treat a slice as supporting work if any of these are true:
- `Rail delta >> Core delta`
- the counterfactual relevance test answers **yes**
- the slice would still mostly make sense as generic discovery/provenance/proof/deployment tooling

## Acceptance criteria
A future slice is acceptable as protocol-center progress only if all of these are true:

### A. Core delta is explicit
The slice states what changed in:
- parent identity
- child capability
- authorization relationship

### B. Rail delta is explicit
The slice states what changed in:
- proof
- public-state
- deployment/control-plane evidence
- or other supporting rails

### C. Counterfactual relevance is answered explicitly
The slice note answers whether it would still mostly make sense without the child-capability authority model.

### D. Label matches the answer
If the counterfactual answer is **yes**, the slice is labeled supporting work.
It is not narrated as protocol-center progress.

### E. Repo health stays clean
- `bun test`
- `bunx tsc --noEmit`

## Explicit non-goals
This rule does **not** ban supporting work.
It does **not** say every slice must directly move the authority model.
It only says:
- do not let supporting work quietly masquerade as core protocol progress

## Minimal implementation shape
Do not build a heavy framework for this.
The smallest useful move is enough:
- when future planning docs are written, add one short `Counterfactual relevance test` section beside `Core delta` and `Rail delta`
- use the answer honestly
- let the answer affect classification/prioritization

## Bottom line
The anti-drift rule is now:
- `Core delta`
- `Rail delta`
- **Counterfactual relevance test**

If a slice would still mostly make sense without the `child capability under parent identity` model, it is supporting work.
That keeps ÆNS centered on the real wedge instead of letting good supporting rails become the product by accident.
