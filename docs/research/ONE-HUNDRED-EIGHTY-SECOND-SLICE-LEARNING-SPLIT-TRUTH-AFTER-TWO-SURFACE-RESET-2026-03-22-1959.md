# One-Hundred-Eighty-Second Slice Learning — Split Truth After Two-Surface Reset (2026-03-22 19:59 UTC)

## Context
ÆNS was locally simplified to the cleaner two-surface product truth:
- **ENS Root Explorer**
- **Write Records**

Repo health at this learning pass stayed strong:
- `git status -sb` → `main...origin/main [ahead 4]`
- `bun run typecheck` → pass
- `cd app && bun run build` → pass

But the immediately preceding boundary check already showed that live deployment truth still contains legacy research/discovery surfaces. So the product reset is real in local code and docs, while public truth is still polluted by old routes.

## Applied learning

### 1) Simplifying a product locally does not simplify public truth until the old routes disappear live
A reset that removes surfaces is stricter than a normal additive feature ship. Users do not experience “what the repo no longer intends”; they experience whatever routes the deployment still serves.

**Rule:** after a product simplification, treat legacy live routes as active public truth until direct URL checks show they redirect away or disappear.

---

### 2) Product truth can become split in a way that looks deceptively clean from the homepage
In this reset, `/` and `/write-records/` can look correct while `/research` or `/discover-research` still remain publicly reachable. That means surface-level checks can falsely suggest the simplification is complete.

**Rule:** post-reset verification must check both the kept surfaces **and** the removed surfaces.

Minimum split-truth checklist:
- kept surface still works (`/`)
- kept surface still works (`/write-records/`)
- removed surface no longer behaves like product (`/research` or replacement route)
- removed surface no longer behaves like product (`/discover-research`)
- legacy alias routes no longer re-expose removed pages

---

### 3) “Local product truth” and “public product truth” need explicit wording, not implied wording
If the repo now models two surfaces but the live deploy still exposes four-ish public entry points, saying “ÆNS now only has two surfaces” is directionally correct but publicly false.

**Rule:** use explicit split-truth wording until deploy verification closes the gap:
- `implemented locally: two-surface reset`
- `publicly verified: legacy routes still live`
- `not yet safe to claim publicly: only two surfaces remain`

---

### 4) Removal claims require stronger proof than addition claims
An added route is proven by one successful fetch. A removed route needs stronger evidence because redirects, stale aliases, old bundles, or fallback routing can keep the old experience reachable even after the local code says it is gone.

**Rule:** treat “this surface is gone” as requiring negative verification, not just positive verification of the new happy path.

---

### 5) Deployment checks after a reset should be framed as decontamination, not just rollout
When old product surfaces linger, the risk is not only that the new model is unpublished; it is that public understanding stays contaminated by prior product shape.

**Rule:** the deployment-verification question after a simplification is:
- not only **did the new surface deploy?**
- but also **did the old surface stop surviving through redirects, legacy routes, and stale entrypoints?**

---

### 6) Heartbeat reporting should preserve the stronger truth boundary during resets
A simplification heartbeat can feel like a completion event because code deletion and UI cleanup are visible, but if old public surfaces survive, the right status is still boundary-learning rather than public-finish messaging.

**Rule:** during a reset, heartbeat summaries should prefer `split-truth`, `legacy routes still live`, or `local-only simplification` over `reset complete` until live verification proves the old shape is actually gone.

## Immediate implementation guidance
- Keep the two-surface product wording in local docs/code, but annotate it as local truth until deployment catches up.
- When verifying the deploy, probe both surviving routes and routes meant to be removed.
- Do not describe legacy surfaces as “gone” until they either redirect to approved destinations or stop serving product pages entirely.
- Use split-truth language in any status summary until the live route matrix matches the simplified product model.
