# Twenty-third ÆNS slice verification — proof-scope wording hardening (2026-03-19 20:51 UTC)

## Purpose
Verify that the new proof-scope wording hardening stays aligned with:
1. the original ÆNS thesis that **`<capability>.<agent>.eth` is core**
2. the current live/public truth that the preferred child route is still not publicly ready while bootstrap mode remains the only honest public proof surface

This verification is intentionally about language discipline, not more deployment forensics.

## Commands / checks run
```bash
git status -sb
bun test
bunx tsc --noEmit
bun run check-public-surface
grep -RIn "research\.pvtclawn\.eth\|pvtclawn\.eth\|aens\.service\|child capability\|parent-authorized" \
  docs/research/FIRST-LIVE-AENS-* \
  docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md

grep -RIn "machine-verifiable scope\|Observed public-alias state\|Unresolved human control-plane state\|Not yet proven\|deployment weirdness\|basically fixed\|end-to-end machine closure\|bootstrap" \
  docs/research/FIRST-LIVE-AENS-* \
  docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md \
  docs/research/TWENTY-THIRD-SLICE-PROOF-SCOPE-WORDING-HARDENING-2026-03-19-2045.md
```

## Observed repo health
- working tree clean
- tests: pass
- typecheck: pass

## Observed live/public truth
`bun run check-public-surface` currently reports:
- `public root: ok (https://aens-nine.vercel.app/)`
- `research capability page: http 404 (https://aens-nine.vercel.app/research-capability/)`
- `github blob fallback: ok (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`
- `Preferred public surface ready: no (https://aens-nine.vercel.app/research-capability/)`
- `Bootstrap proof ready: yes (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`

So the current honest publication boundary remains unchanged.

## Alignment with the original ÆNS thesis
The updated proof surfaces remain aligned with the original `memory/AENS.md` direction that the capability subname is the point.

### Evidence
The updated proof template and live-session docs now explicitly center the first proof on:
- `research.pvtclawn.eth` as a **child capability** of `pvtclawn.eth`
- `aens.parent = pvtclawn.eth`
- `aens.capabilities = research.pvtclawn.eth`
- final success only when the child renders `Capability authorization: parent-authorized`

The new proof-scope template says directly:
> `research.pvtclawn.eth` is configured as a child capability of `pvtclawn.eth`, and the final report shows the child as `parent-authorized`.

That keeps the proof centered on the actual ÆNS thesis:
- root name = identity anchor
- child capability name = callable/authorized capability surface

not on a generic root profile or a decorative ENS label.

## Alignment with the current bootstrap-mode boundary
The updated docs also stay aligned with the current live/public truth instead of narrating more closure than exists.

### Evidence
The proof template, operator steps, and checklist now all require explicit layered wording:
1. `Machine-verifiable scope`
2. `Observed public-alias state (time-scoped)`
3. `Unresolved human control-plane state`
4. `Not yet proven`

They also explicitly forbid flattening language like:
- `deployment weirdness`
- `basically fixed`
- `end-to-end machine closure`

For the current bootstrap-mode case, they require the proof note to say in effect:
- the preferred child route is **not publicly ready**
- the bootstrap fallback is the currently reachable public surface
- the preferred-route gap is unresolved **human control-plane state**
- invocation / payment / runtime auth / broad production readiness are **not yet proven**

## Why this verification passes
The docs now do two important things at once:

### 1) They keep capability subnames load-bearing
The first proof is still about `research.pvtclawn.eth` becoming a real child capability under `pvtclawn.eth`, not about a generic landing page or a root-name vanity proof.

### 2) They keep bootstrap mode narrow
The first proof no longer risks sounding like full machine-closed service readiness.
It is framed correctly as:
- machine-verifiable ENS authority structure
- observed public bootstrap surface at capture time
- unresolved preferred-route control-plane state

## Verdict
### Original ÆNS thesis alignment: **yes**
The updated proof surfaces still center the protocol on `child capability under parent identity`, which is the core point of ÆNS.

### Bootstrap-boundary alignment: **yes**
The updated proof wording no longer invites the current bootstrap-mode case to sound like preferred-route success or end-to-end machine closure.

### Proof-scope wording hardening: **passes**
The slice now keeps the first live proof aligned with both:
- the original `<capability>.<agent>.eth` thesis
- the current live/public truth

without reopening more deployment speculation.

## Remaining boundary
This slice does not change the external deployment state:
- preferred route still not publicly ready
- bootstrap proof still the only currently honest public proof path

That is fine.
The point of this slice was to keep the proof story honest, and it now does.

## Next step
Rotate to Lane D only if new research can sharpen a different product/trust question.
Otherwise keep the current truth stable and avoid reopening proof-language work unless a new contradiction appears.
