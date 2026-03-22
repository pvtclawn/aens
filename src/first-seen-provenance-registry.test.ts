import { expect, test } from 'bun:test'
import {
  verifyFirstSeenProvenanceRegistry,
  type FirstSeenProvenanceRegistry,
} from './first-seen-provenance-registry'

function buildRegistry(overrides: Partial<FirstSeenProvenanceRegistry> = {}): FirstSeenProvenanceRegistry {
  return {
    registryVersion: 'first-seen-registry/v1',
    boundPolicyHash: '0xpolicyhash0001',
    boundFixtureBundleHash: '0xbundlehash0001',
    records: [
      {
        fixtureId: 'validator-grace-expired_schema-active',
        firstSeenCommit: 'a1b2c3d4',
        firstSeenSchemaVersion: 'fixture-schema/v1',
        firstSeenPath: 'fixtures/validator-grace-expired_schema-active.json',
        firstSeenContentHash: '0xrecordhash001',
      },
      {
        fixtureId: 'validator-active_schema-active',
        firstSeenCommit: 'a1b2c3d0',
        firstSeenSchemaVersion: 'fixture-schema/v1',
        firstSeenPath: 'fixtures/validator-active_schema-active.json',
        firstSeenContentHash: '0xrecordhash002',
      },
    ],
    ...overrides,
  }
}

test('verifyFirstSeenProvenanceRegistry returns fresh success with deterministic hash metadata', () => {
  const registry = buildRegistry()

  const first = verifyFirstSeenProvenanceRegistry({
    registry,
    expectedPolicyHash: registry.boundPolicyHash,
    expectedFixtureBundleHash: registry.boundFixtureBundleHash,
  })

  const second = verifyFirstSeenProvenanceRegistry({
    registry: {
      ...registry,
      records: [...registry.records].reverse(), // order independence via normalization
    },
    expectedPolicyHash: registry.boundPolicyHash,
    expectedFixtureBundleHash: registry.boundFixtureBundleHash,
  })

  expect(first.ok).toBe(true)
  expect(second.ok).toBe(true)
  if (!first.ok || !second.ok) return

  expect(first.registryHash).toBe(second.registryHash)
  expect(first.registryVersion).toBe('first-seen-registry/v1')
  expect(first.freshness.isFresh).toBe(true)
  expect(first.freshness.policyHashMatches).toBe(true)
  expect(first.freshness.fixtureBundleHashMatches).toBe(true)
})

test('verifyFirstSeenProvenanceRegistry fails integrity on expectedRegistryHash mismatch', () => {
  const registry = buildRegistry()

  const result = verifyFirstSeenProvenanceRegistry({
    registry,
    expectedPolicyHash: registry.boundPolicyHash,
    expectedFixtureBundleHash: registry.boundFixtureBundleHash,
    expectedRegistryHash: '0xdeadbeef',
  })

  expect(result.ok).toBe(false)
  if (result.ok) return

  expect(result.reasonCode).toBe('fixture-provenance-registry-integrity-invalid')
  expect(result.path).toBe('expectedRegistryHash')
  expect(result.registryHash).toMatch(/^0x[0-9a-f]{64}$/)
})

test('verifyFirstSeenProvenanceRegistry fails stale on policy-hash freshness mismatch', () => {
  const registry = buildRegistry()

  const result = verifyFirstSeenProvenanceRegistry({
    registry,
    expectedPolicyHash: '0xpolicyhash9999',
    expectedFixtureBundleHash: registry.boundFixtureBundleHash,
  })

  expect(result.ok).toBe(false)
  if (result.ok) return

  expect(result.reasonCode).toBe('fixture-provenance-registry-stale')
  expect(result.path).toBe('registry.boundPolicyHash')
  expect(result.freshness?.policyHashMatches).toBe(false)
  expect(result.freshness?.fixtureBundleHashMatches).toBe(true)
  expect(result.freshness?.isFresh).toBe(false)
})

test('verifyFirstSeenProvenanceRegistry fails stale on fixture-bundle freshness mismatch', () => {
  const registry = buildRegistry()

  const result = verifyFirstSeenProvenanceRegistry({
    registry,
    expectedPolicyHash: registry.boundPolicyHash,
    expectedFixtureBundleHash: '0xbundlehash9999',
  })

  expect(result.ok).toBe(false)
  if (result.ok) return

  expect(result.reasonCode).toBe('fixture-provenance-registry-stale')
  expect(result.path).toBe('registry.boundFixtureBundleHash')
  expect(result.freshness?.policyHashMatches).toBe(true)
  expect(result.freshness?.fixtureBundleHashMatches).toBe(false)
})

test('verifyFirstSeenProvenanceRegistry fails integrity on duplicate fixture IDs', () => {
  const result = verifyFirstSeenProvenanceRegistry({
    registry: buildRegistry({
      records: [
        {
          fixtureId: 'same-id',
          firstSeenCommit: 'a1',
          firstSeenSchemaVersion: 'fixture-schema/v1',
          firstSeenPath: 'fixtures/a.json',
          firstSeenContentHash: '0x1',
        },
        {
          fixtureId: 'same-id',
          firstSeenCommit: 'a2',
          firstSeenSchemaVersion: 'fixture-schema/v1',
          firstSeenPath: 'fixtures/b.json',
          firstSeenContentHash: '0x2',
        },
      ],
    }),
    expectedPolicyHash: '0xpolicyhash0001',
    expectedFixtureBundleHash: '0xbundlehash0001',
  })

  expect(result.ok).toBe(false)
  if (result.ok) return

  expect(result.reasonCode).toBe('fixture-provenance-registry-integrity-invalid')
  expect(result.path).toBe('registry.records')
  expect(result.message).toContain('duplicate fixtureId detected')
})
