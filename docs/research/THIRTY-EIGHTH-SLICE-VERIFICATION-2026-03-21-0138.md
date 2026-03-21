# Thirty-eighth ÆNS slice verification — product-first artifact preamble (2026-03-21 01:38 UTC)

## Scope
Verify the new product-first artifact preamble against the fresh challenge note and current submission docs.

Targets checked:
- the artifact section starts with the product question rather than wrapper fields
- the example/live distinction is explicit
- the `officialEndpointDeclared` non-overclaim contrast is visible before the legend
- the patch did not accidentally restore the dead public `/discover-research/` route as the primary current truth surface inside the artifact section
- current live/public truth remains explicit while the route is still undeployed

## Commands run
```bash
git status -sb
/home/clawn/.bun/bin/bunx tsc --noEmit
timeout --kill-after=2 25s /home/clawn/.bun/bin/bun test src/*.test.ts
/home/clawn/.bun/bin/bun run check-public-surface || true
sed -n '/## Agent-judge packaging add-on/,/## Best final judge-facing sentence/p' docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md
grep -n 'discover-research/' docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md || true
read docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md around the demo-flow block
```

## Observed results
### Repo health
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`61 pass`)

### Live public truth
Current live verifier result still says:
- `public root: ok`
- `research capability page: ok`
- `discover research page: http 404`
- `Preferred public surface ready: no`
- `Bootstrap proof ready: yes`

So the deployed public discovery route is still not current truth.

### Artifact-section verification
The patched artifact section now begins with:
- product question first (`given a root ENS identity, what is the official research endpoint, and is it actually parent-authorized?`)
- explicit interpretation rule (`example artifact = deterministic target state`, `live artifact = current namespace truth`)
- explicit non-overclaim contrast (`officialEndpointDeclared` is not the same as fully live/publicly deployed)
- tiny legend only after the product framing

That part of the patch behaves correctly.

### Broader submission-doc consistency check
However, the same form pack still includes an earlier `## Demo flow for judges` section that begins with:
1. `Open the public discovery route`
2. `https://aens-nine.vercel.app/discover-research/`

And the demo script still points to:
- `https://aens-nine.vercel.app/discover-research/`

Since the live route still returns `404`, the broader submission-doc stack is **not yet fully aligned** with the new surface-priority note (`artifacts first, route later with caveat`).

## Acceptance mapping
Target | Result
- artifact section starts with product question | ✅
- example/live distinction explicit | ✅
- non-overclaim contrast visible before legend | ✅
- artifact section itself does not restore the dead route as primary current truth surface | ✅
- broader submission docs fully aligned with artifacts-first priority | ⚠️ no

## Verdict
**Partial pass.**

What passes:
- the narrow preamble patch itself is good
- the artifact section now starts from the product question rather than wrapper semantics
- humans get the right interpretation rule and non-overclaim boundary before the legend

What does not fully pass yet:
- the wider submission-doc stack still has route-first demo instructions even though `/discover-research/` is still undeployed

## Practical result
The product-first preamble fixed the local artifact section, but one more tiny docs-consistency slice is still needed:
- demote the public route in the form-pack demo flow and demo script
- foreground the wrapped artifacts and CLI backup until deploy truth changes

## Smallest next move
Patch the human-facing demo ordering so it matches the already-frozen submission surface priority:
1. wrapped artifacts first
2. CLI backup second
3. live research capability page third
4. public discovery route only with explicit caveat until it actually deploys
