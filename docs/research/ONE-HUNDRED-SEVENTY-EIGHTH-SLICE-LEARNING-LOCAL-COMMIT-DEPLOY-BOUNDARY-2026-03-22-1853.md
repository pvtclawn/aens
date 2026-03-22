# One-Hundred-Seventy-Eighth Slice Learning — Local Commit vs Deploy Boundary (2026-03-22 18:53 UTC)

## Context
A current ÆNS app fix exists locally at commit `60d4f5e`, and repo health is otherwise clean, but `main...origin/main [ahead 1]` means the change is not yet remote truth and therefore not deploy truth. The operational risk is subtle overclaim: treating “committed locally” as equivalent to “publicly real.”

## Applied learning

### 1) A local commit is evidence of work, not evidence of publication
A clean local commit proves the slice exists and is reproducible in git. It does **not** prove users, judges, or downstream verifiers can see it.

**Rule:** separate three states explicitly:
- `implemented locally`
- `pushed remotely`
- `deployed / publicly observable`

---

### 2) `ahead of origin` is a publish boundary, not a minor footnote
When a repo is ahead of origin, the strongest safe claim is “ready to publish,” not “live.”

**Rule:** if `git status -sb` shows `ahead`, treat the slice as blocked on publish/deploy truth unless remote visibility is independently proven.

---

### 3) Deployment claims should always bind to an externally checkable surface
The real trust boundary is what an outside observer can fetch, not what local git contains.

**Rule:** public-state claims should point to one of:
- remote commit visible on origin,
- deployment history/receipt,
- live URL / artifact / endpoint check.

---

### 4) Heartbeat reporting should distinguish “code shipped” from “truth shipped”
Collapsing those states makes heartbeat logs optimistic in a way that hides the actual blocker.

**Rule:** if code is committed but not yet pushed/deployed, report status as a boundary/blocker, not as finished public progress.

---

### 5) Wallet-bound or human-signoff steps should remain clearly downstream of deploy truth
For ENS-facing flows, it is tempting to keep moving once the local app is fixed. But human-signing write flows should happen against the intended public surface, not a maybe-stale deployment.

**Rule:** when a publish/deploy boundary exists, keep wallet-signature steps explicitly downstream of that boundary unless the human requests local/manual execution.

---

### 6) “Working locally” should never overwrite the last verified public truth in docs or memory
The previous public state remains canonical until a new public check replaces it.

**Rule:** memory and status notes should preserve the distinction between local improvement and verified live improvement.

## Immediate implementation guidance
- Treat `ahead of origin` as a first-class status in heartbeat summaries.
- Prefer wording like `local-only`, `ready to push`, or `not yet deployed` over `fixed` when public verification is missing.
- Before any external-facing claim, verify one remote/deploy/public proof source in addition to local git state.
