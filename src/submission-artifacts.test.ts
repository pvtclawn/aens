import { expect, test } from 'bun:test'
import type { DiscoverResearchResult } from './discover-research'
import { type PublicProofState } from './public-proof-state'
import {
  buildDiscoverResearchArtifact,
  buildDiscoverResearchArtifactSurfaceCheck,
  DISCOVER_RESEARCH_ARTIFACT_KIND,
  DISCOVER_RESEARCH_ARTIFACT_SCHEMA_VERSION,
} from './submission-artifacts'
import { SURFACE_FAILURE_CLASS_SUMMARY_CUES } from './public-surface'

const RESULT: DiscoverResearchResult = {
  parentName: 'pvtclawn.eth',
  researchCapabilityName: 'research.pvtclawn.eth',
  authorizationStatus: 'parent-authorized',
  authorizationSummary: 'capability is explicitly listed by the parent profile and matches parent identity',
  parentListsChild: true,
  childDeclaresParent: true,
  serviceUrl: 'https://aens-nine.vercel.app/research-capability/',
  officialEndpointDeclared: true,
  livenessChecked: false,
  notes: ['official research endpoint is declared under parent authorization, but liveness still needs to be checked separately if required'],
}

const PUBLIC_PROOF_STATE: PublicProofState = {
  preferredBaseUrl: 'https://aens-nine.vercel.app/',
  preferredResearchUrl: 'https://aens-nine.vercel.app/research-capability/',
  preferredSurfaceReady: false,
  bootstrapProofReady: true,
  preferredResults: [
    {
      label: 'public root',
      url: 'https://aens-nine.vercel.app/',
      status: 200,
      expectedMarker: 'ÆNS — ENS root explorer',
      matchMode: 'exact',
      body: 'ÆNS — ENS root explorer',
    },
    {
      label: 'research capability page',
      url: 'https://aens-nine.vercel.app/research-capability/',
      status: 200,
      expectedMarker: 'Research Capability — ÆNS',
      matchMode: 'exact',
      body: 'Research Capability — ÆNS',
    },
    {
      label: 'discover research page',
      url: 'https://aens-nine.vercel.app/discover-research/',
      status: 404,
      expectedMarker: 'Discover the official research capability for an ENS identity',
      matchMode: 'exact',
      body: 'not found',
    },
  ],
  fallbackResult: {
    label: 'github blob fallback',
    url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
    status: 200,
    expectedMarker: 'PrivateClawn Research Capability Surface',
    matchMode: 'exact',
    body: 'PrivateClawn Research Capability Surface',
  },
}

test('buildDiscoverResearchArtifactSurfaceCheck keeps status and adds machine-readable pass/summary fields', () => {
  expect(buildDiscoverResearchArtifactSurfaceCheck(PUBLIC_PROOF_STATE.preferredResults[0]!)).toEqual({
    label: 'public root',
    url: 'https://aens-nine.vercel.app/',
    status: 200,
    expectedMarker: 'ÆNS — ENS root explorer',
    failureClass: null,
    passed: true,
    summary: 'public root: ok (https://aens-nine.vercel.app/)',
  })
})

test('buildDiscoverResearchArtifact wraps the current result without changing its inner contract', () => {
  const artifact = buildDiscoverResearchArtifact({
    sourceMode: 'example',
    exampleId: 'parent-authorized-capability',
    generatedAt: '2026-03-21T01:02:00.000Z',
    gitCommit: 'abc123',
    command: 'bun run discover-research -- --example parent-authorized-capability --json',
    publicProofState: PUBLIC_PROOF_STATE,
    result: RESULT,
  })

  expect(artifact.schemaVersion).toBe(DISCOVER_RESEARCH_ARTIFACT_SCHEMA_VERSION)
  expect(artifact.artifactKind).toBe(DISCOVER_RESEARCH_ARTIFACT_KIND)
  expect(artifact.sourceMode).toBe('example')
  expect(artifact.exampleId).toBe('parent-authorized-capability')
  expect(artifact.generatedAt).toBe('2026-03-21T01:02:00.000Z')
  expect(artifact.gitCommit).toBe('abc123')
  expect(artifact.command).toBe('bun run discover-research -- --example parent-authorized-capability --json')
  expect(artifact.publicSurface.preferredPublicBaseUrl).toBe('https://aens-nine.vercel.app/')
  expect(artifact.publicSurface.preferredSurfaceReady).toBe(false)
  expect(artifact.publicSurface.bootstrapProofReady).toBe(true)
  expect(artifact.publicSurface.preferredResults[2]).toEqual({
    label: 'discover research page',
    url: 'https://aens-nine.vercel.app/discover-research/',
    status: 404,
    expectedMarker: 'Discover the official research capability for an ENS identity',
    failureClass: 'http-failure',
    passed: false,
    summary: 'discover research page: http-failure (http failure) (https://aens-nine.vercel.app/discover-research/)',
  })
  expect(artifact.result).toEqual(RESULT)
})

test('artifact failure class token and summary text stay in shared-template parity', () => {
  const failedCheck = buildDiscoverResearchArtifactSurfaceCheck(PUBLIC_PROOF_STATE.preferredResults[2]!)

  expect(failedCheck.failureClass).toBe('http-failure')
  expect(failedCheck.summary.includes('http')).toBe(true)

  const cue = SURFACE_FAILURE_CLASS_SUMMARY_CUES[failedCheck.failureClass!]
  expect(cue).toBe('http failure')
})
