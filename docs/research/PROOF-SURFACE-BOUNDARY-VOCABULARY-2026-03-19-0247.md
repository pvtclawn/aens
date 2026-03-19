# Proof-surface boundary vocabulary for AENS reports (2026-03-19 02:47 UTC)

## Purpose
Define the smallest vocabulary needed to tighten the remaining proof-surface boundary leak in the trust-tier report.

Current leak:
- the declared proof section still includes interpretive summary text such as
  - `receipts document matches a signed receipt-like object with all core fields present`

That wording is not purely declared material.
It is already parsed and interpreted.

## Problem statement
The trust-tier section model now exists, but proof-related lines still mix three different evidence classes:
1. what the ENS profile explicitly links to,
2. what the runtime fetch observed right now,
3. what AENS inferred by parsing the fetched content.

The next slice should separate those cleanly.

## Minimal proof-surface boundary vocabulary

### 1. Declared proof material
**Tier label:** `declared`
**Source label:** `linked-doc`

**What belongs here:**
- `Proof surface present: yes/no`
- `Proofs URL: ...`
- `Receipts URL: ...`
- short statement that linked proof material is declared or absent

**Meaning:**
This tier answers:
- what proof-related material is explicitly linked from the ENS profile?

**Rule:**
This section should not contain interpretation of fetched content.
If a linked doc has never been fetched successfully, this section can still remain truthful.

**Allowed examples:**
- `Proof surface present: yes`
- `Proofs URL: https://...`
- `Receipts URL: https://...`
- `Linked proof material declared via ENS-linked URLs.`

**Not allowed here:**
- shape classification
- receipt-like summaries
- key counts / item counts
- core field deductions
- valid JSON / reachability status

---

### 2. Live observations
**Tier label:** `observed`
**Source label:** `live-fetch`

**What belongs here:**
- reachable yes/no
- valid JSON yes/no
- HTTP status / usability now
- fetch succeeded / failed / unavailable now

**Meaning:**
This tier answers:
- what did the runtime observe right now when it tried to fetch the declared material?

**Rule:**
This section should talk about current fetch behavior, not about semantic meaning of the content.

**Allowed examples:**
- `receipts: reachable=yes, valid JSON=yes, http status=200`
- `proofs: reachable=no, valid JSON=no, http status=503`

**Not allowed here:**
- receipt-like labels
- proof strength
- core field summaries
- key counts as semantic evidence

---

### 3. Inferred proof interpretation
**Tier label:** `inferred`
**Source label:** `inference`

**What belongs here:**
- shape classification
- proof strength
- summary text derived from parsing
- key counts / item counts
- core fields present / missing
- any field-based deductions

**Meaning:**
This tier answers:
- given the fetched content, what does AENS currently infer about its structure?

**Rule:**
This section is where parsed/derived meaning belongs.
It must remain clearly weaker than anchored/authorized facts and distinct from mere fetch success.

**Allowed examples:**
- `receipts: shape=battle-receipt, proof strength=signed-receipt`
- `receipts: summary=matches a signed receipt-like object with all core fields present`
- `receipts: key count=3`
- `receipts: core fields present: payload, signature, receiptHash, payload.agentId`

## Migration guidance for current fields
### Move out of declared section
These should leave `Linked proof material [declared | linked-doc]`:
- `receipts: receipts document matches a signed receipt-like object with all core fields present`
- `receipts key count: 3`
- receipt-list / proof-list semantic summaries

### Keep in observed section
- `reachable=yes/no`
- `valid JSON=yes/no`
- `http status=...`

### Move into inferred section
- `shape=...`
- `proof strength=...`
- summary text from `LinkedRecordSummary.summary`
- `item count`
- `key count`
- `core fields present/missing`

## Acceptance criteria for the next build slice
1. Declared section contains only presence + URL-level proof declarations.
2. Observed section contains only fetch/runtime state.
3. Inferred section contains all parsed/derived content interpretation.
4. A synthetic linked-proof test proves the summary text is no longer present in the declared section.
5. A failed fetch still leaves declared proof material intact while degrading only the observed section.

## Why this is the next smallest move
The trust-tier model is already in place.
This slice tightens the most important remaining semantics leak without expanding scope.

## Bottom line
The next build slice should make proof material obey the same rule as the rest of the report:

> **declared is what was linked, observed is what happened now, inferred is what AENS concluded from parsing.**
