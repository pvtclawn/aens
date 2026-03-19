import type { AensResolvedProfile } from './profile'

export type CapabilityAuthorizationStatus =
  | 'parent-authorized'
  | 'unlisted-child'
  | 'identity-mismatch'
  | 'not-a-capability-surface'

export interface CapabilityAuthorization {
  status: CapabilityAuthorizationStatus
  parentName: string | null
  childName: string
  listedByParent: boolean
  identityMatchesParent: boolean
  summary: string
}

function normalizeEnsName(name: string): string {
  return name.trim().toLowerCase()
}

function isDirectChildName(childName: string, parentName: string): boolean {
  const childParts = normalizeEnsName(childName).split('.')
  const parentParts = normalizeEnsName(parentName).split('.')

  if (childParts.length !== parentParts.length + 1) {
    return false
  }

  return childParts.slice(1).join('.') === parentParts.join('.')
}

export function classifyCapabilityAuthorization(input: {
  profile: AensResolvedProfile
  parentProfile?: AensResolvedProfile | null
}): CapabilityAuthorization {
  const parentName = input.profile.records.parentName
  if (!parentName) {
    return {
      status: 'not-a-capability-surface',
      parentName: null,
      childName: input.profile.ensName,
      listedByParent: false,
      identityMatchesParent: false,
      summary: 'profile does not declare a parent-authorized capability surface',
    }
  }

  const isDirectChild = isDirectChildName(input.profile.ensName, parentName)
  const parentProfileMatches = input.parentProfile
    ? normalizeEnsName(input.parentProfile.ensName) === normalizeEnsName(parentName)
    : false

  const listedByParent = input.parentProfile?.records.capabilities?.some((capabilityName) => (
    normalizeEnsName(capabilityName) === normalizeEnsName(input.profile.ensName)
  )) ?? false

  const identityMatchesParent = Boolean(
    input.parentProfile?.records.agentId
      && input.profile.records.agentId
      && input.parentProfile.records.agentId === input.profile.records.agentId,
  )

  if (!isDirectChild || !parentProfileMatches || !identityMatchesParent) {
    return {
      status: 'identity-mismatch',
      parentName,
      childName: input.profile.ensName,
      listedByParent,
      identityMatchesParent,
      summary: 'capability parent or agent identity does not match the declared parent authority',
    }
  }

  if (!listedByParent) {
    return {
      status: 'unlisted-child',
      parentName,
      childName: input.profile.ensName,
      listedByParent: false,
      identityMatchesParent: true,
      summary: 'capability matches the declared parent identity but is not listed by the parent profile',
    }
  }

  return {
    status: 'parent-authorized',
    parentName,
    childName: input.profile.ensName,
    listedByParent: true,
    identityMatchesParent: true,
    summary: 'capability is explicitly listed by the parent profile and matches parent identity',
  }
}
