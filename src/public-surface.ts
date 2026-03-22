import {
  BOOTSTRAP_FALLBACK_MARKER,
  PREFERRED_RUNTIME_MARKERS,
  assertSurfaceMarkerContractsValid,
  resolveActiveMarkerAliases,
  type SurfaceMarkerAlias,
  type SurfaceMarkerContract,
  type SurfaceMarkerDomain,
  type SurfaceMarkerMatchMode,
} from './public-surface-marker-contract'
import { isClassFirstFailureSummary } from './surface-summary-format'

export const DEFAULT_PUBLIC_BASE_URL = 'https://aens-nine.vercel.app/'
export const WRITE_RECORDS_PATH = 'write-records/'
export const DEFAULT_WRITE_RECORDS_URL = new URL(WRITE_RECORDS_PATH, DEFAULT_PUBLIC_BASE_URL).toString()
export const GITHUB_BLOB_STUB_URL = 'https://github.com/pvtclawn/aens/blob/main/docs/public/write-records-stub.md'

export type SurfaceMarkerMatchType = 'canonical' | 'alias' | 'none'
export type SurfaceFailureClass =
  | 'mode-invalid'
  | 'collision-blocked'
  | 'alias-expired'
  | 'marker-missing'
  | 'http-failure'

export interface SurfaceCheckResult {
  label: string
  url: string
  status: number
  expectedMarker: string
  expectedMarkerAliases?: SurfaceMarkerAlias[]
  markerDomain?: SurfaceMarkerDomain
  markerMatchType?: SurfaceMarkerMatchType
  matchedMarker?: string
  matchMode?: SurfaceMarkerMatchMode | string
  contractIssueCode?: 'match-mode-invalid' | 'cross-domain-normalized-overlap'
  failureClass?: SurfaceFailureClass
  body: string
}

export interface SurfaceCheckTarget {
  label: string
  url: string
  expectedMarker: string
  expectedMarkerAliases?: SurfaceMarkerAlias[]
  markerDomain?: SurfaceMarkerDomain
  matchMode: SurfaceMarkerMatchMode
}

function isSurfaceMarkerMatchMode(value: string | undefined): value is SurfaceMarkerMatchMode {
  return value === 'exact' || value === 'token-boundary' || value === 'contains'
}

const SURFACE_FAILURE_CLASS_PRECEDENCE: readonly SurfaceFailureClass[] = [
  'mode-invalid',
  'collision-blocked',
  'alias-expired',
  'marker-missing',
  'http-failure',
] as const

export const SURFACE_FAILURE_CLASS_SUMMARY_CUES = Object.freeze({
  'mode-invalid': 'invalid marker match mode',
  'collision-blocked': 'marker collision blocked',
  'alias-expired': 'alias expired (canonical marker required)',
  'marker-missing': 'reachable but missing expected marker',
  'http-failure': 'http failure',
} as const satisfies Record<SurfaceFailureClass, string>)

function selectHighestFailureClass(candidates: SurfaceFailureClass[]): SurfaceFailureClass | undefined {
  for (const failureClass of SURFACE_FAILURE_CLASS_PRECEDENCE) {
    if (candidates.includes(failureClass)) {
      return failureClass
    }
  }

  return undefined
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function markerMatchesBody(input: {
  body: string
  marker: string
  matchMode: SurfaceMarkerMatchMode
}): boolean {
  switch (input.matchMode) {
    case 'exact':
      return input.body.includes(input.marker)
    case 'contains':
      return input.body.includes(input.marker)
    case 'token-boundary': {
      const escaped = escapeRegex(input.marker)
      const pattern = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}(?:$|[^\\p{L}\\p{N}])`, 'u')
      return pattern.test(input.body)
    }
  }
}

function targetFromMarkerContract(input: {
  label: string
  url: string
  markerContract: SurfaceMarkerContract
}): SurfaceCheckTarget {
  return {
    label: input.label,
    url: input.url,
    expectedMarker: input.markerContract.canonical,
    expectedMarkerAliases: input.markerContract.aliases,
    markerDomain: input.markerContract.domain,
    matchMode: input.markerContract.matchMode,
  }
}

export function normalizePublicBaseUrl(value: string): string {
  const trimmed = value.trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return withProtocol.endsWith('/') ? withProtocol : `${withProtocol}/`
}

export function resolvePreferredPublicBaseUrl(input: {
  envValue?: string
  deployedHost?: string
  defaultBaseUrl?: string
} = {}): string {
  if (input.envValue?.trim()) {
    return normalizePublicBaseUrl(input.envValue)
  }

  if (input.deployedHost?.trim()) {
    return normalizePublicBaseUrl(input.deployedHost)
  }

  return normalizePublicBaseUrl(input.defaultBaseUrl ?? DEFAULT_PUBLIC_BASE_URL)
}

export function buildPreferredSurfaceTargets(baseUrl: string): SurfaceCheckTarget[] {
  assertSurfaceMarkerContractsValid()

  const normalizedBaseUrl = normalizePublicBaseUrl(baseUrl)

  return [
    targetFromMarkerContract({
      label: 'public root',
      url: normalizedBaseUrl,
      markerContract: PREFERRED_RUNTIME_MARKERS.publicRoot,
    }),
    targetFromMarkerContract({
      label: 'write records page',
      url: new URL(WRITE_RECORDS_PATH, normalizedBaseUrl).toString(),
      markerContract: PREFERRED_RUNTIME_MARKERS.writeRecords,
    }),
  ]
}

export function buildFallbackSurfaceTarget(): SurfaceCheckTarget {
  assertSurfaceMarkerContractsValid()

  return targetFromMarkerContract({
    label: 'github blob fallback',
    url: GITHUB_BLOB_STUB_URL,
    markerContract: BOOTSTRAP_FALLBACK_MARKER,
  })
}

export function resolveSurfaceMarkerMatch(input: {
  body: string
  expectedMarker: string
  expectedMarkerAliases?: SurfaceMarkerAlias[]
  matchMode?: SurfaceMarkerMatchMode | string
  nowIso?: string
}): {
  markerMatchType: SurfaceMarkerMatchType
  matchedMarker?: string
  activeAliases: SurfaceMarkerAlias[]
} {
  const activeAliases = resolveActiveMarkerAliases({
    aliases: input.expectedMarkerAliases ?? [],
    nowIso: input.nowIso,
  })

  if (!isSurfaceMarkerMatchMode(input.matchMode)) {
    return {
      markerMatchType: 'none',
      matchedMarker: undefined,
      activeAliases,
    }
  }

  if (markerMatchesBody({ body: input.body, marker: input.expectedMarker, matchMode: input.matchMode })) {
    return {
      markerMatchType: 'canonical',
      matchedMarker: input.expectedMarker,
      activeAliases,
    }
  }

  for (const alias of activeAliases) {
    if (markerMatchesBody({ body: input.body, marker: alias.marker, matchMode: input.matchMode })) {
      return {
        markerMatchType: 'alias',
        matchedMarker: alias.marker,
        activeAliases,
      }
    }
  }

  return {
    markerMatchType: 'none',
    matchedMarker: undefined,
    activeAliases,
  }
}

export function resolveSurfaceFailureClass(result: SurfaceCheckResult): SurfaceFailureClass | undefined {
  const candidates: SurfaceFailureClass[] = []

  if (result.failureClass) {
    candidates.push(result.failureClass)
  }

  if (result.status !== 200) {
    candidates.push('http-failure')
  }

  if (result.contractIssueCode === 'match-mode-invalid') {
    candidates.push('mode-invalid')
  }

  if (result.contractIssueCode === 'cross-domain-normalized-overlap') {
    candidates.push('collision-blocked')
  }

  if (result.status === 200 && !isSurfaceMarkerMatchMode(result.matchMode)) {
    candidates.push('mode-invalid')
  }

  if (result.status === 200 && result.markerMatchType === 'none') {
    candidates.push('marker-missing')
  }

  return selectHighestFailureClass(candidates)
}

export function surfaceCheckPassed(result: SurfaceCheckResult): boolean {
  const failureClass = resolveSurfaceFailureClass(result)
  if (failureClass) {
    return false
  }

  if (result.status !== 200) {
    return false
  }

  if (result.markerMatchType) {
    return result.markerMatchType !== 'none'
  }

  if (!isSurfaceMarkerMatchMode(result.matchMode)) {
    return false
  }

  return markerMatchesBody({
    body: result.body,
    marker: result.expectedMarker,
    matchMode: result.matchMode,
  })
}

export function summarizeSurfaceFailure(result: SurfaceCheckResult, failureClass: SurfaceFailureClass): string {
  const cue = SURFACE_FAILURE_CLASS_SUMMARY_CUES[failureClass]
  const summary = `${result.label}: ${failureClass} (${cue}) (${result.url})`

  if (!isClassFirstFailureSummary(summary)) {
    throw new Error(`surface-failure-summary-format-invalid: ${summary}`)
  }

  return summary
}

export function summarizeSurfaceCheck(result: SurfaceCheckResult): string {
  if (surfaceCheckPassed(result)) {
    if (result.markerMatchType === 'alias') {
      return `${result.label}: ok (matched alias marker) (${result.url})`
    }

    return `${result.label}: ok (${result.url})`
  }

  const failureClass = resolveSurfaceFailureClass(result)
  if (failureClass) {
    return summarizeSurfaceFailure(result, failureClass)
  }

  if (result.status === 200) {
    return summarizeSurfaceFailure(result, 'marker-missing')
  }

  return summarizeSurfaceFailure(result, 'http-failure')
}

export function preferredSurfaceReady(results: SurfaceCheckResult[]): boolean {
  return results.every(surfaceCheckPassed)
}
