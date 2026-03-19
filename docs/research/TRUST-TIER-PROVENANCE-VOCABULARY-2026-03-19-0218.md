# Trust-tier / provenance vocabulary for AENS reports (2026-03-19 02:18 UTC)

## Purpose
Define the smallest trust-tier vocabulary that fixes the next remaining report problem:

> AENS now has more honest discovery semantics, but it still presents trust material in a mostly flat linear dump with implicit provenance.

The next build slice should use this vocabulary to reorganize report output without yet attempting full proof corroboration.

## Problem statement
Current report output now correctly distinguishes:
- identity anchor
- profile metadata
- callable service surface
- proof surface
- capability authority

That fixed the discovery semantics bug.

But the report still makes the user visually stitch together very different evidence classes:
- ENS facts
- parent authority facts
- linked-document material
- live fetch observations
- inferred proof-shape claims

This still creates avoidable trust ambiguity.

## Minimal trust tiers

### 1. Identity anchor
**Tier label:** `anchored`
**Primary source label:** `ens`

**What belongs here:**
- queried ENS name
- resolved address
- ENS-native profile records
- identity/profile state lines

**Meaning:**
These are the baseline facts anchored directly to the queried ENS name.

**Rule:**
This section should stay stable even if linked fetches fail.

---

### 2. Capability authority
**Tier label:** `authorized`
**Primary source label:** `parent-ens`

**What belongs here:**
- capability authorization status
- parent name
- listed-by-parent status
- identity-matches-parent status

**Meaning:**
These facts describe whether a capability surface is actually authorized by its parent ENS identity.

**Rule:**
This section should be visually distinct from generic ENS profile richness.

---

### 3. Linked proof material
**Tier label:** `declared`
**Primary source label:** `linked-doc`

**What belongs here:**
- proofs URL / receipts URL
- linked proof summaries
- JSON structure summaries
- declared proof/document surfaces

**Meaning:**
Useful trust material exists, but it remains externally declared until corroborated.

**Rule:**
Do not let this section sound stronger than the underlying provenance permits.

---

### 4. Live observations
**Tier label:** `observed`
**Primary source label:** `live-fetch`

**What belongs here:**
- endpoint reachable / unreachable
- response retrieved now
- status codes
- fetch-time availability

**Meaning:**
These are runtime observations, not durable identity truths.

**Rule:**
A failed fetch should degrade this section only, not the identity-anchor section.

---

### 5. Inferred claims and caveats
**Tier label:** `inferred`
**Primary source label:** `inference`

**What belongs here:**
- receipt-like shape interpretations
- proof-strength heuristics
- caveats about missing corroboration

**Meaning:**
These are useful interpretations, but not cryptographic verification.

**Rule:**
Never use `verified` language here unless a later slice adds real corroboration.

## Recommended report structure
The next build slice should organize output as sections like:

1. **Identity anchor** `[anchored | ens]`
2. **Capability authority** `[authorized | parent-ens]`
3. **Linked proof material** `[declared | linked-doc]`
4. **Live observations** `[observed | live-fetch]`
5. **Inferred claims / caveats** `[inferred | inference]`

## Minimal output rule
The next slice does **not** need per-line metadata objects or a new JSON API.
The smallest useful move is enough:
- section heading includes tier + source labels
- lines under the section inherit that meaning
- current flat lines are moved into the correct section

Example heading styles:
- `Identity anchor [anchored | ens]`
- `Capability authority [authorized | parent-ens]`
- `Linked proof material [declared | linked-doc]`

## Specific migration guidance for current report fields
### Move into Identity anchor
- resolved address
- agent ID
- runtime
- description
- primary URL
- avatar
- socials
- identity/profile state lines

### Move into Capability authority
- capability authorization
- capability authority summary
- listed by parent
- identity matches parent
- parent name
- declared capabilities

### Move into Linked proof material
- proofs URL
- receipts URL
- linked proof summaries

### Move into Live observations
- reachable yes/no
- valid JSON yes/no
- status-code-derived usability notes

### Move into Inferred claims / caveats
- proof strength
- receipt-like shape summaries
- missing-core-field caveats

## Acceptance criteria for the next build slice
1. Report output is grouped into explicit trust sections.
2. Each section has a tier/source heading.
3. `vitalik.eth` still reads honestly under the new structure.
4. Linked proof details no longer appear as just another flat block under generic profile output.
5. Inferred proof-strength language is visually separated from anchored/authorized facts.

## Why this is the next smallest move
This is smaller than full proof-language reform but strong enough to change how the product reads.
It makes the current discovery/authority work legible instead of leaving it flattened into one dump.

## Bottom line
The next slice should not add more facts.
It should make the existing facts **legible by provenance and trust tier**.
