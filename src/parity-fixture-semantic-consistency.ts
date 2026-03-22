import {
  type PolicyBlockerMapperOutput,
  type PolicyStateSummary,
} from './policy-blocker-mapper-output'
import { type PolicyBlockerReasonCode } from './policy-blocker-reason-codes'

export type ParityFixtureSemanticIssueReasonCode =
  | 'fixture-semantic-release-blocker-mismatch'
  | 'fixture-semantic-primary-reason-mismatch'
  | 'fixture-semantic-unknown-state-diagnostics-missing'
  | 'fixture-semantic-unknown-state-diagnostics-unexpected'
  | 'fixture-semantic-placeholder-value'

export interface ParityFixtureSemanticIssue {
  reasonCode: ParityFixtureSemanticIssueReasonCode
  path: string
  hint: string
}

export interface ValidateParityFixtureSemanticConsistencyInput {
  fixtureId: string
  inputState: PolicyStateSummary
  expectedMachinePayload: PolicyBlockerMapperOutput
}

const PLACEHOLDER_PATTERNS = [
  '__TODO__',
  '__REPLACE__',
  'PLACEHOLDER',
  'REPLACE_ME',
]

function hasPlaceholder(value: string): boolean {
  const upper = value.toUpperCase()
  return PLACEHOLDER_PATTERNS.some((pattern) => upper.includes(pattern))
}

function expectedPrimaryReasonFromState(
  state: PolicyStateSummary,
): PolicyBlockerReasonCode | null {
  if (state.validatorVersionState === 'policy-invalid' || state.schemaVersionState === 'policy-invalid') {
    return 'artifact-policy-grace-entry-invalid'
  }

  if (state.validatorVersionState === 'grace-expired') {
    return 'artifact-validator-version-grace-expired'
  }

  if (state.schemaVersionState === 'grace-expired') {
    return 'artifact-schema-version-grace-expired'
  }

  if (state.validatorVersionState === 'unsupported') {
    return 'artifact-validator-version-unsupported'
  }

  if (state.schemaVersionState === 'unsupported') {
    return 'artifact-schema-version-unsupported'
  }

  if (state.validatorVersionState === 'grace-active') {
    return 'artifact-validator-version-grace-active-nonrelease'
  }

  if (state.schemaVersionState === 'grace-active') {
    return 'artifact-schema-version-grace-active-nonrelease'
  }

  return null
}

function collectPlaceholderIssues(
  value: unknown,
  path: string,
  issues: ParityFixtureSemanticIssue[],
): void {
  if (typeof value === 'string') {
    if (hasPlaceholder(value)) {
      issues.push({
        reasonCode: 'fixture-semantic-placeholder-value',
        path,
        hint: 'Replace template placeholder text with concrete deterministic fixture values.',
      })
    }

    return
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      collectPlaceholderIssues(entry, `${path}[${index}]`, issues)
    })
    return
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    Object.keys(record).sort((left, right) => left.localeCompare(right)).forEach((key) => {
      collectPlaceholderIssues(record[key], `${path}.${key}`, issues)
    })
  }
}

export function validateParityFixtureSemanticConsistency(
  input: ValidateParityFixtureSemanticConsistencyInput,
): ParityFixtureSemanticIssue[] {
  const issues: ParityFixtureSemanticIssue[] = []

  collectPlaceholderIssues(input.fixtureId, '$.fixtureId', issues)
  collectPlaceholderIssues(input.inputState, '$.inputState', issues)
  collectPlaceholderIssues(input.expectedMachinePayload, '$.expectedMachinePayload', issues)

  const expectedPrimaryReason = expectedPrimaryReasonFromState(input.inputState)
  if (input.expectedMachinePayload.primaryBlockerReasonCode !== expectedPrimaryReason) {
    issues.push({
      reasonCode: 'fixture-semantic-primary-reason-mismatch',
      path: '$.expectedMachinePayload.primaryBlockerReasonCode',
      hint: `Expected primary blocker ${String(expectedPrimaryReason)} for input state summary.`,
    })
  }

  const shouldBeReleaseEligible = expectedPrimaryReason === null
  if (input.expectedMachinePayload.releaseEligibleByPolicy !== shouldBeReleaseEligible) {
    issues.push({
      reasonCode: 'fixture-semantic-release-blocker-mismatch',
      path: '$.expectedMachinePayload.releaseEligibleByPolicy',
      hint: `releaseEligibleByPolicy must be ${String(shouldBeReleaseEligible)} for this input state.`,
    })
  }

  const requiresUnknownDiagnostics =
    input.expectedMachinePayload.primaryBlockerReasonCode === 'artifact-policy-state-unknown'

  if (requiresUnknownDiagnostics) {
    const unknown = input.expectedMachinePayload.unknownState
    const hasUnknownDiagnostics = Boolean(
      unknown
      && unknown.offendingAxis.trim().length > 0
      && unknown.offendingState.trim().length > 0
      && unknown.mapperVersion.trim().length > 0
      && unknown.remediationHint.trim().length > 0,
    )

    if (!hasUnknownDiagnostics) {
      issues.push({
        reasonCode: 'fixture-semantic-unknown-state-diagnostics-missing',
        path: '$.expectedMachinePayload.unknownState',
        hint: 'Unknown-state primary blocker requires full unknownState diagnostics fields.',
      })
    }
  } else if (input.expectedMachinePayload.unknownState) {
    issues.push({
      reasonCode: 'fixture-semantic-unknown-state-diagnostics-unexpected',
      path: '$.expectedMachinePayload.unknownState',
      hint: 'unknownState diagnostics are only allowed when primary blocker is artifact-policy-state-unknown.',
    })
  }

  return issues
}
