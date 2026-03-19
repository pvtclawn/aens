import { expect, test } from 'bun:test'
import { buildAensProfile } from './profile'
import { fetchLinkedRecords } from './linked-records'
import { renderProfileReport } from './report'

test('fetchLinkedRecords summarizes linked proof and receipt JSON documents', async () => {
  const profile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      proofsUrl: 'https://example.com/proofs.json',
      receiptsUrl: 'https://example.com/receipts.json',
    },
  })

  const linked = await fetchLinkedRecords(profile, async (url) => ({
    ok: true,
    status: 200,
    text: async () => {
      if (url.includes('proofs')) {
        return JSON.stringify({ proofs: [{ id: 'p1' }, { id: 'p2' }] })
      }
      return JSON.stringify({
        receiptHash: '0xabc',
        signature: '0xsig',
        payload: {
          agentId: '1391',
          operator: '0x000000000000000000000000000000000000dEaD',
          sessionId: 'clawttack:battle:123:turn:7',
          authorityHash: '0xauth',
          artifactRoot: '0xart',
        },
      })
    },
  }))

  expect(linked).toHaveLength(2)
  expect(linked[0]?.kind).toBe('proofs')
  expect(linked[0]?.validJson).toBe(true)
  expect(linked[0]?.shape).toBe('proof-list')
  expect(linked[1]?.kind).toBe('receipts')
  expect(linked[1]?.shape).toBe('battle-receipt')
  expect(linked[1]?.proofStrength).toBe('signed-receipt')
  expect(linked[1]?.coreFieldsMissing).toHaveLength(0)
})

test('renderProfileReport includes stronger proof summaries when receipt-like docs are present', () => {
  const profile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      proofsUrl: 'https://example.com/proofs.json',
    },
  })

  const report = renderProfileReport(profile, [
    {
      kind: 'receipts',
      url: 'https://example.com/receipts.json',
      reachable: true,
      status: 200,
      validJson: true,
      shape: 'battle-receipt',
      itemCount: null,
      keyCount: 3,
      proofStrength: 'signed-receipt',
      coreFieldsPresent: ['payload', 'signature', 'receiptHash', 'payload.agentId'],
      coreFieldsMissing: [],
      summary: 'receipts document matches a signed receipt-like object with all core fields present',
    },
  ])

  expect(report).toContain('proof strength: signed-receipt')
  expect(report).toContain('core fields present: payload, signature, receiptHash, payload.agentId')
  expect(report).toContain('shape: battle-receipt')
})
