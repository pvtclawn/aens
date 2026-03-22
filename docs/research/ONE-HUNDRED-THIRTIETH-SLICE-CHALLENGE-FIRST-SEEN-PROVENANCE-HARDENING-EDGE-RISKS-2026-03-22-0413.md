# One-Hundred-Thirtieth Slice Challenge — First-Seen Provenance Hardening Edge Risks (2026-03-22 04:13 UTC)

## Goal
Red-team first-seen provenance hardening implementation for edge-case bypass/drift risks, focusing on:
1) migration-record conflict handling,
2) ID-mutation false positives/false negatives,
3) mismatch-diagnostic determinism under mixed identity failures.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted first-seen/cutoff/parity/blocker/grace/provenance/validator/write-intent/publish/discover-service tests pass (`53 pass`)
- public surface check green

## Challenge findings

### 1) Migration-record conflict graph can become ambiguous under chained renames (high)
**Failure mode:** multiple migration records create overlapping or cyclic mappings (A→B, B→C, C→A or A→B and A→D), with no deterministic conflict resolver.

**Impact:** same fixture lineage can be interpreted differently across runs/tools, opening bypass paths and nondeterministic blocker selection.

**Mitigation:**
- model migration records as DAG with cycle rejection,
- enforce single outbound mapping per `oldFixtureId` per migration epoch,
- require deterministic conflict blocker (`fixture-provenance-id-migration-conflict`) before any fallback.

---

### 2) Over-strict mutation detection can create false positives for benign refactors (high)
**Failure mode:** path-only reorganizations or canonical formatting changes trigger mutation blocker despite stable identity and valid provenance continuity.

**Impact:** contributors face unnecessary hard failures and may attempt bypass edits.

**Mitigation:**
- split identity checks into hard keys (fixtureId + approved migration lineage) vs soft continuity hints (path/hash drift),
- allow path drift under unchanged fixtureId when provenance continuity policy explicitly permits,
- emit warning-level context for benign drift while keeping hard identity semantics strict.

---

### 3) Under-strict mutation detection can miss identity replacement (high)
**Failure mode:** attacker/bug reuses fixtureId while swapping semantic payload in a way not covered by current continuity checks.

**Impact:** identity hijack appears legitimate; deprecated/new fixture controls can be bypassed.

**Mitigation:**
- require semantic fingerprint checks in addition to ID (e.g., normalized state class + blocker profile),
- flag incompatible semantic deltas as mutation candidate unless migration record explicitly authorizes change,
- include deterministic mismatch field paths for semantic fingerprint divergence.

---

### 4) Mixed failure classes can produce unstable primary blocker messaging (high)
**Failure mode:** same fixture set triggers multiple issues (duplicate ID + stale registry + migration conflict), but primary blocker varies by iteration order.

**Impact:** triage paths become inconsistent and contributors chase non-root blockers.

**Mitigation:**
- enforce deterministic global precedence for identity/provenance failures,
- sort fixtures and issues canonically before choosing primary blocker,
- expose secondary blockers in ordered list with stable `remaining` metadata.

---

### 5) Migration-record replay can reintroduce deprecated transitions (medium-high)
**Failure mode:** old valid migration records are replayed in later policy phases where transitions should no longer be accepted.

**Impact:** historical approvals leak into current enforcement context.

**Mitigation:**
- bind migration records to policy epoch/version and effective window,
- reject records outside validity window with deterministic reason,
- include epoch/version in migration diagnostics.

---

### 6) Incomplete diagnostics can hide root mismatch fields (medium-high)
**Failure mode:** output reports only high-level reason code without exact mismatching field path under mixed identity conflicts.

**Impact:** fixes become trial-and-error; repeated CI churn increases bypass temptation.

**Mitigation:**
- require field-level mismatch payload for every blocking identity reason:
  - `mismatchFieldPath`
  - `expectedValueSnippet`
  - `observedValueSnippet`,
- keep reason-specific remediation mapping deterministic.

---

### 7) Registry freshness and identity blockers can be conflated (medium)
**Failure mode:** stale registry and ID mutation are reported interchangeably as generic provenance conflict.

**Impact:** teams apply wrong remediation sequence (editing fixtures instead of refreshing registry, or vice versa).

**Mitigation:**
- separate freshness gate from identity gate with explicit stage markers,
- if freshness fails, block before identity checks and mark downstream identity checks as not evaluated,
- emit stage-aware blocker context.

## Hardened rule (post-challenge)
First-seen provenance hardening is acceptable only if all constraints hold:
1. migration lineage graph is acyclic and conflict-deterministic,
2. hard vs soft identity continuity signals are separated to reduce false positives,
3. semantic fingerprint checks catch false negatives in ID-reuse scenarios,
4. mixed failures use stable global blocker precedence,
5. migration records are epoch/policy-bound to prevent replay,
6. blocking diagnostics include deterministic field-level mismatch payload,
7. freshness and identity stages remain strictly separated in reporting and enforcement.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- migration lineage graph validator + conflict precedence,
- stage-separated freshness→identity gate contract,
- deterministic field-level identity mismatch diagnostics schema with reason-specific remediation mapping.
