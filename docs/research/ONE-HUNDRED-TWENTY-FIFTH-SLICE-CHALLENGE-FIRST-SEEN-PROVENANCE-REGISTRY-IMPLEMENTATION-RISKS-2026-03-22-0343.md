# One-Hundred-Twenty-Fifth Slice Challenge — First-Seen Provenance Registry Implementation Risks (2026-03-22 03:43 UTC)

## Goal
Red-team first-seen provenance registry implementation design for bypass/drift risks, with focus on:
1) registry integrity spoofing,
2) stale-cache acceptance,
3) fixture ID mutation handling,
4) ambiguous mismatch diagnostics.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted cutoff/parity/blocker/grace/provenance/validator/write-intent/publish/discover-service tests pass (`48 pass`)
- public surface check green

## Challenge findings

### 1) Registry integrity spoofing via trusted-path confusion (high)
**Failure mode:** implementation trusts registry file location/path without binding contents to a deterministic hash/signature policy.

**Impact:** attacker or accidental process can replace registry bytes with plausible-looking records; deprecated additions may appear legacy-approved.

**Mitigation:**
- require registry hash/signature verification against policy-bound expected digest,
- include `registryHash` + `registryVersion` in every decision artifact,
- fail closed on any integrity mismatch before first-seen checks run.

---

### 2) Stale-cache acceptance under policy/schema updates (high)
**Failure mode:** cache reuses old first-seen registry snapshot after policy version/schema changes.

**Impact:** warning/hard-cutoff decisions may be computed against stale provenance state, allowing bypass or false blocks.

**Mitigation:**
- bind cache key to `registryHash + policyHash + fixtureBundleHash + schemaVersion`,
- force cache invalidation when any bound component changes,
- emit freshness verdict with compared hashes in output.

---

### 3) Fixture ID mutation and rename bypass vector (high)
**Failure mode:** fixture ID or path rename effectively resets identity and evades “new deprecated addition” checks.

**Impact:** deprecated fixtures can be reintroduced as apparently new legitimate entities.

**Mitigation:**
- enforce immutable fixture IDs once first-seen recorded,
- detect path-only renames with stable content-hash continuity checks,
- require explicit migration record (oldId -> newId) with audit trail for legitimate ID changes.

---

### 4) Ambiguous mismatch diagnostics reduce recoverability (high)
**Failure mode:** implementation emits generic conflict labels (e.g., `record mismatch`) without indicating which provenance field diverged.

**Impact:** contributors guess fixes, causing repeated CI churn and potential manual bypass pressure.

**Mitigation:**
- diagnostics must include deterministic field-path mismatch details:
  - `fixtureId`
  - `mismatchFieldPath`
  - `expected` vs `observed` snippets
  - reason-code-specific remediation hint.

---

### 5) Partial-registry availability can create inconsistent enforcement (medium-high)
**Failure mode:** registry loader tolerates missing subset records and proceeds with warnings.

**Impact:** enforcement behavior depends on which subset loaded; deterministic policy guarantees collapse.

**Mitigation:**
- prohibit partial success in blocking pipeline,
- all referenced fixture IDs must resolve deterministically,
- missing records in active warning/hard-cutoff contexts are hard-fail.

---

### 6) Multi-source provenance merge can hide conflicts (medium-high)
**Failure mode:** implementation merges multiple provenance sources (local cache + CI artifact + generated history) without strict conflict policy.

**Impact:** conflicting first-seen records may be silently resolved by precedence heuristics, masking drift.

**Mitigation:**
- single canonical source-of-truth in blocking path,
- if multiple sources exist, require explicit reconciliation stage and fail closed on unresolved conflicts,
- surface all conflicting records in diagnostics.

---

### 7) Replay of old signed registry snapshots (medium)
**Failure mode:** previously valid signed registry is replayed after newer policy state exists.

**Impact:** signatures verify but freshness/policy alignment is wrong; stale legacy allowances may reappear.

**Mitigation:**
- include monotonic provenance epoch or policy version binding in signed payload,
- reject registry epochs older than current required baseline,
- output replay-specific blocker reason.

## Hardened rule (post-challenge)
First-seen provenance registry implementation is acceptable only if all constraints hold:
1. policy-bound integrity verification (hash/signature) before enforcement,
2. cache freshness tied to registry/policy/schema/fixture bundle hashes,
3. immutable fixture-ID identity with explicit audited migration flow,
4. deterministic field-level mismatch diagnostics,
5. no partial-registry acceptance in blocking path,
6. single canonical source or explicit conflict-fail reconciliation,
7. replay resistance via epoch/policy-version binding.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- integrity+freshness verifier module,
- fixture identity immutability + migration-record checks,
- structured mismatch diagnostic schema with reason-code-specific remediation mapping.
