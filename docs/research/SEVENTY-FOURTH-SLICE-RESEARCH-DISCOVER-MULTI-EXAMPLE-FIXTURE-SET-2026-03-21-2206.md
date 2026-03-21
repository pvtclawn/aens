# Seventy-Fourth Slice Research — discover-research Multi-Example Fixture Set (2026-03-21 22:06 UTC)

## Goal
Freeze a minimal, actionable fixture set for multi-example discover demos (authorized, partial authorization, missing capability, timeout failure shape) without changing the current contract.

## Checks run
```bash
bun run discover-research -- --example parent-authorized-capability --json
bun run discover-research -- --example unlisted-child-capability --json
bun run discover-research -- --example identity-mismatch-capability --json
```

## What is true now
1. `parent-authorized-capability` works and provides the deterministic positive path for discover-research.
2. `unlisted-child-capability` and `identity-mismatch-capability` currently fail in discover CLI with:
   - `Example <id> is not a research capability example`
3. Root cause is structural, not transient: discover CLI currently hard-requires fixture child ENS names to start with `research.` (`src/discover-research.ts`, `resolveDiscoverResearchExampleResult`).
4. Existing `src/examples.ts` fixture IDs are capability-general (good for authority demos), but only one fixture is discover-research compatible today.

## Actionable insights (D-lane output)

### Insight 1 — discover demo has an example-surface mismatch
- The project has three fixture IDs, but discover CLI can only consume one because two are non-`research.*` capability names.
- User-facing effect: demos feel single-example even though fixture registry appears broader.

### Insight 2 — minimal demo coverage should follow reason/outcome semantics, not fixture count
For discover demos, the smallest useful set is outcome-based:
1. **authorized** → parent-authorized + service URL present
2. **partial authorization** → child found but parent/child authorization incomplete
3. **missing capability** → child not found (no address/url/capabilities)
4. **timeout failure shape** → `lookup-failed` with `failureClass=rpc-timeout`, `retryable=true`

### Insight 3 — keep backward compatibility by adding discover-specific fixtures, not mutating legacy ones
- Preserve current capability-general fixtures for authority demos.
- Add discover-focused fixtures (or discover fixture adapter) that all satisfy `research.*` constraint and map cleanly to the four outcome classes above.

## Frozen minimal fixture set proposal (v1)
1. `parent-authorized-capability` (existing; keep)
2. `research-unlisted-child-capability` (new deterministic partial-authorization case)
3. `research-missing-child-capability` (new deterministic missing-capability case)
4. `timeout-failure-shape` (gated verification shape, not default path; must reuse existing 502 contract)

## Next smallest build slice (handoff)
Implement only discover-specific example coverage (no contract changes):
- add two `research.*` deterministic example IDs for partial/missing cases,
- expose them in discover usage text,
- add tests proving all discover fixture IDs resolve and preserve existing output schema.
