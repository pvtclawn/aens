# Consumer-first ÆNS MVP cut (2026-03-20 21:26 UTC)

## Purpose
Freeze the most useful product refinement after the strong-vs-weak ÆNS thesis:

### The MVP should be defined from the consumer action, not the publisher workflow.

## Core rule
A strong ÆNS MVP should be explainable as:

1. input a parent ENS name
2. discover official child capabilities
3. verify which ones are parent-authorized
4. return the endpoint to use

Example:
- input: `pvtclawn.eth`
- output: official research endpoint from `research.pvtclawn.eth`

## Why this is the right cut
It solves the problem Egor's questions exposed:
- too much of ÆNS still sounds like internal publication machinery
- not enough of it sounds like a product someone can actually use

A consumer-first cut forces the product to answer:
- what does the user/software put in?
- what useful answer comes out?
- what trust boundary does the verifier enforce?

## Strong MVP framing
The MVP is **not**:
- a publishing flow by itself
- a profile page
- a collection of ENS records
- a proof note

The MVP **is**:
- a way to discover the official machine-readable capability/endpoints for an ENS identity

## Minimal consumer loop
### Input
- parent ENS name

### Processing
- read parent + child capability records
- classify parent authorization
- resolve the child service URL/endpoint

### Output
- official capability name(s)
- authorization status
- endpoint to use

## Product filter
If a proposed feature does not improve this consumer loop, it is probably secondary.

Examples of secondary work:
- nicer publication-side comfort if it does not improve discovery/consumption
- generic profile-page framing
- vague “official pages” language without actual endpoint consumption

## Best current MVP articulation
> Given an ENS identity, ÆNS tells people and software which machine-readable capabilities are officially authorized and where to use them.

## Bottom line
The strongest version of ÆNS becomes real only when the project is organized around:
### input ENS identity -> output official endpoint(s)

That is the MVP cut worth keeping.
