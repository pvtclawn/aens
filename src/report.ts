import { hasDiscoverySurface, hasProofSurface, type AensResolvedProfile } from './profile'
import type { LinkedRecordSummary } from './linked-records'

export function renderProfileReport(
  profile: AensResolvedProfile,
  linkedRecords: LinkedRecordSummary[] = [],
): string {
  const lines = [
    `AENS profile: ${profile.ensName}`,
    '',
    `Resolved address: ${profile.address ?? 'not set'}`,
    `Agent ID: ${profile.records.agentId ?? 'not set'}`,
    `Runtime: ${profile.records.runtime ?? 'not set'}`,
    `Description: ${profile.records.description ?? 'not set'}`,
    `Primary URL: ${profile.records.url ?? 'not set'}`,
    `Service URL: ${profile.records.serviceUrl ?? 'not set'}`,
    `Proofs URL: ${profile.records.proofsUrl ?? 'not set'}`,
    `Receipts URL: ${profile.records.receiptsUrl ?? 'not set'}`,
    `Avatar: ${profile.records.avatar ?? 'not set'}`,
    `Twitter: ${profile.records.twitter ?? 'not set'}`,
    `GitHub: ${profile.records.github ?? 'not set'}`,
    `Telegram: ${profile.records.telegram ?? 'not set'}`,
    '',
    `Discovery surface present: ${hasDiscoverySurface(profile) ? 'yes' : 'no'}`,
    `Proof surface present: ${hasProofSurface(profile) ? 'yes' : 'no'}`,
  ]

  if (linkedRecords.length > 0) {
    lines.push('', 'Linked proof records:')
    for (const record of linkedRecords) {
      lines.push(
        `  ${record.kind}: ${record.summary}`,
        `    url: ${record.url}`,
        `    reachable: ${record.reachable ? 'yes' : 'no'}`,
        `    valid JSON: ${record.validJson ? 'yes' : 'no'}`,
        `    shape: ${record.shape}`,
        `    proof strength: ${record.proofStrength}`,
      )
      if (record.itemCount !== null) {
        lines.push(`    item count: ${record.itemCount}`)
      }
      if (record.keyCount !== null) {
        lines.push(`    key count: ${record.keyCount}`)
      }
      if (record.coreFieldsPresent.length > 0) {
        lines.push(`    core fields present: ${record.coreFieldsPresent.join(', ')}`)
      }
      if (record.coreFieldsMissing.length > 0) {
        lines.push(`    core fields missing: ${record.coreFieldsMissing.join(', ')}`)
      }
    }
  }

  lines.push(
    '',
    'Why ENS matters here:',
    '  - the name is the entrypoint for discovery',
    '  - the resolved profile is anchored to ENS records / resolution',
    '  - the project would lose its primary lookup surface without ENS',
  )

  return lines.join('\n')
}
