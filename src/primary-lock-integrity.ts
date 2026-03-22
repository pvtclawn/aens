export const PRIMARY_SOURCE_VALUES = ['ownership-contract', 'stage-gate', 'none'] as const
export type PrimarySource = (typeof PRIMARY_SOURCE_VALUES)[number]

export const PRIMARY_SELECTION_REASON_VALUES = [
  'ownership-unmapped',
  'ownership-mismatch',
  'earliest-failing-stage',
  'no-failure',
] as const
export type PrimarySelectionReason = (typeof PRIMARY_SELECTION_REASON_VALUES)[number]

export interface PrimaryLockState {
  primarySource: PrimarySource
  primaryLocked: boolean
  primarySelectionReason: PrimarySelectionReason
}

export interface PrimaryLockIntegrityIssue {
  fieldPath: '$.primarySource' | '$.primaryLocked' | '$.primarySelectionReason'
  message: string
}

export interface PrimaryLockStateValid {
  ok: true
  state: PrimaryLockState
}

export interface PrimaryLockStateInvalid {
  ok: false
  reasonCode: 'primary-lock-integrity-violation'
  issues: PrimaryLockIntegrityIssue[]
}

export type PrimaryLockStateValidationResult = PrimaryLockStateValid | PrimaryLockStateInvalid

interface ValidatePrimaryLockStateInput {
  primarySource: string
  primaryLocked: boolean
  primarySelectionReason: string
}

function isPrimarySource(value: string): value is PrimarySource {
  return (PRIMARY_SOURCE_VALUES as readonly string[]).includes(value)
}

function isPrimarySelectionReason(value: string): value is PrimarySelectionReason {
  return (PRIMARY_SELECTION_REASON_VALUES as readonly string[]).includes(value)
}

function expectedSelectionReasonsForSource(primarySource: PrimarySource): readonly PrimarySelectionReason[] {
  switch (primarySource) {
    case 'ownership-contract':
      return ['ownership-unmapped', 'ownership-mismatch']
    case 'stage-gate':
      return ['earliest-failing-stage']
    case 'none':
      return ['no-failure']
  }
}

export function validatePrimaryLockState(
  input: ValidatePrimaryLockStateInput,
): PrimaryLockStateValidationResult {
  const issues: PrimaryLockIntegrityIssue[] = []

  if (!isPrimarySource(input.primarySource)) {
    issues.push({
      fieldPath: '$.primarySource',
      message: `unknown primary source: ${input.primarySource}`,
    })
  }

  if (!isPrimarySelectionReason(input.primarySelectionReason)) {
    issues.push({
      fieldPath: '$.primarySelectionReason',
      message: `unknown primary selection reason: ${input.primarySelectionReason}`,
    })
  }

  if (issues.length > 0) {
    return {
      ok: false,
      reasonCode: 'primary-lock-integrity-violation',
      issues,
    }
  }

  const source = input.primarySource as PrimarySource
  const selectionReason = input.primarySelectionReason as PrimarySelectionReason

  if (source === 'none' && input.primaryLocked) {
    issues.push({
      fieldPath: '$.primaryLocked',
      message: 'primarySource=none requires primaryLocked=false',
    })
  }

  if (source !== 'none' && !input.primaryLocked) {
    issues.push({
      fieldPath: '$.primaryLocked',
      message: `primarySource=${source} requires primaryLocked=true`,
    })
  }

  const allowedReasons = expectedSelectionReasonsForSource(source)
  if (!allowedReasons.includes(selectionReason)) {
    issues.push({
      fieldPath: '$.primarySelectionReason',
      message: `primarySource=${source} is incompatible with primarySelectionReason=${selectionReason}`,
    })
  }

  if (issues.length > 0) {
    return {
      ok: false,
      reasonCode: 'primary-lock-integrity-violation',
      issues,
    }
  }

  return {
    ok: true,
    state: {
      primarySource: source,
      primaryLocked: input.primaryLocked,
      primarySelectionReason: selectionReason,
    },
  }
}
