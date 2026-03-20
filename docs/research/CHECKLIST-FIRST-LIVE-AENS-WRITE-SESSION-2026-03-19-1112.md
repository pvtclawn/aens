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

### Partial-execution rule
For this first live ÆNS publication, partial completion is **failure handling**, not incremental success.
If the session stops after only some writes land, treat the run as an aborted session:
- stop adding new writes
- save the last tx hash
- capture current CLI output immediately
- record the exact failed checkpoint

The acceptable external outcomes are:
1. full success (`parent-authorized` child + proof artifacts)
2. captured abort

## Human prerequisites
Before starting, confirm all of the following:
- [ ] Egor is present and ready to approve wallet prompts
- [ ] connected wallet is exactly:
  - `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- [ ] wallet has enough ETH on mainnet for several transactions
- [ ] `app.ens.domains` is reachable
- [ ] `https://tools.ens.xyz` is reachable as fallback/power-user path
- [ ] current public service target is chosen honestly:
  - preferred mainline target (default when `Preferred public surface ready = yes`): `https://aens-nine.vercel.app/research-capability/`
  - bootstrap regression target (only if the preferred route is not live at baseline or regresses before final capture): `https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

The preferred target is the honest current default because it is the strongest publicly reachable capability-scoped surface under project control.
Do **not** downgrade to bootstrap mode unless the verifier says the preferred route is not currently ready.

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
- `aens.service = <selected publication-mode service URL>`

### Publication-mode service URL
Choose exactly one before the session and keep proof capture aligned with it:
- `preferred` → `https://aens-nine.vercel.app/research-capability/` (**default mainline path when `Preferred public surface ready = yes`**)
- `bootstrap` → `https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md` (**explicit regression path only**)

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
bun run check-public-surface

# default mainline path when the verifier reports "Preferred public surface ready: yes"
export AENS_PROOF_PUBLICATION_MODE=preferred
export AENS_PROOF_SERVICE_URL=https://aens-nine.vercel.app/research-capability/

# use this only as an explicit regression path if the preferred route is not ready
# at baseline (or if the session is intentionally restarted after a later regression)
# export AENS_PROOF_PUBLICATION_MODE=bootstrap
# export AENS_PROOF_SERVICE_URL=https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md

bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
bun run capture-proof -- baseline
```

### Required capture
- [ ] save output for `bun run check-public-surface`
- [ ] record the chosen `AENS_PROOF_PUBLICATION_MODE`
- [ ] record the exact `AENS_PROOF_SERVICE_URL`
- [ ] save output for `pvtclawn.eth`
- [ ] save output for `research.pvtclawn.eth`
- [ ] note current time

### Abort conditions
- [ ] abort if baseline commands do not run locally
- [ ] abort if the connected wallet is not the wrapped owner
- [ ] abort or explicitly switch to the regression/bootstrap path if the baseline verifier does not support the selected publication-mode story

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
The root phase remains one continuous goal even if it spans multiple UI surfaces after the resolver update.
Resolver modernization is only the opening sub-action of the root phase.
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

Default posture for the first live session:
- confirm the resolver tx landed
- attempt post-resolver record editing in ENS App first
- if required editability still is not available after one reasonable retry/reopen check, switch to `tools.ens.xyz`

This is still the same root phase even if the edit path crosses ENS App and `tools.ens.xyz` after the resolver write.
Treat `tools.ens.xyz` as a contingency surface, not a defeat state.

### Checkpoint command
```bash
bun run inspect pvtclawn.eth
```

### Required checkpoint result
The root phase is not operationally complete until `bun run inspect pvtclawn.eth` shows a visibly non-empty and coherent root, including:
- non-empty identity anchor
- ETH address present
- description present
- `Agent ID: 1391`
- `Runtime: openclaw-gateway`

### If resolver landed but root records stalled
If the resolver update tx succeeded but the root records do not become cleanly writable:
- [ ] save the resolver tx hash
- [ ] allow one reasonable ENS App retry/reopen check before declaring fallback necessary
- [ ] if required editability still fails, switch to `tools.ens.xyz`
- [ ] run `bun run inspect pvtclawn.eth`
- [ ] record the exact blocked record/editability point and failure class, for example:
  - `editability missing after resolver update`
  - `text-record path unavailable`
  - `wrapped-name manager friction`
- [ ] stop here and do **not** drift into child creation if the root still cannot be made coherent

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
- `aens.service = <selected publication-mode service URL>`

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
- service URL set to the selected service URL (preferred mainline by default)
- explicit understanding that this state is **PROVISIONAL — not yet `parent-authorized`**

Do **not** draft the final proof note or take celebratory screenshots yet.
The strongest ÆNS claim lands only after the parent capability list is written and verified.

### Abort conditions
- [ ] abort if child resolver is wrong and cannot be changed cleanly
- [ ] abort if child records remain inconsistent with the root
- [ ] abort if the service URL is not the selected honest current target

## Phase 5 — parent capability list last
### Goal
Flip the live authority state only after the child is fully coherent.

### Record to set on `pvtclawn.eth`
- `aens.capabilities = research.pvtclawn.eth`

### Final verification commands
```bash
bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
bun run check-public-surface
bun run capture-proof -- final
```

### Required final result
The child report must show:
- `Capability authorization: parent-authorized`
- `Capability listed by parent: yes`
- `Capability identity matches parent: yes`

The root report should show a coherent root identity plus the declared capability list.

### Required final public-truth recheck
- if this is still a preferred-mode session, `bun run check-public-surface` must still show `Preferred public surface ready: yes`
- if that line is no longer `yes`, stop and treat the run as an abort or an explicitly restarted regression/bootstrap session
- run `bun run capture-proof -- final` only after the recheck still supports the selected session story
- do **not** capture final proof on stale baseline truth alone

### Abort conditions
- [ ] do not call the slice complete if the child is anything other than `parent-authorized`
- [ ] abort if the final public-surface recheck contradicts the selected preferred-mode story
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
- [ ] final `bun run capture-proof -- final` artifact with public-truth snapshot
- [ ] at least one screenshot of the live final state
- [ ] repo-side verification note after the session

## Proof-scope wording checklist
Use `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md` for the final note.

### Machine-verifiable scope
The final proof note must say:
- [ ] this proves one live ENS-backed ÆNS authority path
- [ ] this section is limited to machine-verifiable structure such as ENS records, final CLI authority output, publication mode, exact service URL, and any commit-pinned bootstrap source reference only if bootstrap mode is actually used

### Observed public-alias state (time-scoped)
The final proof note must say:
- [ ] the public service-surface claim is a snapshot at capture time, not a timeless claim about the URL forever
- [ ] the verifier output at capture time showed whether `preferred surface ready` and `bootstrap proof ready` were true or false
- [ ] if bootstrap mode is used, the note says the child points to a real public bootstrap surface under project control at capture time

### Unresolved human control-plane state
The final proof note must say:
- [ ] if the preferred route is still live at capture time, the note says plainly that no unresolved preferred-route control-plane blocker remained visible at capture time
- [ ] if the preferred route is blocked or regressed at capture time, that blocker is described narrowly as unresolved human-controlled deployment/control-plane state
- [ ] the note does **not** flatten that boundary into vague language like `deployment weirdness`, `basically fixed`, or implied preferred-route readiness

### Not yet proven
The final proof note must say:
- [ ] this does **not** yet prove invocation
- [ ] this does **not** yet prove payment flow
- [ ] this does **not** yet prove runtime auth
- [ ] this does **not** yet prove broad production readiness or end-to-end machine closure

## Hard finish line
The session is done only if **all** are true:
- [ ] root upgraded to current Public Resolver
- [ ] root records coherent
- [ ] child exists and is coherent
- [ ] child renders `parent-authorized`
- [ ] final public-truth recheck was captured honestly
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
