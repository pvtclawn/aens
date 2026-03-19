import {
  GITHUB_BLOB_STUB_URL,
  buildPreferredSurfaceTargets,
  preferredSurfaceReady,
  resolvePreferredPublicBaseUrl,
  summarizeSurfaceCheck,
  type SurfaceCheckResult,
} from './public-surface'

async function checkSurface(input: {
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

async function main() {
  const preferredBaseUrl = resolvePreferredPublicBaseUrl({
    envValue: process.env.AENS_PUBLIC_BASE_URL,
  })
  const preferredTargets = buildPreferredSurfaceTargets(preferredBaseUrl)
  const preferredResults = await Promise.all(preferredTargets.map(checkSurface))

  const fallbackResult = await checkSurface({
    label: 'github blob fallback',
    url: GITHUB_BLOB_STUB_URL,
    expectedMarker: 'PrivateClawn Research Capability Surface',
  })

  console.log('ÆNS public surface check')
  console.log('')
  console.log(`Preferred public base: ${preferredBaseUrl}`)
  console.log('')
  for (const result of [...preferredResults, fallbackResult]) {
    console.log(summarizeSurfaceCheck(result))
  }

  console.log('')
  const preferredResearchUrl = preferredTargets[1]?.url ?? preferredBaseUrl
  if (preferredSurfaceReady(preferredResults)) {
    console.log(`Preferred public surface ready: yes (${preferredResearchUrl})`)
    process.exit(0)
  }

  console.log(`Preferred public surface ready: no (${preferredResearchUrl})`)
  process.exit(1)
}

await main()
