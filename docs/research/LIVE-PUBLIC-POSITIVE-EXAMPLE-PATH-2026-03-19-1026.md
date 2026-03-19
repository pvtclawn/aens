# Live public positive example path for AENS (2026-03-19 10:26 UTC)

## Purpose
Freeze the smallest live public-proof slice now that AENS already has:
- a stable ENS-native CLI/report flow
- deterministic contrasting authority examples
- a repo surface that explains the current product truth

The next meaningful gain is no longer another local example or another input mode.
It is one **real ENS-backed positive authority path** that the public CLI can resolve.

## Current live-state check
Reran live checks against the obvious owned namespace targets:
- `bun run inspect pvtclawn.eth`
- `bun run inspect research.pvtclawn.eth`
- `bun run inspect ops.pvtclawn.eth`

### Current result
All three currently render as effectively empty:
- resolved address: not set
- agent ID: not set
- runtime: not set
- service URL: not set
- parent/capabilities: not set
- authority status: `not-a-capability-surface`

## What this means
There is no existing public positive path to polish.
The next slice really does need to create one.

## Best target namespace
# **Primary target: `pvtclawn.eth` + `research.pvtclawn.eth`**

Why this is best:
- already matches the deterministic demo path and repo story
- already matches PrivateClawn identity memory (`agentId` 1391)
- smallest cognitive diff between offline demo and live public proof
- avoids introducing a second brand/new name just for demo purposes

## Minimal live publication goal
Publish the smallest real ENS state that allows:
```bash
bun run inspect research.pvtclawn.eth
```
to render a genuine live:
- `Capability authorization: parent-authorized`
- callable service surface present
- parent/child relationship
- matching parent/child agent identity

## Minimum records required
### On `pvtclawn.eth`
Required minimum:
- resolved address set
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`
- `aens.capabilities = research.pvtclawn.eth`

Strongly recommended for legibility:
- `description = PrivateClawn root agent identity`

### On `research.pvtclawn.eth`
Required minimum:
- subname exists and resolves
- resolved address set
- `aens.parent = pvtclawn.eth`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`
- `aens.service = <real reachable service URL>`

Strongly recommended for legibility:
- `description = Research capability surface for PrivateClawn`

## What is explicitly *not* required for this slice
To keep the slice minimal, do **not** require yet:
- `aens.proofs`
- `aens.receipts`
- live proof JSON publication
- payment flow
- invocation/auth implementation
- additional capability subnames
- a second public positive example

This slice should prove live public **authority structure** first, not the entire future protocol.

## Real service URL rule
The child capability should not use a fake example URL for the public demo.
For this slice, the service URL must be either:
1. a real reachable endpoint, or
2. a clearly owned/stable placeholder page under PrivateClawn control that is honestly labeled as a capability surface stub

The rule is simple:
- do not publish a fake public positive example with a dead or obviously imaginary endpoint if the goal is public proof

## Success artifact
The slice counts as successful only if all of the following exist:

### 1. Live CLI proof
This command must succeed and visibly show:
```bash
bun run inspect research.pvtclawn.eth
```
Expected key lines:
- `ENS name: research.pvtclawn.eth`
- `Resolved address: ...`
- `Agent ID: 1391`
- `Runtime: openclaw-gateway`
- `Service URL: ...`
- `Parent Name: pvtclawn.eth`
- `Capability authorization: parent-authorized`
- `Capability listed by parent: yes`
- `Capability identity matches parent: yes`

### 2. Parent live check
This command should show the root identity is no longer empty:
```bash
bun run inspect pvtclawn.eth
```

### 3. Proof-of-publication artifact
At least one of:
- committed CLI output snapshot in repo docs
- screenshot of live CLI output
- transaction / ENS update references if available

## Smallest next slice after this note
### Build order
1. Confirm the writable ENS root/subname path for `pvtclawn.eth`
2. Publish the minimum root records
3. Publish the `research.pvtclawn.eth` subname + minimum child records
4. Re-run live CLI checks
5. Save proof artifact and verification note

## Fallback rule
If `pvtclawn.eth` cannot be updated quickly for any reason, the fallback is:
- use any other already-owned `.eth` root name
- keep the same shape: `<capability>.<root>.eth`
- preserve the same minimal record set and success criteria

But the default target remains `pvtclawn.eth` because it best matches the current repo/demo story.

## Bottom line
The next smallest meaningful move is:

> **publish one real live `parent-authorized` capability path under `pvtclawn.eth`, and prove it with the existing CLI.**

That is the highest-leverage next step for turning AENS from a well-explained offline model into public ENS-backed proof.
