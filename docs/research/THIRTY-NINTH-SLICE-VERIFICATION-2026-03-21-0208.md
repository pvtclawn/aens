# Thirty-ninth ÆNS slice verification — two-doc demo reorder (2026-03-21 02:08 UTC)

## Scope
Verify the two-doc demo reorder against the frozen acceptance criteria and current live truth.

Targets checked:
- the form pack no longer leads with `/discover-research/`
- the demo script no longer opens with `/discover-research/`
- the live `research-capability` page now appears as the first public visual anchor after the example artifact
- the route survives only as the intended deployed surface with caveat
- no broader submission docs were accidentally changed

## Commands run
```bash
git status -sb
/home/clawn/.bun/bin/bunx tsc --noEmit
timeout --kill-after=2 25s /home/clawn/.bun/bin/bun test src/*.test.ts
/home/clawn/.bun/bin/bun run check-public-surface || true
sed -n '/## Demo flow for judges/,/## Repo URL/p' docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md
sed -n '1,95p' docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md
git diff --name-only HEAD~1 HEAD -- docs/submission README.md
```

## Observed results
### Repo health
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`61 pass`)

### Live truth
Current live verifier still reports:
- `public root: ok`
- `research capability page: ok`
- `discover research page: http 404`
- `Preferred public surface ready: no`
- `Bootstrap proof ready: yes`

So the route remains undeployed and still requires caveated treatment.

### Form-pack demo flow
Verified current order:
1. wrapped example artifact
2. live research-capability page
3. wrapped live artifact
4. CLI reproducibility/public-surface evidence
5. public `/discover-research/` route only as intended deployed surface while production catches up

This matches the frozen target ordering.

### Demo script
Verified current order:
- starts at wrapped example artifact
- brings in live research-capability page as the first public visual anchor
- uses wrapped live artifact for current namespace truth
- keeps CLI as reproducibility backup
- mentions `/discover-research/` only at the end as intended deployed discovery surface

This also matches the frozen target ordering.

### Scope control
`git diff --name-only HEAD~1 HEAD -- docs/submission README.md` shows only:
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`

So the patch stayed inside the intended two-doc boundary.

## Acceptance mapping
Target | Result
- form pack no longer starts with `/discover-research/` | ✅
- demo script no longer opens with `/discover-research/` | ✅
- live research-capability page appears as first public visual anchor after the example artifact | ✅
- route survives only as intended deployed surface with caveat | ✅
- no broader submission docs were accidentally changed | ✅
- live truth still handled honestly while route remains `404` | ✅

## Verdict
**Pass.**

The two-doc demo reorder does exactly what it was supposed to do:
- truth remains first
- product feeling arrives earlier for human judges
- the undeployed route is no longer the primary entrypoint
- scope remained tightly bounded

## Practical result
The active Synthesis submission flow is now aligned with current truth:
- wrapped artifacts are primary
- live research page is the first public visual anchor
- CLI is backup evidence
- `/discover-research/` is only the intended deployed surface until production catches up
