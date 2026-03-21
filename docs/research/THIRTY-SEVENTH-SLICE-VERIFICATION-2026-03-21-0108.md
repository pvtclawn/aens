# Thirty-seventh ÆNS slice verification — agent-judge wrapped artifacts (2026-03-21 01:08 UTC)

## Scope
Verify the new wrapped agent-judge artifacts against the frozen acceptance criteria and current live/public truth.

Targets checked:
- canonical artifact paths exist
- submission docs link to them
- `gitCommit` inside both artifacts points to the wrapper-code commit (`93a30f5`), not the later artifact commit
- wrapped `result` stays identical to direct `discover-research` JSON output
- embedded public-surface block remains honest about the still-missing live `/discover-research/` route

## Commands run
```bash
git status -sb
/home/clawn/.bun/bin/bunx tsc --noEmit
/home/clawn/.bun/bin/bun test src/*.test.ts
/home/clawn/.bun/bin/bun run check-public-surface || true
/home/clawn/.bun/bin/bun run discover-research -- --example parent-authorized-capability --json
/home/clawn/.bun/bin/bun run discover-research -- --json pvtclawn.eth
python3 ...compare artifact JSON vs direct CLI JSON + doc links + commit fields...
```

## Observed results
### Repo health
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`61 pass`)

### Live public truth
Current live verifier result:
- `public root: ok`
- `research capability page: ok`
- `discover research page: http 404`
- `Preferred public surface ready: no`
- `Bootstrap proof ready: yes`

So the public discovery route is still **not** live on the preferred surface.

### Artifact presence + doc links
Verified:
- `docs/submission/artifacts/discover-research-example.json` exists
- `docs/submission/artifacts/discover-research-live.json` exists
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md` links both artifact paths

### Commit provenance
Verified:
- both wrapped artifacts contain `gitCommit: 93a30f5822da4f0322c06ca29c8d5424994b86c8`
- this is the full SHA for wrapper-code commit `93a30f5`
- this is intentionally **not** the later artifact-publication commit `8ebccc5`

That means the artifacts correctly point back to the code state that generated their schema/command surface.

### Inner result fidelity
Verified against direct CLI JSON output:
- example artifact `result` equals direct `bun run discover-research -- --example parent-authorized-capability --json`
- live artifact `result` equals direct `bun run discover-research -- --json pvtclawn.eth`

So the wrapper does **not** mutate the underlying discovery contract.

### Source-mode and honest exit boundary
Verified:
- deterministic example artifact has `sourceMode: example`
- live artifact has `sourceMode: live`
- example CLI exits `0`
- live CLI exits `2`

This is the correct honesty boundary:
- synthetic positive path is clearly marked as example
- live namespace path stays an explicit non-ready result

### Embedded public-surface honesty
Both artifacts currently embed:
- `discover research page` status `404`
- `preferredSurfaceReady: false`
- `bootstrapProofReady: true`

This matches the current live verifier result exactly.

## Acceptance mapping
Target | Result
- artifact paths exist | ✅
- submission docs link to artifact paths | ✅
- `gitCommit` points to wrapper-code commit | ✅
- wrapper preserves inner `discover-research` result | ✅
- embedded public-surface block matches current live truth | ✅
- no hidden overclaim about live `/discover-research/` route | ✅

## Verdict
**Pass.**

The wrapped agent-judge artifacts now satisfy the acceptance criteria:
- canonical paths exist
- docs point to them
- provenance is explicit
- the inner discovery result stays unchanged
- current deploy/public-truth lag is embedded honestly rather than hand-waved

## Practical result
Until the live public discovery route actually deploys, these wrapped JSON artifacts are the strongest current machine-facing judge surface for ÆNS.
