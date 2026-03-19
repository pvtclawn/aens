# Plan — strict proof-boundary split after red-team (2026-03-19 03:07 UTC)

## Purpose
Turn the proof-boundary research + challenge notes into a small, guarded execution plan for the next AENS slice.

## Constraint from the challenge
The next slice must not become fake separation.
It only counts if proof-boundary separation becomes a **model boundary**, not just a formatting boundary.

## Chosen plan (ordered)

### Task 1 — Separate proof evidence views **(NEXT TASK)**
#### Goal
Stop rendering proof sections directly from one mixed `LinkedRecordSummary`-style blob.

#### Scope
Introduce or derive explicit report-layer proof views for:
- declared proof material
- observed proof fetch state
- inferred proof interpretation

These views may be produced from the current raw linked-record summary shape, but they must be separate structures before rendering.

#### Acceptance criteria
1. Report code derives separate proof evidence views before section rendering.
2. Declared proof view contains only:
   - proof surface presence
   - proofs URL
   - receipts URL
   - short declaration-presence/absence statement when helpful
3. Observed proof view contains only runtime fetch state such as:
   - reachable
   - valid JSON
   - HTTP status / usability now
4. Inferred proof view contains only parsed/derived interpretation such as:
   - summary text
   - shape
   - proof strength
   - counts
   - core field deductions
5. Tests assert boundary membership directly, including:
   - summary absent from declared
   - proof strength absent from observed
   - URLs absent from inferred unless explicitly justified

#### Why this is first
Without this, the next slice can still pass cosmetically while leaving the underlying semantics muddy.
This is the smallest move that makes the boundary real in code.

---

### Task 2 — Sharper observed-state vocabulary
#### Goal
Keep runtime fetch results informative without collapsing different operational states into one mushy line.

#### Scope
At minimum, distinguish cases such as:
- no linked material declared
- fetch not attempted
- fetch failed
- fetch succeeded but content invalid
- fetch succeeded and content parsed

#### Acceptance criteria
1. Observed output distinguishes absent declaration from attempted fetch failure.
2. A failed fetch does not degrade declared proof material.
3. Tests cover at least one fetch-failure case and one invalid-JSON case.

#### Why this is second
Important, but it lands more cleanly after the proof views exist.

---

### Task 3 — Concise declared output + inferred-language cleanup
#### Goal
Keep declared output useful and compact while preventing inferred wording from sounding stronger than it is.

#### Scope
- keep declared output concise
- keep summary text in inferred only
- consider demoting especially loaded wording where it helps legibility/trust

#### Acceptance criteria
1. Declared section for ordinary profiles stays short and clear.
2. Inferred section remains clearly separate and last.
3. No interpretive summary text appears in declared or observed output.

#### Why this is third
Useful polish, but structurally downstream of Tasks 1 and 2.

## Single next task
# **Build Task 1 — Separate proof evidence views**

### Smallest mergeable slice
Do not rewrite the whole fetch/parsing pipeline.
Just:
- derive separate proof views in the report layer,
- render each proof section from its matching view,
- add direct boundary-membership tests,
- and keep existing CLI behavior green.

## What to avoid next
- no heading-only cleanup
- no giant proof-language rewrite in the same slice
- no new capability/discovery features
- no parser overhaul unless forced

## Bottom line
The next build slice should prove one thing:

> AENS no longer renders declared, observed, and inferred proof material from one semantically mixed report input.
