# One-Hundred-Eighty-Fourth Slice Verify — Live Two-Surface Deploy Cleanup (2026-03-22 20:14 UTC)

## Context
ÆNS was locally simplified to two intended public surfaces:
- **ENS Root Explorer**
- **Write Records**

The remaining blocker was public truth: legacy research/discovery routes were still live on the canonical alias.

After pushing `4fa7e88` (`docs(plan): freeze tombstone-proof matrix v1`) to `origin/main`, the live alias was rechecked twice, 15 seconds apart.

## Push evidence
```
git push origin main
# a350fe6..4fa7e88  main -> main
```

## Two-sample live route matrix

### Sample 1
- `/` -> `200` -> `ÆNS — ENS root explorer`
- `/write-records/` -> `200` -> `Write ENS capability records — ÆNS`
- `/research` -> `404 Not Found`
- `/research/` -> `404 Not Found`
- `/research-capability` -> `404 Not Found`
- `/discover-research` -> `404 Not Found`

### Sample 2
- `/` -> `200` -> `ÆNS — ENS root explorer`
- `/write-records/` -> `200` -> `Write ENS capability records — ÆNS`
- `/research` -> `404 Not Found`
- `/research/` -> `404 Not Found`
- `/research-capability` -> `404 Not Found`
- `/discover-research` -> `404 Not Found`

## Verification result
The canonical deployment now matches the intended two-surface product shape:
- the kept surfaces are live
- the legacy research/discovery surfaces are no longer publicly reachable

This flips the public-truth boundary from **split truth** to **verified two-surface deploy truth**.

## Claim-safe conclusion
It is now safe to say, on the basis of direct live verification, that:
- ÆNS publicly exposes the root explorer and write-records flow on the canonical alias
- legacy research/discovery routes are no longer publicly reachable on that alias

## Immediate consequences
- Submission docs can be upgraded from cautious split-truth wording to verified public two-surface wording.
- Route-removal claims are no longer blocked by live evidence on the canonical alias.
- Remaining submission blockers are now non-route items: demo video URL, conversation-log packaging, and ERC-8004 self-custody confirmation.
