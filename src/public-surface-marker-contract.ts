export type SurfaceMarkerDomain = 'preferred-runtime' | 'bootstrap-fallback'

export interface SurfaceMarkerAlias {
  marker: string
  sunsetAt: string
  reason: string
}

export interface SurfaceMarkerContract {
  domain: SurfaceMarkerDomain
  canonical: string
  aliases: SurfaceMarkerAlias[]
}

export const MARKER_ALIAS_ALLOW_UNTIL = '2026-05-01T00:00:00.000Z' as const

export const PREFERRED_RUNTIME_MARKERS = {
  publicRoot: {
    domain: 'preferred-runtime',
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
    canonical: 'Research Capability — ÆNS',
    aliases: [
      {
        marker: 'Research Capability Route',
        sunsetAt: MARKER_ALIAS_ALLOW_UNTIL,
        reason: 'runtime h1 alias while checker reads static HTML content',
      },
      {
        marker: 'PrivateClawn Research Capability',
        sunsetAt: MARKER_ALIAS_ALLOW_UNTIL,
        reason: 'temporary transition alias after research page copy de-hardcode',
      },
    ],
  },
  discoverResearch: {
    domain: 'preferred-runtime',
    canonical: 'Discover the official research capability for an ENS identity',
    aliases: [],
  },
} satisfies Record<string, SurfaceMarkerContract>

export const BOOTSTRAP_FALLBACK_MARKER: SurfaceMarkerContract = {
  domain: 'bootstrap-fallback',
  canonical: 'PrivateClawn Research Capability Surface',
  aliases: [],
}

export interface ResolveActiveMarkerAliasesInput {
  aliases: SurfaceMarkerAlias[]
  nowIso?: string
}

export function resolveActiveMarkerAliases(input: ResolveActiveMarkerAliasesInput): SurfaceMarkerAlias[] {
  const nowMs = Date.parse(input.nowIso ?? new Date().toISOString())

  return input.aliases.filter((alias) => {
    const sunsetMs = Date.parse(alias.sunsetAt)
    return Number.isFinite(sunsetMs) && nowMs <= sunsetMs
  })
}
