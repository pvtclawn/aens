# Challenge — core delta / rail delta process-theater risk (2026-03-19 21:57 UTC)

## Purpose
Red-team the newest planning guardrail:

> every future ÆNS slice should state `Core delta` and `Rail delta` separately

The question now is not whether this rule is directionally right.
It is whether the rule could still be gamed in practice and decay into process theater.

## Verdict
### Yes — the rule can still be obeyed formally while evaded substantively.

This is the next subtle failure mode.
A future slice can include:
- a small `Core delta` section
- a large `Rail delta` section
- some capability-centered language in the intro

and still present itself as balanced, even though most of the real work, complexity, and downstream consequences live in supporting rails.

That means the current rule is a good start, but not yet a complete anti-drift filter.

## Core failure mode
The process-theater version looks like this:
- the slice note has both headings
- the note says the authority model is primary
- the concrete work still mostly improves proofs, public-state checks, transition receipts, or operator/reporting layers
- the slice is still narrated as if it were central protocol advancement

In that scenario, the repo passes the **form** of the rule while failing its **intent**.

## Why this matters
The core ÆNS wedge is narrow:
- parent identity
- child capability
- authorization relationship

Support rails are broad and easy to elaborate:
- proof capture
- publication-state summaries
- control-plane evidence
- transition receipts
- report ergonomics

So a formal headings rule is helpful, but it will not automatically prevent attention from sliding toward the broader, more generative supporting surfaces.

## Specific process-theater risks

### 1) Token core delta
A slice can present a very small authority-model clarification as `core delta` while the meaningful implementation delta remains overwhelmingly rail-heavy.

### 2) Heading compliance without priority compliance
The note can admit a large rail delta but still let the slice be treated socially or operationally as protocol-center progress.

### 3) Narrative laundering
The rule can become a way to launder support work into core work:
- mention `research.pvtclawn.eth`
- mention `parent-authorized`
- ship mostly support-rail improvements
- still imply protocol advancement

### 4) Review fatigue
If every slice carries the same headings, reviewers may stop asking the harder question:
- is the capability-authority model doing real explanatory work here, or is it just ceremonial framing?

### 5) Process bloat
A rule meant to reduce drift can itself create more structure, notes, and compliance work without materially changing how slices are chosen or evaluated.

## Stronger anti-drift test
The current rule should eventually be paired with a harder question:

> **Counterfactual relevance test:** If the `child capability under parent identity` model were removed, would this slice still mostly make sense?

If the answer is **yes**, then the slice is almost certainly rail-dominant.
It may still be valuable, but it should be labeled and prioritized as supporting work.

This test is harder to game than headings alone because it checks whether the ÆNS wedge is actually load-bearing in the slice.

## Secondary guardrail
A future slice should also declare one explicit label such as:
- `primary delta: core`
- `primary delta: rail`
- `primary delta: mixed`

That makes the classification harder to hide behind generic progress language.

## Bottom line
The `core delta / rail delta` rule is useful, but it is not yet self-enforcing.

Without a stronger anti-drift question, the project can still drift into:
- capability-centered language on paper
- support-rail-heavy work in practice

## Best next move
Freeze one follow-up planning rule:
- future slices should not only state `Core delta` and `Rail delta`
- they should also answer the **counterfactual relevance test**:
  - would this slice still mostly make sense without the child-capability authority model?

If yes, it is supporting work — useful, but not protocol-center progress.
