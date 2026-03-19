# Positive-path capability example / demo for AENS (2026-03-19 04:42 UTC)

## Purpose
Define the smallest useful positive-path slice now that the AENS report surface is stable enough.

## Current gap
AENS can already model and test:
- parent-authorized capability surfaces
- unlisted-child cases
- identity mismatch cases
- ordinary ENS negative-path cases

But the live CLI/demo surface still mostly shows:
- ordinary ENS profiles like `vitalik.eth`
- negative-path sanity checks

That means the product still lacks a clear **positive authorized capability demo** outside unit tests.

## Wrong next moves
### 1. Live ENS writes first
Too heavy.
That would add operational and ownership complexity before the product even has a deterministic positive demo path.

### 2. README-first documentation blast
Too soft.
The repo needs an executable positive path, not just prose about one.

### 3. More report polishing first
Too late.
The report surface is now strong enough to support a demo.

## Best next slice
# **Fixture-backed positive capability demo path**

## Smallest useful shape
Add a deterministic example flow that lets the CLI/report show a parent-authorized capability surface without needing live ENS writes.

### Recommended implementation shape
1. Create a small example/fixture module containing:
   - parent profile
   - capability child profile
   - authorization result
   - optional linked proof example if useful

2. Add a CLI entry path such as one of:
   - `bun run inspect --example parent-authorized-capability`
   - `bun run demo parent-authorized-capability`
   - equivalent minimal flag/subcommand

3. Reuse the current report surface to render the example exactly as a user would see it.

4. Keep the example deterministic and offline.

## Why this is the best next move
- it turns the current positive-path test logic into a visible product demo
- it avoids waiting on live ENS writes or external state
- it gives AENS a clear “happy path” artifact
- it keeps the slice small and mergeable

## Acceptance criteria
1. A user can run one CLI command and see a **parent-authorized capability** report.
2. The demo path is deterministic and does not require network resolution.
3. The output clearly shows:
   - capability authorization: `parent-authorized`
   - parent/child relationship
   - capability authority section
   - trust-tier report structure
4. Tests cover the demo/fixture path.
5. The slice does not depend on live ENS ownership or new onchain writes.

## Good boundary for the slice
### Include
- example fixture data
- one CLI/demo path
- tests
- maybe one small research/demo note update if needed

### Exclude
- live ENS writes
- deployment scripts
- onchain publication
- broad docs/marketing push
- new trust semantics unrelated to the demo path

## Optional follow-up after this slice
Once the fixture-backed demo exists, the next step could be:
- a real-world public example
- or a local sample config/JSON input mode
- or eventually a live ENS-backed positive example

But not before the deterministic demo exists.

## Bottom line
The smallest meaningful next move is:

> **turn the already-tested positive capability path into a deterministic CLI demo path.**

That gives AENS a visible happy path instead of proving only what can go wrong or what ordinary ENS profiles are not.
