# Learning Note — Timeout Semantics for Agent Services (2026-03-21 16:12 UTC)

## Context
The discover service now has richer semantic responses (`reasonCode`), but timeout behavior still creates inconsistent consumer experience under degraded RPC/network conditions.

## Applied learning

### 1) Transport timeout is a UX bug for agent APIs
If callers only see socket timeout/no body, they cannot distinguish infrastructure delay from semantic negative outcomes.

### 2) Error-path semantics should be first-class contract behavior
Success-path reason codes are not enough; failure-paths need explicit structured semantics too (e.g., `lookup-failed`).

### 3) Reliability meaning should degrade gracefully, not disappear
Even when upstream RPCs fail, the API should return parseable JSON with stable fields so automation pipelines can branch deterministically.

### 4) Timeouts should map to bounded, observable classes
A small error taxonomy for failures (`lookup-failed` + message/source hints) is more useful than leaking raw transport behavior to consumers.

## Reusable rule
For agent-facing services:
1. design semantic fields for success and failure paths,
2. avoid raw transport timeouts escaping as primary interface,
3. keep failure payload backward-compatible and machine-parseable,
4. test timeout-path behavior explicitly.

## Main takeaway
An agent API is only as usable as its worst-path semantics; stable failure contracts matter as much as rich success responses.
