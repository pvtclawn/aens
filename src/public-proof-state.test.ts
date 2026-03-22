import { expect, test } from 'bun:test'
import { buildPublicProofState, summarizePublicProofStateLines } from './public-proof-state'
import type { SurfaceCheckResult } from './public-surface'

function buildSurfaceResult(overrides: Partial<SurfaceCheckResult> = {}): SurfaceCheckResult {
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
      {
        marker: 'PrivateClawn Research Capability',
        sunsetAt: '2026-05-01T00:00:00.000Z',
        reason: 'temporary transition alias after research page copy de-hardcode',
      },
    ],
    markerDomain: 'preferred-runtime',
    markerMatchType: 'canonical',
    matchedMarker: 'Research Capability — ÆNS',
    body: 'Research Capability — ÆNS',
    ...overrides,
  }
}

test('buildPublicProofState marks preferred ready only when all preferred targets pass', () => {
  const state = buildPublicProofState({
    preferredBaseUrl: 'https://aens-nine.vercel.app',
    preferredResults: [
      buildSurfaceResult({
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
        markerMatchType: 'canonical',
        matchedMarker: 'ÆNS — ENS root explorer',
        body: 'ÆNS — ENS root explorer',
      }),
      buildSurfaceResult(),
    ],
    fallbackResult: buildSurfaceResult({
      label: 'github blob fallback',
      url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
      expectedMarker: 'PrivateClawn Research Capability Surface',
      expectedMarkerAliases: [],
      markerDomain: 'bootstrap-fallback',
      markerMatchType: 'canonical',
      matchedMarker: 'PrivateClawn Research Capability Surface',
      body: 'PrivateClawn Research Capability Surface',
    }),
  })

  expect(state.preferredSurfaceReady).toBe(true)
  expect(state.bootstrapProofReady).toBe(false)
})

test('buildPublicProofState marks bootstrap ready when preferred surface is not ready but fallback passes', () => {
  const state = buildPublicProofState({
    preferredBaseUrl: 'https://aens-nine.vercel.app',
    preferredResults: [
      buildSurfaceResult({
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
        markerMatchType: 'canonical',
        matchedMarker: 'ÆNS — ENS root explorer',
        body: 'ÆNS — ENS root explorer',
      }),
      buildSurfaceResult({ status: 404, body: 'not found', markerMatchType: 'none', matchedMarker: undefined }),
    ],
    fallbackResult: buildSurfaceResult({
      label: 'github blob fallback',
      url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
      expectedMarker: 'PrivateClawn Research Capability Surface',
      expectedMarkerAliases: [],
      markerDomain: 'bootstrap-fallback',
      markerMatchType: 'canonical',
      matchedMarker: 'PrivateClawn Research Capability Surface',
      body: 'PrivateClawn Research Capability Surface',
    }),
  })

  expect(state.preferredSurfaceReady).toBe(false)
  expect(state.bootstrapProofReady).toBe(true)
})

test('summarizePublicProofStateLines includes both preferred and bootstrap verdicts', () => {
  const lines = summarizePublicProofStateLines(
    buildPublicProofState({
      preferredBaseUrl: 'https://aens-nine.vercel.app',
      preferredResults: [
        buildSurfaceResult({
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
          markerMatchType: 'canonical',
          matchedMarker: 'ÆNS — ENS root explorer',
          body: 'ÆNS — ENS root explorer',
        }),
        buildSurfaceResult({ status: 404, body: 'not found', markerMatchType: 'none', matchedMarker: undefined }),
      ],
      fallbackResult: buildSurfaceResult({
        label: 'github blob fallback',
        url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
        expectedMarker: 'PrivateClawn Research Capability Surface',
        expectedMarkerAliases: [],
        markerDomain: 'bootstrap-fallback',
        markerMatchType: 'canonical',
        matchedMarker: 'PrivateClawn Research Capability Surface',
        body: 'PrivateClawn Research Capability Surface',
      }),
    }),
  )

  expect(lines).toContain('Preferred public surface ready: no (https://aens-nine.vercel.app/research-capability/)')
  expect(lines).toContain(
    'Bootstrap proof ready: yes (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)',
  )
})
