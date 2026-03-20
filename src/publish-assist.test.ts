import { expect, test } from 'bun:test'
import { classifyCapabilityAuthorization } from './capability-authorization'
import { buildAensProfile, type AensResolvedProfile } from './profile'
import {
  DEFAULT_PUBLISH_CHILD_NAME,
  DEFAULT_PUBLISH_ROOT_NAME,
  derivePublishAssistResult,
  parsePublishAssistArgs,
  type PublishAssistSnapshot,
} from './publish-assist'
import type { PublicProofState } from './public-proof-state'
import { DEFAULT_RESEARCH_CAPABILITY_URL } from './public-surface'

function buildPublicProofState(input: {
  preferredSurfaceReady: boolean
  bootstrapProofReady: boolean
}): PublicProofState {
  return {
    preferredBaseUrl: 'https://aens-nine.vercel.app/',
    preferredResearchUrl: DEFAULT_RESEARCH_CAPABILITY_URL,
    preferredSurfaceReady: input.preferredSurfaceReady,
    bootstrapProofReady: input.bootstrapProofReady,
    preferredResults: [
      {
        label: 'public root',
        url: 'https://aens-nine.vercel.app/',
        status: 200,
        expectedMarker: 'ÆNS — PrivateClawn landing',
        body: 'ÆNS — PrivateClawn landing',
      },
      {
        label: 'research capability page',
        url: DEFAULT_RESEARCH_CAPABILITY_URL,
        status: input.preferredSurfaceReady ? 200 : 404,
        expectedMarker: 'PrivateClawn Research Capability',
        body: input.preferredSurfaceReady
          ? 'PrivateClawn Research Capability'
          : 'not found',
      },
    ],
    fallbackResult: {
      label: 'github blob fallback',
      url: 'https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md',
      status: input.bootstrapProofReady ? 200 : 404,
      expectedMarker: 'PrivateClawn Research Capability Surface',
      body: input.bootstrapProofReady
        ? 'PrivateClawn Research Capability Surface'
        : 'not found',
    },
  }
}

function buildSnapshot(overrides: Partial<PublishAssistSnapshot> = {}): PublishAssistSnapshot {
  return {
    rootName: DEFAULT_PUBLISH_ROOT_NAME,
    childName: DEFAULT_PUBLISH_CHILD_NAME,
    expectedServiceUrl: DEFAULT_RESEARCH_CAPABILITY_URL,
    proofDir: '/tmp/proof',
    root: {
      profile: null,
      error: null,
    },
    child: {
      profile: null,
      error: null,
    },
    publicProofState: buildPublicProofState({
      preferredSurfaceReady: true,
      bootstrapProofReady: false,
    }),
    publicProofStateError: null,
    capabilityAuthorization: null,
    proofArtifactPaths: [],
    ...overrides,
  }
}

function buildReadyRootProfile(input: { capabilities?: string[] } = {}): AensResolvedProfile {
  return buildAensProfile({
    ensName: DEFAULT_PUBLISH_ROOT_NAME,
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      description: 'root profile',
      agentId: '1391',
      runtime: 'openclaw-gateway',
      capabilities: input.capabilities ?? [],
    },
  })
}

function buildReadyChildProfile(): AensResolvedProfile {
  return buildAensProfile({
    ensName: DEFAULT_PUBLISH_CHILD_NAME,
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      description: 'child profile',
      parentName: DEFAULT_PUBLISH_ROOT_NAME,
      agentId: '1391',
      runtime: 'openclaw-gateway',
      serviceUrl: DEFAULT_RESEARCH_CAPABILITY_URL,
    },
  })
}

test('parsePublishAssistArgs defaults to the expected root and child names', () => {
  expect(parsePublishAssistArgs([])).toEqual({
    rootName: DEFAULT_PUBLISH_ROOT_NAME,
    childName: DEFAULT_PUBLISH_CHILD_NAME,
    proofDir: undefined,
  })
})

test('parsePublishAssistArgs accepts explicit names and proof dir', () => {
  expect(
    parsePublishAssistArgs([
      '--root-name',
      'base.eth',
      '--child-name',
      'research.base.eth',
      '--proof-dir',
      'docs/proof/live-session',
    ]),
  ).toEqual({
    rootName: 'base.eth',
    childName: 'research.base.eth',
    proofDir: 'docs/proof/live-session',
  })
})

test('derivePublishAssistResult reports preflight-ready when no publish progress exists', () => {
  const result = derivePublishAssistResult(buildSnapshot())

  expect(result.state).toBe('preflight-ready')
  expect(result.nextLegalStep).toContain(`Write the root resolver + root publish records for ${DEFAULT_PUBLISH_ROOT_NAME}`)
  expect(result.humanReviewRequired.length).toBeGreaterThan(0)
  expect(result.followUpVerificationCommands).toContain(`bun run inspect ${DEFAULT_PUBLISH_ROOT_NAME}`)
})

test('derivePublishAssistResult reports needs-operator-reconcile when preferred surface is not ready', () => {
  const result = derivePublishAssistResult(
    buildSnapshot({
      publicProofState: buildPublicProofState({
        preferredSurfaceReady: false,
        bootstrapProofReady: true,
      }),
    }),
  )

  expect(result.state).toBe('needs-operator-reconcile')
  expect(result.evidenceLines.some((line) => line.includes('Reconcile reason: preferred public surface is not ready'))).toBe(true)
})

test('derivePublishAssistResult reports needs-parent-authorization when child is verified but unlisted', () => {
  const rootProfile = buildReadyRootProfile({
    capabilities: ['ops.pvtclawn.eth'],
  })
  const childProfile = buildReadyChildProfile()
  const capabilityAuthorization = classifyCapabilityAuthorization({
    profile: childProfile,
    parentProfile: rootProfile,
  })

  const result = derivePublishAssistResult(
    buildSnapshot({
      root: {
        profile: rootProfile,
        error: null,
      },
      child: {
        profile: childProfile,
        error: null,
      },
      capabilityAuthorization,
    }),
  )

  expect(capabilityAuthorization.status).toBe('unlisted-child')
  expect(result.state).toBe('needs-parent-authorization')
  expect(result.nextLegalStep).toContain('Write the parent capability authorization')
})

test('derivePublishAssistResult reports parent-authorized-verified and proof-captured correctly', () => {
  const rootProfile = buildReadyRootProfile({
    capabilities: [DEFAULT_PUBLISH_CHILD_NAME],
  })
  const childProfile = buildReadyChildProfile()
  const capabilityAuthorization = classifyCapabilityAuthorization({
    profile: childProfile,
    parentProfile: rootProfile,
  })

  const parentAuthorized = derivePublishAssistResult(
    buildSnapshot({
      root: {
        profile: rootProfile,
        error: null,
      },
      child: {
        profile: childProfile,
        error: null,
      },
      capabilityAuthorization,
    }),
  )

  expect(capabilityAuthorization.status).toBe('parent-authorized')
  expect(parentAuthorized.state).toBe('parent-authorized-verified')

  const proofCaptured = derivePublishAssistResult(
    buildSnapshot({
      root: {
        profile: rootProfile,
        error: null,
      },
      child: {
        profile: childProfile,
        error: null,
      },
      capabilityAuthorization,
      proofArtifactPaths: ['/tmp/proof/final.md'],
    }),
  )

  expect(proofCaptured.state).toBe('proof-captured')
  expect(proofCaptured.evidenceLines.some((line) => line.includes('/tmp/proof/final.md'))).toBe(true)
})
