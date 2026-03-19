# Plan — trust-tier report slice after red-team (2026-03-19 02:33 UTC)

## Purpose
Turn the trust-tier research and challenge notes into a small, guarded plan for the next AENS report slice.

## Constraint from the challenge
The next slice must not become a cosmetic heading pass.
It only counts if it makes evidence boundaries materially harder to confuse.

## Chosen plan (ordered)

### Task 1 — Semantic section model **(NEXT TASK)**
#### Goal
Replace the flat line-assembly approach with an explicit section model so each report field belongs to exactly one trust tier.

#### Scope
- define internal report sections for:
  - identity anchor
  - capability authority
  - linked proof material
  - live observations
  - inferred claims / caveats
- build section arrays/objects first, then render them
- move current fields into those sections using a strict mapping

#### Acceptance criteria
1. `renderProfileReport()` no longer relies on one monolithic flat `lines` array as the primary model.
2. Every current report field is assigned to exactly one section.
3. Section headings include tier + source labels.
4. Tests assert sectionized output for at least:
   - ordinary ENS profile (`vitalik.eth`-like case)
   - capability-authorized child profile
5. The rendered report order follows the trust questions:
   - who is this?
   - who authorizes it?
   - what is declared?
   - what was observed?
   - what is inferred?

#### Why this is first
Without this, the rest of the trust-tier work is vulnerable to cosmetic drift.
This is the smallest slice that makes the evidence boundaries real in code, not just in docs.

---

### Task 2 — Split declared proof material from live observations
#### Goal
Prevent runtime fetch state from visually contaminating stronger anchored/authorized facts.

#### Scope
- keep URLs and declared proof material in the declared section
- move reachability / valid JSON / usability observations into the observed section
- ensure fetch failures do not degrade identity/authority reporting

#### Acceptance criteria
1. `proofsUrl` / `receiptsUrl` live in the declared section.
2. `reachable`, `valid JSON`, and related fetch-time signals live in the observed section.
3. A failed fetch still leaves identity anchor + capability authority intact.
4. Tests cover at least one fetch-failure case.

#### Why this is second
This is the most important semantic split inside the linked-proof surface.
But it lands most cleanly once Task 1 gives the report real sections.

---

### Task 3 — Concise empty states + inferred-language demotion
#### Goal
Keep ordinary ENS profiles readable while ensuring heuristics remain visibly weaker than anchored/authorized facts.

#### Scope
- avoid bloated `not set` dumps inside advanced sections
- keep inferred claims last
- demote loaded labels when needed so heuristics do not sound stronger than they are

#### Acceptance criteria
1. `vitalik.eth`-like output stays concise and readable.
2. Empty advanced sections collapse to short summaries where appropriate.
3. Inferred section appears last.
4. Heuristic proof wording does not imply cryptographic verification.

#### Why this is third
Important for trust safety and legibility, but best done after the structural and declared/observed boundaries are in place.

## Single next task
# **Build Task 1 — Semantic section model**

### Smallest mergeable slice
Do not try to solve every wording issue at once.
Just:
- build a structured section model,
- map current fields into it,
- render tier/source headings in the right order,
- and test that the grouping is real.

## What to avoid next
- no cosmetic heading-only pass
- no giant proof-language rewrite in the same slice
- no new discovery/invocation features
- no JSON API expansion yet

## Bottom line
The next build slice should prove one thing:

> AENS report structure is now semantic enough that evidence classes are enforced by code rather than implied by formatting.
