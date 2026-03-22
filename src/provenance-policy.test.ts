import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { expect, test } from 'bun:test'
import {
  DEFAULT_PROVENANCE_POLICY_PATH,
  loadProvenancePolicy,
} from './provenance-policy'

function writePolicyFile(input: {
  repoRoot: string
  relativePath?: string
  body: unknown
}): string {
  const relativePath = input.relativePath ?? DEFAULT_PROVENANCE_POLICY_PATH
  const fullPath = join(input.repoRoot, relativePath)
  mkdirSync(dirname(fullPath), { recursive: true })
  writeFileSync(fullPath, JSON.stringify(input.body, null, 2))
  return fullPath
}

function createRepoRoot(): string {
  return mkdtempSync(join(tmpdir(), 'aens-provenance-policy-test-'))
}

function validPolicyBody(): unknown {
  return {
    policyVersion: 'aens-provenance-policy.v1',
    allowedValidatorVersions: {
      active: ['aens-provenance-gate/v1'],
      grace: [],
    },
    allowedSchemaVersions: {
      active: ['aens-write-intent/v1'],
      grace: [],
    },
  }
}

test('loadProvenancePolicy loads canonical policy with hash metadata', () => {
  const repoRoot = createRepoRoot()
  writePolicyFile({
    repoRoot,
    body: validPolicyBody(),
  })

  const loaded = loadProvenancePolicy({ repoRoot })

  expect(loaded.policy.policyVersion).toBe('aens-provenance-policy.v1')
  expect(loaded.policySourcePath.endsWith('/config/provenance-policy.json')).toBe(true)
  expect(loaded.policyHash).toMatch(/^0x[0-9a-f]{64}$/)
  expect(loaded.policyByteLength).toBeGreaterThan(0)
})

test('loadProvenancePolicy hash stays stable for identical policy bytes', () => {
  const repoRoot = createRepoRoot()
  writePolicyFile({
    repoRoot,
    body: validPolicyBody(),
  })

  const first = loadProvenancePolicy({ repoRoot })
  const second = loadProvenancePolicy({ repoRoot })

  expect(first.policyHash).toBe(second.policyHash)
  expect(first.policyByteLength).toBe(second.policyByteLength)
})

test('loadProvenancePolicy rejects malformed policy structure', () => {
  const repoRoot = createRepoRoot()
  writePolicyFile({
    repoRoot,
    body: {
      policyVersion: 'aens-provenance-policy.v1',
      allowedValidatorVersions: {
        active: ['aens-provenance-gate/v1'],
      },
    },
  })

  expect(() => loadProvenancePolicy({ repoRoot })).toThrow('$.allowedSchemaVersions')
})

test('loadProvenancePolicy rejects multiple policy sources (source collision)', () => {
  const repoRoot = createRepoRoot()
  writePolicyFile({
    repoRoot,
    body: validPolicyBody(),
  })
  writePolicyFile({
    repoRoot,
    relativePath: 'config/provenance-policy.override.json',
    body: validPolicyBody(),
  })

  expect(() => {
    loadProvenancePolicy({
      repoRoot,
      additionalPolicyPaths: ['config/provenance-policy.override.json'],
    })
  }).toThrow('Multiple provenance policy sources detected')
})

test('loadProvenancePolicy rejects unsupported top-level keys', () => {
  const repoRoot = createRepoRoot()
  const body = validPolicyBody() as Record<string, unknown>

  writePolicyFile({
    repoRoot,
    body: {
      ...body,
      allowlistOverride: true,
    },
  })

  expect(() => loadProvenancePolicy({ repoRoot })).toThrow('unsupported keys')
})
