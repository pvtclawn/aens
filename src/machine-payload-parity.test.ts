import { expect, test } from 'bun:test'
import {
  compareCanonicalMachinePayloads,
  formatMachinePayloadMismatchSummary,
} from './machine-payload-parity'

test('compareCanonicalMachinePayloads treats key-order and optional undefined/missing fields as equal', () => {
  const expected = {
    primaryBlockerReasonCode: null,
    secondaryBlockerReasonCodes: [] as string[],
    releaseEligibleByPolicy: true,
    stateSummary: {
      validatorVersionState: 'active',
      schemaVersionState: 'active',
    },
    unknownState: undefined,
  }

  const observed = {
    stateSummary: {
      schemaVersionState: 'active',
      validatorVersionState: 'active',
    },
    releaseEligibleByPolicy: true,
    secondaryBlockerReasonCodes: [],
    primaryBlockerReasonCode: null,
  }

  const result = compareCanonicalMachinePayloads({ expected, observed })

  expect(result.equal).toBe(true)
  expect(result.mismatches).toHaveLength(0)
  expect(result.canonicalExpected).toBe(result.canonicalObserved)
})

test('compareCanonicalMachinePayloads reports deterministic field-level mismatch path for nested drift', () => {
  const result = compareCanonicalMachinePayloads({
    expected: {
      primaryBlockerReasonCode: 'artifact-validator-version-grace-expired',
      secondaryBlockerReasonCodes: ['artifact-schema-version-unsupported'],
      releaseEligibleByPolicy: false,
      stateSummary: {
        validatorVersionState: 'grace-expired',
        schemaVersionState: 'active',
      },
    },
    observed: {
      primaryBlockerReasonCode: 'artifact-validator-version-grace-expired',
      secondaryBlockerReasonCodes: ['artifact-schema-version-unsupported'],
      releaseEligibleByPolicy: false,
      stateSummary: {
        validatorVersionState: 'grace-expired',
        schemaVersionState: 'unsupported',
      },
    },
  })

  expect(result.equal).toBe(false)
  expect(result.mismatches).toEqual([
    {
      fieldPath: '$.stateSummary.schemaVersionState',
      expectedValueSnippet: '"active"',
      observedValueSnippet: '"unsupported"',
    },
  ])
})

test('compareCanonicalMachinePayloads reports array ordering drift deterministically', () => {
  const result = compareCanonicalMachinePayloads({
    expected: {
      primaryBlockerReasonCode: 'artifact-validator-version-grace-expired',
      secondaryBlockerReasonCodes: [
        'artifact-schema-version-unsupported',
        'artifact-schema-version-grace-active-nonrelease',
      ],
      releaseEligibleByPolicy: false,
      stateSummary: {
        validatorVersionState: 'grace-expired',
        schemaVersionState: 'grace-active',
      },
    },
    observed: {
      primaryBlockerReasonCode: 'artifact-validator-version-grace-expired',
      secondaryBlockerReasonCodes: [
        'artifact-schema-version-grace-active-nonrelease',
        'artifact-schema-version-unsupported',
      ],
      releaseEligibleByPolicy: false,
      stateSummary: {
        validatorVersionState: 'grace-expired',
        schemaVersionState: 'grace-active',
      },
    },
  })

  expect(result.equal).toBe(false)
  expect(result.mismatches[0]).toEqual({
    fieldPath: '$.secondaryBlockerReasonCodes[0]',
    expectedValueSnippet: '"artifact-schema-version-unsupported"',
    observedValueSnippet: '"artifact-schema-version-grace-active-nonrelease"',
  })
})

test('formatMachinePayloadMismatchSummary exposes deterministic limited diagnostics', () => {
  const comparison = compareCanonicalMachinePayloads({
    expected: {
      primaryBlockerReasonCode: 'artifact-policy-grace-entry-invalid',
      secondaryBlockerReasonCodes: ['artifact-schema-version-unsupported'],
      releaseEligibleByPolicy: false,
      stateSummary: {
        validatorVersionState: 'policy-invalid',
        schemaVersionState: 'unsupported',
      },
      unknownState: {
        offendingAxis: 'policy',
        offendingState: 'mystery-state',
        mapperVersion: 'aens-policy-blocker-mapper/v1',
        remediationHint: 'update policy state normalizer',
      },
    },
    observed: {
      primaryBlockerReasonCode: 'artifact-policy-state-unknown',
      secondaryBlockerReasonCodes: ['artifact-schema-version-grace-active-nonrelease'],
      releaseEligibleByPolicy: false,
      stateSummary: {
        validatorVersionState: 'unsupported',
        schemaVersionState: 'grace-active',
      },
      unknownState: {
        offendingAxis: 'schema',
        offendingState: 'mystery-state',
        mapperVersion: 'aens-policy-blocker-mapper/v2',
        remediationHint: 'check adapter mapper version',
      },
    },
  })

  const summary = formatMachinePayloadMismatchSummary(comparison, { limit: 2 })

  expect(summary).toEqual([
    '$.primaryBlockerReasonCode: expected "artifact-policy-grace-entry-invalid" observed "artifact-policy-state-unknown"',
    '$.secondaryBlockerReasonCodes[0]: expected "artifact-schema-version-unsupported" observed "artifact-schema-version-grace-active-nonrelease"',
    '... 5 more mismatch(es)',
  ])
})
