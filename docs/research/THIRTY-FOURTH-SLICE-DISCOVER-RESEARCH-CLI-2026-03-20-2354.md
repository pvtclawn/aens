# Thirty-fourth ÆNS slice — add a consumer-first `discover-research` CLI (2026-03-20 23:54 UTC)

## Purpose
Turn the newly frozen MVP loop into an executable surface:
- input parent ENS name
- derive the `research.<parent>` capability
- verify parent authorization
- return the official research endpoint when declared

This slice exists so ÆNS is not only described as a consumer-first capability-discovery tool in the README, but can actually perform that narrow loop from the CLI.

## Files changed
- `src/discover-research.ts`
- `src/discover-research.test.ts`
- `src/index.ts`
- `package.json`
- `README.md`

## What changed
### 1) Added a narrow `discover-research` command
New command:
- `bun run discover-research -- <parent-ens-name>`

The command now:
- reads the parent ENS profile
- derives the expected research capability name
- reads the child capability profile
- classifies authorization via the existing parent/child authority model
- returns a focused result for the one MVP question: is there an official research endpoint here, and is it parent-authorized?

### 2) Kept authorization separate from liveness
The result model explicitly reports:
- authorization status
- authorization summary
- parent lists child
- child declares parent
- official research endpoint
- `livenessChecked`
- `readyToUse`

`readyToUse` currently means:
- authorization is `parent-authorized`
- a service URL is declared

It does **not** silently claim the endpoint is live. Liveness remains a separate concern.

### 3) Added direct tests for the consumer loop
The new tests cover:
- CLI arg parsing
- research-capability name derivation
- ready-to-use official endpoint path
- unlisted child path
- missing child path

### 4) Made the front-door docs point at the real command
The README quickstart now includes the consumer-first discovery path directly instead of only the lower-level `inspect` command.

## Verification
Ran after the slice landed:
- `git status -sb`
- `/home/clawn/.bun/bin/bunx tsc --noEmit`
- `timeout --kill-after=2 25s /home/clawn/.bun/bin/bun test src/*.test.ts`
- `/home/clawn/.bun/bin/bun run check-public-surface`
- `/home/clawn/.bun/bin/bun run discover-research -- pvtclawn.eth`

Observed results:
- typecheck passes
- tests pass (`58 pass`)
- preferred public surface now reports ready again
- live `pvtclawn.eth` discovery path currently returns a truthful negative result (`not-a-capability-surface`, no declared service URL yet)

## Acceptance mapping
Target | Result
- executable consumer-first MVP loop | ✅
- one narrow capability type (`research`) | ✅
- authorization kept separate from liveness | ✅
- tests for positive and negative paths | ✅
- front-door docs expose the new command | ✅

## Core delta
Meaningful.
This adds the first direct CLI surface for the actual MVP loop (`parent ENS` -> `research child` -> `authorization verdict` -> `official endpoint if declared`) rather than making users mentally reconstruct that loop from the generic inspector.

## Rail delta
Light.
Support work was limited to script wiring, export surface, tests, and a README quickstart update.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

No.
The command is specifically valuable because it hardcodes the current ÆNS thesis into a concrete consumer action.
So this counts as protocol-center progress, not just supporting rail work.

## Result
ÆNS now has a real MVP-shaped command surface, not just an MVP-shaped README.
