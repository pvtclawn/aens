# Twelfth AENS slice — contrasting capability-authority examples (2026-03-19 10:12 UTC)

## Goal
Make the full capability-authority classifier legible from the CLI by extending the deterministic example path beyond one happy case.

## Slice
Add deterministic `--example` scenarios for contrasting capability-authority states alongside the existing positive path.

## What this adds
- expanded `src/examples.ts` registry with:
  - `parent-authorized-capability`
  - `unlisted-child-capability`
  - `identity-mismatch-capability`
- example tests for:
  - scenario registry/state coverage
  - rendered report output for each contrasting authority state
  - CLI parsing for the expanded example mode
- existing CLI/report/authorization pipeline reused with no new input mode

## Why this matters
AENS already had the authority classifier, but only one visible example path.
This slice makes the classifier legible as a model instead of a hidden implementation detail.

## Example commands
```bash
bun run inspect --example parent-authorized-capability
bun run inspect --example unlisted-child-capability
bun run inspect --example identity-mismatch-capability
```

## Success criterion
A user can now run deterministic CLI examples that clearly demonstrate:
- authorized child capability
- matching-but-unlisted child capability
- listed child capability with identity mismatch

without requiring live ENS writes or a second non-ENS input path.

## Scope boundary
This slice does **not** add:
- live ENS publication
- sample JSON input mode
- payment or invocation support
- new trust/report semantics
