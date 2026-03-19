import { classifyCapabilityAuthorization, type CapabilityAuthorization } from './capability-authorization'
import type { LinkedRecordSummary } from './linked-records'
import { buildAensProfile, type AensResolvedProfile } from './profile'

export type AensExampleId = 'parent-authorized-capability'

export interface AensExampleScenario {
  id: AensExampleId
  title: string
  description: string
  profile: AensResolvedProfile
  parentProfile: AensResolvedProfile | null
  linkedRecords: LinkedRecordSummary[]
  capabilityAuthorization: CapabilityAuthorization
}

function buildParentAuthorizedCapabilityExample(): AensExampleScenario {
  const parentProfile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      description: 'PrivateClawn root agent identity',
      capabilities: ['research.pvtclawn.eth'],
      runtime: 'openclaw-gateway',
    },
  })

  const profile = buildAensProfile({
    ensName: 'research.pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      parentName: 'pvtclawn.eth',
      agentId: '1391',
      description: 'Research capability surface for PrivateClawn',
      serviceUrl: 'https://pvtclawn.example/research',
      runtime: 'openclaw-gateway',
    },
  })

  const capabilityAuthorization = classifyCapabilityAuthorization({
    profile,
    parentProfile,
  })

  return {
    id: 'parent-authorized-capability',
    title: 'Parent-authorized capability surface',
    description: 'Offline demo of a child capability explicitly listed by its parent ENS identity.',
    profile,
    parentProfile,
    linkedRecords: [],
    capabilityAuthorization,
  }
}

export function listExampleIds(): AensExampleId[] {
  return ['parent-authorized-capability']
}

export function getExampleScenario(exampleId: string): AensExampleScenario | null {
  switch (exampleId) {
    case 'parent-authorized-capability':
      return buildParentAuthorizedCapabilityExample()
    default:
      return null
  }
}
