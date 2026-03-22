# Plan — Canonical Policy Loader + Policy-Hash Binding + Grace Expiry + CI Commit-Source Handling v1 (2026-03-22 00:48 UTC)

## Goal
Freeze a compact implementation plan that turns allowlist-governance hardening into enforceable code paths:
1. canonical provenance-policy loader,
2. policy-hash binding in gate evaluation artifacts,
3. grace-window expiry enforcement,
4. CI commit-source ambiguity fail-closed behavior.

## Smallest shippable milestone
Ship one thin governance vertical that prevents silent policy drift and commit-authority ambiguity without changing discover/public APIs:
- all provenance checks consume exactly one canonical policy source,
- gate output includes deterministic policy identity (`policyVersion`, `policyHash`, `policySourcePath`),
- expired grace entries fail closed,
- unresolved CI commit authority blocks release checks.

## Tasks (1–3) with acceptance criteria

### Task 1 — Canonical policy loader + hash binding
Implement typed loader for single policy file (e.g., `config/provenance-policy.json`) with strict shape checks.

Minimum loaded fields:
- `policyVersion`
- `allowedValidatorVersions.active`
- `allowedSchemaVersions.active`
- optional `grace` arrays with `version` + `expiresAt`

Output metadata from loader:
- `policySourcePath`
- `policyHash` (deterministic hash of canonical policy bytes)

**Acceptance criteria**
- loader rejects missing/malformed policy fields,
- loader rejects multiple policy sources or override collisions,
- same policy bytes always yield same hash,
- gate artifacts include `policyVersion`, `policyHash`, `policySourcePath`.

---

### Task 2 — Grace-window expiry enforcement
Define and enforce strict grace semantics for version migration windows.

Rules:
- grace entries require `expiresAt` (UTC timestamp),
- current time > `expiresAt` => fail closed,
- grace entries never imply release-eligible strict pass (advisory only unless explicitly promoted by policy state).

**Acceptance criteria**
- expired grace versions fail with deterministic blocker reason,
- non-expired grace versions surface explicit advisory status,
- policy linter fails when grace entry lacks expiry,
- tests cover active vs grace vs expired behavior.

---

### Task 3 — CI commit-source ambiguity fail-closed handling
Implement event-aware expected-commit resolver with explicit source labeling.

Required output fields:
- `ciEventType`
- `expectedCommitSource`
- `expectedCommit`
- `validatedCommit`
- `commitMatch`

Rules:
- unresolved/ambiguous expected commit => fail closed,
- exact commit mismatch => fail closed,
- gate summary prints deterministic primary blocker reason.

**Acceptance criteria**
- PR/push/release event fixtures resolve expected commit deterministically,
- ambiguous context fixtures fail with explicit reason code,
- commit mismatch reason is stable and precedes secondary warnings,
- tests cover event matrix and ambiguity cases.

## Out of scope (v1)
- wallet signing or write execution
- on-chain convergence verifier implementation
- discover/public response schema changes

## Next lane handoff
Lane B: implement Task 1 only (canonical policy loader + policy-hash binding metadata + strict tests), leaving grace-expiry and CI commit-source handling for follow-up slices.
