# Synthesis submission core — ÆNS

## One-line thesis
**ÆNS is the minimal ENS utility for reading root identity state and writing the `aens.*` records that matter.**

## The product truth
ÆNS now has two real surfaces:
- **ENS Root Explorer** — inspect a root ENS identity and its current `aens.*` text records.
- **Write Records** — prepare and submit `aens.capabilities`, `aens.parent`, and `aens.service` writes from a wallet.

Everything else that tried to masquerade as a separate research/discovery product surface has been retired from the **local product model** and should not appear in the submission pitch.

Important honesty boundary:
- do **not** claim those routes are publicly gone unless live public-surface verification proves it

## The problem
Agent/ENS demos often sprawl into speculative surfaces that are harder to explain than the useful core. What operators actually need is simpler:
1. inspect the current ENS truth for a root identity,
2. prepare the missing records cleanly,
3. keep the wallet approval boundary explicit.

## What the current build demonstrates
- live root exploration at `https://aens-nine.vercel.app/`
- live write flow at `https://aens-nine.vercel.app/write-records/`
- explicit planned-write preview before signature
- a disciplined two-surface submission story

## Honest claim
The honest claim is:

> ÆNS gives a clean browser surface for reading root ENS state and preparing the exact `aens.*` writes needed to publish capability metadata.

That is stronger than a vague ENS profile demo.
It is weaker than claiming wallet automation, runtime auth, or production-complete agent infrastructure.

## Judge-facing framing
If explaining this quickly, say:

> "ÆNS stopped pretending to be broader than it is. It now does two useful things well: show the current ENS root state, and prepare the write that fixes it."

## Demo commands
### Public surface check
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run check-public-surface
```

### Truth rule after the check
- if the check confirms legacy routes are gone or redirected cleanly, it is safe to say so
- if not, keep the submission language focused on the explorer + write flow and avoid disappearance claims

## Short submission summary
ÆNS is a deliberately narrow ENS utility. The root explorer lets you inspect current `aens.*` state, the write flow lets you prepare and submit the right text-record changes, and the wallet boundary stays human-controlled instead of being hand-waved away.
