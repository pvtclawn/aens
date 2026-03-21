# Thirty-fourth ÆNS slice verification — `discover-research` CLI (2026-03-20 23:59 UTC)

## Scope
Verify the new consumer-first `discover-research` command against the frozen MVP cut:
- `research` as the single capability type
- consumer loop = input parent ENS name -> derive child research capability -> verify parent authorization -> return the official endpoint
- authorization stays separate from liveness
- current preferred public surface is treated as observed public truth, not automatic end-to-end readiness

## Commands run
```bash
git status -sb
/home/clawn/.bun/bin/bunx tsc --noEmit
timeout --kill-after=2 25s /home/clawn/.bun/bin/bun test src/*.test.ts
/home/clawn/.bun/bin/bun run check-public-surface
/home/clawn/.bun/bin/bun run discover-research -- pvtclawn.eth
/home/clawn/.bun/bin/bun -e "...synthetic parent-authorized render..."
grep -n "MVP v1 loop\|Current proof status\|discover-research\|fully live end-to-end\|liveness" README.md
```

## Observed results
### Repo health
- `git status -sb` clean
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`58 pass`)

### Public truth
`bun run check-public-surface` currently reports:
- preferred root: ok
- preferred research capability page: ok
- `Preferred public surface ready: yes`
- `Bootstrap proof ready: no`

This means the preferred capability page is currently live as public truth.

### Live `pvtclawn.eth` discovery path
`bun run discover-research -- pvtclawn.eth` currently returns the honest negative result:
- `Authorization status: not-a-capability-surface`
- `Official research endpoint: (none declared)`
- `Liveness checked: no`
- `Ready to use now: no`

This is good: the live command does **not** bluff readiness when the live ENS records are not published yet.

### Synthetic positive-path render
The synthetic parent-authorized case currently renders:
- `Authorization status: parent-authorized`
- `Official research endpoint: https://aens-nine.vercel.app/research-capability/`
- `Liveness checked: no`
- `Ready to use now: yes`
- note: `authorization is parent-authorized, but liveness still needs to be checked separately if required`

This is the important verification finding.

## Acceptance mapping
Target | Result
- CLI matches the `research`-only MVP wedge | ✅
- live negative path stays honest on current `pvtclawn.eth` truth | ✅
- README exposes the new command and current proof boundary | ✅
- preferred public surface is checked as observed public truth | ✅
- authorization remains clearly separate from liveness in positive-path output | ⚠️ partial

## Main verification finding
The slice is **mostly correct**, but it still has one wording-level semantics leak on the positive path.

Why:
- the README says ÆNS does **not** prove the endpoint is fully live end-to-end unless liveness is checked separately
- the positive-path CLI result still prints `Liveness checked: no` and **also** `Ready to use now: yes`

That combination is too strong.
It does not break the underlying authority model, but it weakens the wording boundary the README is trying to protect.

## Verdict
**Partial pass.**

What passes:
- the command is a real consumer-first surface now
- the live negative path is honest
- the repo/public-surface truth is currently clean
- the `research` wedge is now executable rather than just described

What does not fully pass:
- the positive-path output still compresses `parent-authorized + service URL declared` into `Ready to use now: yes` even when `livenessChecked: no`

## Smallest next move
Do one narrow wording hardening slice for `discover-research` output:
- replace `Ready to use now` with wording that stays strictly about authorization/declaration rather than end-to-end readiness
- keep `Liveness checked` explicit
- keep README and command wording aligned

Example direction:
- `Official endpoint declared: yes`
- `Authorization sufficient to treat as official: yes`
- `Endpoint liveness checked: no`

## Core delta
None.
This verification changes no protocol behavior; it tests whether the current command language stays faithful to the existing authority-vs-liveness boundary.

## Rail delta
Moderate.
This is trust-language verification on the consumer-facing CLI surface.

## Counterfactual relevance test
Would this verification still mostly make sense without the `child capability under parent identity` model?

Partly, but not fully.
The specific bug only matters because ÆNS is trying to distinguish official capability authorization from endpoint liveness, and that distinction is central to the current capability-authority model.

## Result
`discover-research` is real and useful now, but one small wording leak remains before its positive path is fully aligned with the frozen MVP truth.
