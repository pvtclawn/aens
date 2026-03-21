# Challenge — Deterministic Failure-Probe Design (2026-03-21 16:43 UTC)

## Target challenged
`docs/research/LEARNING-SAFE-DETERMINISTIC-FAILURE-PROBING-2026-03-21-1638.md`

## Why challenge now
Guarded deterministic probes are useful, but can introduce hidden security/operational debt if left unchecked.

## Main blind spots

### 1) Probe abuse risk
Even gated probe paths can be abused if guard headers leak or gate checks are too weak.

**Mitigation:** require short-lived nonce/token validation + strict server-side gate enable flag (default off).

### 2) Stale probe paths lingering in production
Temporary verification hooks often become permanent attack surface if not retired.

**Mitigation:** enforce explicit expiry policy:
- probe path auto-disabled after verification window,
- tracked in a cleanup checklist with commit reference.

### 3) Semantics divergence between simulated and real failures
If simulated failure path bypasses normal catch branch logic, verification can pass while real failures still differ.

**Mitigation:** route simulation through the same error-shaping function as real failures.

### 4) Observability leakage
Detailed probe metadata can leak internals to external consumers if response detail is too verbose.

**Mitigation:** keep probe responses using same public payload schema; internal trace details only in server logs.

## Red-team verdict
Deterministic failure probes are valuable but only safe when treated as temporary, tightly controlled verification infrastructure—not a permanent runtime feature.

## Stronger rule (proposed)
Before enabling deterministic probe mode in production:
1. default-off gate with short-lived auth token,
2. simulation path reuses real error-shaping code,
3. explicit expiry/removal plan with owner + commit,
4. no additional public response detail beyond normal contract.
