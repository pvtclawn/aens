import { DEFAULT_PUBLIC_BASE_URL, resolvePreferredPublicBaseUrl } from './public-surface'
import { fetchPublicProofState, summarizePublicProofStateLines } from './public-proof-state'

async function main() {
  const preferredBaseUrl = resolvePreferredPublicBaseUrl({
    envValue: process.env.AENS_PUBLIC_BASE_URL,
    defaultBaseUrl: DEFAULT_PUBLIC_BASE_URL,
  })
  const publicProofState = await fetchPublicProofState({
    preferredBaseUrl,
  })

  console.log('ÆNS public surface check')
  console.log('')
  for (const line of summarizePublicProofStateLines(publicProofState)) {
    console.log(line)
  }

  process.exit(publicProofState.preferredSurfaceReady ? 0 : 1)
}

await main()
