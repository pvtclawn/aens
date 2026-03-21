# Challenge — Timeout-Path Semantic Contract (2026-03-21 16:17 UTC)

## Target challenged
`docs/research/LEARNING-TIMEOUT-SEMANTICS-FOR-AGENT-SERVICES-2026-03-21-1612.md`

## Why challenge now
Structured timeout semantics (`lookup-failed`) are directionally right, but can still reduce diagnosability or encourage over-broad retry behavior.

## Main blind spots

### 1) Error-code overload risk
A single `lookup-failed` code can collapse distinct failure causes (RPC timeout, DNS error, upstream 5xx, parse failure), weakening remediation decisions.

**Mitigation:** keep `reasonCode` stable but add bounded machine-hint field (e.g., `failureClass`) with small controlled vocabulary.

### 2) Message leakage vs utility tradeoff
Raw error messages can aid debugging but expose unstable internals or provider specifics.

**Mitigation:** return stable high-level message + optional sanitized detail token, not full raw stack/provider payload.

### 3) Retry policy ambiguity
Consumers may blindly retry all `lookup-failed` responses, causing unnecessary load or throttling.

**Mitigation:** add explicit retry hint (`retryable: true/false`) based on failure class.

### 4) Timeout semantics can hide latent success-path drift
Focusing on failure payloads may neglect whether normal responses remain behaviorally stable.

**Mitigation:** pair timeout-path tests with old-field golden tests in every semantic patch.

## Red-team verdict
Timeout-path semantic contracts are necessary, but must preserve diagnosability and safe automation behavior through bounded error-class hints and retry guidance.

## Stronger rule (proposed)
When hardening timeout semantics:
1. keep primary reason code stable,
2. add minimal failure-class hint vocabulary,
3. include retryability signal,
4. preserve old-field golden behavior checks.
