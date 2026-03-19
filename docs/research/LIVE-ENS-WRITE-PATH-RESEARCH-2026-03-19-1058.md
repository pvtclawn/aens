# Live ENS write path research for the first ÆNS public example (2026-03-19 10:58 UTC)

## Purpose
Narrow the exact live ENS write path for:
- `pvtclawn.eth`
- `research.pvtclawn.eth`

so the next build slice can execute the real publication cleanly instead of discovering wrapper / resolver constraints mid-flight.

## Live onchain state
A direct mainnet probe using `viem` against the ENS Registry, Name Wrapper, Base Registrar, and the currently configured resolver shows:

### `pvtclawn.eth`
- ENS Registry owner: `0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401`
- wrapped owner via Name Wrapper: `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- resolver: `0x231b0a83C26111eF8652C90355Ff0037eC3a54bb`
- record exists: `true`
- direct `addr()` / `text()` reads on the current resolver return no data for the planned record interfaces

### `research.pvtclawn.eth`
- owner: zero address
- resolver: zero address
- record exists: `false`

### `.eth` 2LD ownership check
- Base Registrar `ownerOf(labelhash('pvtclawn'))` returns the same Name Wrapper address

## What this means
A useful reading constraint from `books_and_papers/006_think_distributed_systems.pdf`: a good mental model must capture every **relevant fact** of the system, especially the interactions and boundaries that actually shape outcomes.

Applied here, wrapper state, resolver compatibility, and human-wallet approval are not low-level execution trivia. They are product-shaping facts for the first live ÆNS proof slice.

### 1. `pvtclawn.eth` is already wrapped
This is not a hypothetical possibility; it is the current live state.

Implication:
- the effective manager is the wrapped owner
- resolver changes and subname creation should be treated as **wrapped-name operations**, not plain unwrapped registry operations

This matches ENS docs:
- for wrapped names, the manager is found via `ownerOf()` on the Name Wrapper
- if the ENS Registry `owner()` returns the Name Wrapper address, the name is wrapped

### 2. The current resolver is not a good base for the ÆNS publication slice
The existing resolver on `pvtclawn.eth` does not return data for the `addr(bytes32)` and `text(bytes32,string)` interfaces that the planned slice depends on.

That means the live write path should **start with resolver modernization**, not with custom text-record writes on the current resolver.

This also matches ENS support guidance:
- wrapped names need to use the **current ENS Public Resolver** in the ENS App
- if the resolver is empty or incorrectly set, record editing in the ENS App is not available
- the current ENS Public Resolver is `0xF29100983E058B709F3D539b0c765937B804AC15`

## Relevant ENS contract addresses
From ENS docs `Deployments` (mainnet):
- ENS Registry: `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`
- Base Registrar: `0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85`
- Name Wrapper: `0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401`
- Public Resolver: `0xF29100983E058B709F3D539b0c765937B804AC15`

## Safest publication method
# **Use the official ENS App / ENS tools with the human wallet, not a bespoke one-off script, for the first live publication.**

Why this is safest:
- the name is already wrapped
- resolver needs updating before the custom records are useful
- subname creation under a wrapped parent has wrapper-specific behavior
- the publication needs explicit human-wallet approvals anyway
- the first slice should optimize for safe, legible public proof rather than clever custom transaction batching

## Exact recommended path
### Step 0 — human wallet requirement
The wrapped owner of `pvtclawn.eth` is the PrivateClawn wallet:
- `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`

So the first live publication requires the human-controlled wallet flow.
This is not a silent background-write slice.

### Step 1 — update `pvtclawn.eth` to the current ENS Public Resolver
Use ENS App support flow:
- open `app.ens.domains`
- connect the manager/owner wallet
- open `pvtclawn.eth`
- update resolver to:
  - `0xF29100983E058B709F3D539b0c765937B804AC15`

This should happen **before** trying to set `aens.*` text records.

### Step 2 — set root records on `pvtclawn.eth`
After resolver modernization, set:
- ETH address = `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `description = PrivateClawn root agent identity`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`

Recommended UI/tooling:
- ENS App `Edit Profile` for the ETH address / description
- ENS App `Edit Records` or `tools.ens.xyz` for the custom `aens.*` keys

Why `tools.ens.xyz` matters:
ENS support explicitly describes it as the power-user path for setting ETH address or text records when the main ENS App is not suitable, including wrapped-name / public-resolver-manager situations.

### Step 3 — create `research.pvtclawn.eth`
Create the child subname from the wrapped parent.

Expected behavior from ENS support/docs:
- wrapped parents create wrapped subnames

Safest approach:
- create the subname in the ENS App first
- keep the first version simple
- avoid burning restrictive fuses on the first public-proof slice

### Step 4 — ensure the child uses the current ENS Public Resolver
If subname creation does not already set the resolver the way we need, explicitly set:
- child resolver = `0xF29100983E058B709F3D539b0c765937B804AC15`

### Step 5 — set child records on `research.pvtclawn.eth`
Set:
- ETH address = `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `description = Research capability surface for PrivateClawn`
- `aens.parent = pvtclawn.eth`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`
- `aens.service = https://pvtclawn.github.io/aens/research-capability/`

### Step 6 — publish parent capability list last
Only after the child exists, resolves, and has coherent records, set on `pvtclawn.eth`:
- `aens.capabilities = research.pvtclawn.eth`

That final step is what should flip the live child report into the target state:
- `Capability authorization: parent-authorized`

## Why this order is still right
The new research does not overturn the previously frozen publication sequence.
It sharpens the first step:
- **resolver modernization on the wrapped root is the first real prerequisite**

So the practical live sequence becomes:
1. root resolver modernization
2. root base records
3. child creation
4. child resolver/records
5. parent capability list last

## What not to do
- do **not** start by writing `aens.*` records against the current legacy resolver
- do **not** unwrap `pvtclawn.eth` just to simplify the first publication slice
- do **not** burn restrictive fuses on the child in the first proof slice unless there is a strong reason
- do **not** batch everything into one clever custom script before verifying the wrapped-name path in the official tooling

## Required human-wallet steps
Because this is a wrapped-name update, the likely cleanest execution path requires:
- local browser access
- wallet connection to ENS App and/or `tools.ens.xyz`
- explicit human confirmation of each transaction

If browser automation is used later, it should be done only with the user present to approve wallet prompts.

## Best next build slice
# **Execute the resolver-modernization + root-record phase with the human wallet, then checkpoint with the CLI before creating the child.**

That is the smallest real publication step now.
It is better than trying to create the child first against an incompatible root resolver setup.

## Bottom line
The next bottleneck is not ÆNS design anymore.
It is the exact wrapped-name write path:
- `pvtclawn.eth` is wrapped
- its current resolver is not suitable for the planned text-record-based slice
- so the safest first live move is: **upgrade the root to the current Public Resolver, then publish records through the official ENS UI/tool path with the human wallet.**
