import { expect, test } from 'bun:test'
import { getExampleScenario, listExampleIds } from './examples'
import { parseCliArgs } from './cli'
import { renderProfileReport } from './report'

test('example registry exposes contrasting capability authority demos', () => {
  expect(listExampleIds()).toEqual([
    'parent-authorized-capability',
    'unlisted-child-capability',
    'identity-mismatch-capability',
  ])

  const parentAuthorized = getExampleScenario('parent-authorized-capability')
  expect(parentAuthorized).not.toBeNull()
  expect(parentAuthorized?.capabilityAuthorization.status).toBe('parent-authorized')
  expect(parentAuthorized?.profile.ensName).toBe('research.pvtclawn.eth')
  expect(parentAuthorized?.profile.records.parentName).toBe('pvtclawn.eth')
  expect(parentAuthorized?.profile.records.serviceUrl).toBe('https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md')
  expect(parentAuthorized?.parentProfile?.records.capabilities).toEqual(['research.pvtclawn.eth'])

  const unlistedChild = getExampleScenario('unlisted-child-capability')
  expect(unlistedChild).not.toBeNull()
  expect(unlistedChild?.capabilityAuthorization.status).toBe('unlisted-child')
  expect(unlistedChild?.profile.ensName).toBe('ops.pvtclawn.eth')
  expect(unlistedChild?.capabilityAuthorization.listedByParent).toBe(false)
  expect(unlistedChild?.capabilityAuthorization.identityMatchesParent).toBe(true)
  expect(unlistedChild?.parentProfile?.records.capabilities).toEqual(['research.pvtclawn.eth'])

  const identityMismatch = getExampleScenario('identity-mismatch-capability')
  expect(identityMismatch).not.toBeNull()
  expect(identityMismatch?.capabilityAuthorization.status).toBe('identity-mismatch')
  expect(identityMismatch?.profile.ensName).toBe('trade.pvtclawn.eth')
  expect(identityMismatch?.capabilityAuthorization.listedByParent).toBe(true)
  expect(identityMismatch?.capabilityAuthorization.identityMatchesParent).toBe(false)
  expect(identityMismatch?.parentProfile?.records.capabilities).toEqual(['trade.pvtclawn.eth'])
})

test('renderProfileReport exposes contrasting capability authority states for examples', () => {
  const parentAuthorized = getExampleScenario('parent-authorized-capability')!
  const unlistedChild = getExampleScenario('unlisted-child-capability')!
  const identityMismatch = getExampleScenario('identity-mismatch-capability')!

  const parentAuthorizedReport = renderProfileReport(
    parentAuthorized.profile,
    parentAuthorized.linkedRecords,
    parentAuthorized.capabilityAuthorization,
  )
  expect(parentAuthorizedReport).toContain('Capability authorization: parent-authorized')
  expect(parentAuthorizedReport).toContain('Capability listed by parent: yes')
  expect(parentAuthorizedReport).toContain('Capability identity matches parent: yes')

  const unlistedChildReport = renderProfileReport(
    unlistedChild.profile,
    unlistedChild.linkedRecords,
    unlistedChild.capabilityAuthorization,
  )
  expect(unlistedChildReport).toContain('Capability authorization: unlisted-child')
  expect(unlistedChildReport).toContain('Capability listed by parent: no')
  expect(unlistedChildReport).toContain('Capability identity matches parent: yes')

  const identityMismatchReport = renderProfileReport(
    identityMismatch.profile,
    identityMismatch.linkedRecords,
    identityMismatch.capabilityAuthorization,
  )
  expect(identityMismatchReport).toContain('Capability authorization: identity-mismatch')
  expect(identityMismatchReport).toContain('Capability listed by parent: yes')
  expect(identityMismatchReport).toContain('Capability identity matches parent: no')
})

test('parseCliArgs parses the example mode and with-links flag', () => {
  expect(parseCliArgs(['--example', 'parent-authorized-capability', '--with-links'])).toEqual({
    ensName: null,
    withLinks: true,
    exampleId: 'parent-authorized-capability',
  })

  expect(parseCliArgs(['--example=identity-mismatch-capability'])).toEqual({
    ensName: null,
    withLinks: false,
    exampleId: 'identity-mismatch-capability',
  })
})
