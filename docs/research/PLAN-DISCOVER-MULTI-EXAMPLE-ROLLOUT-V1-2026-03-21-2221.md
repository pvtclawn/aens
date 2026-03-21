# Plan — Discover Multi-Example Rollout v1 (2026-03-21 22:21 UTC)

## Goal
Ship the smallest safe implementation that turns discover demos from single-example to outcome-based coverage while preserving current response contract and safety boundaries.

## Smallest shippable milestone
One build slice that adds discover-specific deterministic examples + operator guidance + verification guardrails, without changing API schema.

## Tasks (1–3) with acceptance criteria

### Task 1 — Add discover-specific outcome fixtures (implementation)
Add discover-consumable fixture IDs that satisfy `research.*` constraint:
- `research-unlisted-child-capability` (partial authorization)
- `research-missing-child-capability` (missing child)

Keep existing `parent-authorized-capability` as the positive baseline.

**Acceptance criteria**
- `bun run discover-research -- --example parent-authorized-capability --json` works.
- `bun run discover-research -- --example research-unlisted-child-capability --json` works.
- `bun run discover-research -- --example research-missing-child-capability --json` works.
- Existing authority fixture IDs remain unchanged for `inspect` surface.

---

### Task 2 — Freeze outcome→reason mapping + operator command matrix (docs)
Create a compact mapping artifact and one-screen command matrix clarifying surface usage:
- authority demos vs discover demos vs failure-contract verification path.

**Acceptance criteria**
- Mapping artifact explicitly lists:
  - authorized → `parent-authorized-with-service-url|without-service-url`
  - partial → `child-found-not-authorized`
  - missing → `child-not-found`
  - failure → `lookup-failed` (+ `failureClass`, `retryable`)
- Command matrix is referenced from submission/demo docs and avoids ambiguous fixture guidance.

---

### Task 3 — Add drift/paired-demo verification checks (tests + process)
Add minimal checks to prevent fixture/demo confidence drift:
- snapshot expectations for discover fixture outcomes,
- paired deterministic + live demo acceptance line in discover docs/checklist.

**Acceptance criteria**
- New/updated tests fail if discover fixture outcome mapping drifts unexpectedly.
- Discover demo checklist includes explicit fixture-vs-live boundary statement.
- Failure-shape verification remains marked as default-off/gated path.

## Out of scope (v1)
- API schema changes
- generalized multi-tenant UI redesign
- enabling failure probes in production by default

## Next lane handoff
Lane B: implement Task 1 only (discover-specific fixture coverage) with tests/typecheck green; defer Task 2/3 to follow-up slices if needed.
