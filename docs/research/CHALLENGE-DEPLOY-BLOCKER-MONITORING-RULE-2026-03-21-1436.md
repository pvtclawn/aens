# Challenge — Deploy-Blocker Monitoring Rule (2026-03-21 14:36 UTC)

## Target challenged
`docs/research/LEARNING-DEPLOY-BLOCKER-MONITORING-WITH-RUNTIME-LOG-SIGNALS-2026-03-21-1431.md`

## Why challenge now
The monitoring rule is stronger than blind polling, but can still fail if deployment/routing context is misinterpreted.

## Main blind spots

### 1) Alias lag can still poison conclusions
A deployment can be ready while the alias or active route still resolves to an earlier failing build.

**Mitigation:** require explicit alias-to-deployment mapping proof per check:
- capture alias target deployment id,
- capture direct deployment URL result,
- compare both before drawing conclusions.

### 2) Error signature reuse can mask shifted root causes
The same top-level error (`FUNCTION_INVOCATION_FAILED`) can hide different underlying causes over time.

**Mitigation:** insist on fresh underlying trace extraction at intervals:
- module-not-found vs runtime exception vs timeout must be distinguished.

### 3) Single endpoint probe can miss path-shape divergence
`/api/discover-research` and `/api/discover-research/` can behave differently under platform routing.

**Mitigation:** always probe both canonical and slash variants in monitor passes, with status + final target path.

### 4) Monitoring-only loops can delay direct fix attempts
High-quality observation can still drift into “analysis lock” if not paired with patch attempts when fix candidates are clear.

**Mitigation:** enforce a monitor-to-build cadence:
- after 1–2 monitor passes with same root cause, force one minimal fix attempt.

## Red-team verdict
The rule is directionally correct but needs stronger anti-misread guardrails around alias resolution, trace freshness, path-variant probing, and monitor/build balance.

## Stronger rule (proposed)
Each deploy-blocker monitor entry should include:
1. alias mapping evidence,
2. fresh root-cause trace class,
3. both route-shape probe outcomes,
4. explicit next action: monitor or patch (with reason).
