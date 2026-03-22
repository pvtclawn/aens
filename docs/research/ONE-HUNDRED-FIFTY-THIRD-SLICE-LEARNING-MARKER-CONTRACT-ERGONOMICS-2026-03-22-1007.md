# One-Hundred-Fifty-Third Slice Learning — Marker-Contract Ergonomics (2026-03-22 10:07 UTC)

## Context
Public-surface checks now fail with marker drift after UI de-hardcode/rebrand:
- root/research are reachable but missing expected markers,
- discover route remains healthy,
- bootstrap fallback still passes.

The reliability challenge is balancing strict machine checks with legitimate copy evolution.

## Applied learning

### 1) Marker strictness should anchor on role semantics, not branded wording
Identity-specific labels are volatile and can create false regressions.

**Rule:** prefer role markers (`landing explorer`, `research capability route`) over personal branding strings.

---

### 2) Checker failures must preserve high diagnostic precision
“Not ready” alone is insufficient during copy transitions.

**Rule:** emit per-surface drift diagnostics with both expected marker and mismatch class (`reachable-but-marker-drift`) so triage is immediate.

---

### 3) Alias windows are useful only as short migration bridges
Permanent dual-marker acceptance weakens checker value and can hide accidental copy regressions.

**Rule:** if alias windows are used, require explicit sunset criteria (e.g., two consecutive green runs on canonical markers) and then remove legacy aliases.

---

### 4) Runtime marker contracts and bootstrap marker contracts must stay separate
Fallback proof pages serve a different purpose from preferred runtime pages.

**Rule:** do not normalize fallback marker text to runtime copy semantics; keep fallback checks explicit and independent.

---

### 5) Single-source marker constants reduce silent drift
Literal duplication across checker + tests is the fastest path to inconsistent outcomes.

**Rule:** centralize marker constants and consume them from tests/checkers; no ad hoc marker strings in downstream assertions.

---

### 6) Marker checks should fail closed, but not block root-cause classification
Strict failure is correct for `preferredSurfaceReady`, but operators need confidence that outage vs copy drift are distinguished.

**Rule:** maintain red status on marker drift while preserving clear categorization (`unreachable` vs `drift` vs `ok`) in output summaries.

---

### 7) Copy updates should include a marker-contract checklist in the same PR
Most drift is process drift, not logic drift.

**Rule:** any UI copy/title change affecting monitored pages must include marker-constant + checker-test updates in the same slice.

## Immediate implementation guidance
- Add shared marker constants module and migrate checker/test literals to it.
- Keep fallback marker constants in a dedicated bootstrap section, separate from preferred runtime markers.
- Add a lightweight “copy change marker checklist” note in contribution docs for monitored public pages.