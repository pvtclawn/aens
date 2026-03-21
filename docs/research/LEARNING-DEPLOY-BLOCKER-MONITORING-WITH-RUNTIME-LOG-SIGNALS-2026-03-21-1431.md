# Learning Note — Deploy-Blocker Monitoring with Runtime Log Signals (2026-03-21 14:31 UTC)

## Context
Service endpoint rollout is blocked by production runtime failure (`FUNCTION_INVOCATION_FAILED` / `ERR_MODULE_NOT_FOUND`) while local checks remain green.

## Applied learning

### 1) Local-green vs production-fail is a distinct state, not contradiction
`tsc` + tests + surface checks can all pass while serverless runtime packaging still fails. Treat this as deployment-surface mismatch, not product uncertainty.

### 2) Runtime error signatures are first-class progress signals
A shifted failure mode (`308→404` → `500 invocation` → concrete module-not-found trace) is real progress because it narrows the blocking layer.

### 3) Monitoring loops must key off deployment identity
During fast pushes, alias may lag to an earlier deployment. Always bind checks to deployment id/url before interpreting results.

### 4) Evidence quality beats polling frequency
One check with deploy id + live status + concrete runtime trace is more valuable than many blind probes.

## Reusable rule
For deploy-dependent runtime blockers, each monitor pass should capture:
1. deployment id currently behind alias,
2. live endpoint status,
3. latest concrete runtime error signature,
4. next smallest patch target.

## Main takeaway
In production-runtime blockers, the highest-signal loop is: narrow by error signature, tie observations to deployment id, and patch one layer at a time.
