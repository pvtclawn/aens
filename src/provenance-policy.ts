import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { keccak256, stringToHex } from 'viem'
import { canonicalJsonStringify } from './write-intent-hash'

export const DEFAULT_PROVENANCE_POLICY_PATH = 'config/provenance-policy.json'

export interface ProvenancePolicyGraceVersion {
  version: string
  expiresAt: string
}

export interface ProvenancePolicyVersionSet {
  active: string[]
  grace: ProvenancePolicyGraceVersion[]
}

export interface ProvenancePolicy {
  policyVersion: string
  allowedValidatorVersions: ProvenancePolicyVersionSet
  allowedSchemaVersions: ProvenancePolicyVersionSet
}

export interface LoadProvenancePolicyOptions {
  repoRoot?: string
  policyPath?: string
  additionalPolicyPaths?: string[]
}

export interface LoadedProvenancePolicy {
  policy: ProvenancePolicy
  policySourcePath: string
  policyHash: `0x${string}`
  policyByteLength: number
}

function repoRootFromModule(): string {
  return resolve(fileURLToPath(new URL('..', import.meta.url)))
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function readRequiredString(input: {
  value: unknown
  path: string
}): string {
  if (typeof input.value !== 'string' || input.value.trim().length === 0) {
    throw new Error(`${input.path} must be a non-empty string`)
  }

  return input.value.trim()
}

function assertAllowedKeys(input: {
  value: Record<string, unknown>
  path: string
  allowedKeys: string[]
}): void {
  const allowed = new Set(input.allowedKeys)
  const unknown = Object.keys(input.value).filter((key) => !allowed.has(key))

  if (unknown.length > 0) {
    throw new Error(`${input.path} contains unsupported keys: ${unknown.join(', ')}`)
  }
}

function normalizeVersionArray(input: {
  value: unknown
  path: string
}): string[] {
  if (!Array.isArray(input.value)) {
    throw new Error(`${input.path} must be an array of non-empty strings`)
  }

  const normalized = input.value.map((entry, index) => readRequiredString({
    value: entry,
    path: `${input.path}[${index}]`,
  }))

  if (normalized.length === 0) {
    throw new Error(`${input.path} must contain at least one version`)
  }

  return [...new Set(normalized)]
}

function normalizeGraceVersions(input: {
  value: unknown
  path: string
}): ProvenancePolicyGraceVersion[] {
  if (input.value === undefined) {
    return []
  }

  if (!Array.isArray(input.value)) {
    throw new Error(`${input.path} must be an array when provided`)
  }

  return input.value.map((entry, index) => {
    if (!isObject(entry)) {
      throw new Error(`${input.path}[${index}] must be an object`)
    }

    assertAllowedKeys({
      value: entry,
      path: `${input.path}[${index}]`,
      allowedKeys: ['version', 'expiresAt'],
    })

    const version = readRequiredString({
      value: entry.version,
      path: `${input.path}[${index}].version`,
    })

    const expiresAt = readRequiredString({
      value: entry.expiresAt,
      path: `${input.path}[${index}].expiresAt`,
    })

    if (Number.isNaN(Date.parse(expiresAt))) {
      throw new Error(`${input.path}[${index}].expiresAt must be a valid timestamp`)
    }

    return { version, expiresAt }
  })
}

function normalizeVersionSet(input: {
  value: unknown
  path: string
}): ProvenancePolicyVersionSet {
  if (!isObject(input.value)) {
    throw new Error(`${input.path} must be an object`)
  }

  assertAllowedKeys({
    value: input.value,
    path: input.path,
    allowedKeys: ['active', 'grace'],
  })

  return {
    active: normalizeVersionArray({
      value: input.value.active,
      path: `${input.path}.active`,
    }),
    grace: normalizeGraceVersions({
      value: input.value.grace,
      path: `${input.path}.grace`,
    }),
  }
}

function normalizePolicy(input: unknown): ProvenancePolicy {
  if (!isObject(input)) {
    throw new Error('provenance policy must be a JSON object')
  }

  assertAllowedKeys({
    value: input,
    path: '$',
    allowedKeys: ['policyVersion', 'allowedValidatorVersions', 'allowedSchemaVersions'],
  })

  return {
    policyVersion: readRequiredString({
      value: input.policyVersion,
      path: '$.policyVersion',
    }),
    allowedValidatorVersions: normalizeVersionSet({
      value: input.allowedValidatorVersions,
      path: '$.allowedValidatorVersions',
    }),
    allowedSchemaVersions: normalizeVersionSet({
      value: input.allowedSchemaVersions,
      path: '$.allowedSchemaVersions',
    }),
  }
}

function resolvePolicySourcePath(input: {
  repoRoot: string
  policyPath: string
  additionalPolicyPaths: string[]
}): string {
  const candidatePaths = [input.policyPath, ...input.additionalPolicyPaths]
    .map((path) => resolve(input.repoRoot, path))

  const existingPaths = candidatePaths.filter((path) => existsSync(path))

  if (existingPaths.length === 0) {
    throw new Error(`No provenance policy source found (checked: ${candidatePaths.join(', ')})`)
  }

  if (existingPaths.length > 1) {
    throw new Error(`Multiple provenance policy sources detected: ${existingPaths.join(', ')}`)
  }

  return existingPaths[0]
}

export function loadProvenancePolicy(
  options: LoadProvenancePolicyOptions = {},
): LoadedProvenancePolicy {
  const repoRoot = options.repoRoot ?? repoRootFromModule()
  const policyPath = options.policyPath ?? DEFAULT_PROVENANCE_POLICY_PATH
  const additionalPolicyPaths = options.additionalPolicyPaths ?? []

  const policySourcePath = resolvePolicySourcePath({
    repoRoot,
    policyPath,
    additionalPolicyPaths,
  })

  const rawBody = readFileSync(policySourcePath, 'utf8')

  let parsedBody: unknown
  try {
    parsedBody = JSON.parse(rawBody)
  } catch (error: unknown) {
    throw new Error(`Unable to parse provenance policy JSON at ${policySourcePath}: ${String(error)}`)
  }

  const policy = normalizePolicy(parsedBody)
  const canonicalPolicyJson = canonicalJsonStringify(policy)
  const policyHash = keccak256(stringToHex(canonicalPolicyJson))

  return {
    policy,
    policySourcePath,
    policyHash,
    policyByteLength: new TextEncoder().encode(canonicalPolicyJson).length,
  }
}
