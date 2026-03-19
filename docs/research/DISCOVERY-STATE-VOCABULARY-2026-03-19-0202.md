# Discovery-state vocabulary for AENS (2026-03-19 02:02 UTC)

## Purpose
Define the smallest discovery-state vocabulary that fixes the live semantics bug exposed by the fourth-slice verification:

- `Discovery surface present: yes`
- while `Capability authorization: not-a-capability-surface`

The next build slice should use this vocabulary instead of the current over-broad discovery boolean.

## Problem statement
The current `hasDiscoverySurface()` boolean is too generous because it treats all of these as one class:
- resolved address
- primary URL
- service URL
- proofs URL
- receipts URL

That collapses several different realities into one optimistic statement.

Example: `vitalik.eth`
- clearly has an ENS identity anchor
- clearly has profile metadata richness
- does **not** currently expose an agent capability authority surface
- does **not** necessarily expose a callable agent service surface

Yet the current output says `Discovery surface present: yes`.

## Minimal vocabulary

### 1. Identity anchor
**Question:** does this ENS name resolve to a meaningful identity anchor?

**Meaning:**
- resolved address and/or
- other ENS-native records resolved directly on the queried name

**Why it exists:**
This is the strongest baseline statement AENS can make for ordinary ENS names.

**Rule:**
A plain ENS identity should be able to score positive here **without** implying callable services or authority.

---

### 2. Profile metadata richness
**Question:** does this ENS name expose descriptive metadata?

**Includes:**
- primary URL
- avatar
- description
- social handles

**Why it exists:**
These fields are informative, but they are not the same as service discovery.

**Rule:**
Profile metadata must **not** be allowed to imply callable service discovery by itself.

---

### 3. Callable service surface
**Question:** does this ENS name declare an actual callable service endpoint?

**Includes:**
- `serviceUrl`

**Why it exists:**
This is the smallest honest meaning of “discovery” in an agent/service context.

**Rule:**
A generic website URL (`url`) is **not** enough.
Only an explicit service surface should turn this positive.

---

### 4. Proof surface
**Question:** does this ENS name declare proof/receipt material?

**Includes:**
- `proofsUrl`
- `receiptsUrl`

**Why it exists:**
A proof surface is useful and trust-relevant, but it is not the same thing as a callable surface or authority surface.

**Rule:**
Proof surface positivity must stay independent of service discovery and capability authority.

---

### 5. Capability authority
**Question:** if this looks like a capability surface, what is its authority status?

**Current vocabulary already exists:**
- `parent-authorized`
- `unlisted-child`
- `identity-mismatch`
- `not-a-capability-surface`

**Why it exists:**
This is the authority-bearing layer that most directly makes ENS load-bearing.

**Rule:**
Capability authority should be reported as its own explicit line/state, never folded into a generic discovery boolean.

## Recommended output model
Replace the single line:
- `Discovery surface present: yes/no`

With a small state block:
- `Identity anchor present: yes/no`
- `Profile metadata present: yes/no`
- `Callable service surface present: yes/no`
- `Proof surface present: yes/no`
- `Capability authorization: <status>`

## Why this is enough
This is deliberately smaller than a full trust-tier report remodel.
It fixes the immediate semantics contradiction while preserving room for later work:
- trust-tier provenance labels
- corroboration-aware proof language
- richer capability models

## Explicit semantic rules for the next build slice
1. `url` must stop contributing to callable discovery.
2. `address` must not imply callable service discovery.
3. `proofsUrl` / `receiptsUrl` must not imply callable discovery.
4. `capability authorization` must stay independent from generic profile richness.
5. Ordinary ENS profiles like `vitalik.eth` should read roughly as:
   - identity anchor: yes
   - profile metadata: yes
   - callable service surface: no
   - proof surface: no
   - capability authorization: not-a-capability-surface

## Next build acceptance criteria
1. Remove or retire the current broad `hasDiscoverySurface()` usage from report output.
2. Add explicit state lines for identity anchor, profile metadata, callable service surface, proof surface, and capability authority.
3. Update tests to cover an ordinary ENS profile where metadata richness no longer implies service discovery.
4. Keep the existing capability-authorization model intact.

## Design rationale — avoid boolean blindness
A supporting software-design lesson from `books_and_papers/003_solid_software.pdf`:
- booleans should ask a real yes/no question,
- avoid misleading names,
- and promote domain variants/state machines instead of compressing non-binary concepts into a single flag.

Applied to AENS:
- `hasDiscoverySurface()` is too lossy for the actual domain,
- because discovery here is not one binary state,
- it is a compact set of distinct trust/discovery states.

That means the next build slice should promote discovery from a boolean helper into a small explicit state model.

## Bottom line
The next build slice should not try to make the report more beautiful.
It should make the report **more honest** by separating:
- identity,
- metadata,
- service discovery,
- proof surface,
- and authority.
