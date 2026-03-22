# One-Hundred-Thirty-Fifth Slice Challenge — Stage-Separated Freshness→Identity Edge Drift (2026-03-22 07:57 UTC)

## Goal
Red-team the stage-separated provenance gating direction for edge-case drift and adapter-level trust leaks, focusing on:
1) `not-evaluated` misuse,
2) suppressed-downstream leakage into primary blocker output,
3) reason-code stage-ownership ambiguity across surfaces.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted stage/provenance/discover tests pass (`13 pass`)
- public surface check green

## Challenge findings

### 1) `not-evaluated` can be silently collapsed to `fail` or omitted by adapters (high)
**Failure mode:** formatter/adapters coerce unknown/empty stage values into a binary pass/fail display, or drop downstream stage fields entirely in compact output.

**Impact:** operators cannot distinguish “blocked upstream” from “evaluated and failed,” which breaks deterministic remediation flow.

**Mitigation:**
- enforce strict enum output (`pass|fail|not-evaluated`) at schema boundary,
- reject adapter payloads that omit stage fields,
- include `blockedByStage` + `blockedByReasonCode` whenever `not-evaluated` is emitted.

---

### 2) `suppressedDownstreamReasons` can leak as primary blocker under sorting shortcuts (high)
**Failure mode:** some renderers sort all reasons by severity or lexical order and accidentally elevate identity reasons while freshness failed upstream.

**Impact:** false primary blocker selection; teams “fix” downstream issues that were never validly evaluated.

**Mitigation:**
- lock primary blocker source to earliest failing stage before any severity sorting,
- mark suppressed reasons with explicit non-primary flag,
- add contract tests: freshness fail must never produce identity primary blocker.

---

### 3) Reason-code stage ownership can drift between code constants and UI/docs mappings (high)
**Failure mode:** reason registry and adapter mapping diverge (e.g., same reason interpreted as freshness in CI, identity in local output).

**Impact:** inconsistent triage and contradictory gate messaging across surfaces.

**Mitigation:**
- centralize reason→stage ownership in one exported registry,
- fail closed on unknown/unmapped reason code,
- gate releases with parity checks across CLI/CI/presentation adapters.

---

### 4) Impossible stage combinations can appear via partial payload reuse/caching (medium-high)
**Failure mode:** stale stage fields from previous run merge with fresh blocker metadata, yielding invalid tuples (e.g., `integrity=fail` + `identity=fail`).

**Impact:** audit trace corruption and ambiguous enforcement behavior.

**Mitigation:**
- validate stage tuple invariants at payload construction time,
- emit deterministic contract blocker (`fixture-provenance-stage-contract-invalid`) on invalid combinations,
- forbid caching of partial stage status fragments.

---

### 5) Legacy compatibility paths can bypass stage ordering (medium-high)
**Failure mode:** old code paths still execute identity checks directly when freshness/integrity status is unavailable or degraded.

**Impact:** stage contract becomes advisory instead of authoritative; downstream leakage reappears under error conditions.

**Mitigation:**
- enforce stage gate in shared evaluator used by all entrypoints,
- reject direct identity evaluation calls without upstream pass tokens,
- add regression tests for degraded/partial metadata paths.

---

### 6) Compact summaries can overclaim completion when only upstream checks ran (medium)
**Failure mode:** compact output uses “validated” language after integrity/freshness checks while identity remained `not-evaluated`.

**Impact:** consumer trust drift; false readiness perception.

**Mitigation:**
- reserve completion wording for full `pass/pass/pass` only,
- require compact summary to include explicit stage triad,
- add wording snapshot tests for blocked-stage scenarios.

## Hardened rule (post-challenge)
Stage-separated gating remains trustworthy only if all conditions hold:
1. `not-evaluated` is explicit, never implicit,
2. earliest-failing-stage arbitration is non-overridable,
3. reason-code stage ownership is centralized and fail-closed,
4. impossible stage tuples are rejected with deterministic contract reason,
5. all execution paths share one stage-order gate,
6. compact output cannot imply full validation unless all three stages pass.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- adapter-parity contract tests (`not-evaluated` + primary blocker invariants),
- centralized reason→stage ownership enforcement in code,
- stage-tuple validator + compact wording guardrails for blocked-stage outputs.
