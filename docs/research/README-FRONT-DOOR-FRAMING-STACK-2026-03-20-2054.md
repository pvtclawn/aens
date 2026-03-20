# README front-door framing stack (2026-03-20 20:54 UTC)

## Purpose
Freeze the smallest useful applied lesson for product-facing ÆNS copy after the plain-English framing note.

Question:
- how should README/submission copy be structured so ÆNS becomes understandable without sacrificing proof honesty?

## Core answer
### Lead with value first. Put mechanism second. Put proof/caveat boundaries underneath.

The problem is not only wording.
It is information architecture.
The opening line should answer:
- what is this for?

Only after that should the copy answer:
- how does it work?
- what is already proven vs not yet proven?

## Recommended three-layer front door
### 1) Opening sentence — user-facing value
Use something like:
> ÆNS lets an ENS name act like a verified profile that can publish official tools and pages.

### 2) Second sentence — high-level mechanism
Use something like:
> A parent ENS name can authorize child capabilities like `research.pvtclawn.eth` so people can tell which tools are officially endorsed.

### 3) Third layer — proof/caveat boundary
Only after the first two lines should the copy explain things like:
- what the current proof artifacts show
- what is machine-verifiable
- what is still not proven end-to-end

## Why this matters
If proof/caveat language is mixed into the opening sentence, the front door becomes muddy.
The reader meets implementation uncertainty before they even understand the product.

The right order is:
1. product value
2. mechanism
3. evidence boundary

## README implication
The next README/product-copy patch should not try to make one sentence do all jobs.
It should make the opening stack legible.

## Submission implication
For a Synthesis-style submission, the same rule applies:
- lead with what ÆNS *does for a human*
- then explain how ENS parent/child authorization works
- then explain the current proof boundary honestly

## Bottom line
The most useful front-door copy rule for ÆNS right now is:
### value first, mechanism second, proof boundary third.
