import { type DiscoverResearchResult, resolveDiscoverResearchResult } from './discover-research'

export interface DiscoverResearchServiceResponse {
  queryName: string
  resolvedAt: string
  source: 'aens-discover-research-v1'
  authorization: {
    status: string
    summary: string
    parentListsChild: boolean
    childDeclaresParent: boolean
  }
  endpoint: {
    capabilityName: string
    serviceUrl: string | null
    officialEndpointDeclared: boolean
    livenessChecked: boolean
  }
  notes: string[]
}

export function toDiscoverResearchServiceResponse(
  queryName: string,
  result: DiscoverResearchResult,
  resolvedAt: string,
): DiscoverResearchServiceResponse {
  return {
    queryName,
    resolvedAt,
    source: 'aens-discover-research-v1',
    authorization: {
      status: result.authorizationStatus,
      summary: result.authorizationSummary,
      parentListsChild: result.parentListsChild,
      childDeclaresParent: result.childDeclaresParent,
    },
    endpoint: {
      capabilityName: result.researchCapabilityName,
      serviceUrl: result.serviceUrl,
      officialEndpointDeclared: result.officialEndpointDeclared,
      livenessChecked: result.livenessChecked,
    },
    notes: result.notes,
  }
}

export async function resolveDiscoverResearchServiceResponse(
  queryName: string,
  nowIso: string,
): Promise<DiscoverResearchServiceResponse> {
  const result = await resolveDiscoverResearchResult(queryName)
  return toDiscoverResearchServiceResponse(queryName, result, nowIso)
}
