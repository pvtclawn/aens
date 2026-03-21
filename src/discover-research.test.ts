import { expect, test } from 'bun:test'
import { buildAensProfile } from './profile'
import {
  deriveDiscoverResearchResult,
  deriveResearchCapabilityName,
  parseDiscoverResearchArgs,
  renderDiscoverResearchResult,
  resolveDiscoverResearchExampleResult,
} from './discover-research'

const PARENT = 'pvtclawn.eth'
const CHILD = 'research.pvtclawn.eth'
const SERVICE_URL = 'https://aens-nine.vercel.app/research-capability/'

test('parseDiscoverResearchArgs accepts a parent name, example mode, and optional json flag', () => {
  expect(parseDiscoverResearchArgs(['pvtclawn.eth'])).toEqual({
    parentName: 'pvtclawn.eth',
    exampleId: null,
    json: false,
  })

  expect(parseDiscoverResearchArgs(['--json', 'pvtclawn.eth'])).toEqual({
    parentName: 'pvtclawn.eth',
    exampleId: null,
    json: true,
  })

  expect(parseDiscoverResearchArgs(['--example', 'parent-authorized-capability'])).toEqual({
    parentName: null,
    exampleId: 'parent-authorized-capability',
    json: false,
  })
})

test('deriveResearchCapabilityName prefers listed research capability when present', () => {
  const parentProfile = buildAensProfile({
    ensName: PARENT,
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      capabilities: [CHILD],
    },
  })

  expect(deriveResearchCapabilityName(PARENT, parentProfile)).toBe(CHILD)
  expect(deriveResearchCapabilityName(PARENT)).toBe(CHILD)
})

test('deriveDiscoverResearchResult reports an officially declared research endpoint without implying liveness', () => {
  const parentProfile = buildAensProfile({
    ensName: PARENT,
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      capabilities: [CHILD],
    },
  })
  const childProfile = buildAensProfile({
    ensName: CHILD,
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      parentName: PARENT,
      serviceUrl: SERVICE_URL,
    },
  })

  const result = deriveDiscoverResearchResult({
    parentName: PARENT,
    parent: { profile: parentProfile, error: null },
    child: { profile: childProfile, error: null },
  })

  expect(result.authorizationStatus).toBe('parent-authorized')
  expect(result.officialEndpointDeclared).toBe(true)
  expect(result.livenessChecked).toBe(false)
  expect(result.serviceUrl).toBe(SERVICE_URL)
  const rendered = renderDiscoverResearchResult(result)
  expect(rendered).toContain('Official endpoint declared: yes')
  expect(rendered).toContain(`Open or verify: ${SERVICE_URL}`)
  expect(rendered).not.toContain('Ready to use now: yes')
})

test('deriveDiscoverResearchResult keeps authorization separate from liveness and flags missing authorization', () => {
  const parentProfile = buildAensProfile({
    ensName: PARENT,
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      capabilities: [],
    },
  })
  const childProfile = buildAensProfile({
    ensName: CHILD,
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      parentName: PARENT,
      serviceUrl: SERVICE_URL,
    },
  })

  const result = deriveDiscoverResearchResult({
    parentName: PARENT,
    parent: { profile: parentProfile, error: null },
    child: { profile: childProfile, error: null },
  })

  expect(result.authorizationStatus).toBe('unlisted-child')
  expect(result.officialEndpointDeclared).toBe(false)
  expect(result.livenessChecked).toBe(false)
  expect(result.notes.some((note) => note.includes('parent identity does not currently list'))).toBe(true)
})

test('deriveDiscoverResearchResult reports missing child cleanly', () => {
  const parentProfile = buildAensProfile({
    ensName: PARENT,
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      agentId: '1391',
      capabilities: [],
    },
  })

  const result = deriveDiscoverResearchResult({
    parentName: PARENT,
    parent: { profile: parentProfile, error: null },
    child: { profile: null, error: 'name not found' },
  })

  expect(result.authorizationStatus).toBe('missing-child')
  expect(result.officialEndpointDeclared).toBe(false)
  expect(result.notes.some((note) => note.includes('research capability read failed'))).toBe(true)
})

test('resolveDiscoverResearchExampleResult exposes the exact consumer-first positive path for demos', () => {
  const result = resolveDiscoverResearchExampleResult('parent-authorized-capability')

  expect(result.parentName).toBe(PARENT)
  expect(result.researchCapabilityName).toBe(CHILD)
  expect(result.authorizationStatus).toBe('parent-authorized')
  expect(result.officialEndpointDeclared).toBe(true)
  expect(result.serviceUrl).toBe(SERVICE_URL)
})

test('resolveDiscoverResearchExampleResult supports discover-specific partial authorization fixture', () => {
  const result = resolveDiscoverResearchExampleResult('research-unlisted-child-capability')

  expect(result.parentName).toBe(PARENT)
  expect(result.researchCapabilityName).toBe('research-ops.pvtclawn.eth')
  expect(result.authorizationStatus).toBe('unlisted-child')
  expect(result.parentListsChild).toBe(false)
  expect(result.childDeclaresParent).toBe(true)
  expect(result.officialEndpointDeclared).toBe(false)
})

test('resolveDiscoverResearchExampleResult supports discover-specific missing child fixture', () => {
  const result = resolveDiscoverResearchExampleResult('research-missing-child-capability')

  expect(result.parentName).toBe(PARENT)
  expect(result.researchCapabilityName).toBe(CHILD)
  expect(result.authorizationStatus).toBe('missing-child')
  expect(result.officialEndpointDeclared).toBe(false)
  expect(result.notes.some((note) => note.includes('research capability read failed'))).toBe(true)
})
