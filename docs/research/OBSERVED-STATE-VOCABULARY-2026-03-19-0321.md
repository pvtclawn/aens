# Observed-state vocabulary for AENS proof fetches (2026-03-19 03:21 UTC)

## Purpose
Define the smallest observed-state vocabulary needed to fix the remaining semantics gap in the proof report.

Current problem:
- the proof-boundary split is now clean,
- but the observed section still compresses too many operational states into one flat line.

Examples of current output:
- `proofs: reachable=no, valid JSON=no, http status=503`
- `receipts: reachable=yes, valid JSON=no, http status=200`

These are technically useful, but they still force the reader to infer too much.

## Problem statement
The observed section should answer one question clearly:

> What happened when AENS tried to fetch the declared proof material?

Right now the section reports raw fields, but not a crisp state vocabulary.
That leaves avoidable ambiguity between:
- no proof material declared,
- fetch not attempted,
- fetch failed,
- fetch succeeded but content invalid,
- fetch succeeded and content parsed.

## Minimal observed-state vocabulary

### 1. `not-declared`
**Meaning:** there is no linked proof material of this kind declared on the ENS profile.

**When to use:**
- no `proofsUrl` for proofs
- no `receiptsUrl` for receipts

**Example line:**
- `proofs: not declared`

**Rule:**
This is not a fetch failure. It is the absence of a declared link.

---

### 2. `not-attempted`
**Meaning:** linked proof material exists, but this report did not attempt a fetch.

**When to use:**
- inspection path omitted link fetching
- a future mode intentionally suppresses fetches

**Example line:**
- `receipts: fetch not attempted`

**Rule:**
This is operationally different from a failure.

---

### 3. `fetch-failed`
**Meaning:** a fetch was attempted, but the runtime could not successfully retrieve usable content.

**When to use:**
- network error
- timeout
- non-2xx HTTP response
- transport-layer failure

**Example lines:**
- `proofs: fetch failed (http 503)`
- `receipts: fetch failed (network timeout)`

**Rule:**
This should remain an observed/runtime fact only. It does not weaken declared proof material itself.

---

### 4. `content-invalid`
**Meaning:** a fetch succeeded enough to return content, but the content was not usable for parsing.

**When to use:**
- HTTP 200 but invalid JSON
- reachable response, but unusable structure

**Example lines:**
- `receipts: content invalid (http 200, invalid JSON)`
- `proofs: content invalid (http 200, unusable structure)`

**Rule:**
This is stronger than `fetch-failed` because some content was retrieved, but weaker than parsed content.

---

### 5. `content-parsed`
**Meaning:** a fetch succeeded and the content was usable enough for AENS to parse and infer structure.

**When to use:**
- reachable
- valid JSON
- parser reached the inference layer

**Example lines:**
- `receipts: content parsed (http 200)`
- `proofs: content parsed (http 200)`

**Rule:**
This state only says parsing was possible. It does not imply verification.
Interpretive meaning still belongs in the inferred section.

## Recommended observed view shape
The report layer should derive an observed view roughly like:

```ts
{
  kind: 'proofs' | 'receipts'
  state: 'not-declared' | 'not-attempted' | 'fetch-failed' | 'content-invalid' | 'content-parsed'
  status: number | null
  detail: string | null
}
```

Where:
- `state` carries the primary semantics
- `status` carries raw HTTP context when available
- `detail` carries a short operational explanation when useful

## Presentation rule — primary signal first
Observed output should render as:
- `state (+ supporting detail)`

not as:
- raw boolean/status bundles that force the reader to infer the state.

Examples:
- `proofs: fetch-failed (http 503)`
- `receipts: content-invalid (http 200, invalid JSON)`
- `receipts: content-parsed (http 200)`

That keeps the observed layer human-shaped: the operational conclusion comes first, and the transport detail remains secondary context.

## Mapping guidance from current data
Given current inputs:
- no linked URL for kind → `not-declared`
- linked URL exists but no fetch record → `not-attempted`
- `reachable=false` → `fetch-failed`
- `reachable=true && validJson=false` → `content-invalid`
- `reachable=true && validJson=true` → `content-parsed`

## Design rationale — observed state should be a state machine
A supporting software-design lesson from `books_and_papers/003_solid_software.pdf` and `books_and_papers/006_think_distributed_systems.pdf`:
- distinct domain variants should be modeled explicitly,
- and runtime observations are local operational facts, not just low-level field bundles.

Applied to AENS:
- the current `reachable/validJson/status` tuple is implementation-shaped,
- but the report is trying to answer a human domain question:
  - what happened when AENS tried to fetch this proof material?

That means the observed layer should expose one explicit fetch state plus supporting detail, not force readers to decode meaning from raw booleans.

## Acceptance criteria for the next build slice
1. Observed proof output uses explicit state labels rather than only raw boolean/status bundles.
2. The report distinguishes absent declaration from failed fetch.
3. The report distinguishes invalid content from successful parsed content.
4. Declared proof material remains intact when fetches fail.
5. Tests cover at least:
   - not declared
   - fetch failed
   - content invalid
   - content parsed
6. The report layer models observed proof fetches as an explicit state enum/variant with supporting detail, rather than using raw booleans/status as the primary semantics.

## Why this is the next smallest move
The proof-boundary model is already in place.
The remaining ambiguity is now concentrated in the observed section.
So the next best move is to make that operational layer speak clearly.

## Bottom line
The next slice should make observed proof fetches answer a human question cleanly:

> **Was proof material absent, skipped, unreachable, invalid, or successfully parsed?**
