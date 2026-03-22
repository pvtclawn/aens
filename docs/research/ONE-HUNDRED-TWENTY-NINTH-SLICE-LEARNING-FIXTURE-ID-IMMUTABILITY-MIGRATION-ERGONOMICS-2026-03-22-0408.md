# One-Hundred-Twenty-Ninth Slice Learning — Fixture-ID Immutability + Migration Ergonomics (2026-03-22 04:08 UTC)

## Context
Identity continuity rules and migration-record boundaries are defined. The practical risk now is operator/contributor execution: strict immutability must hold, but migration authoring/review needs to be predictable enough that teams do not bypass the process.

## Applied learning

### 1) Migration records should be authored through a constrained template
Freeform migration files increase omission and inconsistency risk.

**Rule:** provide a strict migration-record template with required fields pre-labeled:
- `oldFixtureId`
- `newFixtureId`
- `migrationCommit`
- `migrationReason`
- `approvedBy`
- `effectiveAt`
- optional continuity hash metadata

Template-driven authoring lowers friction without relaxing policy.

### 2) Reviewers need a deterministic migration diff view
Raw JSON diffs are noisy; identity intent can get lost in formatting changes.

**Rule:** migration review output should summarize:
1. identity mapping (`old -> new`),
2. continuity evidence (content/path/hash),
3. policy-phase compatibility,
4. pass/fail reason code.

### 3) Immutability failures should separate “rename without migration” from “duplicate ID”
Both are identity issues, but remediation differs.

**Rule:** diagnostics must keep distinct reason codes and hints:
- duplicate ID -> resolve collision,
- mutation without migration -> create approved migration record.

### 4) Cutoff phase should influence migration guidance wording
A migration that is valid in prepare/warning contexts may still be blocked in hard-cutoff depending on schema state.

**Rule:** migration validator output should include current phase and phase-aware next step:
- warning: migrate now before cutoff,
- hard-cutoff: migration + schema compliance required before parity runs.

### 5) Contributor trust improves when migration audit lineage is visible
People are less likely to bypass strict rules when they can see traceability working.

**Rule:** compact output includes migration ID + commit reference; verbose mode shows full lineage chain.

### 6) Fast local preflight prevents CI churn and bypass temptation
If contributors discover migration mistakes only in CI, retries spike and strict checks are blamed.

**Rule:** provide local preflight command that runs:
1. registry integrity/freshness,
2. ID immutability + migration validation,
3. concise blocker report with exact fix path.

### 7) Migration records need lifecycle hygiene too
Old migration records can accumulate ambiguity if not scoped.

**Rule:** migration records should include status/lifecycle markers and optional supersession pointers to avoid conflicting historical mappings.

## Immediate implementation guidance
- Add migration-record schema validator with deterministic field/path diagnostics.
- Add migration-summary formatter for reviewers (compact + verbose).
- Keep strict fail-closed identity checks intact; optimize contributor experience by tightening templates, review summaries, and local preflight ergonomics.
