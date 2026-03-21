# Plan — Privileged Probe Lifecycle Hardening (2026-03-21 17:14 UTC)

## Goal
Harden the new deterministic failure-probe mechanism so temporary privileged verification stays safe over time.

## Scope boundary
- Lifecycle controls only (security/ops hardening around probe mode).
- No new product semantics.
- Keep default-off behavior unchanged.

## Tasks (next 1–3)

### 1) Add token lifecycle evidence fields
Target: controlled probe procedure + verification artifacts.

Acceptance criteria:
- Require recording:
  - `token_issued_at`
  - `token_expires_at`
  - `token_revoked_at`
- Verification notes must include these fields for any probe window.

### 2) Add fail-closed gate-state guard policy
Target: probe governance docs and implementation checklist.

Acceptance criteria:
- Explicit rule: if probe enable flag is on but token is missing/invalid, treat state as unsafe and disable immediately.
- Include post-window inertness re-check with deployment id proof.

### 3) Add bounded probe-window policy
Target: procedure docs.

Acceptance criteria:
- Cap by both duration and invocation count per window (e.g., one short window, max 1–3 probe calls).
- Require explicit owner and cleanup commit reference for each window.
- Require one non-secret audit marker for probe activation/deactivation.

## Done definition
Privileged probe usage is not just gated at runtime, but governed through explicit lifecycle controls and auditable teardown, preventing long-lived privileged-mode drift.
