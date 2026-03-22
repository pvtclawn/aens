import { expect, test } from 'bun:test'
import {
  buildPolicyBlockerMapperOutput,
  POLICY_BLOCKER_MAPPER_VERSION,
} from './policy-blocker-mapper-output'
import {
  assertPolicyBlockerReasonCode,
  isPolicyBlockerReasonCode,
  POLICY_BLOCKER_REASON_CODES,
} from './policy-blocker-reason-codes'

test('policy blocker reason-code registry recognizes and asserts registered codes', () => {
  for (const reasonCode of POLICY_BLOCKER_REASON_CODES) {
    expect(isPolicyBlockerReasonCode(reasonCode)).toBe(true)
    expect(assertPolicyBlockerReasonCode(reasonCode)).toBe(reasonCode)
  }

  expect(isPolicyBlockerReasonCode('artifact-unknown-reason')).toBe(false)
  expect(() => assertPolicyBlockerReasonCode('artifact-unknown-reason')).toThrow(
    'registered blocker reason code',
  )
})

test('buildPolicyBlockerMapperOutput accepts registered primary/secondary reason codes', () => {
  const output = buildPolicyBlockerMapperOutput({
    primaryBlockerReasonCode: 'artifact-validator-version-grace-expired',
    secondaryBlockerReasonCodes: ['artifact-schema-version-unsupported'],
    releaseEligibleByPolicy: false,
    stateSummary: {
      validatorVersionState: 'grace-expired',
      schemaVersionState: 'unsupported',
    },
  })

  expect(output.primaryBlockerReasonCode).toBe('artifact-validator-version-grace-expired')
  expect(output.secondaryBlockerReasonCodes).toEqual(['artifact-schema-version-unsupported'])
  expect(output.releaseEligibleByPolicy).toBe(false)
})

test('buildPolicyBlockerMapperOutput fails on unregistered primary reason code', () => {
  expect(() => buildPolicyBlockerMapperOutput({
    primaryBlockerReasonCode: 'artifact-validator-version-custom-state',
    secondaryBlockerReasonCodes: [],
    releaseEligibleByPolicy: false,
    stateSummary: {
      validatorVersionState: 'unsupported',
      schemaVersionState: 'active',
    },
  })).toThrow('primaryBlockerReasonCode must be a registered blocker reason code')
})

test('buildPolicyBlockerMapperOutput fails on unregistered secondary reason code', () => {
  expect(() => buildPolicyBlockerMapperOutput({
    primaryBlockerReasonCode: 'artifact-schema-version-unsupported',
    secondaryBlockerReasonCodes: ['artifact-unknown-secondary'],
    releaseEligibleByPolicy: false,
    stateSummary: {
      validatorVersionState: 'active',
      schemaVersionState: 'unsupported',
    },
  })).toThrow('secondaryBlockerReasonCodes[0] must be a registered blocker reason code')
})

test('buildPolicyBlockerMapperOutput enforces unknown-state invariant diagnostics', () => {
  const output = buildPolicyBlockerMapperOutput({
    primaryBlockerReasonCode: 'artifact-policy-state-unknown',
    secondaryBlockerReasonCodes: [],
    releaseEligibleByPolicy: false,
    stateSummary: {
      validatorVersionState: 'active',
      schemaVersionState: 'active',
    },
    unknownState: {
      offendingAxis: 'policy',
      offendingState: 'unexpected-state',
      mapperVersion: POLICY_BLOCKER_MAPPER_VERSION,
      remediationHint: 'update state normalizer',
    },
  })

  expect(output.unknownState?.mapperVersion).toBe(POLICY_BLOCKER_MAPPER_VERSION)

  expect(() => buildPolicyBlockerMapperOutput({
    primaryBlockerReasonCode: 'artifact-schema-version-unsupported',
    secondaryBlockerReasonCodes: [],
    releaseEligibleByPolicy: false,
    stateSummary: {
      validatorVersionState: 'active',
      schemaVersionState: 'unsupported',
    },
    unknownState: {
      offendingAxis: 'schema',
      offendingState: 'unexpected-state',
      mapperVersion: POLICY_BLOCKER_MAPPER_VERSION,
      remediationHint: 'fix schema state source',
    },
  })).toThrow('unknownState diagnostics require primaryBlockerReasonCode=artifact-policy-state-unknown')
})
