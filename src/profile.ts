export interface AensRecords {
  description?: string | null
  avatar?: string | null
  url?: string | null
  twitter?: string | null
  github?: string | null
  telegram?: string | null
  agentId?: string | null
  serviceUrl?: string | null
  proofsUrl?: string | null
  receiptsUrl?: string | null
  runtime?: string | null
}

export interface AensResolvedProfile {
  ensName: string
  address: string | null
  records: AensRecords
}

export function buildAensProfile(input: {
  ensName: string
  address: string | null
  records: Partial<AensRecords>
}): AensResolvedProfile {
  return {
    ensName: input.ensName,
    address: input.address,
    records: {
      description: input.records.description ?? null,
      avatar: input.records.avatar ?? null,
      url: input.records.url ?? null,
      twitter: input.records.twitter ?? null,
      github: input.records.github ?? null,
      telegram: input.records.telegram ?? null,
      agentId: input.records.agentId ?? null,
      serviceUrl: input.records.serviceUrl ?? null,
      proofsUrl: input.records.proofsUrl ?? null,
      receiptsUrl: input.records.receiptsUrl ?? null,
      runtime: input.records.runtime ?? null,
    },
  }
}

export function hasDiscoverySurface(profile: AensResolvedProfile): boolean {
  return Boolean(
    profile.address
      || profile.records.serviceUrl
      || profile.records.proofsUrl
      || profile.records.receiptsUrl
      || profile.records.url,
  )
}

export function hasProofSurface(profile: AensResolvedProfile): boolean {
  return Boolean(profile.records.proofsUrl || profile.records.receiptsUrl)
}
