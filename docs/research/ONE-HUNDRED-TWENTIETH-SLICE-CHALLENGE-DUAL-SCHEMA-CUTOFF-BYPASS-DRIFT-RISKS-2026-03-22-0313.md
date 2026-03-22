# One-Hundred-Twentieth Slice Challenge — Dual-Schema Cutoff Bypass & Drift Risks (2026-03-22 03:13 UTC)

## Goal
Red-team dual-schema cutoff enforcement design for bypass and drift risks, focusing on:
1) phase-computation inconsistencies,
2) first-seen provenance spoofing,
3) warning-to-cutoff transition ambiguity.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted parity/blocker/grace/provenance/validator/write-intent/publish/discover-service tests pass (`44 pass`)
- public surface check green

## Challenge findings

### 1) Phase-computation inconsistencies across environments (high)
**Failure mode:** local preflight and CI compute lifecycle phase (`prepare`/`warning`/`hard-cutoff`) with different clocks/timezone assumptions or edge rounding.

**Impact:** fixture accepted locally but blocked in CI (or vice versa), driving contributor confusion and retry loops.

**Mitigation:**
- one shared UTC phase evaluator module for both CI and local commands,
- explicit boundary rule (`now >= cutoffAt` => hard-cutoff) with no local-time conversion,
- include `evaluatedAtUtc` + `phase` in every result payload.

---

### 2) First-seen provenance spoofing via metadata tampering (high)
**Failure mode:** fixture baseline metadata (`firstSeenAt`, `firstSeenSchemaVersion`) is manually edited or regenerated to reclassify a newly added deprecated fixture as legacy.

**Impact:** deprecated-schema new-addition block can be bypassed while appearing policy-compliant.

**Mitigation:**
- derive first-seen provenance from immutable git history or signed registry artifact, not mutable fixture fields,
- bind first-seen records to fixture ID + file path + content hash,
- fail closed on provenance mismatch or missing provenance records.

---

### 3) Warning-to-cutoff transition ambiguity at boundary instants (high)
**Failure mode:** equality-edge behavior around cutoff timestamp is unclear (`>` vs `>=`) and differs between tools.

**Impact:** borderline runs produce inconsistent blocker codes and migration messaging.

**Mitigation:**
- codify exact comparator semantics in one constant/spec:
  - warning when `now < cutoffAt`
  - hard-cutoff when `now >= cutoffAt`,
- add boundary tests for exact timestamp equality,
- emit phase decision trace in verbose diagnostics.

---

### 4) Cached baseline drift can hide deprecated new additions (medium-high)
**Failure mode:** CI cache serves stale first-seen registry built before warning phase updates.

**Impact:** new deprecated fixtures may evade blocking checks temporarily.

**Mitigation:**
- include policy hash + schema version hash in baseline cache key,
- invalidate cache on fixture bundle or policy changes,
- verify baseline freshness before evaluating additions.

---

### 5) Fixture rename/path churn can evade first-seen checks (medium-high)
**Failure mode:** renaming fixture file/ID can reset perceived provenance and bypass “new deprecated addition” detection.

**Impact:** policy appears enforced while deprecated fixtures re-enter as “new identities.”

**Mitigation:**
- enforce immutable fixture IDs once introduced,
- detect ID reuse/rename with content-similarity checks,
- block ID mutation unless explicit migration operation with audit trail is recorded.

---

### 6) Contributor messaging may understate hard-cutoff severity (medium)
**Failure mode:** warning and hard-cutoff outputs look too similar in compact mode.

**Impact:** contributors misclassify hard blockers as advisory and delay migration.

**Mitigation:**
- hard-cutoff compact banner must include explicit `release blocked` phrasing,
- warning banner includes countdown + advisory tone,
- both carry deterministic reason codes and phase fields.

---

### 7) Multi-fixture mixed outcomes can obscure primary remediation sequence (medium)
**Failure mode:** report mixes warning and hard-cutoff fixtures without deterministic primary blocker selection.

**Impact:** teams address warning fixtures first while hard-cutoff blockers remain unresolved.

**Mitigation:**
- enforce deterministic precedence: policy-invalid > hard-cutoff > deprecated-new-addition > warning,
- group results by severity bucket and show top blocking fixture IDs first,
- include `blockingFixtureCount` vs `advisoryFixtureCount` summary.

## Hardened rule (post-challenge)
Dual-schema cutoff design is acceptable only if all constraints hold:
1. shared UTC phase evaluator with explicit boundary semantics,
2. tamper-resistant first-seen provenance source,
3. exact warning→cutoff transition tests (`>= cutoffAt` hard-fail),
4. cache freshness binding to policy/schema/fixture hashes,
5. immutable fixture-ID provenance controls,
6. phase-distinct compact messaging with deterministic reason codes,
7. deterministic mixed-outcome blocker prioritization.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- shared phase evaluator + boundary tests,
- tamper-resistant first-seen provenance registry and validation,
- mixed-outcome reporting contract with deterministic blocking/advisory split.
