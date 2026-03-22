import { canonicalJsonStringify } from './write-intent-hash'

export interface MachinePayloadMismatch {
  fieldPath: string
  expectedValueSnippet: string
  observedValueSnippet: string
}

export interface CompareCanonicalMachinePayloadsInput {
  expected: unknown
  observed: unknown
}

export interface CompareCanonicalMachinePayloadsResult {
  equal: boolean
  canonicalExpected: string
  canonicalObserved: string
  mismatches: MachinePayloadMismatch[]
}

export interface FormatMachinePayloadMismatchSummaryOptions {
  limit?: number
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function normalizeMachinePayloadValue(value: unknown): unknown {
  if (value === undefined) {
    return undefined
  }

  if (Array.isArray(value)) {
    return Array.from({ length: value.length }, (_, index) => {
      const normalized = normalizeMachinePayloadValue(value[index])
      return normalized === undefined ? null : normalized
    })
  }

  if (isObject(value)) {
    const normalizedEntries: Array<[string, unknown]> = []

    for (const key of Object.keys(value).sort((left, right) => left.localeCompare(right))) {
      const normalized = normalizeMachinePayloadValue(value[key])
      if (normalized !== undefined) {
        normalizedEntries.push([key, normalized])
      }
    }

    return Object.fromEntries(normalizedEntries)
  }

  return value
}

function toSnippet(value: unknown): string {
  return canonicalJsonStringify(value)
}

function diffMachinePayload(
  expected: unknown,
  observed: unknown,
  fieldPath: string,
  mismatches: MachinePayloadMismatch[],
): void {
  if (Array.isArray(expected) && Array.isArray(observed)) {
    if (expected.length !== observed.length) {
      mismatches.push({
        fieldPath,
        expectedValueSnippet: toSnippet(expected),
        observedValueSnippet: toSnippet(observed),
      })
      return
    }

    for (let index = 0; index < expected.length; index += 1) {
      diffMachinePayload(expected[index], observed[index], `${fieldPath}[${index}]`, mismatches)
    }

    return
  }

  if (isObject(expected) && isObject(observed)) {
    const keys = [...new Set([...Object.keys(expected), ...Object.keys(observed)])]
      .sort((left, right) => left.localeCompare(right))

    for (const key of keys) {
      if (!(key in expected) || !(key in observed)) {
        mismatches.push({
          fieldPath: `${fieldPath}.${key}`,
          expectedValueSnippet: toSnippet(expected[key]),
          observedValueSnippet: toSnippet(observed[key]),
        })
        continue
      }

      diffMachinePayload(expected[key], observed[key], `${fieldPath}.${key}`, mismatches)
    }

    return
  }

  if (!Object.is(expected, observed)) {
    mismatches.push({
      fieldPath,
      expectedValueSnippet: toSnippet(expected),
      observedValueSnippet: toSnippet(observed),
    })
  }
}

function normalizeLimit(value: number | undefined): number {
  if (value === undefined) return 3
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.floor(value)
}

export function compareCanonicalMachinePayloads(
  input: CompareCanonicalMachinePayloadsInput,
): CompareCanonicalMachinePayloadsResult {
  const normalizedExpected = normalizeMachinePayloadValue(input.expected)
  const normalizedObserved = normalizeMachinePayloadValue(input.observed)

  const mismatches: MachinePayloadMismatch[] = []
  diffMachinePayload(normalizedExpected, normalizedObserved, '$', mismatches)

  const canonicalExpected = canonicalJsonStringify(normalizedExpected)
  const canonicalObserved = canonicalJsonStringify(normalizedObserved)

  return {
    equal: mismatches.length === 0,
    canonicalExpected,
    canonicalObserved,
    mismatches,
  }
}

export function formatMachinePayloadMismatchSummary(
  result: CompareCanonicalMachinePayloadsResult,
  options: FormatMachinePayloadMismatchSummaryOptions = {},
): string[] {
  const limit = normalizeLimit(options.limit)
  const shown = result.mismatches.slice(0, limit)
  const lines = shown.map((mismatch) => {
    return `${mismatch.fieldPath}: expected ${mismatch.expectedValueSnippet} observed ${mismatch.observedValueSnippet}`
  })

  const remaining = Math.max(0, result.mismatches.length - shown.length)
  if (remaining > 0) {
    lines.push(`... ${remaining} more mismatch(es)`) 
  }

  return lines
}
