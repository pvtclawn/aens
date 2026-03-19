# Thirteenth-slice verification — AENS README / demo-surface cleanup (2026-03-19 10:23 UTC)

## Purpose
Verify whether the new top-level README actually makes AENS self-explanatory from the repo surface, and decide what the next smallest move should be now that the project has both CLI coverage and an explicit entrypoint.

## Checks rerun
- `git status -sb`
- `ls README.md`
- `bun test`
- `bunx tsc --noEmit`
- `bun run inspect vitalik.eth`
- `bun run inspect vitalik.eth --with-links`
- `bun run inspect --example parent-authorized-capability`
- `bun run inspect --example unlisted-child-capability`
- `bun run inspect --example identity-mismatch-capability`

## Current evidence
### 1. The repo surface now matches the product surface
The repo is clean, `README.md` exists at the root, and the commands the README tells a user to run all work as documented.

That means the README is not just marketing copy layered on top of a stale or fragile command surface.

### 2. The README now explains the real current product truth
The new root README clearly states that AENS is currently:
- an ENS-native CLI trust debugger for agent profiles and capability subnames
- not yet a full invocation/payment protocol

It also explains:
- which ENS records AENS reads today
- how to interpret the capability-authority states
- what is implemented now
- what is not yet implemented

That materially improves standalone legibility because a reader no longer has to infer the product from chat history or research notes.

### 3. The README quickstart is grounded in working commands
The live ordinary ENS command works:
- `bun run inspect vitalik.eth`

The optional linked-proof command works:
- `bun run inspect vitalik.eth --with-links`

The three deterministic example commands also work:
- `parent-authorized-capability`
- `unlisted-child-capability`
- `identity-mismatch-capability`

So the README now points at a real, runnable demo surface rather than a theoretical one.

### 4. The next bottleneck is no longer repo explanation
The repo now has:
- clear project truth
- quickstart commands
- authority-state explanations
- explicit product boundaries

That means one more README-polish pass is no longer the best next move.
The main remaining gap is stronger **public proof**: a live positive example that shows the authority model on an actual published ENS surface rather than only on deterministic fixtures.

## Verdict
The thirteenth slice **passes**.

It succeeds at its intended job:
- make AENS self-explanatory from the repo surface without overclaiming unfinished protocol features.

## Next-move decision
### Option A — sample input mode next
Not the best next move.

It would add a second non-ENS input pathway just after the repo finally became legible through the ENS-native flow.
That risks weakening ENS as the load-bearing surface.

### Option B — one more README/demo polish pass
Low value.

Possible later, but no longer the bottleneck.
The repo is already understandable enough to move on.

### Option C — live public positive example next
**Best next move.**

This is now the smallest step that most strengthens AENS’s public proof story.
The project can already explain itself and demonstrate the model offline; the next gain comes from showing the same model against an actual published ENS positive path.

## Chosen next slice
# **Freeze the minimal live public positive example path**

### Smallest useful shape
Define the exact minimum live publication target for one publicly resolvable positive capability example, including:
- which ENS root + child names are involved
- which `aens.*` records must exist
- which authority state must render
- what proof artifact (screenshot/CLI output/link) counts as success
- what can remain fixture-backed vs what must be truly live

## On-chain decision
No on-chain action taken in this verification pass.
The next move is still offchain planning for a live ENS-backed public example.

## Bottom line
The README/demo-surface cleanup worked.

AENS is now understandable from the repo surface.
The next smallest meaningful move is to turn the current offline positive story into one **live public ENS-backed positive example**, not to add another input mode or keep polishing prose.
