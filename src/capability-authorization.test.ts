import { expect, test } from 'bun:test'
import { classifyCapabilityAuthorization } from './capability-authorization'
import { buildAensProfile } from './profile'
import { renderProfileReport } from './report'

test('classifyCapabilityAuthorization detects a parent-authorized capability surface', () => {
  const parentProfile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      capabilities: ['research.pvtclawn.eth'],
    },
  })

  const childProfile = buildAensProfile({
    ensName: 'research.pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      parentName: 'pvtclawn.eth',
      agentId: '1391',
    },
  })

  const authorization = classifyCapabilityAuthorization({
    profile: childProfile,
    parentProfile,
  })

  expect(authorization.status).toBe('parent-authorized')
  expect(authorization.listedByParent).toBe(true)
  expect(authorization.identityMatchesParent).toBe(true)
})

test('classifyCapabilityAuthorization detects an unlisted child capability', () => {
  const parentProfile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      capabilities: ['summarize.pvtclawn.eth'],
    },
  })

  const childProfile = buildAensProfile({
    ensName: 'research.pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      parentName: 'pvtclawn.eth',
      agentId: '1391',
    },
  })

  expect(classifyCapabilityAuthorization({
    profile: childProfile,
    parentProfile,
  }).status).toBe('unlisted-child')
})

test('classifyCapabilityAuthorization detects an identity mismatch', () => {
  const parentProfile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      capabilities: ['research.pvtclawn.eth'],
    },
  })

  const childProfile = buildAensProfile({
    ensName: 'research.pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      parentName: 'pvtclawn.eth',
      agentId: '9999',
    },
  })

  expect(classifyCapabilityAuthorization({
    profile: childProfile,
    parentProfile,
  }).status).toBe('identity-mismatch')
})

test('classifyCapabilityAuthorization detects profiles that are not capability surfaces', () => {
  const profile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
    },
  })

  expect(classifyCapabilityAuthorization({
    profile,
  }).status).toBe('not-a-capability-surface')
})

test('renderProfileReport includes capability-authorization status', () => {
  const parentProfile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      capabilities: ['research.pvtclawn.eth'],
    },
  })

  const childProfile = buildAensProfile({
    ensName: 'research.pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      parentName: 'pvtclawn.eth',
      agentId: '1391',
    },
  })

  const authorization = classifyCapabilityAuthorization({
    profile: childProfile,
    parentProfile,
  })

  const report = renderProfileReport(childProfile, [], authorization)
  expect(report).toContain('Capability authorization: parent-authorized')
  expect(report).toContain('Capability listed by parent: yes')
})
