import { keccak256, stringToHex } from 'viem'
import { canonicalJsonStringify } from './write-intent-hash'

export const REASON_STAGE_OWNERSHIP_REGISTRY_VERSION = 'aens-reason-stage-ownership/v1' as const

export type ReasonStageOwner = 'integrity' | 'freshness' | 'identity'

export const REASON_STAGE_OWNERSHIP_REGISTRY: Record<string, ReasonStageOwner> = {
  'fixture-provenance-registry-integrity-invalid': 'integrity',
  'fixture-provenance-registry-stale': 'freshness',
  'fixture-provenance-id-migration-cycle-detected': 'identity',
  'fixture-provenance-id-migration-conflict': 'identity',
}

export const REASON_STAGE_OWNERSHIP_REGISTRY_HASH = keccak256(stringToHex(canonicalJsonStringify(
  REASON_STAGE_OWNERSHIP_REGISTRY,
)))

export const REASON_STAGE_OWNERSHIP_UNMAPPED_CONTRACT_REASON =
  'fixture-provenance-stage-reason-unmapped' as const

export const REASON_STAGE_OWNERSHIP_MISMATCH_CONTRACT_REASON =
  'fixture-provenance-stage-owner-mismatch' as const

export type ReasonStageOwnershipResolutionStatus = 'resolved' | 'unmapped' | 'mismatch'

interface ResolveReasonStageOwnershipBase {
  reasonCode: string
  claimedStageOwner: ReasonStageOwner | null
  registryVersion: typeof REASON_STAGE_OWNERSHIP_REGISTRY_VERSION
  registryHash: `0x${string}`
}

export interface ResolveReasonStageOwnershipResolved extends ResolveReasonStageOwnershipBase {
  status: 'resolved'
  canonicalStageOwner: ReasonStageOwner
}

export interface ResolveReasonStageOwnershipUnmapped extends ResolveReasonStageOwnershipBase {
  status: 'unmapped'
  contractReasonCode: typeof REASON_STAGE_OWNERSHIP_UNMAPPED_CONTRACT_REASON
  remediationHint: 'add reason to canonical registry before emitting it'
}

export interface ResolveReasonStageOwnershipMismatch extends ResolveReasonStageOwnershipBase {
  status: 'mismatch'
  contractReasonCode: typeof REASON_STAGE_OWNERSHIP_MISMATCH_CONTRACT_REASON
  canonicalStageOwner: ReasonStageOwner
  remediationHint: 'align emitted stage with canonical owner from registry'
}

export type ResolveReasonStageOwnershipResult =
  | ResolveReasonStageOwnershipResolved
  | ResolveReasonStageOwnershipUnmapped
  | ResolveReasonStageOwnershipMismatch

export interface ResolveReasonStageOwnershipInput {
  reasonCode: string
  claimedStageOwner?: ReasonStageOwner | null
}

function normalizeReasonCode(value: string): string {
  return value.trim()
}

export function resolveReasonStageOwnership(
  input: ResolveReasonStageOwnershipInput,
): ResolveReasonStageOwnershipResult {
  const reasonCode = normalizeReasonCode(input.reasonCode)
  const claimedStageOwner = input.claimedStageOwner ?? null
  const canonicalStageOwner = REASON_STAGE_OWNERSHIP_REGISTRY[reasonCode]

  if (!canonicalStageOwner) {
    return {
      status: 'unmapped',
      reasonCode,
      claimedStageOwner,
      contractReasonCode: REASON_STAGE_OWNERSHIP_UNMAPPED_CONTRACT_REASON,
      remediationHint: 'add reason to canonical registry before emitting it',
      registryVersion: REASON_STAGE_OWNERSHIP_REGISTRY_VERSION,
      registryHash: REASON_STAGE_OWNERSHIP_REGISTRY_HASH,
    }
  }

  if (claimedStageOwner !== null && claimedStageOwner !== canonicalStageOwner) {
    return {
      status: 'mismatch',
      reasonCode,
      claimedStageOwner,
      canonicalStageOwner,
      contractReasonCode: REASON_STAGE_OWNERSHIP_MISMATCH_CONTRACT_REASON,
      remediationHint: 'align emitted stage with canonical owner from registry',
      registryVersion: REASON_STAGE_OWNERSHIP_REGISTRY_VERSION,
      registryHash: REASON_STAGE_OWNERSHIP_REGISTRY_HASH,
    }
  }

  return {
    status: 'resolved',
    reasonCode,
    claimedStageOwner,
    canonicalStageOwner,
    registryVersion: REASON_STAGE_OWNERSHIP_REGISTRY_VERSION,
    registryHash: REASON_STAGE_OWNERSHIP_REGISTRY_HASH,
  }
}
