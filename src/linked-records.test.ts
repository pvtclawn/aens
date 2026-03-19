import { expect, test } from 'bun:test'
import { fetchLinkedRecords } from './linked-records'
import { buildAensProfile } from './profile'
import { createProofEvidenceViews } from './proof-evidence'
import { createReportSections, renderProfileReport } from './report'

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

test('createProofEvidenceViews separates declared, observed, and inferred proof details', () => {
  const profile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      proofsUrl: 'https://example.com/proofs.json',
      receiptsUrl: 'https://example.com/receipts.json',
    },
  })

  const views = createProofEvidenceViews(profile, [
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

  expect(views.declared.proofSurfacePresent).toBe(true)
  expect(views.declared.proofsUrl).toBe('https://example.com/proofs.json')
  expect(views.declared.receiptsUrl).toBe('https://example.com/receipts.json')
  expect(views.declared.note).toBe('Linked proof material declared via ENS-linked URLs.')
  expect('summary' in views.declared).toBe(false)

  expect(views.observed).toEqual([
    {
      kind: 'receipts',
      reachable: true,
      validJson: true,
      status: 200,
    },
  ])
  expect('proofStrength' in views.observed[0]!).toBe(false)

  expect(views.inferred).toHaveLength(1)
  expect(views.inferred[0]?.summary).toBe('receipts document matches a signed receipt-like object with all core fields present')
  expect(views.inferred[0]?.proofStrength).toBe('signed-receipt')
  expect('url' in views.inferred[0]!).toBe(false)
})

test('createReportSections keeps summary text out of the declared proof section', () => {
  const profile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      proofsUrl: 'https://example.com/proofs.json',
      receiptsUrl: 'https://example.com/receipts.json',
    },
  })

  const sections = createReportSections(profile, [
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

  const declaredSection = sections.find((section) => section.key === 'linked-proof-material')
  const observedSection = sections.find((section) => section.key === 'live-observations')
  const inferredSection = sections.find((section) => section.key === 'inferred-claims')

  expect(declaredSection?.lines).toContain('Proofs URL: https://example.com/proofs.json')
  expect(declaredSection?.lines).toContain('Receipts URL: https://example.com/receipts.json')
  expect(declaredSection?.lines).toContain('Linked proof material declared via ENS-linked URLs.')
  expect(declaredSection?.lines.join('\n')).not.toContain('signed receipt-like object')
  expect(declaredSection?.lines.join('\n')).not.toContain('key count')

  expect(observedSection?.lines).toContain('receipts: reachable=yes, valid JSON=yes, http status=200')
  expect(observedSection?.lines.join('\n')).not.toContain('proof strength')

  expect(inferredSection?.lines).toContain('receipts: summary=receipts document matches a signed receipt-like object with all core fields present')
  expect(inferredSection?.lines).toContain('receipts: shape=battle-receipt, proof strength=signed-receipt')
  expect(inferredSection?.lines).toContain('receipts: key count=3')
})

test('renderProfileReport includes trust-tier headings when receipt-like docs are present', () => {
  const profile = buildAensProfile({
    ensName: 'pvtclawn.eth',
    address: '0x000000000000000000000000000000000000dEaD',
    records: {
      proofsUrl: 'https://example.com/proofs.json',
      receiptsUrl: 'https://example.com/receipts.json',
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

  expect(report).toContain('Linked proof material [declared | linked-doc]')
  expect(report).toContain('Live observations [observed | live-fetch]')
  expect(report).toContain('Inferred claims / caveats [inferred | inference]')
  expect(report).toContain('receipts: summary=receipts document matches a signed receipt-like object with all core fields present')
  expect(report).toContain('proof strength=signed-receipt')
  expect(report).toContain('core fields present: payload, signature, receiptHash, payload.agentId')
  expect(report).not.toContain('Linked proof material [declared | linked-doc]\n  receipts: receipts document matches a signed receipt-like object with all core fields present')
})
