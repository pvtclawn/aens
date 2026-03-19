import { expect, test } from 'bun:test'
import {
  buildCommandSection,
  buildProofCaptureHeader,
  DEFAULT_SERVICE_URLS,
  ProofCaptureConfigError,
  resolveProofCaptureConfig,
  resolveProofPublicationMode,
  resolveProofServiceUrl,
  sanitizeProofLabel,
} from './proof-capture'
import { DEFAULT_RESEARCH_CAPABILITY_URL, GITHUB_BLOB_STUB_URL } from './public-surface'

test('sanitizeProofLabel keeps safe characters and collapses spaces to dashes', () => {
  expect(sanitizeProofLabel('post root / trial')).toBe('post-root--trial')
  expect(sanitizeProofLabel('   ')).toBe('capture')
})

test('resolveProofPublicationMode defaults to bootstrap and accepts explicit modes', () => {
  expect(resolveProofPublicationMode()).toBe('bootstrap')
  expect(resolveProofPublicationMode('preferred')).toBe('preferred')
  expect(resolveProofPublicationMode('bootstrap')).toBe('bootstrap')
})

test('resolveProofPublicationMode rejects unsupported values', () => {
  expect(() => resolveProofPublicationMode('root')).toThrow(ProofCaptureConfigError)
})

test('resolveProofServiceUrl defaults by mode and accepts explicit overrides', () => {
  expect(resolveProofServiceUrl({ publicationMode: 'preferred' })).toBe(DEFAULT_RESEARCH_CAPABILITY_URL)
  expect(resolveProofServiceUrl({ publicationMode: 'bootstrap' })).toBe(GITHUB_BLOB_STUB_URL)
  expect(
    resolveProofServiceUrl({
      publicationMode: 'bootstrap',
      serviceUrl: 'https://example.com/custom-capability',
    }),
  ).toBe('https://example.com/custom-capability')
})

test('resolveProofCaptureConfig derives output path plus publication metadata', () => {
  expect(
    resolveProofCaptureConfig({
      label: 'final',
      timestamp: '2026-03-19T20-06-00Z',
      repoRoot: '/workspace/aens',
      repoCommit: 'abc123',
      publicationMode: 'preferred',
    }),
  ).toEqual({
    label: 'final',
    safeLabel: 'final',
    timestamp: '2026-03-19T20-06-00Z',
    repoRoot: '/workspace/aens',
    repoCommit: 'abc123',
    outDir: '/workspace/aens/docs/proof/live-session',
    outFile: '/workspace/aens/docs/proof/live-session/2026-03-19T20-06-00Z--final.md',
    publicationMode: 'preferred',
    serviceUrl: DEFAULT_SERVICE_URLS.preferred,
  })
})

test('buildProofCaptureHeader includes publication mode, service URL, and commit', () => {
  const header = buildProofCaptureHeader({
    label: 'baseline',
    safeLabel: 'baseline',
    timestamp: '2026-03-19T20-06-00Z',
    repoRoot: '/workspace/aens',
    repoCommit: 'abc123',
    outDir: '/workspace/aens/docs/proof/live-session',
    outFile: '/workspace/aens/docs/proof/live-session/2026-03-19T20-06-00Z--baseline.md',
    publicationMode: 'bootstrap',
    serviceUrl: GITHUB_BLOB_STUB_URL,
  })

  expect(header).toContain('- Publication mode: `bootstrap`')
  expect(header).toContain(`- Service URL: \`${GITHUB_BLOB_STUB_URL}\``)
  expect(header).toContain('- Repo commit: `abc123`')
})

test('buildCommandSection keeps exit code and command output together', () => {
  expect(
    buildCommandSection({
      title: 'bun run inspect pvtclawn.eth',
      exitCode: 2,
      output: 'partial output',
    }),
  ).toContain('- Exit code: `2`')
})
