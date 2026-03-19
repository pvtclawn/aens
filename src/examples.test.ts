import { expect, test } from 'bun:test'
import { getExampleScenario, listExampleIds } from './examples'
import { parseCliArgs } from './cli'
import { renderProfileReport } from './report'

test('example registry exposes the parent-authorized capability demo', () => {
  expect(listExampleIds()).toContain('parent-authorized-capability')

  const example = getExampleScenario('parent-authorized-capability')
  expect(example).not.toBeNull()
  expect(example?.capabilityAuthorization.status).toBe('parent-authorized')
  expect(example?.profile.ensName).toBe('research.pvtclawn.eth')
  expect(example?.profile.records.parentName).toBe('pvtclawn.eth')
  expect(example?.profile.records.serviceUrl).toBe('https://pvtclawn.example/research')
  expect(example?.parentProfile?.records.capabilities).toEqual(['research.pvtclawn.eth'])

  const report = renderProfileReport(
    example!.profile,
    example!.linkedRecords,
    example!.capabilityAuthorization,
  )
  expect(report).toContain('Capability authorization: parent-authorized')
  expect(report).toContain('Callable service surface present: yes')
  expect(report).toContain('Capability authority [authorized | parent-ens]')
})

test('parseCliArgs parses the example mode and with-links flag', () => {
  expect(parseCliArgs(['--example', 'parent-authorized-capability', '--with-links'])).toEqual({
    ensName: null,
    withLinks: true,
    exampleId: 'parent-authorized-capability',
  })

  expect(parseCliArgs(['--example=parent-authorized-capability'])).toEqual({
    ensName: null,
    withLinks: false,
    exampleId: 'parent-authorized-capability',
  })
})
