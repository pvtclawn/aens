# Tenth-slice verification — AENS declared/observed consistency guard (2026-03-19 04:37 UTC)

## Purpose
Verify whether the new declared/observed consistency guard actually strengthens the standalone AENS thesis and decide whether the report surface still needs meaningful cleanup.

## Checks rerun
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect vitalik.eth --with-links`
- direct guard-predicate inspection for:
  - empty declared view + all `not-declared`
  - non-empty declared view + all `not-declared`
  - empty declared view + mixed observed states

## Current evidence
### 1. The guard is now explicit, not incidental
The collapsed undeclared observed summary is no longer merely “safe because current derivation happens to make it safe.”

It now depends on an explicit cross-view predicate requiring:
- fully empty declared proof view
- and all observed proof states equal to `not-declared`

That is exactly the hardening this slice was meant to add.

### 2. Live ordinary ENS output remains clean
For `vitalik.eth`, the observed section still renders the quiet neutral summary instead of repeating per-kind `not-declared` lines.

That means the hardening did not regress the readability win from the previous slice.

### 3. Mixed/contradictory cases are now blocked correctly
The new tests prove collapse is forbidden when:
- any declared proof URL exists
- observed states are mixed

So the collapsed summary is now explicitly protected against the main contradiction/over-collapse failure modes.

## Verdict
The tenth slice **passes**.

It succeeds at what it was supposed to do:
- turn the collapsed undeclared summary into an explicit cross-view invariant.

At this point, the AENS report surface looks **stable enough to move on**.
The remaining renderer work is minor polish, not a missing trust-semantic layer.

## What this means
The recent report hardening sequence has now achieved its main goals:
- sharper discovery semantics
- trust-tier section model
- clean proof-boundary split
- explicit observed-state model
- neutral undeclared collapse
- declared/observed consistency guard

That is enough to stop treating the report as the main bottleneck.

## Next-slice decision
### Option A — more renderer polish next
Low priority.
Possible, but no longer the best use of the loop.

### Option B — positive-path capability example / demo next
Best next move.

AENS still lacks a strong end-to-end positive example that shows:
- a capability surface
- parent authorization
- and how the report reads when the system finds a genuinely positive authority path

Right now the live CLI checks are mostly anchored on ordinary ENS names like `vitalik.eth`, which are useful negative-path sanity checks but not the whole product story.

## Chosen next slice
# **Positive-path capability example / demo**

### Smallest useful shape
Create the smallest reproducible example path that lets AENS demonstrate a parent-authorized capability surface clearly, likely through:
- a local fixture/example profile pair,
- or a documented sample flow the CLI/tests can render deterministically.

### Why this is next
- the report surface is now strong enough
- the next trust/product gap is showing the positive case clearly
- this would make AENS feel less like a negative-path debugger only

## On-chain decision
No on-chain action needed for this verification pass.
The next useful move is still an offchain example/demo slice.

## Bottom line
The consistency-guard slice worked.

The report surface is now stable enough to move on.
The next meaningful work should demonstrate a **positive authorized capability path**, not keep sanding the same report edges.
