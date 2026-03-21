import { createPublicClient, getAddress, http } from 'viem'
import { mainnet } from 'viem/chains'

interface VercelRequestLike {
  method?: string
  query?: Record<string, string | string[] | undefined>
}

interface VercelResponseLike {
  status(code: number): VercelResponseLike
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

const RPC_REQUEST_TIMEOUT_MS = 8_000
const DEFAULT_RPC_URLS = [
  'https://eth.merkle.io',
  'https://rpc.ankr.com/eth',
  'https://cloudflare-eth.com',
] as const

function pickQueryName(req: VercelRequestLike): string | null {
  const raw = req.query?.name
  if (Array.isArray(raw)) {
    return raw[0]?.trim().toLowerCase() || null
  }
  return raw?.trim().toLowerCase() || null
}

function parseCapabilities(value: string | null): string[] {
  if (!value) return []
  const trimmed = value.trim()
  if (!trimmed) return []

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.filter((entry): entry is string => typeof entry === 'string').map((s) => s.toLowerCase())
      }
    } catch {
      // ignore and fall through to CSV mode
    }
  }

  return trimmed
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
}

interface EnsObservedProfile {
  ensName: string
  address: string | null
  parentName: string | null
  serviceUrl: string | null
  capabilities: string[]
}

export const REASON_SCHEMA_VERSION = 'v1'

export type DiscoverReasonCode =
  | 'child-not-found'
  | 'child-found-not-authorized'
  | 'parent-authorized-without-service-url'
  | 'parent-authorized-with-service-url'
  | 'lookup-failed'

export const REASON_TAXONOMY_V1: readonly Exclude<DiscoverReasonCode, 'lookup-failed'>[] = [
  'child-not-found',
  'child-found-not-authorized',
  'parent-authorized-without-service-url',
  'parent-authorized-with-service-url',
] as const

export function classifyReasonCode(input: {
  parentListsChild: boolean
  childDeclaresParent: boolean
  childAddress: string | null
  childServiceUrl: string | null
  childCapabilities: string[]
}): DiscoverReasonCode {
  const parentAuthorized = input.parentListsChild && input.childDeclaresParent
  if (parentAuthorized) {
    return input.childServiceUrl ? 'parent-authorized-with-service-url' : 'parent-authorized-without-service-url'
  }

  const childLooksMissing = !input.childAddress && !input.childServiceUrl && input.childCapabilities.length === 0
  if (childLooksMissing) {
    return 'child-not-found'
  }

  return 'child-found-not-authorized'
}

function createEnsClient(rpcUrl: string) {
  return createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl, { timeout: RPC_REQUEST_TIMEOUT_MS }),
  })
}

async function resolveProfileViaRpc(ensName: string, rpcUrl: string): Promise<EnsObservedProfile> {
  const client = createEnsClient(rpcUrl)
  const address = await client.getEnsAddress({ name: ensName })
  const parentName = await client.getEnsText({ name: ensName, key: 'aens.parent' }).catch(() => null)
  const serviceUrl = await client.getEnsText({ name: ensName, key: 'aens.service' }).catch(() => null)
  const capabilitiesRaw = await client.getEnsText({ name: ensName, key: 'aens.capabilities' }).catch(() => null)

  return {
    ensName,
    address: address ? getAddress(address) : null,
    parentName: parentName?.toLowerCase() ?? null,
    serviceUrl,
    capabilities: parseCapabilities(capabilitiesRaw),
  }
}

async function resolveProfile(ensName: string): Promise<EnsObservedProfile> {
  const failures: string[] = []

  for (const rpcUrl of DEFAULT_RPC_URLS) {
    try {
      return await resolveProfileViaRpc(ensName, rpcUrl)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      failures.push(`${rpcUrl}: ${message}`)
    }
  }

  throw new Error(`lookup failed across ${DEFAULT_RPC_URLS.length} rpc endpoints: ${failures.join(' | ')}`)
}

function deriveResearchCapabilityName(parentName: string, parentCapabilities: string[]): string {
  const expected = `research.${parentName}`
  const exact = parentCapabilities.find((capability) => capability === expected)
  if (exact) return exact

  const firstResearch = parentCapabilities.find((capability) => capability.startsWith('research.'))
  return firstResearch ?? expected
}

export function buildDiscoverResponsePayload(input: {
  parentName: string
  capabilityName: string
  parentCapabilities: string[]
  childParentName: string | null
  childAddress: string | null
  childServiceUrl: string | null
  childCapabilities: string[]
  resolvedAt: string
}) {
  const parentListsChild = input.parentCapabilities.includes(input.capabilityName)
  const childDeclaresParent = input.childParentName === input.parentName
  const authorizationStatus = parentListsChild && childDeclaresParent ? 'parent-authorized' : 'not-parent-authorized'
  const authorizationSummary = parentListsChild && childDeclaresParent
    ? 'Research capability is declared by child and listed by parent.'
    : 'Research capability authorization is incomplete (missing parent list and/or child parent reference).'
  const reasonCode = classifyReasonCode({
    parentListsChild,
    childDeclaresParent,
    childAddress: input.childAddress,
    childServiceUrl: input.childServiceUrl,
    childCapabilities: input.childCapabilities,
  })

  return {
    queryName: input.parentName,
    resolvedAt: input.resolvedAt,
    source: 'aens-discover-research-v1',
    reasonCode,
    reasonSchemaVersion: REASON_SCHEMA_VERSION,
    authorization: {
      status: authorizationStatus,
      summary: authorizationSummary,
      parentListsChild,
      childDeclaresParent,
    },
    endpoint: {
      capabilityName: input.capabilityName,
      serviceUrl: input.childServiceUrl,
      officialEndpointDeclared: authorizationStatus === 'parent-authorized' && Boolean(input.childServiceUrl),
      livenessChecked: false,
    },
    notes: ['Authorization and liveness are separate checks.'],
  }
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'public, max-age=30, s-maxage=30')

  if (req.method && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const parentName = pickQueryName(req)
  if (!parentName) {
    return res.status(400).json({ error: 'Missing required query parameter: name' })
  }

  try {
    const parent = await resolveProfile(parentName)
    const capabilityName = deriveResearchCapabilityName(parentName, parent.capabilities)
    const child = await resolveProfile(capabilityName)

    const payload = buildDiscoverResponsePayload({
      parentName,
      capabilityName,
      parentCapabilities: parent.capabilities,
      childParentName: child.parentName,
      childAddress: child.address,
      childServiceUrl: child.serviceUrl,
      childCapabilities: child.capabilities,
      resolvedAt: new Date().toISOString(),
    })

    return res.status(200).json(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return res.status(502).json({
      error: 'Failed to resolve discover-research response',
      message,
      name: parentName,
      reasonCode: 'lookup-failed',
      reasonSchemaVersion: REASON_SCHEMA_VERSION,
    })
  }
}
