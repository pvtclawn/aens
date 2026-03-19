import type {
  LinkedRecordShape,
  LinkedRecordStrength,
  LinkedRecordSummary,
} from './linked-records'
import { hasProofSurface, type AensResolvedProfile } from './profile'

export interface DeclaredProofMaterialView {
  proofSurfacePresent: boolean
  proofsUrl: string | null
  receiptsUrl: string | null
  note: string
}

export type ObservedProofFetchState =
  | 'not-declared'
  | 'not-attempted'
  | 'fetch-failed'
  | 'content-invalid'
  | 'content-parsed'

export interface ObservedProofFetchView {
  kind: 'proofs' | 'receipts'
  state: ObservedProofFetchState
  status: number | null
  detail: string | null
}

export interface InferredProofInterpretationView {
  kind: 'proofs' | 'receipts'
  summary: string
  shape: LinkedRecordShape
  proofStrength: LinkedRecordStrength
  itemCount: number | null
  keyCount: number | null
  coreFieldsPresent: string[]
  coreFieldsMissing: string[]
}

export interface ProofEvidenceViews {
  declared: DeclaredProofMaterialView
  observed: ObservedProofFetchView[]
  inferred: InferredProofInterpretationView[]
}

const PROOF_KINDS = ['proofs', 'receipts'] as const

type ProofKind = typeof PROOF_KINDS[number]

function hasParsedInterpretation(record: LinkedRecordSummary): boolean {
  return record.reachable && record.validJson && record.shape !== 'missing' && record.shape !== 'invalid'
}

function getDeclaredProofUrl(profile: AensResolvedProfile, kind: ProofKind): string | null {
  return kind === 'proofs'
    ? profile.records.proofsUrl ?? null
    : profile.records.receiptsUrl ?? null
}

function extractFailureReason(record: LinkedRecordSummary): string | null {
  if (record.status !== null) {
    return `http ${record.status}`
  }

  const prefix = `${record.kind} document is not currently usable: `
  if (record.summary.startsWith(prefix)) {
    return record.summary.slice(prefix.length)
  }

  return null
}

function extractInvalidReason(record: LinkedRecordSummary): string | null {
  const reasons: string[] = []

  if (record.status !== null) {
    reasons.push(`http ${record.status}`)
  }

  if (record.summary.includes('not valid JSON')) {
    reasons.push('invalid JSON')
  } else if (record.summary.includes('not a usable JSON object/array')) {
    reasons.push('unusable structure')
  }

  return reasons.length > 0 ? reasons.join(', ') : null
}

export function createObservedProofFetchViews(
  profile: AensResolvedProfile,
  linkedRecords: LinkedRecordSummary[] = [],
): ObservedProofFetchView[] {
  return PROOF_KINDS.map((kind) => {
    const declaredUrl = getDeclaredProofUrl(profile, kind)
    if (!declaredUrl) {
      return {
        kind,
        state: 'not-declared',
        status: null,
        detail: null,
      }
    }

    const record = linkedRecords.find((entry) => entry.kind === kind)
    if (!record) {
      return {
        kind,
        state: 'not-attempted',
        status: null,
        detail: null,
      }
    }

    if (!record.reachable) {
      return {
        kind,
        state: 'fetch-failed',
        status: record.status,
        detail: extractFailureReason(record),
      }
    }

    if (!record.validJson) {
      return {
        kind,
        state: 'content-invalid',
        status: record.status,
        detail: extractInvalidReason(record),
      }
    }

    return {
      kind,
      state: 'content-parsed',
      status: record.status,
      detail: record.status !== null ? `http ${record.status}` : null,
    }
  })
}

export function createProofEvidenceViews(
  profile: AensResolvedProfile,
  linkedRecords: LinkedRecordSummary[] = [],
): ProofEvidenceViews {
  return {
    declared: {
      proofSurfacePresent: hasProofSurface(profile),
      proofsUrl: profile.records.proofsUrl ?? null,
      receiptsUrl: profile.records.receiptsUrl ?? null,
      note: hasProofSurface(profile)
        ? 'Linked proof material declared via ENS-linked URLs.'
        : 'No linked proof material declared.',
    },
    observed: createObservedProofFetchViews(profile, linkedRecords),
    inferred: linkedRecords
      .filter(hasParsedInterpretation)
      .map((record) => ({
        kind: record.kind,
        summary: record.summary,
        shape: record.shape,
        proofStrength: record.proofStrength,
        itemCount: record.itemCount,
        keyCount: record.keyCount,
        coreFieldsPresent: record.coreFieldsPresent,
        coreFieldsMissing: record.coreFieldsMissing,
      })),
  }
}
