# Plan — Immutable Primary-Lock Integrity + Glossary Parity v1 (2026-03-22 09:46 UTC)

## Goal
Convert the latest immutable primary-lock/source challenge into a compact implementation plan that hardens lock integrity semantics while keeping compact diagnostics stable and machine-parity-safe.

## Scope boundary
- In scope: canonical token/tuple guards for lock/source fields, shared glossary parity enforcement, compact non-droppable lock/source/reason retention constraints.
- Out of scope: broad schema redesign, non-diagnostic UI restyling, ENS feature expansion unrelated to lock/source integrity.
- Compatibility: additive machine-facing diagnostics only; no breaking discover/public-surface behavior.

## Task 1 — Add canonical enum + tuple integrity guards
Implement one shared guard module for primary-lock/source diagnostics:
- canonical enums for `primarySource` and `primarySelectionReason`,
- tuple invariants (`primarySource=none => primaryLocked=false`),
- lock-integrity hard-fail classification (`primary-lock-integrity-violation`) when canonical values drift.

### Acceptance criteria
1. Canonical token validation rejects alias values (presence-only checks are insufficient).
2. Tuple guard rejects contradictory lock/source combinations deterministically.
3. Locked-primary mutation is elevated to hard failure with explicit integrity reason.
4. Typecheck + targeted parity tests pass.

---

## Task 2 — Enforce glossary parity via shared constants + checksum checks
Create shared glossary constants for source labels/meanings and ensure all renderers consume them.

### Acceptance criteria
1. Compact/verbose/UI source-label text comes from one shared glossary primitive.
2. Snapshot/parity tests fail when glossary text diverges across surfaces.
3. Deterministic glossary checksum (or equivalent digest) is exposed for parity verification.
4. No adapter-local source label overrides remain in stage-gate diagnostics path.

---

## Task 3 — Add compact non-droppable retention tests for lock/source/reason trio
Protect compact diagnostics under size/serialization pressure.

### Acceptance criteria
1. Compact output always retains required trio:
   - `primaryLocked`
   - `primarySource`
   - `primarySelectionReason`
2. Compression/truncation fixtures prove required trio survives while secondary diagnostics are the first to trim.
3. Verbose ordering contract remains lock -> source -> reason -> stage context.
4. Public-surface/discover behavior remains non-regressed.

## Next smallest handoff
Lane B should implement **Task 1 only**:
- add canonical enum/tuple guard primitives,
- wire lock-integrity violation classification,
- add focused tests for alias rejection and `none=>unlocked` tuple enforcement.