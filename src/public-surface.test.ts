import { expect, test } from 'bun:test'
import {
  buildFallbackSurfaceTarget,
  buildPreferredSurfaceTargets,
  preferredSurfaceReady,
  resolvePreferredPublicBaseUrl,
  resolveSurfaceFailureClass,
  resolveSurfaceMarkerMatch,
  summarizeSurfaceCheck,
  summarizeSurfaceFailure,
  SURFACE_FAILURE_CLASS_SUMMARY_CUES,
  surfaceCheckPassed,
  type SurfaceCheckResult,
} from './public-surface'
import { parseSurfaceFailureSummary } from './surface-summary-format'

function buildResult(overrides: Partial<SurfaceCheckResult> = {}): SurfaceCheckResult {
  return {
    label: 'write records page',
    url: 'https://aens-nine.vercel.app/write-records/',
    status: 200,
    expectedMarker: 'Write ENS capability records — ÆNS',
    expectedMarkerAliases: [
      {
        marker: 'Write ENS Records',
        sunsetAt: '2026-05-01T00:00:00.000Z',
        reason: 'runtime h1 alias while checker reads static HTML content',
      },
    ],
    markerDomain: 'preferred-runtime',
    markerMatchType: 'canonical',
    matchedMarker: 'Write ENS capability records — ÆNS',
    matchMode: 'exact',
    body: 'Write ENS capability records — ÆNS',
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

test('buildPreferredSurfaceTargets returns root + write-records contracts', () => {
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
      label: 'write records page',
      url: 'https://aens-nine.vercel.app/write-records/',
      expectedMarker: 'Write ENS capability records — ÆNS',
      expectedMarkerAliases: [
        {
          marker: 'Write ENS Records',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'runtime h1 alias while checker reads static HTML content',
        },
      ],
      markerDomain: 'preferred-runtime',
      matchMode: 'exact',
    },
  ])
})

test('buildFallbackSurfaceTarget keeps bootstrap marker contract separate from runtime markers', () => {
  expect(buildFallbackSurfaceTarget()).toEqual({
    label: 'github blob fallback',
    url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/write-records-stub.md',
    expectedMarker: 'ÆNS Write Records Surface',
    expectedMarkerAliases: [],
    markerDomain: 'bootstrap-fallback',
    matchMode: 'exact',
  })
})

test('resolveSurfaceMarkerMatch supports canonical and alias matching', () => {
  expect(
    resolveSurfaceMarkerMatch({
      body: 'Write ENS capability records — ÆNS',
      expectedMarker: 'Write ENS capability records — ÆNS',
      expectedMarkerAliases: [
        {
          marker: 'Write ENS Records',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'runtime h1 alias while checker reads static HTML content',
        },
      ],
      matchMode: 'exact',
      nowIso: '2026-03-22T10:00:00.000Z',
    }),
  ).toMatchObject({
    markerMatchType: 'canonical',
    matchedMarker: 'Write ENS capability records — ÆNS',
  })

  expect(
    resolveSurfaceMarkerMatch({
      body: 'Write ENS Records',
      expectedMarker: 'Write ENS capability records — ÆNS',
      expectedMarkerAliases: [
        {
          marker: 'Write ENS Records',
          sunsetAt: '2026-05-01T00:00:00.000Z',
          reason: 'runtime h1 alias while checker reads static HTML content',
        },
      ],
      matchMode: 'exact',
      nowIso: '2026-03-22T10:00:00.000Z',
    }),
  ).toMatchObject({
    markerMatchType: 'alias',
    matchedMarker: 'Write ENS Records',
  })
})

test('resolveSurfaceMarkerMatch fails closed on unknown matchMode', () => {
  const result = resolveSurfaceMarkerMatch({
    body: 'Write ENS capability records — ÆNS',
    expectedMarker: 'Write ENS capability records — ÆNS',
    expectedMarkerAliases: [],
    matchMode: 'mystery-mode',
    nowIso: '2026-03-22T10:00:00.000Z',
  })

  expect(result.markerMatchType).toBe('none')
  expect(result.matchedMarker).toBeUndefined()
})

test('resolveSurfaceFailureClass keeps stricter class and never downgrades to marker-missing', () => {
  const result: SurfaceCheckResult = {
    label: 'write records page',
    url: 'https://aens-nine.vercel.app/write-records/',
    status: 200,
    expectedMarker: 'Write ENS capability records — ÆNS',
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
  expect(surfaceCheckPassed(buildResult({ markerMatchType: 'alias', matchedMarker: 'Write ENS Records' }))).toBe(true)
  expect(surfaceCheckPassed(buildResult({ markerMatchType: 'none', matchedMarker: undefined }))).toBe(false)
  expect(surfaceCheckPassed(buildResult({ status: 404 }))).toBe(false)
})

test('summarizeSurfaceCheck explains success, alias success, and failures', () => {
  expect(summarizeSurfaceCheck(buildResult())).toBe(
    'write records page: ok (https://aens-nine.vercel.app/write-records/)',
  )

  expect(
    summarizeSurfaceCheck(
      buildResult({
        markerMatchType: 'alias',
        matchedMarker: 'Write ENS Records',
      }),
    ),
  ).toBe(
    'write records page: ok (matched alias marker) (https://aens-nine.vercel.app/write-records/)',
  )

  expect(summarizeSurfaceCheck(buildResult({ markerMatchType: 'none', matchedMarker: undefined }))).toBe(
    'write records page: marker-missing (reachable but missing expected marker) (https://aens-nine.vercel.app/write-records/)',
  )

  expect(summarizeSurfaceCheck(buildResult({ status: 404 }))).toBe(
    'write records page: http-failure (http failure) (https://aens-nine.vercel.app/write-records/)',
  )
})

test('summary templates are centralized and used by surface failure summarizer', () => {
  expect(SURFACE_FAILURE_CLASS_SUMMARY_CUES['alias-expired']).toBe('alias expired (canonical marker required)')

  const summary = summarizeSurfaceFailure(
    buildResult({ markerMatchType: 'none', matchedMarker: undefined }),
    'alias-expired',
  )

  expect(summary).toBe(
    'write records page: alias-expired (alias expired (canonical marker required)) (https://aens-nine.vercel.app/write-records/)',
  )

  expect(parseSurfaceFailureSummary(summary)).toEqual({
    surfaceLabel: 'write records page',
    failureClass: 'alias-expired',
    cue: 'alias expired (canonical marker required)',
    url: 'https://aens-nine.vercel.app/write-records/',
  })
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
