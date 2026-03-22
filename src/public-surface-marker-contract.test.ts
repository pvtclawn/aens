import { expect, test } from 'bun:test'

import {
  BOOTSTRAP_FALLBACK_MARKER,
  PREFERRED_RUNTIME_MARKERS,
  assertSurfaceMarkerContractsValid,
  hasNormalizedMarkerOverlap,
  validateSurfaceMarkerContracts,
  type SurfaceMarkerContract,
} from './public-surface-marker-contract'

test('default marker contracts pass normalized cross-domain overlap validation', () => {
  expect(() => assertSurfaceMarkerContractsValid()).not.toThrow()
})

test('hasNormalizedMarkerOverlap catches normalized unicode/spacing overlap', () => {
  expect(hasNormalizedMarkerOverlap('Research endpoint — ÆNS', 'research   endpoint — æns')).toBe(true)
})

test('validateSurfaceMarkerContracts rejects unknown match modes', () => {
  const preferredRuntimeMarkers = {
    route: {
      domain: 'preferred-runtime',
      matchMode: 'mystery' as unknown as SurfaceMarkerContract['matchMode'],
      canonical: 'Route Marker',
      aliases: [],
    },
  } as unknown as Record<string, SurfaceMarkerContract>

  const issues = validateSurfaceMarkerContracts({
    preferredRuntimeMarkers,
    fallbackMarker: BOOTSTRAP_FALLBACK_MARKER,
  })

  expect(issues.some((issue) => issue.code === 'match-mode-invalid')).toBe(true)
})

test('validateSurfaceMarkerContracts rejects normalized cross-domain overlap', () => {
  const preferredRuntimeMarkers = {
    route: {
      domain: 'preferred-runtime',
      matchMode: 'exact',
      canonical: 'Research Capability',
      aliases: [],
    },
  } satisfies Record<string, SurfaceMarkerContract>

  const fallbackMarker: SurfaceMarkerContract = {
    domain: 'bootstrap-fallback',
    matchMode: 'exact',
    canonical: 'Research   Capability   Surface',
    aliases: [],
  }

  const issues = validateSurfaceMarkerContracts({
    preferredRuntimeMarkers,
    fallbackMarker,
  })

  expect(issues.some((issue) => issue.code === 'cross-domain-normalized-overlap')).toBe(true)
})

test('baseline contracts still include expected role markers', () => {
  expect(PREFERRED_RUNTIME_MARKERS.publicRoot.canonical).toBe('ÆNS — ENS root explorer')
  expect(PREFERRED_RUNTIME_MARKERS.researchCapability.canonical).toBe('Research endpoint — ÆNS')
})
