# One-Hundred-Twenty-Fourth Slice Learning — First-Seen Provenance Registry Ergonomics (2026-03-22 03:38 UTC)

## Context
The boundary for tamper-resistant first-seen provenance is now defined. The implementation risk is contributor/operator usability: strict spoof-resistance is required, but opaque provenance errors can trigger bypass pressure.

## Applied learning

### 1) Provenance failures must distinguish integrity vs freshness vs identity drift
A single generic “registry mismatch” error forces guesswork and slows recovery.

**Rule:** every provenance failure should expose deterministic classification:
- integrity invalid,
- registry stale,
- fixture ID duplicate/mutation,
- record missing/conflict,
- cutoff policy violation.

This lets teams fix the right layer first.

### 2) First-seen diagnostics should include both observed and authoritative context
Operators need to see why a fixture is treated as “new deprecated addition” instead of legacy.

**Rule:** blocked fixture diagnostics should always include:
- `fixtureId`,
- observed schema/path/content hash,
- authoritative first-seen schema/commit/path/hash (when present),
- phase and policy version.

### 3) Strict spoof-resistance works better with deterministic remediation hints
Hard-fail without next action increases manual override temptation.

**Rule:** each reason code maps to one explicit remediation path:
- repair provenance registry integrity,
- refresh stale registry source,
- resolve ID conflict/mutation,
- migrate deprecated fixture schema.

### 4) Registry freshness should be visible, not implicit
If freshness status is hidden, contributors cannot predict why CI accepted/rejected a run after policy changes.

**Rule:** output always includes:
- `registryVersion`,
- `registryHash`,
- freshness verdict,
- policy hash/version used for comparison.

### 5) Contributor UX improves when provenance checks run before semantic/parity checks
Running deeper checks first creates noisy failures and obscures provenance root causes.

**Rule:** keep fixed stage order and fail-fast on provenance blockers:
1. registry integrity/freshness,
2. first-seen provenance checks,
3. semantic consistency,
4. parity comparison.

### 6) ID mutation handling needs explicit migration mechanism
Legitimate fixture refactors should not require policy weakening.

**Rule:** fixture ID changes must go through explicit migration record flow (old ID -> new ID mapping with audit trail), otherwise fail as mutation.

### 7) Compact output should still preserve audit traceability
Concise logs are good, but must retain enough fields for postmortem analysis.

**Rule:** compact mode shows one-line blocker + fixture ID + reason code; verbose mode includes full provenance tuple and decision trace.

## Immediate implementation guidance
- Implement reason-code-to-remediation mapping table in code, not prose-only docs.
- Add deterministic provenance mismatch formatter (compact + verbose modes).
- Keep strict fail-closed behavior unchanged; optimize contributor velocity through clearer, structured diagnostics.
