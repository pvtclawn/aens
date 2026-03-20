export const DEFAULT_RPC_URLS = [
  'https://ethereum-rpc.publicnode.com',
  'https://cloudflare-eth.com',
  'https://rpc.flashbots.net',
  'https://eth.llamarpc.com',
] as const

export const RPC_REQUEST_TIMEOUT_MS = 10_000

export interface RpcUrlSources {
  inputRpcUrl?: string
  envRpcUrls?: string | null
  envRpcUrl?: string | null
}

function normalizeRpcUrls(urls: string[]): string[] {
  return [...new Set(urls.map((url) => url.trim()).filter(Boolean))]
}

export function getRpcUrlsFromSources(input: RpcUrlSources = {}): string[] {
  if (input.inputRpcUrl) {
    return normalizeRpcUrls([input.inputRpcUrl])
  }

  const envList = input.envRpcUrls
    ? input.envRpcUrls.split(',')
    : []

  const envSingle = input.envRpcUrl ? [input.envRpcUrl] : []

  return normalizeRpcUrls([
    ...envList,
    ...envSingle,
    ...DEFAULT_RPC_URLS,
  ])
}

export function getRpcUrls(inputRpcUrl?: string): string[] {
  return getRpcUrlsFromSources({
    inputRpcUrl,
    envRpcUrls: process.env.AENS_RPC_URLS,
    envRpcUrl: process.env.AENS_RPC_URL,
  })
}
