import { createPublicClient, getAddress, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getRpcUrls, RPC_REQUEST_TIMEOUT_MS } from './config'
import { buildAensProfile, type AensResolvedProfile } from './profile'

const TEXT_RECORD_KEYS = {
  description: 'description',
  url: 'url',
  twitter: 'com.twitter',
  github: 'com.github',
  telegram: 'org.telegram',
  agentId: 'aens.agentId',
  serviceUrl: 'aens.service',
  proofsUrl: 'aens.proofs',
  receiptsUrl: 'aens.receipts',
  runtime: 'aens.runtime',
} as const

export function createEnsClient(rpcUrl: string) {
  return createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl, { timeout: RPC_REQUEST_TIMEOUT_MS }),
  })
}

async function resolveAensProfileViaRpc(input: {
  ensName: string
  rpcUrl: string
}): Promise<AensResolvedProfile> {
  const client = createEnsClient(input.rpcUrl)
  const address = await client.getEnsAddress({ name: input.ensName })
  const avatar = await client.getEnsAvatar({ name: input.ensName }).catch(() => null)

  const entries = await Promise.all(
    Object.entries(TEXT_RECORD_KEYS).map(async ([field, key]) => {
      const value = await client.getEnsText({ name: input.ensName, key }).catch(() => null)
      return [field, value] as const
    }),
  )

  const records = Object.fromEntries(entries)

  return buildAensProfile({
    ensName: input.ensName,
    address: address ? getAddress(address) : null,
    records: {
      ...records,
      avatar,
    },
  })
}

export async function resolveAensProfile(input: {
  ensName: string
  rpcUrl?: string
}): Promise<AensResolvedProfile> {
  const rpcUrls = getRpcUrls(input.rpcUrl)
  const failures: string[] = []

  for (const rpcUrl of rpcUrls) {
    try {
      return await resolveAensProfileViaRpc({
        ensName: input.ensName,
        rpcUrl,
      })
    } catch (error) {
      const message = error !== null
        && typeof error === 'object'
        && 'shortMessage' in error
        && typeof (error as { shortMessage?: unknown }).shortMessage === 'string'
        ? (error as { shortMessage: string }).shortMessage
        : error instanceof Error
          ? error.message
          : String(error)

      failures.push(`${rpcUrl}: ${message}`)
    }
  }

  throw new Error(`AENS lookup failed across ${rpcUrls.length} RPC endpoint(s): ${failures.join(' | ')}`)
}
