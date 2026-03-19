export const DEFAULT_RPC_URLS = [
  'https://ethereum-rpc.publicnode.com',
  'https://cloudflare-eth.com',
  'https://rpc.flashbots.net',
  'https://eth.llamarpc.com',
] as const

export const RPC_REQUEST_TIMEOUT_MS = 10_000

function normalizeRpcUrls(urls: string[]): string[] {
  return [...new Set(urls.map((url) => url.trim()).filter(Boolean))]
}

export function getRpcUrls(inputRpcUrl?: string): string[] {
  if (inputRpcUrl) {
    return normalizeRpcUrls([inputRpcUrl])
  }

  const envList = process.env.AENS_RPC_URLS
    ? process.env.AENS_RPC_URLS.split(',')
    : []

  const envSingle = process.env.AENS_RPC_URL ? [process.env.AENS_RPC_URL] : []

  return normalizeRpcUrls([
    ...envList,
    ...envSingle,
    ...DEFAULT_RPC_URLS,
  ])
}
