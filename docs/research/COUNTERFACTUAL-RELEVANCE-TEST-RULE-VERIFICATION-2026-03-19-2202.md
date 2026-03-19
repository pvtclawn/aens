# Counterfactual relevance test rule verification (2026-03-19 22:02 UTC)

## Purpose
Verify whether the newly frozen `Counterfactual relevance test` rule already requires an immediate structure patch in current planning surfaces, or whether the honest move is to keep the rule frozen without adding more process.

This verification follows the explicit next-priority constraint:
- only add the smallest guard if a real gap exists
- otherwise avoid turning anti-drift work into process bloat

## Checks run
```bash
git status -sb
bun test
bunx tsc --noEmit
find docs/research -maxdepth 1 -type f \( -iname '*template*' -o -iname 'PLAN-*' \) | sort
grep -RIn "Core delta\|Rail delta\|Counterfactual relevance" docs/research/PLAN-* | cut -d: -f1 | sort -u
```

## Observed repo health
- working tree clean
- tests: pass
- typecheck: pass

## What the planning-surface checks show
### 1) There is no generic slice-plan template file to patch right now
The only current `*TEMPLATE*` file in `docs/research/` is:
- `FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

That file is for proof wording, not slice planning.
So there is no existing reusable planning template that obviously needs the new section added immediately.

### 2) The new anti-drift rule already exists in the current active planning-rule docs
The grep checks show that the only plan docs currently carrying the new planning structure are:
- `PLAN-CORE-DELTA-RAIL-DELTA-RULE-2026-03-19-2138.md`
- `PLAN-COUNTERFACTUAL-RELEVANCE-TEST-RULE-2026-03-19-2200.md`

That is the correct place for the rule right now.

### 3) Retrofitting old plan notes would be process bloat, not real progress
There are many historical `PLAN-*` docs from earlier slices.
Those are records of earlier decisions, not an active reusable template surface.
Bulk-editing them now would:
- add ceremony
- blur historical accuracy
- produce little actual anti-drift value

So the rule does **not** justify retrofitting the archive.

## Verification result
### Immediate Lane-B structure patch needed: **no**
There is no current reusable slice-plan template or active planning surface that obviously requires an immediate `Counterfactual relevance test` patch.

The rule is already frozen in the right place:
- current planning-rule docs
- project memory

That means the honest move is:
- keep the rule frozen
- avoid adding extra structure until a future planning surface actually needs it

## Why this is the right outcome
This is exactly what the new anti-drift discipline is supposed to prevent.

If I patched something anyway, the repo would be doing anti-drift work that itself drifts into paperwork without a real surface gap.

So the correct result here is not “more process.”
It is a verified **no-action-needed** report.

## Verdict
### Lane B: skipped with reason
No real structure gap appeared quickly.
Adding more planning scaffolding right now would be process bloat.

### Lane C deliverable: complete
This note serves as the verification artifact that the rule is already adequately frozen and does not yet require a structural doc patch.

## Next step
Rotate onward only if a future planning template or active slice note actually needs the explicit section.
Until then, keep the rule frozen and spend effort on genuinely load-bearing work.
