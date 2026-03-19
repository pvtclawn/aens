# Twenty-second ÆNS slice verification — validated proof-state capture (2026-03-19 20:33 UTC)

## Purpose
Verify the new validated proof-state capture end to end against the current live/public truth.

The slice should now guarantee three things in practice, not just in design:
1. the verifier prints both publication-state verdicts explicitly
2. a valid bootstrap-mode proof capture writes an artifact that embeds the public-truth snapshot
3. contradictory `publication mode ↔ service URL` inputs fail closed

## Commands run
```bash
git status -sb
bun test
bunx tsc --noEmit
bun run check-public-surface
AENS_PROOF_DIR=/tmp/aens-proof-verify-validated-state \
AENS_PROOF_PUBLICATION_MODE=bootstrap \
AENS_PROOF_SERVICE_URL=https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md \
  bun run capture-proof -- verify-validated-state
AENS_PROOF_PUBLICATION_MODE=preferred \
AENS_PROOF_SERVICE_URL=https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md \
  bun run capture-proof -- contradictory-input
```

## Observed repo health
- working tree clean
- tests: pass
- typecheck: pass

## Observed verifier state
`bun run check-public-surface` currently reports:
- `public root: ok (https://aens-nine.vercel.app/)`
- `research capability page: http 404 (https://aens-nine.vercel.app/research-capability/)`
- `github blob fallback: ok (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`
- `Preferred public surface ready: no (https://aens-nine.vercel.app/research-capability/)`
- `Bootstrap proof ready: yes (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`

This is the correct current live-state split.

## Observed valid bootstrap capture behavior
Valid bootstrap-mode dry run wrote:
- `/tmp/aens-proof-verify-validated-state/2026-03-19T20-33-47Z--verify-validated-state.md`

The artifact header now records all expected state fields:
- `Publication mode: bootstrap`
- `Publication mode source: explicit`
- `Service URL family: bootstrap`
- exact public fallback URL
- current repo commit hash
- commit-pinned bootstrap source reference

The artifact also includes a `Public truth snapshot` section with:
- preferred root status
- preferred child-route status
- fallback status
- `Preferred public surface ready: no`
- `Bootstrap proof ready: yes`

The capture command exits with code `2`, which is expected here because `pvtclawn.eth` / `research.pvtclawn.eth` are still not fully populated for the live proof flow. That exit code reflects the current ENS state, not a proof-capture failure.

## Observed contradictory-input behavior
When run with:
- `AENS_PROOF_PUBLICATION_MODE=preferred`
- `AENS_PROOF_SERVICE_URL=https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

`bun run capture-proof` now fails closed with a config error:
- `Service URL family \`bootstrap\` contradicts publication mode \`preferred\``

This is the exact failure mode the slice was supposed to prevent.

## Verdict
### Preferred surface ready: **no**
The Vercel child route still 404s, so the preferred surface is still not publicly ready.

### Bootstrap proof ready: **yes**
The bootstrap fallback remains reachable, and both the verifier and the generated proof artifact now encode that state explicitly.

### Validated proof-state capture: **passes**
The hardening goal is met:
- the verifier exposes the two-state publication truth directly
- the proof artifact carries the public-truth snapshot that justified bootstrap mode
- contradictory mode/url input no longer produces a deceptively tidy artifact

## Remaining boundary
This slice does **not** change the external deployment truth:
- the Vercel preferred child route is still blocked by stale production deployment/config state
- the bootstrap fallback remains the only currently honest public proof surface

## Next step
Rotate to Lane D only if new research can sharpen the remaining external deployment boundary further.
Otherwise keep the current truth stable:
- `preferred surface ready = no`
- `bootstrap proof ready = yes`

and avoid reopening local proof-capture work unless a new contradiction appears.
