# Plan — live public positive publication for AENS (2026-03-19 10:36 UTC)

## Purpose
Turn the live-positive-path target plus red-team guardrails into a guarded execution plan for the first real public AENS authority example.

## Context
AENS already has:
- stable ENS-native CLI/report flow
- deterministic contrasting authority examples
- a README that explains the product truth

The next meaningful move is one live public `parent-authorized` path.
But the challenge note showed that a technically correct publication can still fail as public proof if:
- the service URL looks fake or dead
- the identity surface is too empty
- the rollout happens in a flaky order
- artifact capture is weak

## Chosen target
- root: `pvtclawn.eth`
- child: `research.pvtclawn.eth`

## Plan shape
### Task 1 — freeze the public surface before any ENS write
Publish nothing until the exact public-facing surface is credible.

#### Required decisions
1. **Child service URL**
   - must be either:
     - a real reachable endpoint, or
     - a clearly owned/stable capability-stub page under PrivateClawn control
   - must **not** be an example/fake/dead URL
2. **Exact root record payload**
   - resolved address
   - `aens.agentId = 1391`
   - `aens.runtime = openclaw-gateway`
   - `description = PrivateClawn root agent identity` (recommended, treated as required for this public slice)
3. **Exact child record payload**
   - resolved address
   - `aens.parent = pvtclawn.eth`
   - `aens.agentId = 1391`
   - `aens.runtime = openclaw-gateway`
   - `aens.service = <real/stable URL>`
   - `description = Research capability surface for PrivateClawn` (recommended, treated as required for this public slice)

#### Acceptance criteria
- the exact URL is frozen
- exact root/child record values are frozen
- if no credible URL exists yet, **do not publish ENS records yet**; build the smallest honest capability-stub page first

---

### Task 2 — publish in strict sequence with checkpoint verification
Do not batch-write blindly.
Publish in the smallest order that avoids contradictory public states.

#### Ordered sequence
1. **Confirm writable path** for `pvtclawn.eth` and child subname creation
2. **Publish root base fields first**
   - address
   - description
   - `aens.agentId`
   - `aens.runtime`
3. **Create/publish child subname with resolver/address**
4. **Publish child fields**
   - description
   - `aens.parent`
   - `aens.agentId`
   - `aens.runtime`
   - `aens.service`
5. **Publish parent capability list last**
   - `aens.capabilities = research.pvtclawn.eth`

#### Why this order
- root identity becomes legible before the child is presented as official
- child exists before the parent authorizes it
- final parent capability list flips the public state into the desired `parent-authorized` result only after the child is real and coherent

#### Acceptance criteria
After each step, rerun the relevant CLI check and only continue if the output is coherent.

##### Step checkpoints
- after root fields: `bun run inspect pvtclawn.eth` shows a non-empty identity anchor
- after child subname/resolver: `bun run inspect research.pvtclawn.eth` resolves as a real name, even if not yet authorized
- after child fields: child shows service/runtime/parent linkage
- after parent capability list: child must render `Capability authorization: parent-authorized`

---

### Task 3 — capture proof artifacts and honest scope language
The publication does not count if the state exists but the proof trail is weak.

#### Required artifacts
- final CLI output snapshot for:
  - `bun run inspect pvtclawn.eth`
  - `bun run inspect research.pvtclawn.eth`
- exact commands used for final verification
- any ENS update references / tx hashes available from the publication path
- repo-side verification note after publication

#### Scope language rule
The verification artifact must say clearly:
- this proves one live public ENS-backed authority path
- this does **not yet** prove invocation, payment, or broad ecosystem adoption

#### Acceptance criteria
- proof artifact exists in repo docs or equivalent committed surface
- final note is explicit about both what was proven and what was not proven

## Smallest milestone to merge next
# **Prepare the exact publication payload and credible service URL path.**

That is the smallest useful milestone because it removes the biggest risk before any public ENS write:
- fake-looking service surface
- ad hoc record values
- messy rollout order

## Next task
If a real/stable child URL already exists:
- freeze the exact root/child record payloads in a publication-prep artifact and move straight to the write sequence

If a real/stable child URL does **not** exist yet:
- build the smallest honest capability-stub page under PrivateClawn control first, then freeze the record payloads

## Bottom line
The next build slice should optimize for:

> **credible public publication readiness, not just the fastest route to a green `parent-authorized` line.**
