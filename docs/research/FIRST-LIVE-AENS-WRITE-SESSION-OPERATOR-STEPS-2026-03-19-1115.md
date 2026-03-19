# First live ÆNS write session — operator steps (2026-03-19 11:15 UTC)

## Use this only when Egor is present with the wrapped-owner wallet
Wallet required:
- `0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`

## Before opening the browser
In terminal:
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run capture-proof -- baseline
```

Open these tabs:
- `https://app.ens.domains`
- `https://tools.ens.xyz`
- `https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

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
   - `aens.service` → `https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

### Child checkpoint
In terminal:
```bash
bun run inspect research.pvtclawn.eth
```

Do not continue unless the child is coherent on its own.

## Phase 3 — authorize the child from the parent
### On `pvtclawn.eth`
Set:
- `aens.capabilities` → `research.pvtclawn.eth`

### Final checkpoint
In terminal:
```bash
bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
bun run capture-proof -- final
```

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

## Proof to save
- tx hashes for every write
- final CLI captures
- at least one screenshot
- repo-side verification note after the session
