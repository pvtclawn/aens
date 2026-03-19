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
  parentName?: string | null
  capabilities?: string[] | null
}

export interface AensResolvedProfile {
  ensName: string
  address: string | null
  records: AensRecords
}

function normalizeCapabilities(capabilities?: string[] | null): string[] | null {
  if (!capabilities || capabilities.length === 0) {
    return null
  }

  const normalized = capabilities
    .map((capability) => capability.trim())
    .filter(Boolean)

  return normalized.length > 0 ? normalized : null
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
      parentName: input.records.parentName ?? null,
      capabilities: normalizeCapabilities(input.records.capabilities),
    },
  }
}

export function hasProfileMetadata(profile: AensResolvedProfile): boolean {
  return Boolean(
    profile.records.description
      || profile.records.avatar
      || profile.records.url
      || profile.records.twitter
      || profile.records.github
      || profile.records.telegram,
  )
}

export function hasCallableServiceSurface(profile: AensResolvedProfile): boolean {
  return Boolean(profile.records.serviceUrl)
}

export function hasProofSurface(profile: AensResolvedProfile): boolean {
  return Boolean(profile.records.proofsUrl || profile.records.receiptsUrl)
}

export function hasIdentityAnchor(profile: AensResolvedProfile): boolean {
  return Boolean(
    profile.address
      || profile.records.agentId
      || profile.records.parentName
      || profile.records.runtime
      || profile.records.capabilities?.length
      || hasProfileMetadata(profile)
      || hasCallableServiceSurface(profile)
      || hasProofSurface(profile),
  )
}

/** @deprecated prefer explicit state lines (identity/profile/service/proof/authority) */
export function hasDiscoverySurface(profile: AensResolvedProfile): boolean {
  return Boolean(
    hasCallableServiceSurface(profile)
      || hasProofSurface(profile)
      || profile.records.parentName
      || profile.records.capabilities?.length,
  )
}
