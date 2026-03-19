# Capability-subname authority landscape gap (2026-03-19 21:31 UTC)

## Purpose
Use one narrow external scan to answer a genuinely new product question:

> does the landscape already cover the core ÆNS wedge, or is the differentiated gap still **child capability under parent identity**?

This note is intentionally narrow.
It does **not** reopen the current Vercel/public-surface boundary.
It checks whether the original thesis in `memory/AENS.md` is still the right center:
- ENS must be load-bearing
- `<capability>.<agent>.eth` is core
- the product should not drift into generic discovery or ops-audit tooling

## Sources checked
- ENSIP-25 blog / docs context: `https://ens.domains/blog/post/ensip-25`
- ENSIP-1: `https://docs.ens.domains/ensip/1/`
- ERC-8004 draft: `https://eips.ethereum.org/EIPS/eip-8004`
- x402 Bazaar docs: `https://docs.cdp.coinbase.com/x402/bazaar`

## What each piece covers

### 1) ENSIP-25 covers verified agent ↔ ENS-name association
ENSIP-25 introduces a deterministic text-record link between an ENS name and an onchain agent-registry entry.

That is useful because it gives:
- verified association between an agent identity and an ENS name
- a minimal ENS-native identity confirmation path

But it is still mainly about:
- **agent identity association**

not about:
- a parent ENS identity explicitly authorizing a specific **child capability surface** under its namespace

### 2) ENSIP-1 / ENS itself covers subnames and multiple services
ENSIP-1 clearly supports:
- subnames / subdomains
- multiple services under a single name
- flexible record types whose targets can change over time

That gives the naming substrate ÆNS needs.

But ENSIP-1 itself does **not** define:
- capability authority semantics between parent and child names
- a protocol notion that `research.pvtclawn.eth` is an explicitly authorized capability under `pvtclawn.eth`

It gives the raw namespace and record model, not the authority interpretation layer.

### 3) ERC-8004 covers agent discovery/trust registries
ERC-8004 is about discovering, choosing, and trusting agents through:
- identity registry
- reputation registry
- validation registry

That is important because it gives a broader agent-economy frame.

But it still centers on:
- agent registration and trust registries

not on:
- ENS-native parent/child capability authority
- capability subname semantics inside a human-readable name hierarchy

### 4) x402 Bazaar covers machine-readable endpoint discovery
The Bazaar is explicitly a discovery layer for payable endpoints.
It helps agents and developers:
- find endpoints
- inspect schemas/capabilities
- integrate with x402 services

That is useful because it solves endpoint discoverability.

But it is still about:
- endpoint cataloging and discovery

not about:
- ENS-authorized capability naming
- parent/child authority semantics
- an ENS-native trust surface where the child capability is load-bearing as part of the identity tree

## The gap that still looks real
The landscape pieces are complementary, but the specific gap still appears to be:

### An ENS-native authority model where:
1. a **parent identity name** anchors the agent/project
2. a **child capability subname** represents a specific callable capability surface
3. the system can classify whether that child is actually **authorized by the parent**
4. the proof surface can then layer:
   - machine-verifiable authority
   - observed public state
   - supporting transition evidence when needed

That combination is the actual ÆNS wedge.

## Why this matters
This is a good sign.
It means ÆNS is not merely rebuilding:
- ENSIP-25 identity verification
- generic subname support
- generic agent registries
- generic endpoint catalogs

Instead, it is sitting at their seam and adding a sharper protocol claim:
- **names are not just identities or links; capability subnames can be load-bearing authority surfaces**

## Non-drift implication
This scan also reinforces the recent anti-drift work.
If the differentiated gap is still `child capability under parent identity`, then ÆNS should keep resisting drift toward:
- generic ops-audit tooling
- generic transition logging
- generic endpoint discovery catalogs

Those may remain useful supporting layers.
They are not the center.

## Bottom line
The core wedge still looks right.

The current landscape has:
- identity association
- generic subnames/service records
- agent registries
- endpoint discovery catalogs

What it still does **not** clearly provide is:
- an ENS-native **parent-authorized child capability** model as the primary trust object

That means the original ÆNS thesis in `memory/AENS.md` still appears well-chosen.
