import {
  GITHUB_BLOB_STUB_URL,
  buildPreferredSurfaceTargets,
  normalizePublicBaseUrl,
  preferredSurfaceReady as hasPreferredSurfaceReady,
  summarizeSurfaceCheck,
  surfaceCheckPassed,
  type SurfaceCheckResult,
} from './public-surface'

export interface PublicProofState {
  preferredBaseUrl: string
  preferredResults: SurfaceCheckResult[]
  fallbackResult: SurfaceCheckResult
  preferredResearchUrl: string
  preferredSurfaceReady: boolean
  bootstrapProofReady: boolean
}

export async function checkSurface(input: {
  label: string
  url: string
  expectedMarker: string
}): Promise<SurfaceCheckResult> {
  try {
    const response = await fetch(input.url)
    const body = await response.text()

    return {
      label: input.label,
      url: input.url,
      status: response.status,
      expectedMarker: input.expectedMarker,
      body,
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    return {
      label: input.label,
      url: input.url,
      status: 0,
      expectedMarker: input.expectedMarker,
      body: detail,
    }
  }
}

export function buildPublicProofState(input: {
  preferredBaseUrl: string
  preferredResults: SurfaceCheckResult[]
  fallbackResult: SurfaceCheckResult
}): PublicProofState {
  const preferredBaseUrl = normalizePublicBaseUrl(input.preferredBaseUrl)
  const preferredTargets = buildPreferredSurfaceTargets(preferredBaseUrl)
  const preferredResearchUrl = preferredTargets[1]?.url ?? preferredBaseUrl
  const preferredSurfaceReady = hasPreferredSurfaceReady(input.preferredResults)
  const bootstrapProofReady = !preferredSurfaceReady && surfaceCheckPassed(input.fallbackResult)

  return {
    preferredBaseUrl,
    preferredResults: input.preferredResults,
    fallbackResult: input.fallbackResult,
    preferredResearchUrl,
    preferredSurfaceReady,
    bootstrapProofReady,
  }
}

export async function fetchPublicProofState(input: {
  preferredBaseUrl: string
}): Promise<PublicProofState> {
  const preferredBaseUrl = normalizePublicBaseUrl(input.preferredBaseUrl)
  const preferredTargets = buildPreferredSurfaceTargets(preferredBaseUrl)
  const preferredResults = await Promise.all(preferredTargets.map(checkSurface))
  const fallbackResult = await checkSurface({
    label: 'github blob fallback',
    url: GITHUB_BLOB_STUB_URL,
    expectedMarker: 'PrivateClawn Research Capability Surface',
  })

  return buildPublicProofState({
    preferredBaseUrl,
    preferredResults,
    fallbackResult,
  })
}

export function summarizePublicProofStateLines(state: PublicProofState): string[] {
  return [
    `Preferred public base: ${state.preferredBaseUrl}`,
    ...state.preferredResults.map(summarizeSurfaceCheck),
    summarizeSurfaceCheck(state.fallbackResult),
    `Preferred public surface ready: ${state.preferredSurfaceReady ? 'yes' : 'no'} (${state.preferredResearchUrl})`,
    `Bootstrap proof ready: ${state.bootstrapProofReady ? 'yes' : 'no'} (${state.fallbackResult.url})`,
  ]
}
