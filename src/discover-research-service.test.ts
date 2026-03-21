import { describe, expect, test } from 'bun:test'
import { toDiscoverResearchServiceResponse } from './discover-research-service'
import type { DiscoverResearchResult } from './discover-research'

describe('toDiscoverResearchServiceResponse', () => {
  test('maps discover result to stable service response contract', () => {
    const result: DiscoverResearchResult = {
      parentName: 'pvtclawn.eth',
      researchCapabilityName: 'research.pvtclawn.eth',
      authorizationStatus: 'parent-authorized',
      authorizationSummary: 'Parent-authorized capability discovered.',
      parentListsChild: true,
      childDeclaresParent: true,
      serviceUrl: 'https://aens-nine.vercel.app/research-capability/',
      officialEndpointDeclared: true,
      livenessChecked: false,
      notes: ['official research endpoint is declared under parent authorization'],
    }

    const response = toDiscoverResearchServiceResponse(
      'pvtclawn.eth',
      result,
      '2026-03-21T13:59:00Z',
    )

    expect(response).toEqual({
      queryName: 'pvtclawn.eth',
      resolvedAt: '2026-03-21T13:59:00Z',
      source: 'aens-discover-research-v1',
      authorization: {
        status: 'parent-authorized',
        summary: 'Parent-authorized capability discovered.',
        parentListsChild: true,
        childDeclaresParent: true,
      },
      endpoint: {
        capabilityName: 'research.pvtclawn.eth',
        serviceUrl: 'https://aens-nine.vercel.app/research-capability/',
        officialEndpointDeclared: true,
        livenessChecked: false,
      },
      notes: ['official research endpoint is declared under parent authorization'],
    })
  })
})
