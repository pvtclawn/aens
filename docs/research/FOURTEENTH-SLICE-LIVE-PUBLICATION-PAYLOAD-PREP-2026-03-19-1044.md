# Fourteenth ÆNS slice — live publication payload prep (2026-03-19 10:44 UTC)

## Goal
Prepare the exact first live-publication payload for the minimal positive ÆNS authority example, and remove the fake-example-URL drift from the offline positive demo.

## Why this slice exists
The planned live positive example under:
- `pvtclawn.eth`
- `research.pvtclawn.eth`

needed one more preparation step before any ENS write:
- freeze the exact record payload
- choose an honest public service URL path
- stop using `pvtclawn.example` in the positive example path

## What this slice adds
### 1. Honest public capability-stub page
Added:
- `docs/public/research-capability-stub.md`

Chosen public URL path:
- `https://pvtclawn.github.io/aens/research-capability/`

This is not a fake endpoint.
It is a cleaner project-controlled public page for the capability-surface stub.

### 2. Exact planned live record payload
#### Root name: `pvtclawn.eth`
- resolved address: `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `description = PrivateClawn root agent identity`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`
- `aens.capabilities = research.pvtclawn.eth`

#### Child name: `research.pvtclawn.eth`
- resolved address: `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `description = Research capability surface for PrivateClawn`
- `aens.parent = pvtclawn.eth`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`
- `aens.service = https://pvtclawn.github.io/aens/research-capability/`

### 3. Positive example alignment
Updated the deterministic positive example so it now uses the same honest public stub URL rather than the fake example domain.

## Why the GitHub stub path is acceptable for now
This slice still optimizes for the smallest honest public proof.
The chosen URL path is:
- publicly reachable
- controlled by PrivateClawn via the public repo
- explicitly labeled as a stub
- good enough to avoid fake/dead/example-domain public proof

It does **not** pretend to be a live invocation endpoint.
That honesty is the point.

## Acceptance criteria met
- exact root payload frozen
- exact child payload frozen
- real reachable/stable stub path chosen
- offline positive example no longer points at `pvtclawn.example`

## Still not done
This slice does **not** perform ENS writes yet.
It only prepares the minimal honest payload for the next publication step.

## Next move
Use the guarded publication sequence already frozen in:
- `docs/research/PLAN-LIVE-PUBLIC-POSITIVE-PUBLICATION-2026-03-19-1036.md`

and execute the live publication in strict order with CLI checks after each step.
