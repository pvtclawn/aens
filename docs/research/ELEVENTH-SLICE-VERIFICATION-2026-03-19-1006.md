# Eleventh-slice verification — AENS fixture-backed positive capability demo (2026-03-19 10:06 UTC)

## Purpose
Verify whether the new fixture-backed positive capability demo materially improves the standalone AENS story, and decide what the next smallest move should be now that the report surface is already stable.

## Checks rerun
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect vitalik.eth --with-links`
- `bun run inspect --example parent-authorized-capability`

## Current evidence
### 1. The positive authority path is now visible from the CLI
The example command renders a complete offline report for `research.pvtclawn.eth` and clearly shows:
- child ENS name
- parent relationship (`pvtclawn.eth`)
- callable service surface present
- `Capability authorization: parent-authorized`
- explicit trust-tier report sections

That means the positive-path authority story is no longer trapped only inside tests or internal helper logic.

### 2. The live negative-path sanity check still holds
The ordinary live check on `vitalik.eth` still renders the expected negative-path behavior:
- strong identity anchor
- profile metadata present
- no callable service surface
- `Capability authorization: not-a-capability-surface`

So the new example path did not blur the distinction between ordinary ENS metadata and an actual callable authorized capability surface.

### 3. The demo is useful, but still obviously synthetic
The new example is deterministic and runnable, which is good.
But it is still a single hardcoded positive path.

That means the repo can now show the happy path, but it still cannot yet show a broader authority classification story without reading tests or source.

## Verdict
The eleventh slice **passes**.

It succeeds at its intended job:
- make the positive parent-authorized capability path visible and runnable from the CLI without waiting on live ENS writes.

This is a real improvement to the standalone AENS story because the project no longer reads as a mostly negative-path ENS trust debugger.

## Remaining limitation
The current example surface is still narrow:
- one built-in positive example
- no equally visible contrasting example for `unlisted-child` or `identity-mismatch`
- no public live positive example yet

So the next bottleneck is no longer trust semantics or report correctness.
It is demo coverage.

## Next-move decision
### Option A — richer example coverage next
**Best next move.**

Add the next smallest set of deterministic example scenarios so a user can see the capability-authority classifier across contrasting cases, not only the happy path.

The most useful additions would be:
- `unlisted-child`
- `identity-mismatch`

Why this is best:
- smallest incremental change
- stays ENS-native and keeps the current CLI flow intact
- improves standalone legibility immediately
- avoids introducing a new non-ENS input pathway too early

### Option B — sample input mode next
Not the best next move.

It may become useful later, but right now it would add a new ingestion path and risk making AENS feel less ENS-load-bearing just as the repo is starting to clarify its core story.

### Option C — real-world public positive example next
Valuable, but not the smallest next move.

That would produce stronger public proof, but it depends on live ENS publication and is therefore a bigger coordination step than the current loop needs right now.

## Chosen next slice
# **Richer example coverage for capability authority states**

### Smallest useful shape
Add deterministic example scenarios that visibly demonstrate at least:
- `parent-authorized`
- `unlisted-child`
- `identity-mismatch`

through the existing `--example` CLI path.

## On-chain decision
No on-chain action needed for this verification pass.
The right next move is still an offchain demo-surface expansion.

## Bottom line
The positive capability demo slice worked.

AENS can now show a real happy path from the CLI.
The next smallest move should make the **contrasting authority states equally legible**, so the project reads like a coherent ENS-native authority model rather than one hardcoded demo plus a pile of tests.
