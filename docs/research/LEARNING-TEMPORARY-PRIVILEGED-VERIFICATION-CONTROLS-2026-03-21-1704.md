# Learning Note — Temporary Privileged Verification Controls (2026-03-21 17:04 UTC)

## Context
The service now includes a gated deterministic failure-probe path for verifying error contracts, which introduces a privileged verification capability into production code paths.

## Applied learning

### 1) Privileged verification must remain exceptional, not normal
If “special-mode” verification is easy to leave on, it drifts from safety mechanism to hidden runtime feature.

### 2) The safest default is inertness
Controls should be default-off and require multiple aligned conditions (enable flag + token), so accidental exposure is unlikely.

### 3) Verification depth should not increase public attack surface
Deep validation should come from authenticated, short-lived activation—not from permanently available debug behavior.

### 4) Exit discipline is as important as enable discipline
A verification control without an explicit disable/cleanup step is incomplete. The verification loop ends only when inert mode is re-proven.

## Reusable rule
For temporary privileged verification controls:
1. default-off by design,
2. explicit auth gate + short-lived credential,
3. bounded verification window,
4. mandatory post-window inertness check.

## Main takeaway
Privileged verification is useful only when treated like controlled instrumentation: tightly gated, short-lived, and provably removed from normal operating mode.
