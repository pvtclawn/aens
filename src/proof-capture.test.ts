import { expect, test } from 'bun:test'
import {
  buildCommandSection,
  buildCommitPinnedBootstrapSourceUrl,
  buildProofCaptureHeader,
  buildPublicTruthSnapshotSection,
  classifyProofServiceUrlFamily,
  DEFAULT_SERVICE_URLS,
  ProofCaptureConfigError,
  resolveProofCaptureConfig,
  resolveProofPublicationMode,
  resolveProofPublicationModeSource,
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

test('resolveProofPublicationModeSource records whether mode selection was explicit', () => {
  expect(resolveProofPublicationModeSource()).toBe('defaulted')
  expect(resolveProofPublicationModeSource('bootstrap')).toBe('explicit')
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
      serviceUrl: 'https://github.com/pvtclawn/aens/blob/abc123/docs/public/research-capability-stub.md',
    }),
  ).toBe('https://github.com/pvtclawn/aens/blob/abc123/docs/public/research-capability-stub.md')
})

test('classifyProofServiceUrlFamily classifies preferred and bootstrap URL families', () => {
  expect(classifyProofServiceUrlFamily(DEFAULT_RESEARCH_CAPABILITY_URL)).toBe('preferred')
  expect(classifyProofServiceUrlFamily(GITHUB_BLOB_STUB_URL)).toBe('bootstrap')
  expect(
    classifyProofServiceUrlFamily(
      'https://github.com/pvtclawn/aens/blob/abc123/docs/public/research-capability-stub.md',
    ),
  ).toBe('bootstrap')
  expect(classifyProofServiceUrlFamily('https://example.com/custom-capability')).toBeNull()
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
    publicationModeSource: 'explicit',
    serviceUrl: DEFAULT_SERVICE_URLS.preferred,
    serviceUrlFamily: 'preferred',
    pinnedBootstrapSourceUrl: undefined,
  })
})

test('resolveProofCaptureConfig fails closed for contradictory publication mode and service URL', () => {
  expect(() =>
    resolveProofCaptureConfig({
      label: 'broken',
      timestamp: '2026-03-19T20-06-00Z',
      repoRoot: '/workspace/aens',
      repoCommit: 'abc123',
      publicationMode: 'preferred',
      serviceUrl: GITHUB_BLOB_STUB_URL,
    }),
  ).toThrow(ProofCaptureConfigError)
})

test('resolveProofCaptureConfig adds a pinned bootstrap source reference in bootstrap mode', () => {
  expect(
    resolveProofCaptureConfig({
      label: 'bootstrap',
      timestamp: '2026-03-19T20-06-00Z',
      repoRoot: '/workspace/aens',
      repoCommit: 'abc123',
      publicationMode: 'bootstrap',
    }).pinnedBootstrapSourceUrl,
  ).toBe(buildCommitPinnedBootstrapSourceUrl('abc123'))
})

test('buildProofCaptureHeader includes publication mode, service URL, commit, and pinned bootstrap source', () => {
  const header = buildProofCaptureHeader({
    label: 'baseline',
    safeLabel: 'baseline',
    timestamp: '2026-03-19T20-06-00Z',
    repoRoot: '/workspace/aens',
    repoCommit: 'abc123',
    outDir: '/workspace/aens/docs/proof/live-session',
    outFile: '/workspace/aens/docs/proof/live-session/2026-03-19T20-06-00Z--baseline.md',
    publicationMode: 'bootstrap',
    publicationModeSource: 'defaulted',
    serviceUrl: GITHUB_BLOB_STUB_URL,
    serviceUrlFamily: 'bootstrap',
    pinnedBootstrapSourceUrl: buildCommitPinnedBootstrapSourceUrl('abc123'),
  })

  expect(header).toContain('- Publication mode: `bootstrap`')
  expect(header).toContain('- Publication mode source: `defaulted`')
  expect(header).toContain(`- Service URL: \`${GITHUB_BLOB_STUB_URL}\``)
  expect(header).toContain('- Service URL family: `bootstrap`')
  expect(header).toContain('- Repo commit: `abc123`')
  expect(header).toContain(`- Pinned bootstrap source: \`${buildCommitPinnedBootstrapSourceUrl('abc123')}\``)
})

test('buildPublicTruthSnapshotSection embeds the live verifier lines into the artifact', () => {
  const section = buildPublicTruthSnapshotSection([
    'Preferred public base: https://aens-nine.vercel.app/',
    'public root: ok (https://aens-nine.vercel.app/)',
    'Preferred public surface ready: no (https://aens-nine.vercel.app/research-capability/)',
    'Bootstrap proof ready: yes (https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md)',
  ])

  expect(section).toContain('## Public truth snapshot')
  expect(section).toContain('Bootstrap proof ready: yes')
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
