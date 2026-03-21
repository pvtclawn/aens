# Eightieth Slice Research — Write-Intent Manifest Schema Boundary (2026-03-21 23:03 UTC)

## Goal
Freeze a compact boundary for the dogfooding write-intent manifest so operator automation remains auditable, hashable, and clearly separate from on-chain final truth.

## Inputs considered
- `src/publish-assist.ts` state machine + runbook boundary language
- `src/linked-records.ts` signed-receipt core field discipline
- chain-first trust-boundary notes from slices 77–79

## Actionable boundary (v1)

### 1) Required fields (minimal but complete)
A valid write-intent manifest must include:
- `schemaVersion` (string, exact version tag)
- `createdAt` (ISO-8601 UTC)
- `intentId` (stable ID for this plan)
- `chainId` (number)
- `rootName` (lowercase ENS)
- `capabilityName` (lowercase ENS)
- `targetRecords` (non-empty array)
- `expectedPostState` (object)
- `operatorNotes` (string; may be empty but must exist)

`targetRecords[]` required fields per item:
- `targetName` (ENS name where write lands)
- `key` (record key, e.g. `aens.capabilities`, `aens.parent`, `aens.service`)
- `value` (string; explicit intended value)
- `reason` (why this write is needed)

`expectedPostState` required fields:
- `authorizationStatus` (expected semantic status)
- `reasonCode` (expected service reason class)
- `serviceUrl` (expected endpoint URL or empty string when intentionally absent)

---

### 2) Hashable payload rules (anti-ambiguity)
Manifest hashing must use canonical payload rules so operator + verifier compute the same digest:
1. normalize ENS names to lowercase + trimmed
2. normalize URL values to trimmed, no trailing `/`
3. serialize canonical JSON with deterministic key order
4. sort `targetRecords` by `(targetName, key, value)` before hashing
5. exclude volatile fields from hash input (`operatorNotes`, optional human commentary)
6. include `schemaVersion` in hash input

Suggested hash scope object (`intentPayload`):
- `schemaVersion`, `chainId`, `rootName`, `capabilityName`, `targetRecords`, `expectedPostState`

Suggested outputs:
- `intentPayloadHash` (keccak256 over canonical bytes)
- `intentPayloadByteLength`

This creates a stable commitment boundary for pre-write review and post-write verification.

---

### 3) Operator audit semantics (must be explicit)
The manifest is a **pre-write commitment artifact**, not proof of execution.

Minimum audit trail requires three linked artifacts:
1. **intent artifact** — manifest + `intentPayloadHash`
2. **execution artifact** — tx references per `targetRecords[]` item (or explicit no-op reason)
3. **post-write verification artifact** — live chain reads + semantic verdict (`converged` / `mismatch`)

Audit rules:
- if any record lacks execution evidence, verdict cannot be `converged`
- if live post-state diverges from `expectedPostState`, force `mismatch` + remediation note
- deterministic fixtures may supplement testing but cannot replace live verification artifact

---

## Compact schema sketch (illustrative)
```json
{
  "schemaVersion": "aens-write-intent/v1",
  "createdAt": "2026-03-21T23:03:00Z",
  "intentId": "intent-20260321-2303-001",
  "chainId": 1,
  "rootName": "pvtclawn.eth",
  "capabilityName": "research.pvtclawn.eth",
  "targetRecords": [
    {
      "targetName": "pvtclawn.eth",
      "key": "aens.capabilities",
      "value": "[\"research.pvtclawn.eth\"]",
      "reason": "parent must explicitly authorize child capability"
    },
    {
      "targetName": "research.pvtclawn.eth",
      "key": "aens.service",
      "value": "https://aens-nine.vercel.app/research-capability",
      "reason": "declare official endpoint"
    }
  ],
  "expectedPostState": {
    "authorizationStatus": "parent-authorized",
    "reasonCode": "parent-authorized-with-service-url",
    "serviceUrl": "https://aens-nine.vercel.app/research-capability"
  },
  "intentPayloadHash": "0x...",
  "operatorNotes": "Prepared before wallet session; verify resolver target before signing."
}
```

## Next smallest handoff
Lane E/B follow-up should implement:
1. strict parser/validator for `aens-write-intent/v1`
2. canonical hashing helper for `intentPayload`
3. report template linking intent hash ↔ tx refs ↔ post-write verdict
