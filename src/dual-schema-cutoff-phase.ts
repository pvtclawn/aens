export type DualSchemaCutoffPhase = 'prepare' | 'warning' | 'hard-cutoff'

export interface DualSchemaCutoffPolicy {
  cutoffPolicyVersion: string
  currentSchemaVersion: string
  warningFrom: string
  cutoffAt: string
}

export interface EvaluateDualSchemaCutoffPhaseInput {
  evaluatedAt: string
  policy: DualSchemaCutoffPolicy
}

export interface DualSchemaCutoffPhaseEvaluation {
  ok: true
  phase: DualSchemaCutoffPhase
  evaluatedAtUtc: string
  warningFromUtc: string
  cutoffAtUtc: string
  cutoffPolicyVersion: string
  currentSchemaVersion: string
}

export interface DualSchemaCutoffPhaseEvaluationError {
  ok: false
  reasonCode: 'fixture-schema-cutoff-policy-invalid'
  path: string
  message: string
}

export type EvaluateDualSchemaCutoffPhaseResult =
  | DualSchemaCutoffPhaseEvaluation
  | DualSchemaCutoffPhaseEvaluationError

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function parseUtcTimestamp(value: string): Date | null {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function policyError(path: string, message: string): DualSchemaCutoffPhaseEvaluationError {
  return {
    ok: false,
    reasonCode: 'fixture-schema-cutoff-policy-invalid',
    path,
    message,
  }
}

export function evaluateDualSchemaCutoffPhase(
  input: EvaluateDualSchemaCutoffPhaseInput,
): EvaluateDualSchemaCutoffPhaseResult {
  if (!nonEmptyString(input.evaluatedAt)) {
    return policyError('evaluatedAt', 'evaluatedAt must be a non-empty UTC timestamp')
  }

  const evaluatedAt = parseUtcTimestamp(input.evaluatedAt)
  if (!evaluatedAt) {
    return policyError('evaluatedAt', 'evaluatedAt must be a valid UTC timestamp')
  }

  if (!nonEmptyString(input.policy.cutoffPolicyVersion)) {
    return policyError('policy.cutoffPolicyVersion', 'cutoffPolicyVersion must be a non-empty string')
  }

  if (!nonEmptyString(input.policy.currentSchemaVersion)) {
    return policyError('policy.currentSchemaVersion', 'currentSchemaVersion must be a non-empty string')
  }

  if (!nonEmptyString(input.policy.warningFrom)) {
    return policyError('policy.warningFrom', 'warningFrom must be a non-empty UTC timestamp')
  }

  if (!nonEmptyString(input.policy.cutoffAt)) {
    return policyError('policy.cutoffAt', 'cutoffAt must be a non-empty UTC timestamp')
  }

  const warningFrom = parseUtcTimestamp(input.policy.warningFrom)
  if (!warningFrom) {
    return policyError('policy.warningFrom', 'warningFrom must be a valid UTC timestamp')
  }

  const cutoffAt = parseUtcTimestamp(input.policy.cutoffAt)
  if (!cutoffAt) {
    return policyError('policy.cutoffAt', 'cutoffAt must be a valid UTC timestamp')
  }

  if (warningFrom.getTime() >= cutoffAt.getTime()) {
    return policyError(
      'policy.cutoffAt',
      'cutoffAt must be later than warningFrom for deterministic phase classification',
    )
  }

  const phase: DualSchemaCutoffPhase = evaluatedAt.getTime() >= cutoffAt.getTime()
    ? 'hard-cutoff'
    : evaluatedAt.getTime() >= warningFrom.getTime()
      ? 'warning'
      : 'prepare'

  return {
    ok: true,
    phase,
    evaluatedAtUtc: evaluatedAt.toISOString(),
    warningFromUtc: warningFrom.toISOString(),
    cutoffAtUtc: cutoffAt.toISOString(),
    cutoffPolicyVersion: input.policy.cutoffPolicyVersion.trim(),
    currentSchemaVersion: input.policy.currentSchemaVersion.trim(),
  }
}
