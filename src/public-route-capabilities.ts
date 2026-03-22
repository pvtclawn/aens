export const DEFAULT_PUBLIC_ROOT_NAME = 'theaens.eth'
export const WRITE_RECORDS_PATH = '/write-records/'

export type PublicRouteCapabilityKind = 'explore' | 'write'

export interface PublicRouteLinks {
  ensName: string
  landing: string
  writeRecords: string
}

export interface PublicRouteCapabilitySurface {
  kind: PublicRouteCapabilityKind
  capabilityName: string
  servicePath: string
  serviceUrl: string
}

export interface EnsRecordWrite {
  targetName: string
  key: string
  value: string
}

export interface PublicRouteCapabilityPlan {
  rootName: string
  routeLinks: PublicRouteLinks
  capabilitySurfaces: PublicRouteCapabilitySurface[]
  mergedCapabilities: string[]
  plannedRecords: EnsRecordWrite[]
}

export function normalizeEnsName(value: string, fallback: string = DEFAULT_PUBLIC_ROOT_NAME): string {
  const normalized = value.trim().toLowerCase()
  return normalized.length > 0 ? normalized : fallback
}

function buildRouteQuery(ensName: string): string {
  return new URLSearchParams({ name: ensName }).toString()
}

export function buildRouteLinks(inputEnsName: string): PublicRouteLinks {
  const ensName = normalizeEnsName(inputEnsName)
  const defaultRoot = normalizeEnsName(DEFAULT_PUBLIC_ROOT_NAME)
  const query = buildRouteQuery(ensName)
  const isDefaultRoot = ensName === defaultRoot

  return {
    ensName,
    landing: isDefaultRoot ? '/' : `/?${query}`,
    writeRecords: isDefaultRoot ? WRITE_RECORDS_PATH : `${WRITE_RECORDS_PATH}?${query}`,
  }
}

function deriveCapabilityName(input: {
  kind: PublicRouteCapabilityKind
  rootName: string
}): string {
  return `${input.kind}.${normalizeEnsName(input.rootName)}`
}

function buildAbsoluteUrl(input: {
  origin: string
  path: string
}): string {
  return new URL(input.path, input.origin).toString()
}

export function buildPublicRouteCapabilitySurfaces(input: {
  rootName: string
  origin: string
}): PublicRouteCapabilitySurface[] {
  const routeLinks = buildRouteLinks(input.rootName)

  return [
    {
      kind: 'explore',
      capabilityName: deriveCapabilityName({
        kind: 'explore',
        rootName: routeLinks.ensName,
      }),
      servicePath: routeLinks.landing,
      serviceUrl: buildAbsoluteUrl({
        origin: input.origin,
        path: routeLinks.landing,
      }),
    },
    {
      kind: 'write',
      capabilityName: deriveCapabilityName({
        kind: 'write',
        rootName: routeLinks.ensName,
      }),
      servicePath: routeLinks.writeRecords,
      serviceUrl: buildAbsoluteUrl({
        origin: input.origin,
        path: routeLinks.writeRecords,
      }),
    },
  ]
}

export function mergeCapabilities(
  existingCapabilities: string[] | null | undefined,
  requiredCapabilities: string[],
): string[] {
  const normalizedExisting = (existingCapabilities ?? [])
    .map((value) => normalizeEnsName(value, ''))
    .filter(Boolean)
  const normalizedRequired = requiredCapabilities
    .map((value) => normalizeEnsName(value, ''))
    .filter(Boolean)

  return [...new Set([...normalizedRequired, ...normalizedExisting])]
}

export function buildPublicRouteCapabilityPlan(input: {
  rootName: string
  origin: string
  existingCapabilities?: string[] | null
}): PublicRouteCapabilityPlan {
  const routeLinks = buildRouteLinks(input.rootName)
  const capabilitySurfaces = buildPublicRouteCapabilitySurfaces({
    rootName: routeLinks.ensName,
    origin: input.origin,
  })
  const mergedCapabilities = mergeCapabilities(
    input.existingCapabilities,
    capabilitySurfaces.map((surface) => surface.capabilityName),
  )

  return {
    rootName: routeLinks.ensName,
    routeLinks,
    capabilitySurfaces,
    mergedCapabilities,
    plannedRecords: [
      {
        targetName: routeLinks.ensName,
        key: 'aens.capabilities',
        value: JSON.stringify(mergedCapabilities),
      },
      ...capabilitySurfaces.flatMap((surface) => ([
        {
          targetName: surface.capabilityName,
          key: 'aens.parent',
          value: routeLinks.ensName,
        },
        {
          targetName: surface.capabilityName,
          key: 'aens.service',
          value: surface.serviceUrl,
        },
      ] satisfies EnsRecordWrite[])),
    ],
  }
}
