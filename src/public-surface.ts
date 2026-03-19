export const PAGES_ROOT_URL = 'https://pvtclawn.github.io/aens/'
export const PAGES_RESEARCH_STUB_URL = 'https://pvtclawn.github.io/aens/research-capability/'
export const GITHUB_BLOB_STUB_URL = 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md'

export interface SurfaceCheckResult {
  label: string
  url: string
  status: number
  expectedMarker: string
  body: string
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

export function pagesSurfaceReady(results: SurfaceCheckResult[]): boolean {
  return results.every(surfaceCheckPassed)
}
