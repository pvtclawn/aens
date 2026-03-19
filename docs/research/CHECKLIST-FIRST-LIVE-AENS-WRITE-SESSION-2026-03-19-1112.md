# Checklist — first live ÆNS write session (2026-03-19 11:12 UTC)

## Purpose
Turn the resolver-first publication plan into a **human-in-the-loop execution checklist** for the first real live ÆNS publication session.

This is the operational checklist for publishing:
- `pvtclawn.eth`
- `research.pvtclawn.eth`

without drifting into:
- half-upgraded root state
- broken child setup
- premature parent authorization
- weak proof capture
- overclaiming what the slice proves

## Session boundary
This checklist is for **one continuous live session** with the wrapped-owner wallet present.

Do **not** split this into “upgrade resolver now, finish later” unless forced by failure.
If forced to stop early, stop with explicit abort notes and do not present the intermediate state as success.

## Human prerequisites
Before starting, confirm all of the following:
- [ ] Egor is present and ready to approve wallet prompts
- [ ] connected wallet is exactly:
  - `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- [ ] wallet has enough ETH on mainnet for several transactions
- [ ] `app.ens.domains` is reachable
- [ ] `https://tools.ens.xyz` is reachable as fallback/power-user path
- [ ] current public stub page is reachable:
  - `https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

## Frozen values
### Current ENS Public Resolver
- `0xF29100983E058B709F3D539b0c765937B804AC15`

### Root payload — `pvtclawn.eth`
- ETH address: `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `description = PrivateClawn root agent identity`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`
- `aens.capabilities = research.pvtclawn.eth`

### Child payload — `research.pvtclawn.eth`
- ETH address: `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `description = Research capability surface for PrivateClawn`
- `aens.parent = pvtclawn.eth`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`
- `aens.service = https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

## Tools to use
### Preferred UI flow
1. **ENS App** (`app.ens.domains`)
   - resolver update
   - profile editing
   - subname creation
2. **tools.ens.xyz**
   - fallback/power-user route for direct ETH/text record editing when ENS App is awkward with wrapped/public-resolver state

### Explicitly avoid for this first session
- bespoke custom write scripts
- manual contract-calling improvisation
- fuse experiments unless required
- unwrapping the root just to simplify the flow

## Phase 0 — baseline proof capture
Before any write, save a baseline.

### Commands
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
```

### Required capture
- [ ] save output for `pvtclawn.eth`
- [ ] save output for `research.pvtclawn.eth`
- [ ] note current time

### Abort conditions
- [ ] abort if baseline commands do not run locally
- [ ] abort if the connected wallet is not the wrapped owner

## Phase 1 — resolver modernization on `pvtclawn.eth`
### Goal
Move `pvtclawn.eth` to the current ENS Public Resolver.

### Action
In ENS App:
- open `pvtclawn.eth`
- update resolver to:
  - `0xF29100983E058B709F3D539b0c765937B804AC15`
- approve transaction

### Required capture
- [ ] tx hash saved
- [ ] screenshot or note showing resolver target

### Immediate checkpoint
Do **not** stop the session here.
Proceed directly to root records.

### Abort conditions
- [ ] abort if ENS App will not let the wrapped owner update the resolver
- [ ] abort if wallet prompt is for an unexpected contract or name
- [ ] abort if tx fails or lands on the wrong resolver address

## Phase 2 — root records on `pvtclawn.eth`
### Goal
Make the upgraded root immediately legible, not just technically modernized.

### Records to set
- ETH address: `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `description = PrivateClawn root agent identity`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`

### Preferred path
- ENS App for ETH address / description
- ENS App `Edit Records` or `tools.ens.xyz` for `aens.*` text keys

### Checkpoint command
```bash
bun run inspect pvtclawn.eth
```

### Required checkpoint result
The root report should be visibly non-empty and coherent, including:
- non-empty identity anchor
- ETH address present
- description present
- `Agent ID: 1391`
- `Runtime: openclaw-gateway`

### Abort conditions
- [ ] abort child creation if the root still looks empty or contradictory
- [ ] abort if the resolver change removed editability and records cannot be set cleanly
- [ ] abort if the wrong address or wrong text values appear

## Phase 3 — create `research.pvtclawn.eth`
### Goal
Create the child name only after the root is coherent.

### Action
Use ENS App to create subname:
- label: `research`
- parent: `pvtclawn.eth`

### Constraints
- do not burn restrictive fuses unless forced
- keep the first live proof slice simple

### Checkpoint command
```bash
bun run inspect research.pvtclawn.eth
```

### Required checkpoint result
The child should at least:
- exist onchain
- resolve as a real ENS name or show meaningful partial state

### Abort conditions
- [ ] abort if child creation UI path is unclear for the wrapped parent
- [ ] abort if the created child lands under the wrong owner/manager expectation
- [ ] abort if the child name is created but obviously cannot be edited further

## Phase 4 — child resolver + records
### Goal
Make the child coherent before any parent authorization.

### If needed first
Set child resolver to current ENS Public Resolver:
- `0xF29100983E058B709F3D539b0c765937B804AC15`

### Then set child records
- ETH address: `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `description = Research capability surface for PrivateClawn`
- `aens.parent = pvtclawn.eth`
- `aens.agentId = 1391`
- `aens.runtime = openclaw-gateway`
- `aens.service = https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

### Checkpoint command
```bash
bun run inspect research.pvtclawn.eth
```

### Required checkpoint result
Before parent authorization, the child should already show:
- `ENS name: research.pvtclawn.eth`
- address present
- description present
- `Parent Name: pvtclawn.eth`
- `Agent ID: 1391`
- `Runtime: openclaw-gateway`
- service URL set to the stub page

It is okay if authority is not yet `parent-authorized` at this stage.

### Abort conditions
- [ ] abort if child resolver is wrong and cannot be changed cleanly
- [ ] abort if child records remain inconsistent with the root
- [ ] abort if the service URL is not the frozen stub URL

## Phase 5 — parent capability list last
### Goal
Flip the live authority state only after the child is fully coherent.

### Record to set on `pvtclawn.eth`
- `aens.capabilities = research.pvtclawn.eth`

### Final verification commands
```bash
bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
```

### Required final result
The child report must show:
- `Capability authorization: parent-authorized`
- `Capability listed by parent: yes`
- `Capability identity matches parent: yes`

The root report should show a coherent root identity plus the declared capability list.

### Abort conditions
- [ ] do not call the slice complete if the child is anything other than `parent-authorized`
- [ ] abort celebratory proof-writing if the final report is mixed, stale, or contradictory

## Proof-capture checklist
This slice counts only if proof is saved.

### Save all of the following
- [ ] tx hash for resolver update
- [ ] tx hash(es) for root records
- [ ] tx hash for child creation
- [ ] tx hash(es) for child records
- [ ] tx hash for parent capability list
- [ ] final CLI output for `bun run inspect pvtclawn.eth`
- [ ] final CLI output for `bun run inspect research.pvtclawn.eth`
- [ ] at least one screenshot of the live final state
- [ ] repo-side verification note after the session

## Scope-language checklist
The final proof note must say:
- [ ] this proves one live ENS-backed ÆNS authority path
- [ ] this proves the child points to a real public stub URL under project control
- [ ] this does **not** yet prove invocation
- [ ] this does **not** yet prove payment flow
- [ ] this does **not** yet prove runtime auth or broad production readiness

## Hard finish line
The session is done only if **all** are true:
- [ ] root upgraded to current Public Resolver
- [ ] root records coherent
- [ ] child exists and is coherent
- [ ] child renders `parent-authorized`
- [ ] proof artifacts captured
- [ ] final note remains narrowly honest

## If anything breaks
If any checkpoint fails:
1. stop adding new writes
2. capture current CLI output
3. save the last tx hash
4. write the exact failed checkpoint
5. do **not** present the intermediate state as success

## Next task
# **Run this checklist with Egor present and the wrapped-owner wallet, starting with resolver modernization + root records as one continuous live session.**
