import { expect, test } from 'bun:test'
import {
  buildAensProfile,
  hasCallableServiceSurface,
  hasDiscoverySurface,
  hasIdentityAnchor,
  hasProfileMetadata,
  hasProofSurface,
} from './profile'
import { createReportSections, renderProfileReport } from './report'

test('buildAensProfile normalizes missing fields to null and computes sharper state helpers', () => {
  const profile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: null,
    records: {
      agentId: '1391',
      serviceUrl: 'https://example.com',
    },
  })

  expect(profile.records.agentId).toBe('1391')
  expect(profile.records.proofsUrl).toBeNull()
  expect(hasIdentityAnchor(profile)).toBe(true)
  expect(hasProfileMetadata(profile)).toBe(false)
  expect(hasCallableServiceSurface(profile)).toBe(true)
  expect(hasDiscoverySurface(profile)).toBe(true)
  expect(hasProofSurface(profile)).toBe(false)
})

test('createReportSections builds semantic trust-tier sections in the right order', () => {
  const profile = buildAensProfile({
    ensName: 'vitalik.eth',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    records: {
      url: 'https://vitalik.ca',
      twitter: 'VitalikButerin',
    },
  })

  const sections = createReportSections(profile)

  expect(sections.map((section) => section.key)).toEqual([
    'identity-anchor',
    'capability-authority',
    'linked-proof-material',
    'live-observations',
    'inferred-claims',
  ])

  expect(sections[0]?.lines).toContain('Primary URL: https://vitalik.ca')
  expect(sections[0]?.lines).toContain('Profile metadata present: yes')
  expect(sections[0]?.lines).toContain('Callable service surface present: no')
  expect(sections[2]?.lines).toEqual([
    'Proof surface present: no',
    'No linked proof material declared.',
  ])
  expect(sections[3]?.lines).toEqual([
    'proofs: not-declared',
    'receipts: not-declared',
  ])
  expect(sections[4]?.lines).toEqual(['No inferred claims or caveats.'])
})

test('renderProfileReport explains why ENS is load-bearing with trust-tier sections', () => {
  const profile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      description: 'PrivateClawn agent profile',
      proofsUrl: 'https://example.com/proofs',
      receiptsUrl: 'https://example.com/receipts',
      runtime: 'openclaw-gateway',
    },
  })

  const report = renderProfileReport(profile)
  expect(report).toContain('AENS profile: pvtclawn.eth')
  expect(report).toContain('Identity anchor [anchored | ens]')
  expect(report).toContain('Capability authority [authorized | parent-ens]')
  expect(report).toContain('Linked proof material [declared | linked-doc]')
  expect(report).toContain('Proof surface present: yes')
  expect(report).toContain('Why ENS matters here:')
})

test('renderProfileReport does not let profile metadata masquerade as callable discovery', () => {
  const profile = buildAensProfile({
    ensName: 'vitalik.eth',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    records: {
      url: 'https://vitalik.ca',
      twitter: 'VitalikButerin',
    },
  })

  const report = renderProfileReport(profile)
  expect(report).toContain('Identity anchor present: yes')
  expect(report).toContain('Profile metadata present: yes')
  expect(report).toContain('Callable service surface present: no')
  expect(report).not.toContain('Discovery surface present: yes')
})
