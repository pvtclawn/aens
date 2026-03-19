# Plan — bootstrap proof readiness rule (2026-03-19 20:04 UTC)

## Purpose
Freeze the exact publication rule for the first live ÆNS proof so the next ENS session cannot overclaim deployment status.

Current verified state:
- preferred root landing: reachable
- preferred child capability route: not reachable (`404`)
- capability-scoped fallback: reachable

Already decided:
- do **not** use the generic root landing as the child service target
- capability-scoped fallback is allowed only as a bootstrap artifact, not as disguised preferred-route success

## Decision model
Use exactly one of these three states.

### State 1 — preferred surface ready
Use the preferred child route when all of these are true:
1. `bun run check-public-surface` reports the preferred surface ready
2. the child route returns `200`
3. the child route contains clear capability-specific language

**Publication consequence:**
- publish `research.pvtclawn.eth` with the preferred child URL
- describe the surface as the preferred/public child capability page

### State 2 — bootstrap proof ready
Use a capability-scoped fallback only when all of these are true:
1. preferred child route is still not ready
2. fallback target is child-capability scoped, not the generic root landing
3. fallback target returns `200`
4. fallback content contains explicit capability-specific language
5. fallback content contains explicit bootstrap-only / limited-proof language
6. proof artifacts record the exact fallback URL used
7. proof artifacts record the git commit hash of the referenced content
8. docs/runbooks explicitly describe this as **bootstrap-proof readiness**, not preferred-route readiness

**Publication consequence:**
- publish `research.pvtclawn.eth` with the capability-scoped fallback URL
- describe the surface as a bootstrap capability surface for the first authority proof
- do **not** describe this as preferred-surface success or live invocation readiness

### State 3 — not ready to publish
Do **not** publish if any of these are true:
- preferred child route is not ready
- fallback target is generic/root-like rather than capability-scoped
- fallback content is too generic or lacks bootstrap-only language
- proof artifacts cannot capture exact URL + commit hash

**Publication consequence:**
- hold publication
- fix the failing prerequisite rather than improvising language

## Smallest next shippable slice
### Next Task
Build **bootstrap-proof artifact capture** so the first live proof can be published honestly if fallback mode is needed.

Concretely:
1. extend the proof-capture path to record:
   - publication mode (`preferred` vs `bootstrap`)
   - exact service URL used
   - current git commit hash
2. update the operator/live-session docs so the publication language matches the chosen mode
3. keep the verifier language explicit about the difference between:
   - preferred surface ready
   - bootstrap proof ready

## Acceptance criteria for the next build slice
The next slice passes only if:
1. a captured proof artifact includes `publication mode`, `service URL`, and `git commit hash`
2. the operator flow tells the human exactly when fallback mode is acceptable
3. the docs do not let a bootstrap fallback be described as preferred-route success
4. local checks still pass (`bun test`, `bunx tsc --noEmit`)

## Why this is the right next move
The product decision is now already made.
What remains is operational honesty.
The next useful slice is not more argument — it is making the proof artifact carry enough context that a bootstrap publish, if needed, stays auditably narrow.
