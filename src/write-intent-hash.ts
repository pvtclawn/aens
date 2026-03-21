import { keccak256, stringToHex } from 'viem'

export interface WriteIntentRecord {
  targetName: string
  key: string
  value: string
}

export interface WriteIntentExpectedPostState {
  authorizationStatus: string
  reasonCode: string
  serviceUrl: string
}

export interface WriteIntentPayload {
  schemaVersion: string
  chainId: number
  rootName: string
  capabilityName: string
  targetRecords: WriteIntentRecord[]
  expectedPostState: WriteIntentExpectedPostState
}

export interface WriteIntentHashResult {
  payload: WriteIntentPayload
  canonicalJson: string
  intentPayloadHash: `0x${string}`
  intentPayloadByteLength: number
  hashAlgorithm: typeof WRITE_INTENT_HASH_ALGORITHM
}

export const WRITE_INTENT_HASH_ALGORITHM = 'keccak256-utf8-canonical-json-v1' as const

function normalizeEnsName(value: string): string {
  return value.trim().toLowerCase()
}

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

function normalizeValue(value: string): string {
  const trimmed = value.trim()
  return /^https?:\/\//i.test(trimmed) ? normalizeUrl(trimmed) : trimmed
}

function canonicalizeRecords(records: WriteIntentRecord[]): WriteIntentRecord[] {
  return [...records]
    .map((record) => ({
      targetName: normalizeEnsName(record.targetName),
      key: record.key.trim(),
      value: normalizeValue(record.value),
    }))
    .sort((left, right) => {
      return left.targetName.localeCompare(right.targetName)
        || left.key.localeCompare(right.key)
        || left.value.localeCompare(right.value)
    })
}

export function buildIntentPayloadForHash(input: WriteIntentPayload): WriteIntentPayload {
  return {
    schemaVersion: input.schemaVersion.trim(),
    chainId: input.chainId,
    rootName: normalizeEnsName(input.rootName),
    capabilityName: normalizeEnsName(input.capabilityName),
    targetRecords: canonicalizeRecords(input.targetRecords),
    expectedPostState: {
      authorizationStatus: input.expectedPostState.authorizationStatus.trim(),
      reasonCode: input.expectedPostState.reasonCode.trim(),
      serviceUrl: normalizeUrl(input.expectedPostState.serviceUrl),
    },
  }
}

export function canonicalJsonStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalJsonStringify(entry)).join(',')}]`
  }

  const record = value as Record<string, unknown>
  const keys = Object.keys(record).sort((left, right) => left.localeCompare(right))

  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJsonStringify(record[key])}`).join(',')}}`
}

export function hashWriteIntentPayload(input: WriteIntentPayload): WriteIntentHashResult {
  const payload = buildIntentPayloadForHash(input)
  const canonicalJson = canonicalJsonStringify(payload)
  const intentPayloadHash = keccak256(stringToHex(canonicalJson))

  return {
    payload,
    canonicalJson,
    intentPayloadHash,
    intentPayloadByteLength: new TextEncoder().encode(canonicalJson).length,
    hashAlgorithm: WRITE_INTENT_HASH_ALGORITHM,
  }
}
