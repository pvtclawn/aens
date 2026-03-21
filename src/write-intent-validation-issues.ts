export type WriteIntentValidationPhase =
  | 'structure'
  | 'payload'
  | 'envelope'
  | 'canonicalization'
  | 'hash'

export type WriteIntentValidationSeverity = 'error' | 'warning'

export interface WriteIntentValidationIssue {
  reasonCode: string
  path: string
  severity: WriteIntentValidationSeverity
  phase: WriteIntentValidationPhase
  hint: string
}

export interface PrioritizeValidationIssuesOptions {
  limit?: number
}

export interface PrioritizedValidationIssues {
  allIssues: WriteIntentValidationIssue[]
  primaryIssues: WriteIntentValidationIssue[]
  remainingIssueCount: number
}

const PHASE_ORDER: Record<WriteIntentValidationPhase, number> = {
  structure: 0,
  payload: 1,
  envelope: 2,
  canonicalization: 3,
  hash: 4,
}

const SEVERITY_ORDER: Record<WriteIntentValidationSeverity, number> = {
  error: 0,
  warning: 1,
}

function compareIssues(
  left: WriteIntentValidationIssue,
  right: WriteIntentValidationIssue,
): number {
  return PHASE_ORDER[left.phase] - PHASE_ORDER[right.phase]
    || SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity]
    || left.path.localeCompare(right.path)
    || left.reasonCode.localeCompare(right.reasonCode)
    || left.hint.localeCompare(right.hint)
}

function normalizeLimit(value: number | undefined): number {
  if (value === undefined) return Number.POSITIVE_INFINITY
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.floor(value)
}

export function prioritizeValidationIssues(
  issues: WriteIntentValidationIssue[],
  options: PrioritizeValidationIssuesOptions = {},
): PrioritizedValidationIssues {
  const allIssues = [...issues].sort(compareIssues)
  const limit = normalizeLimit(options.limit)
  const primaryIssues = allIssues.slice(0, limit)

  return {
    allIssues,
    primaryIssues,
    remainingIssueCount: Math.max(0, allIssues.length - primaryIssues.length),
  }
}
