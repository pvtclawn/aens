export const DEFAULT_PUBLIC_ROOT_NAME = 'theaens.eth'
export const WRITE_RECORDS_PATH = '/write-records/'

export interface PublicRouteLinks {
  ensName: string
  landing: string
  writeRecords: string
}

export interface CapabilityWriteSurface {
  label: string
  capabilityName: string
  serviceUrl: string
  demoServicePath?: string
}

export interface EnsRecordWrite {
  targetName: string
  key: string
  value: string
}

export interface PublicRouteCapabilityPlan {
  rootName: string
  capabilitySurfaces: CapabilityWriteSurface[]
  mergedCapabilities: string[]
  plannedRecords: EnsRecordWrite[]
}

export function normalizeEnsName(value: string, fallback: string = DEFAULT_PUBLIC_ROOT_NAME): string {
  const normalized = value.trim().toLowerCase()
  return normalized.length > 0 ? normalized : fallback
}

export function normalizeCapabilityName(value: string): string {
  return value.trim().toLowerCase()
}

export function normalizeCapabilityServiceUrl(value: string): string {
  return value.trim()
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

function buildAbsoluteUrl(input: {
  origin: string
  path: string
}): string {
  return new URL(input.path, input.origin).toString()
}

export function buildDemoRouteCapabilityDraft(input: {
  rootName: string
  origin: string
}): PublicRouteCapabilityPlan {
  const routeLinks = buildRouteLinks(input.rootName)

  return buildPublicRouteCapabilityPlan({
    rootName: routeLinks.ensName,
    capabilitySurfaces: [
      {
        label: 'Demo landing capability',
        capabilityName: `explore.${routeLinks.ensName}`,
        serviceUrl: buildAbsoluteUrl({
          origin: input.origin,
          path: routeLinks.landing,
        }),
        demoServicePath: routeLinks.landing,
      },
      {
        label: 'Demo write capability',
        capabilityName: `write.${routeLinks.ensName}`,
        serviceUrl: buildAbsoluteUrl({
          origin: input.origin,
          path: routeLinks.writeRecords,
        }),
        demoServicePath: routeLinks.writeRecords,
      },
    ],
  })
}

export function mergeCapabilities(
  existingCapabilities: string[] | null | undefined,
  requiredCapabilities: string[],
): string[] {
  const normalizedExisting = (existingCapabilities ?? [])
    .map((value) => normalizeCapabilityName(value))
    .filter(Boolean)
  const normalizedRequired = requiredCapabilities
    .map((value) => normalizeCapabilityName(value))
    .filter(Boolean)

  return [...new Set([...normalizedRequired, ...normalizedExisting])]
}

function normalizeCapabilitySurface(surface: CapabilityWriteSurface): CapabilityWriteSurface {
  return {
    ...surface,
    capabilityName: normalizeCapabilityName(surface.capabilityName),
    serviceUrl: normalizeCapabilityServiceUrl(surface.serviceUrl),
  }
}

export function buildPublicRouteCapabilityPlan(input: {
  rootName: string
  capabilitySurfaces: CapabilityWriteSurface[]
  existingCapabilities?: string[] | null
}): PublicRouteCapabilityPlan {
  const rootName = normalizeEnsName(input.rootName)
  const capabilitySurfaces = input.capabilitySurfaces
    .map(normalizeCapabilitySurface)
    .filter((surface) => surface.capabilityName.length > 0 && surface.serviceUrl.length > 0)
  const mergedCapabilities = mergeCapabilities(
    input.existingCapabilities,
    capabilitySurfaces.map((surface) => surface.capabilityName),
  )

  return {
    rootName,
    capabilitySurfaces,
    mergedCapabilities,
    plannedRecords: [
      {
        targetName: rootName,
        key: 'aens.capabilities',
        value: JSON.stringify(mergedCapabilities),
      },
      ...capabilitySurfaces.flatMap((surface) => ([
        {
          targetName: surface.capabilityName,
          key: 'aens.parent',
          value: rootName,
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
