# One-Hundred-Forty-Fourth Slice Challenge — Ownership-Precedence Implementation Edge Risks (2026-03-22 09:06 UTC)

## Goal
Red-team ownership-precedence implementation risks after the boundary and ergonomics notes, focusing on:
1) suppression-token omission,
2) source-tag drift,
3) fallback sorter re-promotion of stage blockers.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted ownership/parity/discover tests pass (`13 pass`)
- app build pass
- public surface check green

## Challenge findings

### 1) Suppression-token omission can silently re-enable stage-first operator behavior (high)
**Failure mode:** compact adapters omit `stagePrimarySuppressed` / `stageStatusContextOnly` when ownership failure is active.

**Impact:** operators interpret stage triad as active remediation target and ignore ownership contract failures.

**Mitigation:**
- treat suppression/context tokens as required in ownership-failure states,
- fail compact contract tests if either token is absent,
- add fallback renderer that refuses compact output when suppression tokens are missing.

---

### 2) Source-tag drift between compact and verbose surfaces breaks trust (high)
**Failure mode:** verbose path marks `ownership-contract`, compact path defaults to `stage-gate`.

**Impact:** same run appears to have different primary sources across surfaces; triage and audit diverge.

**Mitigation:**
- derive source tag once in shared arbitration primitive,
- prohibit adapter-local source derivation,
- parity tests must diff compact vs verbose source tags for exact equality.

---

### 3) Legacy severity/path sorters can still re-promote stage blockers post-arbitration (high)
**Failure mode:** downstream formatting layers resort reasons after primary arbitration and choose stage blocker by score/order.

**Impact:** ownership failures lose precedence despite correct upstream decision.

**Mitigation:**
- lock primary blocker as immutable after arbitration,
- expose explicit `primaryLocked=true` metadata,
- add regression fixture: `mismatch + freshness fail` must remain ownership primary in all output modes.

---

### 4) Ownership preemption may disappear in partial payload paths (medium-high)
**Failure mode:** certain paths emit stage triad without ownership diagnostics when payload shaping trims optional fields.

**Impact:** contract failures become invisible in thin/compact payloads.

**Mitigation:**
- require ownership-failure diagnostics minimums across all emitters,
- reject partial payloads that have ownership failure without status/source/reason fields,
- add schema guard in serialization boundary.

---

### 5) Fallback remediation templates can mention wrong subsystem (medium-high)
**Failure mode:** generalized remediation helper emits stage-oriented hints even under ownership failure.

**Impact:** teams patch stage policy while registry ownership issue remains unresolved.

**Mitigation:**
- bind remediation template selection to primary source tag,
- ownership-contract source can only emit ownership hint templates,
- snapshot tests for hint text by failure class.

---

### 6) Registry identity can be omitted in compact mode under size pressure (medium)
**Failure mode:** compact output drops registry version while keeping status/reason.

**Impact:** cross-surface disputes cannot confirm same ownership map context.

**Mitigation:**
- include registry version as non-negotiable compact field for ownership failures,
- if hash omitted for brevity, version must still remain,
- add max-size budget tests that preserve required identity fields.

---

### 7) UI-level badge coloring can overrule actual source semantics (medium)
**Failure mode:** presentation layer colors/labels by stage even when `primarySource=ownership-contract`.

**Impact:** visual hierarchy misleads operators despite correct machine payload.

**Mitigation:**
- source-aware UI badge mapping with ownership-contract taking highest visual priority,
- UI tests asserting badge source precedence independent of stage triad values.

## Hardened rule (post-challenge)
Ownership-precedence implementation is acceptable only if:
1. suppression/context tokens are required whenever ownership preemption is active,
2. primary source tag is shared and identical across compact+verbose outputs,
3. post-arbitration re-sorting cannot replace locked primary blocker,
4. ownership-failure diagnostics minimums survive all payload shapes,
5. remediation hints are source-aware and ownership-specific under preemption,
6. compact ownership failures keep registry identity context,
7. UI presentation cannot visually demote ownership-contract source.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- required ownership-preemption token enforcement,
- immutable primary-lock + source-tag parity checks,
- source-aware remediation/UI mapping safeguards.
