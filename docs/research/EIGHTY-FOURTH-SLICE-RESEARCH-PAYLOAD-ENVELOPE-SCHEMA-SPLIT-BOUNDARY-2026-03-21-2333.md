# Eighty-Fourth Slice Research — Payload/Envelope Schema-Split Boundary (2026-03-21 23:33 UTC)

## Goal
Freeze a compact boundary for write-intent manifest schema split so commitment scope stays deterministic while operator/audit context remains explicit and non-ambiguous.

## Current grounding
- Canonical payload hash helper is now live (`src/write-intent-hash.ts`) and already excludes freeform commentary by design.
- Remaining risk is schema ambiguity: without a hard split, future tools may accidentally blur commitment fields and audit fields.

## Boundary definition (v1)

### A) `intentPayload` (hash scope — deterministic, required)
These fields define cryptographic intent and MUST be present:
- `schemaVersion` (string, exact)
- `chainId` (number, integer > 0)
- `rootName` (ENS string)
- `capabilityName` (ENS string)
- `targetRecords` (non-empty array)
- `expectedPostState` (object)

`targetRecords[]` required per item:
- `targetName` (ENS)
- `key` (record key)
- `value` (string)

`expectedPostState` required:
- `authorizationStatus` (string)
- `reasonCode` (string)
- `serviceUrl` (string; may be empty)

Rules:
- no unknown top-level keys inside `intentPayload` in strict mode,
- no nulls for required string fields,
- fail closed on missing/empty `targetRecords`.

---

### B) `auditEnvelope` (non-hash scope — audit context)
These fields track operator/session provenance and MAY evolve without intent hash drift:

Required:
- `intentId` (unique id)
- `createdAt` (ISO-8601 UTC)
- `operatorNotes` (string; can be empty)

Optional refs:
- `commentaryRef` (URI/path)
- `commentaryDigest` (hash of commentary blob)
- `supersedesIntentId` (string)
- `sessionId` (string)
- `requestedBy` (string)
- `labels` (string[])

Rules:
- optional refs are advisory unless explicitly promoted by future schema version,
- edits to `auditEnvelope` MUST NOT change `intentPayloadHash`.

---

### C) Manifest shell (link layer)
Top-level manifest binds both scopes:
- `intentPayload`
- `auditEnvelope`
- `intentPayloadHash`
- `hashAlgorithm`

Validation rule:
- recomputed hash from `intentPayload` must equal `intentPayloadHash`, else reject.

## Fail-closed validator semantics
Validator must reject manifest with explicit machine reason when any of these occur:
1. missing `intentPayload` or `auditEnvelope`
2. unsupported `schemaVersion`
3. unsupported `hashAlgorithm`
4. required payload/envelope field missing or wrong type
5. unknown keys in `intentPayload` (strict mode)
6. empty `targetRecords`
7. non-canonical ENS/value normalization violations (when strict)
8. recomputed hash mismatch
9. malformed optional refs (e.g., non-string `commentaryRef`)

Suggested reason codes:
- `manifest-structure-invalid`
- `manifest-schema-unsupported`
- `manifest-payload-invalid`
- `manifest-envelope-invalid`
- `manifest-hash-mismatch`

## Minimal example shape
```json
{
  "intentPayload": {
    "schemaVersion": "aens-write-intent/v1",
    "chainId": 1,
    "rootName": "pvtclawn.eth",
    "capabilityName": "research.pvtclawn.eth",
    "targetRecords": [
      {
        "targetName": "pvtclawn.eth",
        "key": "aens.capabilities",
        "value": "[\"research.pvtclawn.eth\"]"
      }
    ],
    "expectedPostState": {
      "authorizationStatus": "parent-authorized",
      "reasonCode": "parent-authorized-with-service-url",
      "serviceUrl": "https://aens-nine.vercel.app/research-capability"
    }
  },
  "auditEnvelope": {
    "intentId": "intent-20260321-2333-001",
    "createdAt": "2026-03-21T23:33:00Z",
    "operatorNotes": "Prepared before approval session",
    "commentaryRef": "docs/research/session-notes.md"
  },
  "intentPayloadHash": "0x...",
  "hashAlgorithm": "keccak256-utf8-canonical-json-v1"
}
```

## Next smallest handoff
Lane E/B follow-up:
1. implement strict manifest validator over split schema,
2. emit fail-closed reason codes,
3. prove envelope-only edits keep payload hash stable with tests.
