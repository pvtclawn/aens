import { keccak256, stringToHex } from 'viem'
import { canonicalJsonStringify } from './write-intent-hash'

export type FirstSeenProvenanceVerificationReasonCode =
  | 'fixture-provenance-registry-integrity-invalid'
  | 'fixture-provenance-registry-stale'

export interface FirstSeenProvenanceRecord {
  fixtureId: string
  firstSeenCommit: string
  firstSeenSchemaVersion: string
  firstSeenPath: string
  firstSeenContentHash: string
}

export interface FirstSeenProvenanceRegistry {
  registryVersion: string
  boundPolicyHash: string
  boundFixtureBundleHash: string
  records: FirstSeenProvenanceRecord[]
}

export interface VerifyFirstSeenProvenanceRegistryInput {
  registry: FirstSeenProvenanceRegistry
  expectedPolicyHash: string
  expectedFixtureBundleHash: string
  expectedRegistryHash?: string
}

export interface FirstSeenProvenanceFreshnessStatus {
  expectedPolicyHash: string
  observedPolicyHash: string
  policyHashMatches: boolean
  expectedFixtureBundleHash: string
  observedFixtureBundleHash: string
  fixtureBundleHashMatches: boolean
  isFresh: boolean
}

export interface VerifyFirstSeenProvenanceRegistrySuccess {
  ok: true
  registryVersion: string
  registryHash: `0x${string}`
  freshness: FirstSeenProvenanceFreshnessStatus
}

export interface VerifyFirstSeenProvenanceRegistryError {
  ok: false
  reasonCode: FirstSeenProvenanceVerificationReasonCode
  path: string
  message: string
  registryVersion: string | null
  registryHash: `0x${string}` | null
  freshness: FirstSeenProvenanceFreshnessStatus | null
}

export type VerifyFirstSeenProvenanceRegistryResult =
  | VerifyFirstSeenProvenanceRegistrySuccess
  | VerifyFirstSeenProvenanceRegistryError

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeHash(value: string): string {
  return value.trim().toLowerCase()
}

function isVerificationError(
  value: unknown,
): value is VerifyFirstSeenProvenanceRegistryError {
  return Boolean(value && typeof value === 'object' && (value as { ok?: boolean }).ok === false)
}

function integrityError(input: {
  path: string
  message: string
  registryVersion?: string | null
  registryHash?: `0x${string}` | null
  freshness?: FirstSeenProvenanceFreshnessStatus | null
}): VerifyFirstSeenProvenanceRegistryError {
  return {
    ok: false,
    reasonCode: 'fixture-provenance-registry-integrity-invalid',
    path: input.path,
    message: input.message,
    registryVersion: input.registryVersion ?? null,
    registryHash: input.registryHash ?? null,
    freshness: input.freshness ?? null,
  }
}

function staleError(input: {
  path: string
  message: string
  registryVersion: string
  registryHash: `0x${string}`
  freshness: FirstSeenProvenanceFreshnessStatus
}): VerifyFirstSeenProvenanceRegistryError {
  return {
    ok: false,
    reasonCode: 'fixture-provenance-registry-stale',
    path: input.path,
    message: input.message,
    registryVersion: input.registryVersion,
    registryHash: input.registryHash,
    freshness: input.freshness,
  }
}

function normalizeRecord(
  value: FirstSeenProvenanceRecord,
  index: number,
): FirstSeenProvenanceRecord | VerifyFirstSeenProvenanceRegistryError {
  if (!nonEmptyString(value.fixtureId)) {
    return integrityError({
      path: `registry.records[${index}].fixtureId`,
      message: 'fixtureId must be a non-empty string',
    })
  }

  if (!nonEmptyString(value.firstSeenCommit)) {
    return integrityError({
      path: `registry.records[${index}].firstSeenCommit`,
      message: 'firstSeenCommit must be a non-empty string',
    })
  }

  if (!nonEmptyString(value.firstSeenSchemaVersion)) {
    return integrityError({
      path: `registry.records[${index}].firstSeenSchemaVersion`,
      message: 'firstSeenSchemaVersion must be a non-empty string',
    })
  }

  if (!nonEmptyString(value.firstSeenPath)) {
    return integrityError({
      path: `registry.records[${index}].firstSeenPath`,
      message: 'firstSeenPath must be a non-empty string',
    })
  }

  if (!nonEmptyString(value.firstSeenContentHash)) {
    return integrityError({
      path: `registry.records[${index}].firstSeenContentHash`,
      message: 'firstSeenContentHash must be a non-empty string',
    })
  }

  return {
    fixtureId: value.fixtureId.trim(),
    firstSeenCommit: value.firstSeenCommit.trim(),
    firstSeenSchemaVersion: value.firstSeenSchemaVersion.trim(),
    firstSeenPath: value.firstSeenPath.trim(),
    firstSeenContentHash: normalizeHash(value.firstSeenContentHash),
  }
}

function normalizeRegistry(
  registry: FirstSeenProvenanceRegistry,
): FirstSeenProvenanceRegistry | VerifyFirstSeenProvenanceRegistryError {
  if (!nonEmptyString(registry.registryVersion)) {
    return integrityError({
      path: 'registry.registryVersion',
      message: 'registryVersion must be a non-empty string',
    })
  }

  if (!nonEmptyString(registry.boundPolicyHash)) {
    return integrityError({
      path: 'registry.boundPolicyHash',
      message: 'boundPolicyHash must be a non-empty hash string',
    })
  }

  if (!nonEmptyString(registry.boundFixtureBundleHash)) {
    return integrityError({
      path: 'registry.boundFixtureBundleHash',
      message: 'boundFixtureBundleHash must be a non-empty hash string',
    })
  }

  if (!Array.isArray(registry.records)) {
    return integrityError({
      path: 'registry.records',
      message: 'records must be an array',
    })
  }

  const normalizedRecords: FirstSeenProvenanceRecord[] = []
  for (let index = 0; index < registry.records.length; index += 1) {
    const normalized = normalizeRecord(registry.records[index], index)
    if (isVerificationError(normalized)) {
      return normalized
    }

    normalizedRecords.push(normalized)
  }

  const seenFixtureIds = new Set<string>()
  for (const record of normalizedRecords) {
    if (seenFixtureIds.has(record.fixtureId)) {
      return integrityError({
        path: 'registry.records',
        message: `duplicate fixtureId detected: ${record.fixtureId}`,
      })
    }

    seenFixtureIds.add(record.fixtureId)
  }

  normalizedRecords.sort((left, right) => {
    return left.fixtureId.localeCompare(right.fixtureId)
      || left.firstSeenSchemaVersion.localeCompare(right.firstSeenSchemaVersion)
      || left.firstSeenCommit.localeCompare(right.firstSeenCommit)
  })

  return {
    registryVersion: registry.registryVersion.trim(),
    boundPolicyHash: normalizeHash(registry.boundPolicyHash),
    boundFixtureBundleHash: normalizeHash(registry.boundFixtureBundleHash),
    records: normalizedRecords,
  }
}

export function verifyFirstSeenProvenanceRegistry(
  input: VerifyFirstSeenProvenanceRegistryInput,
): VerifyFirstSeenProvenanceRegistryResult {
  const normalizedRegistry = normalizeRegistry(input.registry)
  if (isVerificationError(normalizedRegistry)) {
    return normalizedRegistry
  }

  if (!nonEmptyString(input.expectedPolicyHash)) {
    return integrityError({
      path: 'expectedPolicyHash',
      message: 'expectedPolicyHash must be a non-empty hash string',
      registryVersion: normalizedRegistry.registryVersion,
    })
  }

  if (!nonEmptyString(input.expectedFixtureBundleHash)) {
    return integrityError({
      path: 'expectedFixtureBundleHash',
      message: 'expectedFixtureBundleHash must be a non-empty hash string',
      registryVersion: normalizedRegistry.registryVersion,
    })
  }

  const canonicalRegistryJson = canonicalJsonStringify(normalizedRegistry)
  const registryHash = keccak256(stringToHex(canonicalRegistryJson))

  if (input.expectedRegistryHash !== undefined) {
    if (!nonEmptyString(input.expectedRegistryHash)) {
      return integrityError({
        path: 'expectedRegistryHash',
        message: 'expectedRegistryHash must be a non-empty hash string when provided',
        registryVersion: normalizedRegistry.registryVersion,
        registryHash,
      })
    }

    if (normalizeHash(input.expectedRegistryHash) !== normalizeHash(registryHash)) {
      return integrityError({
        path: 'expectedRegistryHash',
        message: 'expectedRegistryHash does not match computed registry hash',
        registryVersion: normalizedRegistry.registryVersion,
        registryHash,
      })
    }
  }

  const freshness: FirstSeenProvenanceFreshnessStatus = {
    expectedPolicyHash: normalizeHash(input.expectedPolicyHash),
    observedPolicyHash: normalizedRegistry.boundPolicyHash,
    policyHashMatches: normalizedRegistry.boundPolicyHash === normalizeHash(input.expectedPolicyHash),
    expectedFixtureBundleHash: normalizeHash(input.expectedFixtureBundleHash),
    observedFixtureBundleHash: normalizedRegistry.boundFixtureBundleHash,
    fixtureBundleHashMatches: normalizedRegistry.boundFixtureBundleHash === normalizeHash(input.expectedFixtureBundleHash),
    isFresh: false,
  }

  freshness.isFresh = freshness.policyHashMatches && freshness.fixtureBundleHashMatches

  if (!freshness.policyHashMatches) {
    return staleError({
      path: 'registry.boundPolicyHash',
      message: 'registry bound policy hash does not match expected policy hash',
      registryVersion: normalizedRegistry.registryVersion,
      registryHash,
      freshness,
    })
  }

  if (!freshness.fixtureBundleHashMatches) {
    return staleError({
      path: 'registry.boundFixtureBundleHash',
      message: 'registry bound fixture bundle hash does not match expected fixture bundle hash',
      registryVersion: normalizedRegistry.registryVersion,
      registryHash,
      freshness,
    })
  }

  return {
    ok: true,
    registryVersion: normalizedRegistry.registryVersion,
    registryHash,
    freshness,
  }
}
