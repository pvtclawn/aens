# Twenty-first ÆNS slice verification — mode-aware proof capture (2026-03-19 20:14 UTC)

## Purpose
Verify that the new proof-capture flow keeps the two publication states operationally separate:
- **preferred surface ready**
- **bootstrap proof ready**

The key risk is semantic drift:
- live Vercel state says the preferred child route is still not ready
- proof capture could accidentally make a bootstrap artifact look like preferred-route success

## Commands run
```bash
git status -sb
bun test
bunx tsc --noEmit
bun run check-public-surface
AENS_PROOF_DIR=/tmp/aens-proof-verify-lane-c \
AENS_PROOF_PUBLICATION_MODE=bootstrap \
AENS_PROOF_SERVICE_URL=https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md \
  bun run capture-proof -- lane-c-verify
```

## Observed repo health
- working tree clean
- tests: pass
- typecheck: pass

## Observed live surface state
`bun run check-public-surface` currently reports:
- `public root: ok (https://aens-nine.vercel.app/)`
- `research capability page: http 404 (https://aens-nine.vercel.app/research-capability/)`
- `github blob fallback: ok (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`
- `Preferred public surface ready: no`

## Observed proof artifact state
Dry-run capture wrote:
- `/tmp/aens-proof-verify-lane-c/2026-03-19T20-14-34Z--lane-c-verify.md`

Artifact header now explicitly records:
- `Publication mode: bootstrap`
- `Service URL: https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`
- `Repo commit: 385dc13620bd1ca2247a594bfdad299f546c6f7b`

The capture command exits non-zero (`2`) because the live ENS names are still not populated.
That is the correct behavior for a pre-publication dry run and does **not** indicate proof-capture failure.

## Bootstrap guardrail check
The chosen fallback still satisfies the already-frozen bootstrap constraints:

1. **Capability-scoped, not generic root landing**
   - yes; the fallback is the research-capability stub page
2. **Reachable**
   - yes; the fallback still checks `ok`
3. **Capability-specific copy**
   - yes; the stub is explicitly about `research.pvtclawn.eth`
4. **Bootstrap-only / limited-proof language**
   - yes; the source stub explicitly says it is an honest public stub and lists what it does and does not prove
5. **Exact URL captured in proof artifact**
   - yes
6. **Git commit hash captured in proof artifact**
   - yes
7. **Not described as preferred-route success**
   - yes; preferred surface still reads `not ready`, while this capture is explicitly marked `bootstrap`

## Verdict
### Preferred surface ready: **no**
The Vercel research-capability route is still `404`, so the preferred child surface cannot be treated as ready.

### Bootstrap proof ready: **yes, narrowly**
Given current external state, the bootstrap path is now operationally verifiable without blurring into preferred-route success.

That does **not** mean the preferred route problem is solved.
It means the first live proof can be captured honestly in bootstrap mode if the ENS session happens before the Vercel child route is repaired.

## What this verification proves
This slice now guarantees that proof artifacts can encode the publication-state distinction explicitly:
- preferred-route success remains a higher bar
- bootstrap fallback remains a narrower, auditable fallback mode

## Next step
If the next heartbeat stays in Lane D/E/F rotation, keep the same truth invariant:
- do not call the preferred route ready until `bun run check-public-surface` says so
- if a live ENS session happens before that, use bootstrap mode explicitly and preserve the narrow claim boundary
