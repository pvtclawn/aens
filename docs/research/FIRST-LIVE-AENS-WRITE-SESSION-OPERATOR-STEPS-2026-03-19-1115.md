# First live ÆNS write session — operator steps (2026-03-19 11:15 UTC)

## Use this only when Egor is present with the wrapped-owner wallet
Wallet required:
- `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`

## Before opening the browser
In terminal, first check the current public surface state:
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run check-public-surface
```

Then choose the publication mode.

### Mainline path — preferred route live
Use this when `bun run check-public-surface` reports `Preferred public surface ready: yes`.
This is the honest current default because it is the strongest publicly reachable capability-scoped surface under project control.

```bash
cd /home/clawn/.openclaw/workspace/aens
export AENS_PROOF_PUBLICATION_MODE=preferred
export AENS_PROOF_SERVICE_URL=https://aens-nine.vercel.app/research-capability/
```

### Regression path — preferred route not live
Use bootstrap mode only if the preferred route is not ready at baseline, or if the session is explicitly restarted after a later regression.

```bash
cd /home/clawn/.openclaw/workspace/aens
export AENS_PROOF_PUBLICATION_MODE=bootstrap
export AENS_PROOF_SERVICE_URL=https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md
```

Then capture the baseline:
```bash
bun run capture-proof -- baseline
```

Before moving on, record four things explicitly:
1. current `AENS_PROOF_PUBLICATION_MODE`
2. exact `AENS_PROOF_SERVICE_URL`
3. current verifier truth (`Preferred public surface ready` / `Bootstrap proof ready`)
4. current time

Open these tabs:
- `https://app.ens.domains`
- `https://tools.ens.xyz`
- preferred child route: `https://aens-nine.vercel.app/research-capability/`
- bootstrap fallback page: open only if the session is actually using the regression path

Also keep this wording template open for the final proof note:
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

## Phase 1 — root resolver modernization + root records
### In ENS App
1. open `pvtclawn.eth`
2. update resolver to:
   - `0xF29100983E058B709F3D539b0c765937B804AC15`
3. approve tx
4. immediately set root records:
   - ETH address → `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
   - `description` → `PrivateClawn root agent identity`
   - `aens.agentId` → `1391`
   - `aens.runtime` → `openclaw-gateway`

Use `tools.ens.xyz` if ENS App is awkward for the custom `aens.*` keys.

### Root checkpoint
In terminal:
```bash
bun run inspect pvtclawn.eth
bun run capture-proof -- post-root
```

Do not continue unless the root looks coherent.

## Phase 2 — create and populate the child
### In ENS App
1. create subname:
   - `research.pvtclawn.eth`
2. if needed, set child resolver to:
   - `0xF29100983E058B709F3D539b0c765937B804AC15`
3. set child records:
   - ETH address → `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
   - `description` → `Research capability surface for PrivateClawn`
   - `aens.parent` → `pvtclawn.eth`
   - `aens.agentId` → `1391`
   - `aens.runtime` → `openclaw-gateway`
   - `aens.service` → the selected service URL from `AENS_PROOF_SERVICE_URL`

### Child checkpoint
In terminal:
```bash
bun run inspect research.pvtclawn.eth
```

Do not continue unless the child is coherent on its own.
Treat this state as **PROVISIONAL — not yet `parent-authorized`**.
Do **not** draft the final proof note or take celebratory screenshots yet.

## Phase 3 — authorize the child from the parent
### On `pvtclawn.eth`
Set:
- `aens.capabilities` → `research.pvtclawn.eth`

### Final checkpoint
In terminal:
```bash
bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
bun run check-public-surface
bun run capture-proof -- final
```

Fail closed here:
- if this is still a preferred-mode session, `bun run check-public-surface` must still show `Preferred public surface ready: yes`
- if that line is no longer `yes`, stop and treat the run as an abort or an explicitly restarted regression/bootstrap session
- do **not** capture final proof on stale baseline truth alone

## Success bar
The session only counts if the final child output shows:
- `Capability authorization: parent-authorized`
- `Capability listed by parent: yes`
- `Capability identity matches parent: yes`

## Stop immediately if
- wrong wallet is connected
- resolver update targets the wrong address
- root remains empty after root-record writes
- child cannot be edited cleanly after creation
- final child output is not `parent-authorized`
- the final public-surface recheck contradicts the selected preferred-mode story

## Proof to save
- tx hashes for every write
- final CLI captures
- at least one screenshot
- repo-side verification note after the session

## Final proof note structure (mandatory)
Use the template in `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`.

The final note must use these top-level sections in order:
1. `Machine-verifiable scope`
2. `Observed public-alias state (time-scoped)`
3. `Unresolved human control-plane state`
4. `Not yet proven`

Keep the note narrow, but branch section 3 honestly based on capture-time truth:
- machine-verifiable scope = ENS authority path, publication mode, exact service URL, and any commit-pinned bootstrap source only if bootstrap mode is actually used
- observed public-alias state = what the verifier saw at capture time, not a timeless claim about the URL forever
- unresolved human control-plane state has two allowed branches:
  - preferred route live at capture time → say plainly that no unresolved preferred-route blocker was visible at capture time
  - preferred route blocked/regressed at capture time → describe that blocker narrowly as unresolved deployment/control-plane state
- not yet proven = invocation, payment flow, runtime auth, end-to-end machine closure, or broad production readiness
