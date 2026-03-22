import {
  BOOTSTRAP_FALLBACK_MARKER,
  PREFERRED_RUNTIME_MARKERS,
  resolveActiveMarkerAliases,
  type SurfaceMarkerAlias,
  type SurfaceMarkerContract,
  type SurfaceMarkerDomain,
} from './public-surface-marker-contract'

export const DEFAULT_PUBLIC_BASE_URL = 'https://aens-nine.vercel.app/'
export const RESEARCH_CAPABILITY_PATH = 'research-capability/'
export const DISCOVER_RESEARCH_PATH = 'discover-research/'
export const DEFAULT_RESEARCH_CAPABILITY_URL = new URL(RESEARCH_CAPABILITY_PATH, DEFAULT_PUBLIC_BASE_URL).toString()
export const DEFAULT_DISCOVER_RESEARCH_URL = new URL(DISCOVER_RESEARCH_PATH, DEFAULT_PUBLIC_BASE_URL).toString()
export const GITHUB_BLOB_STUB_URL = 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md'

export type SurfaceMarkerMatchType = 'canonical' | 'alias' | 'none'

export interface SurfaceCheckResult {
  label: string
  url: string
  status: number
  expectedMarker: string
  expectedMarkerAliases?: SurfaceMarkerAlias[]
  markerDomain?: SurfaceMarkerDomain
  markerMatchType?: SurfaceMarkerMatchType
  matchedMarker?: string
  body: string
}

export interface SurfaceCheckTarget {
  label: string
  url: string
  expectedMarker: string
  expectedMarkerAliases?: SurfaceMarkerAlias[]
  markerDomain?: SurfaceMarkerDomain
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
  const normalizedBaseUrl = normalizePublicBaseUrl(baseUrl)

  return [
    targetFromMarkerContract({
      label: 'public root',
      url: normalizedBaseUrl,
      markerContract: PREFERRED_RUNTIME_MARKERS.publicRoot,
    }),
    targetFromMarkerContract({
      label: 'research capability page',
      url: new URL(RESEARCH_CAPABILITY_PATH, normalizedBaseUrl).toString(),
      markerContract: PREFERRED_RUNTIME_MARKERS.researchCapability,
    }),
    targetFromMarkerContract({
      label: 'discover research page',
      url: new URL(DISCOVER_RESEARCH_PATH, normalizedBaseUrl).toString(),
      markerContract: PREFERRED_RUNTIME_MARKERS.discoverResearch,
    }),
  ]
}

export function buildFallbackSurfaceTarget(): SurfaceCheckTarget {
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
  nowIso?: string
}): {
  markerMatchType: SurfaceMarkerMatchType
  matchedMarker?: string
  activeAliases: SurfaceMarkerAlias[]
} {
  if (input.body.includes(input.expectedMarker)) {
    return {
      markerMatchType: 'canonical',
      matchedMarker: input.expectedMarker,
      activeAliases: resolveActiveMarkerAliases({
        aliases: input.expectedMarkerAliases ?? [],
        nowIso: input.nowIso,
      }),
    }
  }

  const activeAliases = resolveActiveMarkerAliases({
    aliases: input.expectedMarkerAliases ?? [],
    nowIso: input.nowIso,
  })

  for (const alias of activeAliases) {
    if (input.body.includes(alias.marker)) {
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

export function surfaceCheckPassed(result: SurfaceCheckResult): boolean {
  if (result.status !== 200) {
    return false
  }

  if (result.markerMatchType) {
    return result.markerMatchType !== 'none'
  }

  return result.body.includes(result.expectedMarker)
}

export function summarizeSurfaceCheck(result: SurfaceCheckResult): string {
  if (surfaceCheckPassed(result)) {
    if (result.markerMatchType === 'alias') {
      return `${result.label}: ok (matched alias marker) (${result.url})`
    }

    return `${result.label}: ok (${result.url})`
  }

  if (result.status === 200) {
    return `${result.label}: reachable but missing expected marker (${result.url})`
  }

  return `${result.label}: http ${result.status} (${result.url})`
}

export function preferredSurfaceReady(results: SurfaceCheckResult[]): boolean {
  return results.every(surfaceCheckPassed)
}
