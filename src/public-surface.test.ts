import { expect, test } from 'bun:test'
import {
  buildPreferredSurfaceTargets,
  preferredSurfaceReady,
  resolvePreferredPublicBaseUrl,
  summarizeSurfaceCheck,
  surfaceCheckPassed,
  type SurfaceCheckResult,
} from './public-surface'

function buildResult(overrides: Partial<SurfaceCheckResult> = {}): SurfaceCheckResult {
  return {
    label: 'research capability page',
    url: 'https://aens-nine.vercel.app/research-capability/',
    status: 200,
    expectedMarker: 'PrivateClawn Research Capability',
    body: 'PrivateClawn Research Capability',
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

test('buildPreferredSurfaceTargets derives root, research-capability, and discovery URLs from the preferred base', () => {
  expect(buildPreferredSurfaceTargets('https://aens-nine.vercel.app')).toEqual([
    {
      label: 'public root',
      url: 'https://aens-nine.vercel.app/',
      expectedMarker: 'ÆNS — PrivateClawn landing',
    },
    {
      label: 'research capability page',
      url: 'https://aens-nine.vercel.app/research-capability/',
      expectedMarker: 'PrivateClawn Research Capability',
    },
    {
      label: 'discover research page',
      url: 'https://aens-nine.vercel.app/discover-research/',
      expectedMarker: 'Discover the official research capability for an ENS identity',
    },
  ])
})

test('surfaceCheckPassed requires http 200 plus expected marker', () => {
  expect(surfaceCheckPassed(buildResult())).toBe(true)
  expect(surfaceCheckPassed(buildResult({ body: 'wrong body' }))).toBe(false)
  expect(surfaceCheckPassed(buildResult({ status: 404 }))).toBe(false)
})

test('summarizeSurfaceCheck explains success, unexpected body, and http failure', () => {
  expect(summarizeSurfaceCheck(buildResult())).toBe(
    'research capability page: ok (https://aens-nine.vercel.app/research-capability/)',
  )

  expect(summarizeSurfaceCheck(buildResult({ body: 'wrong body' }))).toBe(
    'research capability page: reachable but missing expected marker (https://aens-nine.vercel.app/research-capability/)',
  )

  expect(summarizeSurfaceCheck(buildResult({ status: 404 }))).toBe(
    'research capability page: http 404 (https://aens-nine.vercel.app/research-capability/)',
  )
})

test('preferredSurfaceReady requires every checked preferred page to pass', () => {
  expect(preferredSurfaceReady([
    buildResult({ label: 'public root', url: 'https://aens-nine.vercel.app/', expectedMarker: 'ÆNS', body: 'ÆNS public surface' }),
    buildResult(),
    buildResult({
      label: 'discover research page',
      url: 'https://aens-nine.vercel.app/discover-research/',
      expectedMarker: 'Discover the official research capability for an ENS identity',
      body: 'Discover the official research capability for an ENS identity',
    }),
  ])).toBe(true)

  expect(preferredSurfaceReady([
    buildResult({ label: 'public root', url: 'https://aens-nine.vercel.app/', expectedMarker: 'ÆNS' }),
    buildResult({ status: 404 }),
    buildResult({
      label: 'discover research page',
      url: 'https://aens-nine.vercel.app/discover-research/',
      expectedMarker: 'Discover the official research capability for an ENS identity',
      body: 'Discover the official research capability for an ENS identity',
    }),
  ])).toBe(false)
})
