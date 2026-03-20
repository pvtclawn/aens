# Live write-session human dependency boundary (2026-03-20 17:18 UTC)

## Purpose
Freeze the exact boundary between:
- what is already machine-prepared for the first live ÆNS publication session
- what still strictly requires Egor + the wrapped-owner wallet

This is a narrow execution-boundary note, not another wording pass.
The goal is to stop treating more local prep on this specific session path as progress once the remaining blocker is human execution.

## Current truth
At note time:
- repo health clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes
- `bun run check-public-surface` reports:
  - preferred root `ok`
  - preferred child route `ok`
  - `Preferred public surface ready: yes`
  - `Bootstrap proof ready: no`
- live-session checklist/operator steps are patched
- standalone proof template is patched and verified

So the preferred-mode documentation/proof-prep chain is no longer the bottleneck.

## Machine-prepared already
These parts are already executable without wallet access:

### 1) Public-truth verification
```bash
bun run check-public-surface
```
This is read-only and already expresses the preferred-vs-bootstrap decision honestly.

### 2) ENS read-side inspection
```bash
bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
```
These are read-only CLI checks.

### 3) Proof artifact capture
```bash
bun run capture-proof -- baseline
bun run capture-proof -- post-root
bun run capture-proof -- final
```
Current implementation is read-only/local:
- reads current git commit
- fetches public-surface state
- runs the two inspect commands
- writes a proof artifact file

It does **not** perform ENS writes and does **not** require wallet approval.

### 4) Publication-mode choice logic
The machine-prepared default is now straightforward:
- `AENS_PROOF_PUBLICATION_MODE=preferred`
- `AENS_PROOF_SERVICE_URL=https://aens-nine.vercel.app/research-capability/`

That choice is already justified by current public truth.

### 5) Proof/runbook wording discipline
The note/checklist/template stack already encodes:
- preferred mode as the mainline path
- mandatory final public-truth recheck
- provisional child state before parent authorization
- two-branch proof wording for preferred-live vs bootstrap/regression

So this chain no longer needs another adjacent wording slice before execution.

## Human-required still
These parts still strictly require Egor present with the wrapped-owner wallet:

### 1) Resolver modernization on `pvtclawn.eth`
Changing the resolver is a real ENS write.
This requires wallet approval in ENS App or equivalent tooling.

### 2) Root record writes on `pvtclawn.eth`
Setting:
- ETH address
- `description`
- `aens.agentId`
- `aens.runtime`
- later `aens.capabilities`

requires wallet-approved ENS writes.

### 3) Child creation for `research.pvtclawn.eth`
Creating the subname is a real ENS write and cannot be simulated honestly by local prep.

### 4) Child resolver / child record writes
Setting the child resolver if needed, plus:
- ETH address
- `description`
- `aens.parent`
- `aens.agentId`
- `aens.runtime`
- `aens.service`

requires wallet-approved ENS writes.

### 5) The actual success transition
The decisive milestone:
- child renders `parent-authorized`

cannot happen until the parent capability list write lands onchain.
So the strongest ÆNS claim remains human-execution-gated even though the surrounding proof machinery is ready.

## Exact boundary by phase
### Machine-only before Egor is present
Honest allowed work:
1. re-run repo health checks
2. re-run `bun run check-public-surface`
3. capture a fresh baseline artifact if useful
4. reopen the checklist/operator/template docs
5. prepare browser tabs

This is setup/verification only.
It does **not** move the ENS authority state forward.

### Human-in-the-loop required
The moment the session crosses into:
- resolver update
- root record writes
- child creation
- child record writes
- parent capability authorization

it depends on Egor + the wrapped-owner wallet.

### Machine-only again after each write phase
After a human-approved write lands, the machine can resume with:
- `bun run inspect ...`
- `bun run capture-proof -- ...`
- final note drafting

So the true structure is:
- machine prepare
- human approve writes
- machine verify/capture
- human approve next writes
- machine verify/capture

## Bottom line
For this specific first live ÆNS publication path, the remaining blocker is no longer:
- repo health
- public surface
- runbook wording
- proof-template wording

It is now simply:
- **Egor present + wrapped-owner wallet approvals for real ENS writes**

## Operational consequence
Do not treat more local documentation/prep on this exact live-session path as meaningful forward motion unless a genuinely new execution ambiguity appears.

The next honest move on this path is:
1. Egor present
2. run the checklist
3. perform the real ENS writes
4. capture the proof

If Egor is not available, rotate to adjacent ÆNS product work instead of continuing to polish this already-ready session rail.

## Core delta
None.
This note does not change the parent/child authorization model.

## Rail delta
Moderate.
This sharpens the execution boundary for the first live publication session.

## Counterfactual relevance test
Would this note still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution-boundary research, not protocol-center progress.
