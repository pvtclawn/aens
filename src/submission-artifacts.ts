import { type DiscoverResearchResult } from './discover-research'
import { type PublicProofState } from './public-proof-state'
import {
  summarizeSurfaceCheck,
  surfaceCheckPassed,
  type SurfaceCheckResult,
} from './public-surface'

export const DISCOVER_RESEARCH_ARTIFACT_SCHEMA_VERSION = 'aens.discover-research-artifact.v1'
export const DISCOVER_RESEARCH_ARTIFACT_KIND = 'discover-research-result'

export type DiscoverResearchArtifactSourceMode = 'example' | 'live'

export interface DiscoverResearchArtifactSurfaceCheck {
  label: string
  url: string
  status: number
  expectedMarker: string
  passed: boolean
  summary: string
}

export interface DiscoverResearchArtifactPublicSurface {
  checkedAt: string
  preferredPublicBaseUrl: string
  preferredResearchUrl: string
  preferredSurfaceReady: boolean
  bootstrapProofReady: boolean
  preferredResults: DiscoverResearchArtifactSurfaceCheck[]
  fallbackResult: DiscoverResearchArtifactSurfaceCheck
}

export interface DiscoverResearchArtifact {
  schemaVersion: typeof DISCOVER_RESEARCH_ARTIFACT_SCHEMA_VERSION
  artifactKind: typeof DISCOVER_RESEARCH_ARTIFACT_KIND
  sourceMode: DiscoverResearchArtifactSourceMode
  exampleId: string | null
  generatedAt: string
  gitCommit: string
  command: string
  publicSurface: DiscoverResearchArtifactPublicSurface
  result: DiscoverResearchResult
}

export function buildDiscoverResearchArtifactSurfaceCheck(
  result: SurfaceCheckResult,
): DiscoverResearchArtifactSurfaceCheck {
  return {
    label: result.label,
    url: result.url,
    status: result.status,
    expectedMarker: result.expectedMarker,
    passed: surfaceCheckPassed(result),
    summary: summarizeSurfaceCheck(result),
  }
}

export function buildDiscoverResearchArtifact(input: {
  sourceMode: DiscoverResearchArtifactSourceMode
  exampleId?: string | null
  generatedAt: string
  gitCommit: string
  command: string
  publicProofState: PublicProofState
  result: DiscoverResearchResult
}): DiscoverResearchArtifact {
  return {
    schemaVersion: DISCOVER_RESEARCH_ARTIFACT_SCHEMA_VERSION,
    artifactKind: DISCOVER_RESEARCH_ARTIFACT_KIND,
    sourceMode: input.sourceMode,
    exampleId: input.exampleId ?? null,
    generatedAt: input.generatedAt,
    gitCommit: input.gitCommit,
    command: input.command,
    publicSurface: {
      checkedAt: input.generatedAt,
      preferredPublicBaseUrl: input.publicProofState.preferredBaseUrl,
      preferredResearchUrl: input.publicProofState.preferredResearchUrl,
      preferredSurfaceReady: input.publicProofState.preferredSurfaceReady,
      bootstrapProofReady: input.publicProofState.bootstrapProofReady,
      preferredResults: input.publicProofState.preferredResults.map(buildDiscoverResearchArtifactSurfaceCheck),
      fallbackResult: buildDiscoverResearchArtifactSurfaceCheck(input.publicProofState.fallbackResult),
    },
    result: input.result,
  }
}
