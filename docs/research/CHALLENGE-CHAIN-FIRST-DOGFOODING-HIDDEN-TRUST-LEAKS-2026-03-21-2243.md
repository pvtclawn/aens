# Challenge — Chain-First Dogfooding Plan Hidden Trust Leaks (2026-03-21 22:43 UTC)

## Goal
Red-team the chain-first thin-client + dogfooding automation plan before implementation, with focus on hidden trust leaks:
1) labeling drift,
2) write-plan opacity,
3) fixture/live boundary confusion.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted discover contract tests pass
- public surface check green

## Challenge findings

### 1) Labeling drift can silently re-centralize trust (high)
**Failure mode:** UI labels (`live chain` vs `demo fixture`) can become stale relative to the actual data path as code evolves.
- Example: UI still shows “live chain” while data comes from cached fixture/helper path after refactor.
- Impact: users trust rendered claims that are no longer chain-derived.

**Mitigation:** bind labels to runtime data-source enum emitted by resolver path (not UI copy). Add tests asserting each render mode exposes correct source tag.

---

### 2) Write-plan opacity can fake dogfooding finality (high)
**Failure mode:** agent emits “publish success” without a machine-verifiable write-intent artifact and post-write diff.
- Impact: operators cannot audit what was intended vs what actually changed on-chain.

**Mitigation:** require three explicit artifacts per run:
1. write-intent manifest (target records + expected post-state hash),
2. execution receipt(s) reference,
3. post-write chain-read verification report with pass/fail deltas.

---

### 3) Fixture/live boundary confusion can inflate product readiness claims (high)
**Failure mode:** deterministic fixture outputs and live probes are shown together without strict boundary rules.
- Impact: demo success from fixtures is interpreted as live publication success.

**Mitigation:** enforce paired-report format:
- section A: deterministic contract proof,
- section B: live chain probe,
- section C: explicit mismatch statement when outcomes differ.

---

### 4) Cache-layer ambiguity can mask stale chain truth (medium-high)
**Failure mode:** service cache (`max-age/s-maxage`) and UI state can continue showing old authorization after record updates.
- Impact: operator believes writes failed/succeeded incorrectly due to stale reads.

**Mitigation:** expose `resolvedAt` and cache status prominently in UI + verification artifacts; include one forced fresh probe step in publish verification checklist.

---

### 5) Reason taxonomy drift can break trust semantics quietly (medium)
**Failure mode:** reason semantics evolve (`reasonCode` mapping) while UI explanations/docs lag.
- Impact: same visible verdict text can mean different backend states across releases.

**Mitigation:** tie UI reason interpretation to versioned taxonomy (`reasonSchemaVersion`) and fail closed on unknown combinations.

## Hardened rule (post-challenge)
Chain-first dogfooding is valid only when all constraints hold:
1. runtime-bound source labels (not static copy),
2. write-intent/execution/verification artifact triad,
3. mandatory deterministic+live paired reporting,
4. cache freshness evidence in verification,
5. version-coupled reason semantics handling.

## Next smallest handoff
Before implementation, freeze a compact Lane A plan for:
- source-label enum contract + UI test hooks,
- write-intent manifest schema,
- paired deterministic/live report template + acceptance checks.
