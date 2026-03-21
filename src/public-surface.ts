export const DEFAULT_PUBLIC_BASE_URL = 'https://aens-nine.vercel.app/'
export const RESEARCH_CAPABILITY_PATH = 'research-capability/'
export const DISCOVER_RESEARCH_PATH = 'discover-research/'
export const DEFAULT_RESEARCH_CAPABILITY_URL = new URL(RESEARCH_CAPABILITY_PATH, DEFAULT_PUBLIC_BASE_URL).toString()
export const DEFAULT_DISCOVER_RESEARCH_URL = new URL(DISCOVER_RESEARCH_PATH, DEFAULT_PUBLIC_BASE_URL).toString()
export const GITHUB_BLOB_STUB_URL = 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md'

export interface SurfaceCheckResult {
  label: string
  url: string
  status: number
  expectedMarker: string
  body: string
}

export interface SurfaceCheckTarget {
  label: string
  url: string
  expectedMarker: string
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
    {
      label: 'public root',
      url: normalizedBaseUrl,
      expectedMarker: 'ÆNS — PrivateClawn landing',
    },
    {
      label: 'research capability page',
      url: new URL(RESEARCH_CAPABILITY_PATH, normalizedBaseUrl).toString(),
      expectedMarker: 'PrivateClawn Research Capability',
    },
    {
      label: 'discover research page',
      url: new URL(DISCOVER_RESEARCH_PATH, normalizedBaseUrl).toString(),
      expectedMarker: 'Discover the official research capability for an ENS identity',
    },
  ]
}

export function surfaceCheckPassed(result: SurfaceCheckResult): boolean {
  return result.status === 200 && result.body.includes(result.expectedMarker)
}

export function summarizeSurfaceCheck(result: SurfaceCheckResult): string {
  if (surfaceCheckPassed(result)) {
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
