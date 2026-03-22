export interface ParsedSurfaceFailureSummary {
  surfaceLabel: string
  failureClass: string
  cue: string
  url: string
}

function splitOnLastDelimiter(value: string, delimiter: string): [string, string] | null {
  const index = value.lastIndexOf(delimiter)
  if (index <= 0) {
    return null
  }

  return [value.slice(0, index), value.slice(index + delimiter.length)]
}

export function parseSurfaceFailureSummary(summary: string): ParsedSurfaceFailureSummary | null {
  const urlSplit = splitOnLastDelimiter(summary.trim(), ' (http')
  if (!urlSplit) {
    return null
  }

  const [prefix, urlTail] = urlSplit
  const urlCandidate = `http${urlTail}`.replace(/\)$/, '')

  const classSplit = prefix.match(/^(.+):\s+([a-z-]+)\s+\((.+)\)$/)
  if (!classSplit) {
    return null
  }

  const [, surfaceLabel, failureClass, cue] = classSplit
  return {
    surfaceLabel,
    failureClass,
    cue,
    url: urlCandidate,
  }
}

export function isClassFirstFailureSummary(summary: string): boolean {
  return parseSurfaceFailureSummary(summary) !== null
}
