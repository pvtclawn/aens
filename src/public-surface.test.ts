import { expect, test } from 'bun:test'
import {
  buildFallbackSurfaceTarget,
  buildPreferredSurfaceTargets,
  preferredSurfaceReady,
  resolvePreferredPublicBaseUrl,
  resolveSurfaceFailureClass,
  resolveSurfaceMarkerMatch,
  summarizeSurfaceCheck,
  surfaceCheckPassed,
  type SurfaceCheckResult,
} from './public-surface'

function buildResult(overrides: Partial<SurfaceCheckResult> = {}): SurfaceCheckResult {
  return {
    label: 'research capability page',
    url: 'https://aens-nine.vercel.app/research-capability/',
    status: 200,
    expectedMarker: 'Research Capability — ÆNS',
    expectedMarkerAliases: [
      {
        marker: 'Research Capability Route',
        sunsetAt: '2026-05-01T00:00:00.000Z',
        reason: 'runtime h1 alias while checker reads static HTML content',
      },
    ],
    markerDomain: 'preferred-runtime',
    markerMatchType: 'canonical',
    matchedMarker: 'Research Capability — ÆNS',
    matchMode: 'exact',
    body: 'Research Capability — ÆNS',
    ...overrides,
  }
}

test('resolvePreferredPublicBaseUrl prefers env, then deployed host, then default', () => {
  expect(resolvePreferredPublicBaseUrl({ envValue: 'https://custom.example/app' })).toBe(
    'https://custom.example/app/',
  )
  expect(resolvePreferredPublicBaseUrl({ deployedHost: 'preview.example' })).toBe('https://preview.example/')
  expect(resolvePreferredPublicBaseUrl({ defaultBaseUrl: 'https://fallback.example/root' })).toBe(
    'https://fallback.example/root/',
  )
})

test('buildPreferredSurfaceTargets derives role-based runtime marker contracts with explicit matchMode', () => {
  expect(buildPreferredSurfaceTargets('https://aens-nine.vercel.app')).toEqual([
    {
      label: 'public root',
      url: 'https://aens-nine.vercel.app/',
      expectedMarker: 'ÆNS — ENS root explorer',
      expectedMarkerAliases: [
        {
          marker: 'ÆNS live ENS root explorer',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'runtime h1 alias while checker reads static HTML content',
        },
        {
          marker: 'ÆNS — PrivateClawn landing',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'temporary transition alias after landing copy de-hardcode',
        },
      ],
      markerDomain: 'preferred-runtime',
      matchMode: 'exact',
    },
    {
      label: 'research capability page',
      url: 'https://aens-nine.vercel.app/research-capability/',
      expectedMarker: 'Research Capability — ÆNS',
      expectedMarkerAliases: [
        {
          marker: 'Research Capability Route',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'runtime h1 alias while checker reads static HTML content',
        },
      ],
      markerDomain: 'preferred-runtime',
      matchMode: 'exact',
    },
    {
      label: 'discover research page',
      url: 'https://aens-nine.vercel.app/discover-research/',
      expectedMarker: 'Discover the official research capability for an ENS identity',
      expectedMarkerAliases: [],
      markerDomain: 'preferred-runtime',
      matchMode: 'exact',
    },
  ])
})

test('buildFallbackSurfaceTarget keeps bootstrap marker contract separate from runtime markers', () => {
  expect(buildFallbackSurfaceTarget()).toEqual({
    label: 'github blob fallback',
    url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
    expectedMarker: 'PrivateClawn Research Capability Surface',
    expectedMarkerAliases: [],
    markerDomain: 'bootstrap-fallback',
    matchMode: 'exact',
  })
})

test('resolveSurfaceMarkerMatch supports canonical and bounded alias matching for explicit mode', () => {
  expect(
    resolveSurfaceMarkerMatch({
      body: 'Research Capability — ÆNS',
      expectedMarker: 'Research Capability — ÆNS',
      expectedMarkerAliases: [
        {
          marker: 'Research Capability Route',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'runtime h1 alias while checker reads static HTML content',
        },
      ],
      matchMode: 'exact',
      nowIso: '2026-03-22T10:00:00.000Z',
    }),
  ).toMatchObject({
    markerMatchType: 'canonical',
    matchedMarker: 'Research Capability — ÆNS',
  })

  expect(
    resolveSurfaceMarkerMatch({
      body: 'Research Capability Route',
      expectedMarker: 'Research Capability — ÆNS',
      expectedMarkerAliases: [
        {
          marker: 'Research Capability Route',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'runtime h1 alias while checker reads static HTML content',
        },
      ],
      matchMode: 'exact',
      nowIso: '2026-03-22T10:00:00.000Z',
    }),
  ).toMatchObject({
    markerMatchType: 'alias',
    matchedMarker: 'Research Capability Route',
  })

  expect(
    resolveSurfaceMarkerMatch({
      body: 'Research Capability Route',
      expectedMarker: 'Research Capability — ÆNS',
      expectedMarkerAliases: [
        {
          marker: 'Research Capability Route',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'runtime h1 alias while checker reads static HTML content',
        },
      ],
      matchMode: 'exact',
      nowIso: '2026-06-01T00:00:00.000Z',
    }),
  ).toMatchObject({
    markerMatchType: 'none',
    matchedMarker: undefined,
  })
})

test('resolveSurfaceMarkerMatch fails closed on unknown matchMode', () => {
  const result = resolveSurfaceMarkerMatch({
    body: 'Research Capability — ÆNS',
    expectedMarker: 'Research Capability — ÆNS',
    expectedMarkerAliases: [],
    matchMode: 'mystery-mode',
    nowIso: '2026-03-22T10:00:00.000Z',
  })

  expect(result.markerMatchType).toBe('none')
  expect(result.matchedMarker).toBeUndefined()
})

test('resolveSurfaceFailureClass keeps stricter class and never downgrades to marker-missing', () => {
  const result: SurfaceCheckResult = {
    label: 'research capability page',
    url: 'https://aens-nine.vercel.app/research-capability/',
    status: 200,
    expectedMarker: 'Research Capability — ÆNS',
    expectedMarkerAliases: [],
    markerDomain: 'preferred-runtime',
    markerMatchType: 'none',
    matchedMarker: undefined,
    matchMode: 'exact',
    failureClass: 'collision-blocked',
    body: 'some body',
  }

  expect(resolveSurfaceFailureClass(result)).toBe('collision-blocked')
})

test('surfaceCheckPassed requires http 200 plus canonical or alias marker match', () => {
  expect(surfaceCheckPassed(buildResult())).toBe(true)
  expect(surfaceCheckPassed(buildResult({ markerMatchType: 'alias', matchedMarker: 'Research Capability Route' }))).toBe(true)
  expect(surfaceCheckPassed(buildResult({ markerMatchType: 'none', matchedMarker: undefined }))).toBe(false)
  expect(surfaceCheckPassed(buildResult({ status: 404 }))).toBe(false)
})

test('summarizeSurfaceCheck explains success, alias success, and failures', () => {
  expect(summarizeSurfaceCheck(buildResult())).toBe(
    'research capability page: ok (https://aens-nine.vercel.app/research-capability/)',
  )

  expect(
    summarizeSurfaceCheck(
      buildResult({
        markerMatchType: 'alias',
        matchedMarker: 'Research Capability Route',
      }),
    ),
  ).toBe(
    'research capability page: ok (matched alias marker) (https://aens-nine.vercel.app/research-capability/)',
  )

  expect(summarizeSurfaceCheck(buildResult({ markerMatchType: 'none', matchedMarker: undefined }))).toBe(
    'research capability page: reachable but missing expected marker (https://aens-nine.vercel.app/research-capability/)',
  )

  expect(summarizeSurfaceCheck(buildResult({ status: 404 }))).toBe(
    'research capability page: http 404 (https://aens-nine.vercel.app/research-capability/)',
  )
})

test('preferredSurfaceReady requires every checked preferred page to pass', () => {
  expect(preferredSurfaceReady([
    buildResult({
      label: 'public root',
      url: 'https://aens-nine.vercel.app/',
      expectedMarker: 'ÆNS — ENS root explorer',
      body: 'ÆNS — ENS root explorer',
      markerMatchType: 'canonical',
      matchedMarker: 'ÆNS — ENS root explorer',
    }),
    buildResult(),
    buildResult({
      label: 'discover research page',
      url: 'https://aens-nine.vercel.app/discover-research/',
      expectedMarker: 'Discover the official research capability for an ENS identity',
      expectedMarkerAliases: [],
      body: 'Discover the official research capability for an ENS identity',
      markerMatchType: 'canonical',
      matchedMarker: 'Discover the official research capability for an ENS identity',
    }),
  ])).toBe(true)

  expect(preferredSurfaceReady([
    buildResult({
      label: 'public root',
      url: 'https://aens-nine.vercel.app/',
      expectedMarker: 'ÆNS — ENS root explorer',
      body: 'ÆNS — ENS root explorer',
      markerMatchType: 'canonical',
      matchedMarker: 'ÆNS — ENS root explorer',
    }),
    buildResult({ status: 404 }),
    buildResult({
      label: 'discover research page',
      url: 'https://aens-nine.vercel.app/discover-research/',
      expectedMarker: 'Discover the official research capability for an ENS identity',
      expectedMarkerAliases: [],
      body: 'Discover the official research capability for an ENS identity',
      markerMatchType: 'canonical',
      matchedMarker: 'Discover the official research capability for an ENS identity',
    }),
  ])).toBe(false)
})

test('runtime markers do not accept bootstrap fallback marker content', () => {
  const runtimeRootTarget = buildPreferredSurfaceTargets('https://aens-nine.vercel.app/')[0]!
  const fallback = buildFallbackSurfaceTarget()

  const match = resolveSurfaceMarkerMatch({
    body: fallback.expectedMarker,
    expectedMarker: runtimeRootTarget.expectedMarker,
    expectedMarkerAliases: runtimeRootTarget.expectedMarkerAliases,
    matchMode: runtimeRootTarget.matchMode,
    nowIso: '2026-03-22T10:00:00.000Z',
  })

  expect(match.markerMatchType).toBe('none')
})
