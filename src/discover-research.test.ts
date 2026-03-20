import { expect, test } from 'bun:test'
import { buildAensProfile } from './profile'
import {
  deriveDiscoverResearchResult,
  deriveResearchCapabilityName,
  parseDiscoverResearchArgs,
  renderDiscoverResearchResult,
} from './discover-research'

const PARENT = 'pvtclawn.eth'
const CHILD = 'research.pvtclawn.eth'
const SERVICE_URL = 'https://aens-nine.vercel.app/research-capability/'

test('parseDiscoverResearchArgs accepts a parent name and optional json flag', () => {
  expect(parseDiscoverResearchArgs(['pvtclawn.eth'])).toEqual({
    parentName: 'pvtclawn.eth',
    json: false,
  })

  expect(parseDiscoverResearchArgs(['--json', 'pvtclawn.eth'])).toEqual({
    parentName: 'pvtclawn.eth',
    json: true,
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

test('deriveDiscoverResearchResult reports a ready-to-use official research endpoint', () => {
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
  expect(result.readyToUse).toBe(true)
  expect(result.serviceUrl).toBe(SERVICE_URL)
  expect(renderDiscoverResearchResult(result)).toContain(`Open or use: ${SERVICE_URL}`)
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
  expect(result.readyToUse).toBe(false)
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
  expect(result.readyToUse).toBe(false)
  expect(result.notes.some((note) => note.includes('research capability read failed'))).toBe(true)
})
