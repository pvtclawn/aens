import { classifyCapabilityAuthorization, type CapabilityAuthorization } from './capability-authorization'
import type { LinkedRecordSummary } from './linked-records'
import { buildAensProfile, type AensResolvedProfile } from './profile'

const DEMO_ADDRESS = '0x000000000000000000000000000000000000dEaD'
const PARENT_NAME = 'pvtclawn.eth'
const DEFAULT_AGENT_ID = '1391'
const DEFAULT_RUNTIME = 'openclaw-gateway'
const PUBLIC_RESEARCH_CAPABILITY_STUB_URL = 'https://pvtclawn.github.io/aens/research-capability/'

export type AensExampleId =
  | 'parent-authorized-capability'
  | 'unlisted-child-capability'
  | 'identity-mismatch-capability'

export interface AensExampleScenario {
  id: AensExampleId
  title: string
  description: string
  profile: AensResolvedProfile
  parentProfile: AensResolvedProfile | null
  linkedRecords: LinkedRecordSummary[]
  capabilityAuthorization: CapabilityAuthorization
}

function buildParentProfile(input: {
  capabilities: string[]
  agentId?: string
}): AensResolvedProfile {
  return buildAensProfile({
    ensName: PARENT_NAME,
    address: DEMO_ADDRESS,
    records: {
      agentId: input.agentId ?? DEFAULT_AGENT_ID,
      description: 'PrivateClawn root agent identity',
      capabilities: input.capabilities,
      runtime: DEFAULT_RUNTIME,
    },
  })
}

function buildCapabilityProfile(input: {
  ensName: string
  description: string
  serviceUrl: string
  agentId?: string
  parentName?: string
}): AensResolvedProfile {
  return buildAensProfile({
    ensName: input.ensName,
    address: DEMO_ADDRESS,
    records: {
      parentName: input.parentName ?? PARENT_NAME,
      agentId: input.agentId ?? DEFAULT_AGENT_ID,
      description: input.description,
      serviceUrl: input.serviceUrl,
      runtime: DEFAULT_RUNTIME,
    },
  })
}

function buildCapabilityExampleScenario(input: {
  id: AensExampleId
  title: string
  description: string
  childName: string
  childDescription: string
  childServiceUrl: string
  parentCapabilities: string[]
  parentAgentId?: string
  childAgentId?: string
}): AensExampleScenario {
  const parentProfile = buildParentProfile({
    capabilities: input.parentCapabilities,
    agentId: input.parentAgentId,
  })

  const profile = buildCapabilityProfile({
    ensName: input.childName,
    description: input.childDescription,
    serviceUrl: input.childServiceUrl,
    agentId: input.childAgentId,
  })

  const capabilityAuthorization = classifyCapabilityAuthorization({
    profile,
    parentProfile,
  })

  return {
    id: input.id,
    title: input.title,
    description: input.description,
    profile,
    parentProfile,
    linkedRecords: [],
    capabilityAuthorization,
  }
}

function buildParentAuthorizedCapabilityExample(): AensExampleScenario {
  return buildCapabilityExampleScenario({
    id: 'parent-authorized-capability',
    title: 'Parent-authorized capability surface',
    description: 'Offline demo of a child capability explicitly listed by its parent ENS identity.',
    childName: 'research.pvtclawn.eth',
    childDescription: 'Research capability surface for PrivateClawn',
    childServiceUrl: PUBLIC_RESEARCH_CAPABILITY_STUB_URL,
    parentCapabilities: ['research.pvtclawn.eth'],
  })
}

function buildUnlistedChildCapabilityExample(): AensExampleScenario {
  return buildCapabilityExampleScenario({
    id: 'unlisted-child-capability',
    title: 'Unlisted child capability surface',
    description: 'Offline demo of a child capability that matches parent identity but is not listed by the parent profile.',
    childName: 'ops.pvtclawn.eth',
    childDescription: 'Ops capability surface for PrivateClawn',
    childServiceUrl: 'https://pvtclawn.example/ops',
    parentCapabilities: ['research.pvtclawn.eth'],
  })
}

function buildIdentityMismatchCapabilityExample(): AensExampleScenario {
  return buildCapabilityExampleScenario({
    id: 'identity-mismatch-capability',
    title: 'Identity-mismatch capability surface',
    description: 'Offline demo of a listed child capability whose declared agent identity does not match the parent profile.',
    childName: 'trade.pvtclawn.eth',
    childDescription: 'Trade capability surface for PrivateClawn',
    childServiceUrl: 'https://pvtclawn.example/trade',
    parentCapabilities: ['trade.pvtclawn.eth'],
    childAgentId: '9999',
  })
}

export function listExampleIds(): AensExampleId[] {
  return [
    'parent-authorized-capability',
    'unlisted-child-capability',
    'identity-mismatch-capability',
  ]
}

export function getExampleScenario(exampleId: string): AensExampleScenario | null {
  switch (exampleId) {
    case 'parent-authorized-capability':
      return buildParentAuthorizedCapabilityExample()
    case 'unlisted-child-capability':
      return buildUnlistedChildCapabilityExample()
    case 'identity-mismatch-capability':
      return buildIdentityMismatchCapabilityExample()
    default:
      return null
  }
}
