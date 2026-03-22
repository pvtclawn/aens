import { expect, test } from 'bun:test'
import {
  validateParityFixtureSemanticConsistency,
} from './parity-fixture-semantic-consistency'

test('validateParityFixtureSemanticConsistency accepts coherent active fixture payloads', () => {
  const issues = validateParityFixtureSemanticConsistency({
    fixtureId: 'validator-active_schema-active',
    inputState: {
      validatorVersionState: 'active',
      schemaVersionState: 'active',
    },
    expectedMachinePayload: {
      primaryBlockerReasonCode: null,
      secondaryBlockerReasonCodes: [],
      releaseEligibleByPolicy: true,
      stateSummary: {
        validatorVersionState: 'active',
        schemaVersionState: 'active',
      },
    },
  })

  expect(issues).toHaveLength(0)
})

test('validateParityFixtureSemanticConsistency flags primary/release mismatches against state precedence', () => {
  const issues = validateParityFixtureSemanticConsistency({
    fixtureId: 'validator-grace-expired_schema-active',
    inputState: {
      validatorVersionState: 'grace-expired',
      schemaVersionState: 'active',
    },
    expectedMachinePayload: {
      primaryBlockerReasonCode: 'artifact-schema-version-unsupported',
      secondaryBlockerReasonCodes: [],
      releaseEligibleByPolicy: true,
      stateSummary: {
        validatorVersionState: 'grace-expired',
        schemaVersionState: 'active',
      },
    },
  })

  expect(issues.map((issue) => issue.reasonCode)).toEqual([
    'fixture-semantic-primary-reason-mismatch',
    'fixture-semantic-release-blocker-mismatch',
  ])
})

test('validateParityFixtureSemanticConsistency enforces unknown-state diagnostic invariants', () => {
  const missing = validateParityFixtureSemanticConsistency({
    fixtureId: 'policy-unknown-state',
    inputState: {
      validatorVersionState: 'active',
      schemaVersionState: 'active',
    },
    expectedMachinePayload: {
      primaryBlockerReasonCode: 'artifact-policy-state-unknown',
      secondaryBlockerReasonCodes: [],
      releaseEligibleByPolicy: false,
      stateSummary: {
        validatorVersionState: 'active',
        schemaVersionState: 'active',
      },
    },
  })

  expect(missing.some((issue) => issue.reasonCode === 'fixture-semantic-unknown-state-diagnostics-missing')).toBe(true)

  const unexpected = validateParityFixtureSemanticConsistency({
    fixtureId: 'validator-active_schema-active',
    inputState: {
      validatorVersionState: 'active',
      schemaVersionState: 'active',
    },
    expectedMachinePayload: {
      primaryBlockerReasonCode: null,
      secondaryBlockerReasonCodes: [],
      releaseEligibleByPolicy: true,
      stateSummary: {
        validatorVersionState: 'active',
        schemaVersionState: 'active',
      },
      unknownState: {
        offendingAxis: 'policy',
        offendingState: 'unexpected-state',
        mapperVersion: 'aens-policy-blocker-mapper/v1',
        remediationHint: 'remove unknown diagnostics from non-unknown fixture',
      },
    },
  })

  expect(unexpected.some((issue) => issue.reasonCode === 'fixture-semantic-unknown-state-diagnostics-unexpected')).toBe(true)
})

test('validateParityFixtureSemanticConsistency flags placeholder/sentinel values', () => {
  const issues = validateParityFixtureSemanticConsistency({
    fixtureId: '__TODO___validator-active_schema-active',
    inputState: {
      validatorVersionState: 'active',
      schemaVersionState: 'active',
    },
    expectedMachinePayload: {
      primaryBlockerReasonCode: null,
      secondaryBlockerReasonCodes: ['artifact-schema-version-unsupported'],
      releaseEligibleByPolicy: true,
      stateSummary: {
        validatorVersionState: 'active',
        schemaVersionState: 'active',
      },
      unknownState: {
        offendingAxis: 'policy',
        offendingState: 'PLACEHOLDER',
        mapperVersion: 'aens-policy-blocker-mapper/v1',
        remediationHint: 'REPLACE_ME',
      },
    },
  })

  expect(issues.some((issue) => issue.reasonCode === 'fixture-semantic-placeholder-value')).toBe(true)
})
