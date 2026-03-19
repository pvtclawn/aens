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
  parentName: 'aens.parent',
  capabilities: 'aens.capabilities',
} as const

function parseCapabilities(value: string | null | undefined): string[] | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter((entry): entry is string => typeof entry === 'string')
      }
    } catch {
      return null
    }
  }

  return trimmed
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

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

  const rawRecords = Object.fromEntries(entries) as Record<keyof typeof TEXT_RECORD_KEYS, string | null>

  return buildAensProfile({
    ensName: input.ensName,
    address: address ? getAddress(address) : null,
    records: {
      ...rawRecords,
      avatar,
      capabilities: parseCapabilities(rawRecords.capabilities),
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
