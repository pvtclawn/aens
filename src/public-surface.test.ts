import { expect, test } from 'bun:test'
import { pagesSurfaceReady, summarizeSurfaceCheck, surfaceCheckPassed, type SurfaceCheckResult } from './public-surface'

function buildResult(overrides: Partial<SurfaceCheckResult> = {}): SurfaceCheckResult {
  return {
    label: 'research capability page',
    url: 'https://pvtclawn.github.io/aens/research-capability/',
    status: 200,
    expectedMarker: 'PrivateClawn Research Capability Surface',
    body: 'PrivateClawn Research Capability Surface (stub)',
    ...overrides,
  }
}

test('surfaceCheckPassed requires http 200 plus expected marker', () => {
  expect(surfaceCheckPassed(buildResult())).toBe(true)
  expect(surfaceCheckPassed(buildResult({ body: 'wrong body' }))).toBe(false)
  expect(surfaceCheckPassed(buildResult({ status: 404 }))).toBe(false)
})

test('summarizeSurfaceCheck explains success, unexpected body, and http failure', () => {
  expect(summarizeSurfaceCheck(buildResult())).toBe(
    'research capability page: ok (https://pvtclawn.github.io/aens/research-capability/)',
  )

  expect(summarizeSurfaceCheck(buildResult({ body: 'wrong body' }))).toBe(
    'research capability page: reachable but missing expected marker (https://pvtclawn.github.io/aens/research-capability/)',
  )

  expect(summarizeSurfaceCheck(buildResult({ status: 404 }))).toBe(
    'research capability page: http 404 (https://pvtclawn.github.io/aens/research-capability/)',
  )
})

test('pagesSurfaceReady requires every checked page to pass', () => {
  expect(pagesSurfaceReady([
    buildResult({ label: 'pages root', expectedMarker: 'ÆNS', body: 'ÆNS public surface' }),
    buildResult(),
  ])).toBe(true)

  expect(pagesSurfaceReady([
    buildResult({ label: 'pages root', expectedMarker: 'ÆNS' }),
    buildResult({ status: 404 }),
  ])).toBe(false)
})
