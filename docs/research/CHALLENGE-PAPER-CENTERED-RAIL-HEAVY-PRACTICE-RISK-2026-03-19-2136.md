# Challenge — paper-centered / rail-heavy practice risk (2026-03-19 21:36 UTC)

## Purpose
Red-team the newest anti-drift rule:

> supporting trust rails must remain subordinate to the protocol core

The question now is not whether the wording and framing are correct.
It is whether future slices could still *pass the wording check* while spending most of their actual energy on supporting rails in practice.

## Verdict
### Yes — wording discipline can still hide an attention-allocation drift.

This is the next subtle failure mode.
A slice can sound capability-centered on paper while mostly elaborating:
- proof artifacts
- verifier logic
- public-state checks
- deployment/admin evidence
- transition receipts
- rail-focused UX

If that keeps happening, ÆNS can still drift in practice even while its docs keep saying the right words.

## Core failure mode
The failure mode looks like this:
- the slice intro mentions `research.pvtclawn.eth`
- the note says the goal is to strengthen capability authority
- the success language still includes `parent-authorized`
- but the concrete work mostly lands in support-rail machinery

That means the project passes the **language anti-drift test** while failing the **effort anti-drift test**.

## Why this matters
The protocol core is relatively narrow:
- parent identity
- child capability
- authorization relationship

Supporting rails are naturally broad and generative:
- proof capture
- publication-state machinery
- public-surface verification
- control-plane evidence
- operator/reporting layers

That asymmetry means it is easier to keep improving the rails than to improve the core wedge.

So if the project only checks wording order, it can still accumulate lots of rigorous supporting infrastructure around a thesis that is not becoming proportionally more load-bearing.

## Specific risk indicators
A future slice is probably drifting in practice if most of these are true:

### 1) More rail concepts than authority-model delta
The slice introduces multiple new concepts about proofs, public-state, deployment, or transition evidence, while the actual capability-authority interpretation barely changes.

### 2) Most touched files live in support-rail surfaces
Examples:
- verifier code
- proof-capture code
- deployment/public-state docs
- reporting/ops surfaces

while the parent/child authority model itself is unchanged.

### 3) The main milestone is unchanged
If `parent-authorized` semantics, capability meaning, or the child-capability model do not become clearer/stronger, then the slice may be useful — but it is still probably secondary.

### 4) The slice would still make sense without the ÆNS wedge
A strong warning sign is when the slice could almost be transplanted unchanged into a generic service-provenance tool.
If so, the work is probably more about rails than about the core protocol edge.

### 5) Progress language outruns authority-model progress
If the repo feels dramatically more “serious” after the slice, but the child-capability authority model is basically the same, the confidence gain may be mostly rail-driven.

## What this would do to ÆNS
This kind of drift would not make the repo bad.
It would make it lopsided:
- increasingly excellent support machinery
- insufficiently advancing core protocol object

That is exactly how a project becomes impressive infrastructure attached to a still-underpowered thesis.

## Best guardrail
ÆNS should start distinguishing two kinds of delta explicitly:

### Core delta
What became more load-bearing, legible, or enforceable about:
- parent identity
- child capability
- authorization relationship

### Rail delta
What became better about:
- proof capture
- public-state checks
- deployment/control-plane evidence
- supporting trust UX

A rail delta can be useful and worth shipping.
But it should be named as such and not mistaken for core protocol advancement.

## Practical rule for future prioritization
Before calling a future slice a mainline protocol advance, ask:

1. what concrete core delta did this create for the capability-authority model?
2. if that answer is weak, should this be labeled and prioritized as support-rail work instead?

If the slice has mostly rail delta, it may still be good.
But it should not silently consume the project center of gravity.

## Bottom line
The current anti-drift wording rules are necessary.
But they are not sufficient.

ÆNS also needs to guard against **paper-centered / rail-heavy** progress:
- the slice sounds capability-centered
- the work is mostly support-rail elaboration

## Best next move
Freeze one explicit planning rule for future slices:
- every slice should state its **core delta** and **rail delta** separately
- if `rail delta >> core delta`, the slice should be treated as supporting work, not protocol-center progress

That would turn the current anti-drift insight into a usable prioritization filter.
