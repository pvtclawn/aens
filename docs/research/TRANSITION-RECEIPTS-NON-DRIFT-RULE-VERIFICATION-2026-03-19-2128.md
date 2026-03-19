# Transition-receipts non-drift rule verification (2026-03-19 21:28 UTC)

## Purpose
Verify whether the newly frozen non-drift rule already needs an immediate build/doc patch, or whether the current repo surfaces already keep transition receipts subordinate to the core ÆNS thesis.

This verification is intentionally narrow.
It does **not** reopen Vercel forensics or add new receipt machinery.
It checks whether current user-facing surfaces still obey the required ordering:
1. parent identity
2. child capability
3. authorization relationship
4. only then any supporting transition/public-state material

## Checks run
```bash
git status -sb
bun test
bunx tsc --noEmit
bun run check-public-surface
grep -RIn "transition receipt\|transition evidence\|before-state\|after-state\|deployment audit\|public-state transition" \
  docs/research/FIRST-LIVE-AENS-* \
  docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md \
  README.md

grep -RIn "parent-authorized\|child capability\|parent identity\|machine-verifiable authority\|observed public state\|observed public-alias state\|unresolved human control-plane state" \
  docs/research/FIRST-LIVE-AENS-* \
  docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md \
  README.md
```

## Observed repo health
- working tree clean
- tests: pass
- typecheck: pass

## Observed live/public truth
`bun run check-public-surface` still reports:
- `public root: ok (https://aens-nine.vercel.app/)`
- `research capability page: http 404 (https://aens-nine.vercel.app/research-capability/)`
- `github blob fallback: ok (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)`
- `Preferred public surface ready: no`
- `Bootstrap proof ready: yes`

So the stable publication boundary remains unchanged.

## What the doc-surface checks show
The current user-facing proof surfaces already preserve the correct center of gravity.

### Evidence
The main live-proof/operator surfaces foreground:
- `research.pvtclawn.eth` as a **child capability** of `pvtclawn.eth`
- final success as `Capability authorization: parent-authorized`
- layered proof wording with:
  - `Machine-verifiable scope`
  - `Observed public-alias state (time-scoped)`
  - `Unresolved human control-plane state`
  - `Not yet proven`

Importantly, the grep checks found:
- authority-first / child-capability / parent-authorized language in the operator/checklist/template/README surfaces
- **no** transition-receipt-first framing inside those same user-facing surfaces

The transition-receipt language currently lives in research notes where it belongs, not in the top-level proof flow as the main story.

## Verification result
### Immediate build/doc guard needed: **no**
The frozen non-drift rule does not currently require a follow-on build patch.

Right now:
- the public/user-facing surfaces still establish parent identity, child capability, and authorization before any supporting public-state nuance
- transition receipts have **not** yet leaked into a first-position product framing
- the core ÆNS thesis remains legible and intact

## Why this matters
This is the good outcome the rule was meant to protect.

The transition-receipt idea can remain available for future control-plane transition evidence,
while the current live-proof surfaces still say, in effect:
- authority first
- public state second
- supporting causal-history ideas only after that

That means there is no need for a gratuitous structure patch right now.

## Verdict
### Non-drift rule status: **holding**
Current repo surfaces already keep transition receipts subordinate to the `child capability under parent identity` model.

### Lane-B follow-on patch: **not needed now**
The right move is to keep the rule frozen and avoid churn until a future slice actually operationalizes transition receipts more directly.

## Next step
Rotate onward without reopening low-value loops.
If transition receipts become more concrete later, verify the same ordering again at that time.
