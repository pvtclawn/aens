import { expect, test } from 'bun:test'
import { buildPublicProofState, summarizePublicProofStateLines } from './public-proof-state'
import type { SurfaceCheckResult } from './public-surface'

function buildSurfaceResult(overrides: Partial<SurfaceCheckResult> = {}): SurfaceCheckResult {
  return {
    label: 'research capability page',
    url: 'https://aens-nine.vercel.app/research-capability/',
    status: 200,
    expectedMarker: 'PrivateClawn Research Capability',
    body: 'PrivateClawn Research Capability',
    ...overrides,
  }
}

test('buildPublicProofState marks preferred ready only when all preferred targets pass', () => {
  const state = buildPublicProofState({
    preferredBaseUrl: 'https://aens-nine.vercel.app',
    preferredResults: [
      buildSurfaceResult({ label: 'public root', url: 'https://aens-nine.vercel.app/', expectedMarker: 'ÆNS', body: 'ÆNS — PrivateClawn landing' }),
      buildSurfaceResult(),
    ],
    fallbackResult: buildSurfaceResult({
      label: 'github blob fallback',
      url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
      expectedMarker: 'PrivateClawn Research Capability Surface',
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
      buildSurfaceResult({ label: 'public root', url: 'https://aens-nine.vercel.app/', expectedMarker: 'ÆNS', body: 'ÆNS — PrivateClawn landing' }),
      buildSurfaceResult({ status: 404, body: 'not found' }),
    ],
    fallbackResult: buildSurfaceResult({
      label: 'github blob fallback',
      url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
      expectedMarker: 'PrivateClawn Research Capability Surface',
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
        buildSurfaceResult({ label: 'public root', url: 'https://aens-nine.vercel.app/', expectedMarker: 'ÆNS', body: 'ÆNS — PrivateClawn landing' }),
        buildSurfaceResult({ status: 404, body: 'not found' }),
      ],
      fallbackResult: buildSurfaceResult({
        label: 'github blob fallback',
        url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
        expectedMarker: 'PrivateClawn Research Capability Surface',
        body: 'PrivateClawn Research Capability Surface',
      }),
    }),
  )

  expect(lines).toContain('Preferred public surface ready: no (https://aens-nine.vercel.app/research-capability/)')
  expect(lines).toContain(
    'Bootstrap proof ready: yes (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)',
  )
})
