import { expect, test } from 'bun:test'
import { buildAensProfile, hasDiscoverySurface, hasProofSurface } from './profile'
import { renderProfileReport } from './report'

test('buildAensProfile normalizes missing fields to null', () => {
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
  expect(hasDiscoverySurface(profile)).toBe(true)
  expect(hasProofSurface(profile)).toBe(false)
})

test('renderProfileReport explains why ENS is load-bearing', () => {
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
  expect(report).toContain('Proof surface present: yes')
  expect(report).toContain('Why ENS matters here:')
})
