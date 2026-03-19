import {
  GITHUB_BLOB_STUB_URL,
  PAGES_RESEARCH_STUB_URL,
  PAGES_ROOT_URL,
  pagesSurfaceReady,
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
  const pagesResults = await Promise.all([
    checkSurface({
      label: 'pages root',
      url: PAGES_ROOT_URL,
      expectedMarker: 'ÆNS',
    }),
    checkSurface({
      label: 'research capability page',
      url: PAGES_RESEARCH_STUB_URL,
      expectedMarker: 'PrivateClawn Research Capability Surface',
    }),
  ])

  const fallbackResult = await checkSurface({
    label: 'github blob fallback',
    url: GITHUB_BLOB_STUB_URL,
    expectedMarker: 'PrivateClawn Research Capability Surface',
  })

  console.log('ÆNS public surface check')
  console.log('')
  for (const result of [...pagesResults, fallbackResult]) {
    console.log(summarizeSurfaceCheck(result))
  }

  console.log('')
  if (pagesSurfaceReady(pagesResults)) {
    console.log(`Pages surface ready: yes (${PAGES_RESEARCH_STUB_URL})`)
    process.exit(0)
  }

  console.log(`Pages surface ready: no (${PAGES_RESEARCH_STUB_URL})`)
  process.exit(1)
}

await main()
