# Plan — Grace-Window Enforcement UX Contract v1 (2026-03-22 01:18 UTC)

## Goal
Freeze a compact implementation plan that converts grace-window UX hardening into enforceable code-level contract behavior:
1. shared deadline formatter,
2. deterministic blocker-precedence mapper,
3. CI/CLI non-release banner invariants.

## Smallest shippable milestone
Ship one thin UX-governance slice without changing discover/public APIs:
- all grace-related outputs use a shared deadline representation,
- all blocker selection follows one deterministic precedence map,
- CLI and CI both emit explicit non-release messaging for `grace-active` states.

## Tasks (1–3) with acceptance criteria

### Task 1 — Shared deadline formatter (absolute + relative + urgency tier)
Implement a reusable helper for grace-window deadline rendering.

Input:
- `evaluatedAt` (UTC timestamp)
- `expiresAt` (UTC timestamp)

Output:
- `expiresAtUtc` (canonical string)
- `graceRemainingSeconds`
- `relativeLabel` (e.g., `in 2h 14m` / `expired 1d 3h ago`)
- `urgencyTier` (`advisory` | `elevated` | `high` | `expired`)

**Acceptance criteria**
- formatter returns both absolute and relative values for every grace state,
- urgency tiers follow deterministic threshold policy (<72h, <24h, <=0),
- tests lock formatting determinism and edge cases (exact boundary timestamps),
- no output path shows relative-only or absolute-only deadline data.

---

### Task 2 — Deterministic blocker-precedence mapper
Implement centralized mapping from version/policy states to primary blocker reason.

Required precedence:
1. policy entry invalid,
2. grace expired,
3. unsupported version,
4. grace-active non-release.

Required outputs:
- `primaryBlockerReasonCode`
- `secondaryBlockerReasonCodes[]`
- `versionState` summary (`active`, `grace-active`, `grace-expired`, `unsupported`)

**Acceptance criteria**
- identical multi-issue inputs always produce identical primary blocker,
- mapper exports shared constants for CLI/CI consumers,
- tests cover mixed validator/schema states and precedence stability,
- unknown states fail closed with explicit reason code.

---

### Task 3 — CI/CLI non-release banner invariants
Define one shared contract for grace-active messaging across human-facing outputs.

Required invariant lines (semantic equivalents allowed):
- `releaseEligible=false`
- `policyState=grace-active`
- `release gate blocked by policy`

Additional required fields:
- `evaluatedAt`
- `nextActionHint`

**Acceptance criteria**
- both CLI and CI summary outputs include invariant non-release semantics for grace-active,
- output template tests fail when invariant lines are missing,
- summaries remain concise (3–5 lines) while machine JSON retains full detail.

## Out of scope (v1)
- allowlist policy editing automation
- commit/source resolution implementation
- write execution / on-chain convergence actions

## Next lane handoff
Lane B: implement Task 1 only (shared deadline formatter + deterministic urgency tiers + boundary tests), keeping blocker mapper and banner invariants for follow-up slices.
