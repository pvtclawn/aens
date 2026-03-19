# Plan — observed-state slice after red-team (2026-03-19 03:38 UTC)

## Purpose
Turn the observed-state research + challenge notes into a small, guarded execution plan for the next AENS slice.

## Constraint from the challenge
The next slice must not become fake state clarity.
It only counts if observed proof fetches become a **real state model with clear derivation rules**, not just nicer labels over raw transport fields.

## Chosen plan (ordered)

### Task 1 — Explicit observed-state view + derivation rules **(NEXT TASK)**
#### Goal
Replace the raw `reachable/validJson/status` bundle as the primary report input with an explicit observed-state view.

#### Scope
Derive a report-layer observed proof fetch view with fields roughly like:
- `kind`
- `state`
- `status`
- `detail`

Where `state` is one of:
- `not-declared`
- `not-attempted`
- `fetch-failed`
- `content-invalid`
- `content-parsed`

#### Acceptance criteria
1. The report layer derives an explicit observed-state view before rendering.
2. State derivation rules are explicit and tested:
   - no linked URL → `not-declared`
   - linked URL but no observation record → `not-attempted`
   - `reachable=false` → `fetch-failed`
   - `reachable=true && validJson=false` → `content-invalid`
   - `reachable=true && validJson=true` → `content-parsed`
3. Tests assert the derivation function directly, not only final strings.
4. Declared proof material remains intact when the observed state is negative.

#### Why this is first
Without explicit state derivation, the slice can still collapse into a label layer over raw tuples.
This is the smallest move that makes the operational semantics real in code.

---

### Task 2 — State-first rendering with concise supporting detail
#### Goal
Make the observed section readable at a glance by leading with the state and demoting raw transport detail to secondary context.

#### Scope
Render lines like:
- `proofs: fetch-failed (http 503)`
- `receipts: content-invalid (http 200, invalid JSON)`
- `receipts: content-parsed (http 200)`

instead of raw bundles like:
- `reachable=no, valid JSON=no, http status=503`

#### Acceptance criteria
1. Observed output is rendered as `state (+ context)`.
2. Raw booleans are no longer the primary signal in the report.
3. Tests verify representative rendered lines for:
   - fetch failed
   - content invalid
   - content parsed

#### Why this is second
Once the derivation model exists, this becomes a clean rendering pass instead of another semantic guess.

---

### Task 3 — Neutral undeclared handling + concise invalid-detail tuning
#### Goal
Keep undeclared proof kinds neutral and invalid-content states informative without becoming noisy.

#### Scope
- ensure `not-declared` does not read like failure
- keep `content-invalid` reason detail short and useful
- ensure missing kinds remain comparable without becoming alarming

#### Acceptance criteria
1. `not-declared` renders neutrally.
2. `content-invalid` preserves a short reason such as `invalid JSON` or `unusable structure`.
3. The observed section stays concise for ordinary ENS profiles.

#### Why this is third
Important for legibility, but downstream of the more structural state derivation and rendering work.

## Single next task
# **Build Task 1 — Explicit observed-state view + derivation rules**

### Smallest mergeable slice
Do not overhaul the whole fetch/parsing pipeline.
Just:
- derive explicit observed proof states in the report layer,
- encode the mapping rules directly,
- add direct derivation tests,
- and keep current CLI behavior green.

## What to avoid next
- no label-only rewrite without derivation logic
- no premature wording overhaul beyond the state-first rule
- no changes to declared/inferred boundaries unless required by the observed-state implementation
- no new discovery/capability features

## Bottom line
The next build slice should prove one thing:

> AENS observed proof fetches are now modeled and tested as explicit operational states, not inferred ad hoc from low-level transport fields.
