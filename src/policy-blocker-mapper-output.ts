import {
  assertPolicyBlockerReasonCode,
  type PolicyBlockerReasonCode,
} from './policy-blocker-reason-codes'

export const POLICY_BLOCKER_MAPPER_VERSION = 'aens-policy-blocker-mapper/v1' as const

export type PolicyVersionState =
  | 'active'
  | 'grace-active'
  | 'grace-expired'
  | 'unsupported'
  | 'policy-invalid'

export interface PolicyStateSummary {
  validatorVersionState: PolicyVersionState
  schemaVersionState: PolicyVersionState
}

export interface PolicyUnknownStateDiagnostic {
  offendingAxis: 'validator' | 'schema' | 'policy'
  offendingState: string
  mapperVersion: string
  remediationHint: string
}

export interface PolicyBlockerMapperOutput {
  primaryBlockerReasonCode: PolicyBlockerReasonCode | null
  secondaryBlockerReasonCodes: PolicyBlockerReasonCode[]
  releaseEligibleByPolicy: boolean
  stateSummary: PolicyStateSummary
  unknownState?: PolicyUnknownStateDiagnostic
}

export interface BuildPolicyBlockerMapperOutputInput {
  primaryBlockerReasonCode: string | null
  secondaryBlockerReasonCodes: string[]
  releaseEligibleByPolicy: boolean
  stateSummary: PolicyStateSummary
  unknownState?: PolicyUnknownStateDiagnostic
}

function assertNoDuplicateSecondaryReasons(reasonCodes: string[]): void {
  const seen = new Set<string>()
  for (const reasonCode of reasonCodes) {
    if (seen.has(reasonCode)) {
      throw new Error(`secondaryBlockerReasonCodes contains duplicate reason: ${reasonCode}`)
    }

    seen.add(reasonCode)
  }
}

export function buildPolicyBlockerMapperOutput(
  input: BuildPolicyBlockerMapperOutputInput,
): PolicyBlockerMapperOutput {
  if (input.primaryBlockerReasonCode === null && input.releaseEligibleByPolicy === false) {
    throw new Error('releaseEligibleByPolicy=false requires a primaryBlockerReasonCode')
  }

  const primaryBlockerReasonCode = input.primaryBlockerReasonCode === null
    ? null
    : assertPolicyBlockerReasonCode(input.primaryBlockerReasonCode, 'primaryBlockerReasonCode')

  assertNoDuplicateSecondaryReasons(input.secondaryBlockerReasonCodes)
  const secondaryBlockerReasonCodes = input.secondaryBlockerReasonCodes.map((reasonCode, index) => {
    return assertPolicyBlockerReasonCode(
      reasonCode,
      `secondaryBlockerReasonCodes[${index}]`,
    )
  })

  if (primaryBlockerReasonCode !== null && secondaryBlockerReasonCodes.includes(primaryBlockerReasonCode)) {
    throw new Error('secondaryBlockerReasonCodes must not repeat primaryBlockerReasonCode')
  }

  if (input.unknownState && primaryBlockerReasonCode !== 'artifact-policy-state-unknown') {
    throw new Error('unknownState diagnostics require primaryBlockerReasonCode=artifact-policy-state-unknown')
  }

  return {
    primaryBlockerReasonCode,
    secondaryBlockerReasonCodes,
    releaseEligibleByPolicy: input.releaseEligibleByPolicy,
    stateSummary: input.stateSummary,
    unknownState: input.unknownState,
  }
}
