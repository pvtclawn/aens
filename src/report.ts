import { type CapabilityAuthorization } from './capability-authorization'
import {
  hasCallableServiceSurface,
  hasIdentityAnchor,
  hasProfileMetadata,
  hasProofSurface,
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

function buildLinkedProofMaterialSection(
  profile: AensResolvedProfile,
  linkedRecords: LinkedRecordSummary[],
): ReportSection {
  const lines = [
    `Proof surface present: ${hasProofSurface(profile) ? 'yes' : 'no'}`,
  ]

  if (profile.records.proofsUrl) {
    lines.push(`Proofs URL: ${profile.records.proofsUrl}`)
  }
  if (profile.records.receiptsUrl) {
    lines.push(`Receipts URL: ${profile.records.receiptsUrl}`)
  }

  for (const record of linkedRecords) {
    lines.push(
      `${record.kind}: ${record.summary}`,
      `${record.kind} URL: ${record.url}`,
    )

    if (record.itemCount !== null) {
      lines.push(`${record.kind} item count: ${record.itemCount}`)
    }
    if (record.keyCount !== null) {
      lines.push(`${record.kind} key count: ${record.keyCount}`)
    }
  }

  if (lines.length === 1 && lines[0] === 'Proof surface present: no') {
    lines.push('No linked proof material declared.')
  }

  return createSection({
    key: 'linked-proof-material',
    title: 'Linked proof material',
    tier: 'declared',
    source: 'linked-doc',
    lines,
  })
}

function buildLiveObservationsSection(linkedRecords: LinkedRecordSummary[]): ReportSection {
  const lines = linkedRecords.flatMap((record) => {
    const status = record.status !== null ? String(record.status) : 'not available'
    return [
      `${record.kind}: reachable=${record.reachable ? 'yes' : 'no'}, valid JSON=${record.validJson ? 'yes' : 'no'}, http status=${status}`,
    ]
  })

  return createSection({
    key: 'live-observations',
    title: 'Live observations',
    tier: 'observed',
    source: 'live-fetch',
    lines: lines.length > 0 ? lines : ['No live observations recorded.'],
  })
}

function buildInferredClaimsSection(linkedRecords: LinkedRecordSummary[]): ReportSection {
  const lines = linkedRecords.flatMap((record) => {
    const recordLines = [
      `${record.kind}: shape=${record.shape}, proof strength=${record.proofStrength}`,
    ]

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
  return [
    buildIdentityAnchorSection(profile),
    buildCapabilityAuthoritySection(profile, capabilityAuthorization),
    buildLinkedProofMaterialSection(profile, linkedRecords),
    buildLiveObservationsSection(linkedRecords),
    buildInferredClaimsSection(linkedRecords),
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
