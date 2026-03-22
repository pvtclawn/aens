# One-Hundred-Eighty-Sixth Slice Verification — Live `theaens.eth` Default Route-Capability Deploy (2026-03-22 20:42 UTC)

## Context
ÆNS was just pushed with the new default-root / route-capability slice:
- default public root switched from `vitalik.eth` to `theaens.eth`
- public landing route should now map to `explore.theaens.eth`
- public write route should now map to `write.theaens.eth`

This verification pass answers the only question that matters after push:
> did the canonical deployed surface actually pick up the new `theaens` default + route-capability contract?

## Health baseline
Repository state at verification time:
- `git status -sb` -> `## main...origin/main`

So this is no longer local-only or ahead-of-origin ambiguity.

## Live verifier output
Command:

```bash
bun run check-public-surface
```

Observed result:

```text
ÆNS public surface check

Preferred public base: https://aens-nine.vercel.app/
public root: ok (https://aens-nine.vercel.app/)
write records page: ok (https://aens-nine.vercel.app/write-records/)
github blob fallback: ok (https://github.com/pvtclawn/aens/blob/main/docs/public/write-records-stub.md)
Preferred public surface ready: yes (https://aens-nine.vercel.app/write-records/)
Bootstrap proof ready: no (https://github.com/pvtclawn/aens/blob/main/docs/public/write-records-stub.md)
```

This confirms the kept surfaces are live on the canonical alias.

## Browser verification — root explorer
Live page: `https://aens-nine.vercel.app/`

Observed live UI markers:
- page title / root web area: `ÆNS — ENS root explorer`
- ENS input default: `theaens.eth`
- scope copy explicitly references publishing the **route capability bundle**
- current-scope bullet: `Register the landing and write endpoints as ENS capability surfaces`
- empty-state copy explicitly names:
  - `explore.theaens.eth`
  - `write.theaens.eth`

This is the right public truth for the default landing surface.

## Browser verification — write flow
Live page: `https://aens-nine.vercel.app/write-records/`

Observed live UI markers:
- page title / root web area: `Write ENS capability records — ÆNS`
- root ENS default: `theaens.eth`
- derived root capabilities:
  - `["explore.theaens.eth","write.theaens.eth"]`
- derived service URLs:
  - `https://aens-nine.vercel.app/`
  - `https://aens-nine.vercel.app/write-records/`
- route mapping section shows:
  - `/` -> `explore.theaens.eth`
  - `/write-records/` -> `write.theaens.eth`
- planned writes section shows the expected five-record bundle:
  1. `theaens.eth` / `aens.capabilities` / `["explore.theaens.eth","write.theaens.eth"]`
  2. `explore.theaens.eth` / `aens.parent` / `theaens.eth`
  3. `explore.theaens.eth` / `aens.service` / `https://aens-nine.vercel.app/`
  4. `write.theaens.eth` / `aens.parent` / `theaens.eth`
  5. `write.theaens.eth` / `aens.service` / `https://aens-nine.vercel.app/write-records/`

This verifies the deploy picked up not just the new default root, but the full route-capability write bundle semantics.

## Verdict
**Pass.** The canonical deployed surface now reflects the pushed `theaens.eth` route-capability default:
- kept public surfaces are live
- default public root is `theaens.eth`
- route-capability mapping is publicly visible as:
  - `/` -> `explore.theaens.eth`
  - `/write-records/` -> `write.theaens.eth`

## Boundary after this verification
The remaining step is no longer deploy truth.
The remaining step is the explicit wallet boundary:
- real ENS resolver/subname setup as needed
- wallet-signed mainnet text-record writes for `theaens.eth`, `explore.theaens.eth`, and `write.theaens.eth`

Until that signature happens, the UI/workflow is live and truthful, but the ENS namespace itself is not yet proven updated on-chain by this slice.
