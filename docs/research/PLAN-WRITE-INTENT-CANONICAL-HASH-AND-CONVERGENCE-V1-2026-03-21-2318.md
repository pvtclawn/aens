# Plan — Write-Intent Canonical Hash + Payload/Envelope Split + Per-Record Convergence v1 (2026-03-21 23:18 UTC)

## Goal
Freeze a compact implementation plan that turns the write-intent boundary research into enforceable build slices:
1. canonical hash helper with vectors,
2. strict `intentPayload` vs `auditEnvelope` schema split,
3. per-record convergence verifier template.

## Smallest shippable milestone
Ship one thin vertical that prevents covert scope drift without adding write automation:
- deterministic payload hash contract in code/tests,
- schema shape that makes hash scope explicit,
- verification report format that cannot hide partial record failure.

## Tasks (1–3) with acceptance criteria

### Task 1 — Canonical hash helper + test vectors
Implement `buildIntentPayloadForHash(manifest)` + canonical serialization + digest helper.

Canonical rules (v1):
- lowercase/trim ENS names,
- trim URLs and remove trailing `/`,
- sort `targetRecords` by `(targetName,key,value)`,
- deterministic key ordering in JSON bytes,
- hash algorithm pinned (keccak256 over UTF-8 canonical bytes).

**Acceptance criteria**
- helper returns same digest for semantically identical manifests with reordered input fields/records,
- helper returns different digest for any semantic intent change,
- golden vectors are committed (`manifest -> canonical bytes -> hash`),
- tests fail on canonicalization drift.

---

### Task 2 — Payload/Envelope schema split
Define strict schema with explicit commitment scope separation:
- `intentPayload` (hash scope, deterministic)
- `auditEnvelope` (operator commentary, references, optional commentary digest)

`intentPayload` minimum:
- `schemaVersion`, `chainId`, `rootName`, `capabilityName`, `targetRecords`, `expectedPostState`

`auditEnvelope` minimum:
- `intentId`, `createdAt`, `operatorNotes`, optional refs (`commentaryRef`, `commentaryDigest`, `supersedesIntentId`)

**Acceptance criteria**
- parser/validator rejects manifests missing required payload fields,
- `intentPayloadHash` is computed from payload only,
- commentary edits do not change payload hash,
- schema docs include one valid and one invalid example.

---

### Task 3 — Per-record convergence verifier template
Define a report template and data shape that force explicit record-level outcomes.

Required sections:
1. intent artifact summary (`intentPayloadHash`, schemaVersion),
2. execution table per record (`written` / `failed` / `unverified` + tx ref),
3. post-write chain-read table per record (expected vs observed),
4. overall verdict (`converged` / `mismatch`) with reason.

**Acceptance criteria**
- template docs exist and are referenced by publish-assist/runbook docs,
- verifier rules prohibit `converged` if any record is failed/unverified,
- report includes semantic post-state check (`authorizationStatus`, `reasonCode`, `serviceUrl`).

## Out of scope (v1)
- automatic wallet signing/execution
- changing discover service response schema
- cross-chain support beyond current primary chain

## Next lane handoff
Lane B: implement Task 1 only (canonical hash helper + vectors + tests), keeping schema/report work for follow-up slices.
