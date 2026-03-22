export type SurfaceMarkerDomain = 'preferred-runtime' | 'bootstrap-fallback'
export type SurfaceMarkerMatchMode = 'exact' | 'token-boundary' | 'contains'

export interface SurfaceMarkerAlias {
  marker: string
  sunsetAt: string
  reason: string
}

export interface SurfaceMarkerContract {
  domain: SurfaceMarkerDomain
  matchMode: SurfaceMarkerMatchMode
  canonical: string
  aliases: SurfaceMarkerAlias[]
}

export interface MarkerContractValidationIssue {
  code: 'match-mode-invalid' | 'cross-domain-normalized-overlap'
  message: string
}

export const MARKER_ALIAS_ALLOW_UNTIL = '2026-05-01T00:00:00.000Z' as const

export const PREFERRED_RUNTIME_MARKERS = {
  publicRoot: {
    domain: 'preferred-runtime',
    matchMode: 'exact',
    canonical: 'ÆNS — ENS root explorer',
    aliases: [
      {
        marker: 'ÆNS live ENS root explorer',
        sunsetAt: MARKER_ALIAS_ALLOW_UNTIL,
        reason: 'runtime h1 alias while checker reads static HTML content',
      },
      {
        marker: 'ÆNS — PrivateClawn landing',
        sunsetAt: MARKER_ALIAS_ALLOW_UNTIL,
        reason: 'temporary transition alias after landing copy de-hardcode',
      },
    ],
  },
  researchCapability: {
    domain: 'preferred-runtime',
    matchMode: 'exact',
    canonical: 'Research Capability — ÆNS',
    aliases: [
      {
        marker: 'Research Capability Route',
        sunsetAt: MARKER_ALIAS_ALLOW_UNTIL,
        reason: 'runtime h1 alias while checker reads static HTML content',
      },
    ],
  },
  discoverResearch: {
    domain: 'preferred-runtime',
    matchMode: 'exact',
    canonical: 'Discover the official research capability for an ENS identity',
    aliases: [],
  },
} satisfies Record<string, SurfaceMarkerContract>

export const BOOTSTRAP_FALLBACK_MARKER: SurfaceMarkerContract = {
  domain: 'bootstrap-fallback',
  matchMode: 'exact',
  canonical: 'PrivateClawn Research Capability Surface',
  aliases: [],
}

export interface ResolveActiveMarkerAliasesInput {
  aliases: SurfaceMarkerAlias[]
  nowIso?: string
}

function isSurfaceMarkerMatchMode(value: string): value is SurfaceMarkerMatchMode {
  return value === 'exact' || value === 'token-boundary' || value === 'contains'
}

export function normalizeMarkerText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function hasNormalizedMarkerOverlap(left: string, right: string): boolean {
  const normalizedLeft = normalizeMarkerText(left)
  const normalizedRight = normalizeMarkerText(right)

  if (!normalizedLeft || !normalizedRight) {
    return false
  }

  return normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft)
}

function toDomainMarkers(contract: SurfaceMarkerContract): string[] {
  return [contract.canonical, ...contract.aliases.map((alias) => alias.marker)]
}

export function validateSurfaceMarkerContracts(input: {
  preferredRuntimeMarkers?: Record<string, SurfaceMarkerContract>
  fallbackMarker?: SurfaceMarkerContract
} = {}): MarkerContractValidationIssue[] {
  const preferredRuntimeMarkers = input.preferredRuntimeMarkers ?? PREFERRED_RUNTIME_MARKERS
  const fallbackMarker = input.fallbackMarker ?? BOOTSTRAP_FALLBACK_MARKER

  const issues: MarkerContractValidationIssue[] = []

  for (const [label, contract] of Object.entries(preferredRuntimeMarkers)) {
    if (!isSurfaceMarkerMatchMode(contract.matchMode)) {
      issues.push({
        code: 'match-mode-invalid',
        message: `preferred-runtime marker contract (${label}) has invalid matchMode: ${String(contract.matchMode)}`,
      })
    }
  }

  if (!isSurfaceMarkerMatchMode(fallbackMarker.matchMode)) {
    issues.push({
      code: 'match-mode-invalid',
      message: `bootstrap-fallback marker contract has invalid matchMode: ${String(fallbackMarker.matchMode)}`,
    })
  }

  const fallbackDomainMarkers = toDomainMarkers(fallbackMarker)

  for (const [label, runtimeContract] of Object.entries(preferredRuntimeMarkers)) {
    for (const runtimeMarker of toDomainMarkers(runtimeContract)) {
      for (const fallbackDomainMarker of fallbackDomainMarkers) {
        if (!hasNormalizedMarkerOverlap(runtimeMarker, fallbackDomainMarker)) {
          continue
        }

        issues.push({
          code: 'cross-domain-normalized-overlap',
          message: `normalized marker overlap between preferred-runtime (${label}) and bootstrap-fallback: ${runtimeMarker} <-> ${fallbackDomainMarker}`,
        })
      }
    }
  }

  return issues
}

export function assertSurfaceMarkerContractsValid(input?: {
  preferredRuntimeMarkers?: Record<string, SurfaceMarkerContract>
  fallbackMarker?: SurfaceMarkerContract
}): void {
  const issues = validateSurfaceMarkerContracts(input)
  if (issues.length === 0) {
    return
  }

  throw new Error(issues.map((issue) => `${issue.code}: ${issue.message}`).join(' | '))
}

export function resolveActiveMarkerAliases(input: ResolveActiveMarkerAliasesInput): SurfaceMarkerAlias[] {
  const nowMs = Date.parse(input.nowIso ?? new Date().toISOString())

  return input.aliases.filter((alias) => {
    const sunsetMs = Date.parse(alias.sunsetAt)
    return Number.isFinite(sunsetMs) && nowMs <= sunsetMs
  })
}
