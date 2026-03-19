# Plan — README / demo-surface cleanup for AENS (2026-03-19 10:18 UTC)

## Purpose
Freeze the next smallest shippable slice now that AENS has enough CLI/example coverage to explain its authority model, but still lacks an obvious repo entry surface.

## Current situation
AENS now has:
- live ENS lookup via `bun run inspect <ens-name>`
- deterministic contrasting examples via:
  - `bun run inspect --example parent-authorized-capability`
  - `bun run inspect --example unlisted-child-capability`
  - `bun run inspect --example identity-mismatch-capability`
- a trust-tier report that separates identity, authority, declared proof material, live observations, and inferred claims

But the repo still does **not** have a top-level `README.md`.
That means a new reader still has to infer the product from source code, research notes, or chat context.

## Why this is the right next move
### Not sample-input mode yet
A second input surface would broaden the tool before the first one is explained well.
That risks making AENS feel more complicated instead of more useful.

### Not live public positive example yet
That would strengthen public proof, but it depends on external ENS publication and coordination.
It is not the smallest move that improves standalone legibility today.

### Yes README/demo-surface cleanup now
The repo has just enough real functionality that a concise README can now make the project self-explanatory:
- what AENS is
- what it reads from ENS today
- what the capability-authority states mean
- what commands to run first
- what is implemented now vs not yet

## Smallest useful slice
Add a concise top-level `README.md` at the repo root.

## Required contents
1. **One-sentence thesis**
   - what AENS is in plain English
2. **Current product truth**
   - AENS is currently a CLI trust/debugger for ENS-based agent profiles and capability authority
3. **What ENS records it reads today**
   - ordinary identity/profile records
   - current `aens.*` records
4. **Quickstart commands**
   - one live ordinary ENS example
   - the three deterministic authority examples
5. **How to interpret authority states**
   - `parent-authorized`
   - `unlisted-child`
   - `identity-mismatch`
   - `not-a-capability-surface`
6. **What is implemented now / not yet**
   - implemented: lookup, classification, linked-proof summary, trust-tier report, deterministic demos
   - not yet: writes/publication, invocation/payment flow, polished live public positive example

## Nice-to-have but optional
- one small sample output excerpt
- minimal architecture section pointing to `src/resolver.ts`, `src/capability-authorization.ts`, `src/report.ts`, and `src/examples.ts`
- pointer to research notes only after the quickstart, not before it

## Non-goals for this slice
- no new input mode
- no live ENS publication
- no protocol rewrite
- no extra sponsor-facing feature surface
- no long-form whitepaper README

## Acceptance criteria
1. `README.md` exists at repo root.
2. A new reader can understand AENS’s current purpose in under a minute.
3. The first commands to run are obvious.
4. The authority classifier states are explained in plain language.
5. The README does not overclaim features that are not implemented.

## Next task
# **Build the concise top-level `README.md` now.**

The README should optimize for product legibility first, not exhaustiveness.
