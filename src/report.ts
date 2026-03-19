import { type CapabilityAuthorization } from './capability-authorization'
import {
  createProofEvidenceViews,
  type DeclaredProofMaterialView,
  type InferredProofInterpretationView,
  type ObservedProofFetchView,
} from './proof-evidence'
import {
  hasCallableServiceSurface,
  hasIdentityAnchor,
  hasProfileMetadata,
  type AensResolvedProfile,
} from './profile'
import type { LinkedRecordSummary } from './linked-records'

export type ReportSectionKey =
  | 'identity-anchor'
  | 'capability-authority'
  | 'linked-proof-material'
  | 'live-observations'
  | 'inferred-claims'

export interface ReportSection {
  key: ReportSectionKey
  title: string
  tier: 'anchored' | 'authorized' | 'declared' | 'observed' | 'inferred'
  source: 'ens' | 'parent-ens' | 'linked-doc' | 'live-fetch' | 'inference'
  lines: string[]
}

function createSection(input: ReportSection): ReportSection {
  return input
}

function buildIdentityAnchorSection(profile: AensResolvedProfile): ReportSection {
  return createSection({
    key: 'identity-anchor',
    title: 'Identity anchor',
    tier: 'anchored',
    source: 'ens',
    lines: [
      `ENS name: ${profile.ensName}`,
      `Resolved address: ${profile.address ?? 'not set'}`,
      `Agent ID: ${profile.records.agentId ?? 'not set'}`,
      `Runtime: ${profile.records.runtime ?? 'not set'}`,
      `Description: ${profile.records.description ?? 'not set'}`,
      `Primary URL: ${profile.records.url ?? 'not set'}`,
      `Service URL: ${profile.records.serviceUrl ?? 'not set'}`,
      `Avatar: ${profile.records.avatar ?? 'not set'}`,
      `Twitter: ${profile.records.twitter ?? 'not set'}`,
      `GitHub: ${profile.records.github ?? 'not set'}`,
      `Telegram: ${profile.records.telegram ?? 'not set'}`,
      `Identity anchor present: ${hasIdentityAnchor(profile) ? 'yes' : 'no'}`,
      `Profile metadata present: ${hasProfileMetadata(profile) ? 'yes' : 'no'}`,
      `Callable service surface present: ${hasCallableServiceSurface(profile) ? 'yes' : 'no'}`,
    ],
  })
}

function buildCapabilityAuthoritySection(
  profile: AensResolvedProfile,
  capabilityAuthorization?: CapabilityAuthorization,
): ReportSection {
  const lines = [
    `Parent Name: ${profile.records.parentName ?? 'not set'}`,
    `Declared Capabilities: ${profile.records.capabilities?.join(', ') ?? 'not set'}`,
  ]

  if (capabilityAuthorization) {
    lines.push(
      `Capability authorization: ${capabilityAuthorization.status}`,
      `Capability authority summary: ${capabilityAuthorization.summary}`,
      `Capability listed by parent: ${capabilityAuthorization.listedByParent ? 'yes' : 'no'}`,
      `Capability identity matches parent: ${capabilityAuthorization.identityMatchesParent ? 'yes' : 'no'}`,
    )
  } else {
    lines.push('Capability authorization: not evaluated')
  }

  return createSection({
    key: 'capability-authority',
    title: 'Capability authority',
    tier: 'authorized',
    source: 'parent-ens',
    lines,
  })
}

function buildLinkedProofMaterialSection(declared: DeclaredProofMaterialView): ReportSection {
  const lines = [
    `Proof surface present: ${declared.proofSurfacePresent ? 'yes' : 'no'}`,
  ]

  if (declared.proofsUrl) {
    lines.push(`Proofs URL: ${declared.proofsUrl}`)
  }
  if (declared.receiptsUrl) {
    lines.push(`Receipts URL: ${declared.receiptsUrl}`)
  }

  lines.push(declared.note)

  return createSection({
    key: 'linked-proof-material',
    title: 'Linked proof material',
    tier: 'declared',
    source: 'linked-doc',
    lines,
  })
}

function buildLiveObservationsSection(observed: ObservedProofFetchView[]): ReportSection {
  const lines = observed.map((record) => {
    const detail = record.detail ? ` (${record.detail})` : ''
    return `${record.kind}: ${record.state}${detail}`
  })

  return createSection({
    key: 'live-observations',
    title: 'Live observations',
    tier: 'observed',
    source: 'live-fetch',
    lines,
  })
}

function buildInferredClaimsSection(inferred: InferredProofInterpretationView[]): ReportSection {
  const lines = inferred.flatMap((record) => {
    const recordLines = [
      `${record.kind}: summary=${record.summary}`,
      `${record.kind}: shape=${record.shape}, proof strength=${record.proofStrength}`,
    ]

    if (record.itemCount !== null) {
      recordLines.push(`${record.kind}: item count=${record.itemCount}`)
    }
    if (record.keyCount !== null) {
      recordLines.push(`${record.kind}: key count=${record.keyCount}`)
    }
    if (record.coreFieldsPresent.length > 0) {
      recordLines.push(`${record.kind}: core fields present: ${record.coreFieldsPresent.join(', ')}`)
    }
    if (record.coreFieldsMissing.length > 0) {
      recordLines.push(`${record.kind}: core fields missing: ${record.coreFieldsMissing.join(', ')}`)
    }

    return recordLines
  })

  return createSection({
    key: 'inferred-claims',
    title: 'Inferred claims / caveats',
    tier: 'inferred',
    source: 'inference',
    lines: lines.length > 0 ? lines : ['No inferred claims or caveats.'],
  })
}

export function createReportSections(
  profile: AensResolvedProfile,
  linkedRecords: LinkedRecordSummary[] = [],
  capabilityAuthorization?: CapabilityAuthorization,
): ReportSection[] {
  const proofEvidenceViews = createProofEvidenceViews(profile, linkedRecords)

  return [
    buildIdentityAnchorSection(profile),
    buildCapabilityAuthoritySection(profile, capabilityAuthorization),
    buildLinkedProofMaterialSection(proofEvidenceViews.declared),
    buildLiveObservationsSection(proofEvidenceViews.observed),
    buildInferredClaimsSection(proofEvidenceViews.inferred),
  ]
}

function renderSection(section: ReportSection): string[] {
  return [
    `${section.title} [${section.tier} | ${section.source}]`,
    ...section.lines.map((line) => `  ${line}`),
  ]
}

export function renderProfileReport(
  profile: AensResolvedProfile,
  linkedRecords: LinkedRecordSummary[] = [],
  capabilityAuthorization?: CapabilityAuthorization,
): string {
  const sections = createReportSections(profile, linkedRecords, capabilityAuthorization)
  const lines = [`AENS profile: ${profile.ensName}`, '']

  for (const section of sections) {
    lines.push(...renderSection(section), '')
  }

  lines.push(
    'Why ENS matters here:',
    '  - the name is the entrypoint for discovery',
    '  - the resolved profile is anchored to ENS records / resolution',
    '  - the project would lose its primary lookup surface without ENS',
  )

  return lines.join('\n')
}
