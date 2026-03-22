import { describe, expect, test } from 'bun:test'
import { REASON_TAXONOMY_V1, REASON_SCHEMA_VERSION, buildDiscoverResponsePayload } from '../api/discover-research'

describe('discover response golden behavior', () => {
  test('keeps legacy fields stable while adding reason metadata', () => {
    const payload = buildDiscoverResponsePayload({
      parentName: 'pvtclawn.eth',
      capabilityName: 'research.pvtclawn.eth',
      parentCapabilities: ['research.pvtclawn.eth'],
      childParentName: 'pvtclawn.eth',
      childAddress: '0xabc',
      childServiceUrl: 'https://aens-nine.vercel.app/research/',
      childCapabilities: ['research.pvtclawn.eth'],
      resolvedAt: '2026-03-21T15:27:00Z',
    })

    expect(payload.source).toBe('aens-discover-research-v1')
    expect(payload.authorization).toEqual({
      status: 'parent-authorized',
      summary: 'Research capability is declared by child and listed by parent.',
      parentListsChild: true,
      childDeclaresParent: true,
    })
    expect(payload.endpoint).toEqual({
      capabilityName: 'research.pvtclawn.eth',
      serviceUrl: 'https://aens-nine.vercel.app/research/',
      officialEndpointDeclared: true,
      livenessChecked: false,
    })
    expect(payload.notes).toEqual(['Authorization and liveness are separate checks.'])

    expect(payload.reasonSchemaVersion).toBe(REASON_SCHEMA_VERSION)
    expect(REASON_TAXONOMY_V1.includes(payload.reasonCode as never)).toBe(true)
  })
})
