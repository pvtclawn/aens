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

export interface ObservedProofFetchView {
  kind: 'proofs' | 'receipts'
  reachable: boolean
  validJson: boolean
  status: number | null
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

function hasParsedInterpretation(record: LinkedRecordSummary): boolean {
  return record.reachable && record.validJson && record.shape !== 'missing' && record.shape !== 'invalid'
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
    observed: linkedRecords.map((record) => ({
      kind: record.kind,
      reachable: record.reachable,
      validJson: record.validJson,
      status: record.status,
    })),
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
