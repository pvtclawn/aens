# One-Hundred-Forty-Third Slice Learning — Ownership-Precedence Diagnostics Ergonomics (2026-03-22 09:01 UTC)

## Context
Task 2 precedence boundary is frozen. The remaining reliability risk is operator confusion when ownership-contract failures preempt stage-level blockers.

## Applied learning

### 1) Preemption must be visible before reason details
When ownership failures are rendered after stage fields, operators assume stage remediation first.

**Rule:** output order for failure runs should be:
1. `primarySource` (`ownership-contract`),
2. ownership status (`unmapped|mismatch`),
3. contract reason code,
4. stage triad (context only).

---

### 2) Compact output needs explicit “stage suppressed” signal
Without a suppression token, users read stage rows as actionable blocker selection.

**Rule:** compact line for ownership failures should include deterministic token:
- `stagePrimarySuppressed=true`

This avoids accidental stage-first remediation.

---

### 3) Remediation hints must target ownership registry, not stage policies
For `unmapped/mismatch`, stage-level hints are misdirection.

**Rule:**
- `unmapped` -> “register reason->stage ownership first”,
- `mismatch` -> “align claimed stage with canonical owner”,
- suppress generic freshness/integrity/identity remediation until ownership is resolved.

---

### 4) Verbose diagnostics should keep claimed/canonical owner adjacent
Splitting these across sections increases triage latency and copy/paste errors.

**Rule:** mismatch block should always emit ordered pair in one line:
- `claimedStageOwner -> canonicalStageOwner`

---

### 5) Ownership failure should include stable registry identity in both compact+verbose forms
Without version/hash context, cross-surface disagreement is hard to adjudicate.

**Rule:** include `reasonStageRegistryVersion` in compact and `version+hash` in verbose.

---

### 6) Stage triad remains useful as context, but must be labeled non-primary
Operators still need stage snapshot for secondary checks.

**Rule:** when ownership preemption is active, render stage triad with non-primary label:
- `stageStatusContextOnly=true`

---

### 7) Keep wording short to preserve machine+human parity
Long prose causes adapter drift and unstable parsing.

**Rule:** use fixed short strings for failure classes and hints; avoid environment-specific phrasing.

## Immediate implementation guidance
- Add compact preemption tokens (`stagePrimarySuppressed`, `stageStatusContextOnly`).
- Add deterministic short hint templates keyed by ownership failure class.
- Ensure verbose mismatch block emits claimed->canonical owner adjacency + registry identity.
