# Eighty-First Slice Challenge — Write-Intent Covert Scope Drift (2026-03-21 23:13 UTC)

## Goal
Red-team the write-intent manifest boundary for covert scope-drift risks before implementation, with focus on:
1) hash-canonicalization mismatch,
2) commentary leakage into commitment scope,
3) execution/proof conflation.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted publish/discover tests pass (`14 pass`)
- public surface check green

## Challenge findings

### 1) Canonicalization mismatch can create false tamper alarms (high)
**Failure mode:** two tools produce different payload hashes for equivalent manifests because of subtle canonicalization divergence (field order, array order, URL normalization, unicode/newline handling).

**Impact:** valid manifests appear tampered; operator confidence drops; downstream audit automation becomes noisy and brittle.

**Mitigation:**
- define one canonical serialization function + test vectors in-repo,
- pin normalization rules (ENS lowercase, URL trim/no trailing slash, sorted records),
- fail CI when canonical hash output changes without explicit schema-version bump.

---

### 2) Commentary leakage into commitment scope can break reproducibility (high)
**Failure mode:** optional human notes are accidentally included in hash input in one code path but excluded in another.

**Impact:** reworded notes invalidate commitment equivalence; humans perceive random digest churn; real intent drift gets obscured by cosmetic edits.

**Mitigation:**
- hard-separate `intentPayload` from `auditEnvelope`,
- compute `intentPayloadHash` only from strict payload object,
- optional `commentaryDigest` remains auxiliary and never gates intent equivalence.

---

### 3) Execution/proof conflation can fake completion (high)
**Failure mode:** system treats manifest presence + tx links as sufficient to claim completion without post-write semantic convergence check.

**Impact:** partial/mis-targeted writes can be presented as done; dogfooding claims overstate real chain state.

**Mitigation:**
- enforce tri-artifact gate for “converged”:
  1. intent artifact,
  2. execution artifact(s),
  3. post-write chain verification artifact.
- deny `converged` unless all expected records have matching tx evidence and post-state semantics match.

---

### 4) Multi-record partial success can hide dangerous drift (medium-high)
**Failure mode:** one of several intended record writes fails/reverts, but report only tracks aggregate tx presence.

**Impact:** manifest appears mostly complete while authority semantics remain broken.

**Mitigation:**
- per-record execution status table (`written`, `failed`, `unverified`),
- per-record post-state check against expected value,
- overall verdict is minimum severity across records (any failed/unverified => not converged).

---

### 5) Hash-algorithm ambiguity can split operator/verifier truth (medium)
**Failure mode:** some clients compute keccak256 over UTF-8 stringified JSON, others hash bytes of a different canonical representation.

**Impact:** same logical payload yields different digests across environments.

**Mitigation:**
- schema must define exact hash algorithm + byte encoding path,
- publish test vectors (`manifest -> canonical bytes -> hash`) in docs/tests,
- include `hashAlgorithm` field in schema version contract.

---

### 6) Intent replay/collision risk via weak `intentId` discipline (medium)
**Failure mode:** repeated or predictable `intentId` values make it hard to distinguish new intent from replayed artifact.

**Impact:** audit timeline confusion; wrong execution artifacts can be attached to stale intent.

**Mitigation:**
- require globally unique `intentId` format (timestamp + nonce/uuid),
- add `createdAt` freshness checks in validator,
- require explicit `supersedesIntentId` when replacing an intent.

## Hardened rule (post-challenge)
Write-intent boundary is acceptable only if all constraints hold:
1. single canonical serializer + vectors,
2. strict payload/envelope separation,
3. tri-artifact convergence gate,
4. per-record execution + post-state verdicting,
5. explicit hash algorithm/encoding contract,
6. replay-resistant intent identity semantics.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- canonical hash helper + vectors,
- `intentPayload`/`auditEnvelope` schema split,
- per-record convergence report template and validator checks.
