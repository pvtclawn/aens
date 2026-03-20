import { expect, test } from 'bun:test'
import { classifyCapabilityAuthorization } from './capability-authorization'
import { buildAensProfile, type AensResolvedProfile } from './profile'
import {
  classifyProofArtifactBody,
  DEFAULT_PUBLISH_CHILD_NAME,
  DEFAULT_PUBLISH_ROOT_NAME,
  derivePublishAssistResult,
  parsePublishAssistArgs,
  renderPublishAssistResult,
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
    repoCommit: 'commit-123',
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
    proofArtifactCandidatePaths: [],
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

function buildProofArtifactBody(input: {
  label: string
  publicationMode?: string
  serviceUrl?: string
  repoCommit?: string
  childName?: string
  capabilityAuthorization?: string
}): string {
  return [
    `# ÆNS live proof capture — ${input.label}`,
    '',
    '- Captured: `2026-03-20T17-00-00Z`',
    `- Publication mode: \`${input.publicationMode ?? 'preferred'}\``,
    '- Publication mode source: `explicit`',
    `- Service URL: \`${input.serviceUrl ?? DEFAULT_RESEARCH_CAPABILITY_URL}\``,
    '- Service URL family: `preferred`',
    `- Repo commit: \`${input.repoCommit ?? 'commit-123'}\``,
    '- Working directory: `/tmp/aens`',
    '',
    '## Public truth snapshot',
    '',
    '```text',
    'Preferred public surface ready: yes',
    'Bootstrap proof ready: no',
    '```',
    '',
    `## bun run inspect ${input.childName ?? DEFAULT_PUBLISH_CHILD_NAME}`,
    '',
    '- Exit code: `0`',
    '',
    '```text',
    `ENS name: ${input.childName ?? DEFAULT_PUBLISH_CHILD_NAME}`,
    `Capability authorization: ${input.capabilityAuthorization ?? 'parent-authorized'}`,
    '```',
    '',
  ].join('\n')
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

test('classifyProofArtifactBody requires a strong final-proof artifact contract', () => {
  const strongMatch = classifyProofArtifactBody({
    body: buildProofArtifactBody({
      label: 'final',
    }),
    childName: DEFAULT_PUBLISH_CHILD_NAME,
    expectedServiceUrl: DEFAULT_RESEARCH_CAPABILITY_URL,
    repoCommit: 'commit-123',
  })
  expect(strongMatch).toBe('strong-final-match')

  const weakMatch = classifyProofArtifactBody({
    body: buildProofArtifactBody({
      label: 'post-root',
    }),
    childName: DEFAULT_PUBLISH_CHILD_NAME,
    expectedServiceUrl: DEFAULT_RESEARCH_CAPABILITY_URL,
    repoCommit: 'commit-123',
  })
  expect(weakMatch).toBe('advisory-candidate')

  const staleMatch = classifyProofArtifactBody({
    body: buildProofArtifactBody({
      label: 'final',
      repoCommit: 'old-commit',
    }),
    childName: DEFAULT_PUBLISH_CHILD_NAME,
    expectedServiceUrl: DEFAULT_RESEARCH_CAPABILITY_URL,
    repoCommit: 'commit-123',
  })
  expect(staleMatch).toBe('advisory-candidate')
})

test('derivePublishAssistResult keeps weak proof artifacts advisory-only', () => {
  const rootProfile = buildReadyRootProfile({
    capabilities: [DEFAULT_PUBLISH_CHILD_NAME],
  })
  const childProfile = buildReadyChildProfile()
  const capabilityAuthorization = classifyCapabilityAuthorization({
    profile: childProfile,
    parentProfile: rootProfile,
  })

  const noArtifactYet = derivePublishAssistResult(
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
  expect(noArtifactYet.state).toBe('parent-authorized-verified')

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
      proofArtifactCandidatePaths: ['/tmp/proof/post-root.md'],
    }),
  )

  expect(parentAuthorized.state).toBe('parent-authorized-verified')
  expect(parentAuthorized.evidenceLines.some((line) => line.includes('/tmp/proof/post-root.md'))).toBe(true)

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
      proofArtifactCandidatePaths: ['/tmp/proof/post-root.md'],
    }),
  )

  expect(proofCaptured.state).toBe('proof-captured')
  expect(proofCaptured.evidenceLines.some((line) => line.includes('/tmp/proof/final.md'))).toBe(true)
})

test('renderPublishAssistResult keeps write-oriented guidance bounded and tied to human review', () => {
  const result = derivePublishAssistResult(buildSnapshot())
  const rendered = renderPublishAssistResult(result)

  expect(rendered).toContain('Phase-boundary guidance:')
  expect(rendered).toContain('Use this after verification and before the next write.')
  expect(rendered).toContain('not a replacement for the runbook')
  expect(rendered).toContain('FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md')
  expect(rendered).toContain('Human review required before write (guidance only — this tool does not approve wallet prompts):')
})

test('renderPublishAssistResult does not add pre-write guidance to non-write states', () => {
  const rootProfile = buildReadyRootProfile({
    capabilities: [DEFAULT_PUBLISH_CHILD_NAME],
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

  const rendered = renderPublishAssistResult(result)
  expect(result.state).toBe('parent-authorized-verified')
  expect(rendered).not.toContain('Phase-boundary guidance:')
  expect(rendered).not.toContain('Human review required before write (guidance only — this tool does not approve wallet prompts):')
})
