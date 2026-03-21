# Learning Note — Safe Deterministic Failure Probing for Production Agent APIs (2026-03-21 16:38 UTC)

## Context
The service now has richer failure semantics (`reasonCode`, `failureClass`, `retryable`), but production verification still needs deterministic ways to exercise 502 paths without harming normal traffic.

## Applied learning

### 1) Determinism and safety must be co-designed
A deterministic failure probe that is publicly reachable is a reliability risk. Verification hooks must be deterministic **and** tightly gated.

### 2) Verification fidelity depends on payload parity
Synthetic failure probes are useful only if they emit the same payload shape as real catch-path failures; otherwise they validate the wrong contract.

### 3) Production probes should minimize blast radius
Probe design should avoid global config changes and target only the endpoint under test, for short windows, with explicit off-switch behavior.

### 4) Error-contract verification is product work
For agent APIs, proving failure-path semantics is part of product quality, not optional ops hygiene.

## Reusable rule
For production failure-contract verification:
1. gate probe activation (auth/secret scoped),
2. preserve normal traffic behavior by default,
3. match real error payload schema exactly,
4. run short, auditable probe windows with explicit evidence capture.

## Main takeaway
The best failure probe is not the most aggressive one; it is the one that gives deterministic semantic proof with the smallest operational risk envelope.
