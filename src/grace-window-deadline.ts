export type GraceDeadlineUrgencyTier = 'advisory' | 'elevated' | 'high' | 'expired'

export interface FormatGraceWindowDeadlineInput {
  evaluatedAt: string
  expiresAt: string
}

export interface GraceWindowDeadlineView {
  evaluatedAtUtc: string
  expiresAtUtc: string
  graceRemainingSeconds: number
  relativeLabel: string
  urgencyTier: GraceDeadlineUrgencyTier
}

function parseTimestamp(input: { value: string, path: string }): Date {
  const date = new Date(input.value)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${input.path} must be a valid timestamp`)
  }

  return date
}

function formatCompactDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`
  return `${remainingSeconds}s`
}

export function formatGraceWindowDeadline(
  input: FormatGraceWindowDeadlineInput,
): GraceWindowDeadlineView {
  const evaluatedAt = parseTimestamp({
    value: input.evaluatedAt,
    path: 'evaluatedAt',
  })
  const expiresAt = parseTimestamp({
    value: input.expiresAt,
    path: 'expiresAt',
  })

  const graceRemainingSeconds = Math.floor((expiresAt.getTime() - evaluatedAt.getTime()) / 1000)

  const urgencyTier: GraceDeadlineUrgencyTier = graceRemainingSeconds <= 0
    ? 'expired'
    : graceRemainingSeconds < 24 * 60 * 60
      ? 'high'
      : graceRemainingSeconds < 72 * 60 * 60
        ? 'elevated'
        : 'advisory'

  const relativeLabel = graceRemainingSeconds <= 0
    ? `expired ${formatCompactDuration(Math.abs(graceRemainingSeconds))} ago`
    : `in ${formatCompactDuration(graceRemainingSeconds)}`

  return {
    evaluatedAtUtc: evaluatedAt.toISOString(),
    expiresAtUtc: expiresAt.toISOString(),
    graceRemainingSeconds,
    relativeLabel,
    urgencyTier,
  }
}
