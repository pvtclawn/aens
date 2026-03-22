import {
  resolveReasonStageOwnership,
  type ResolveReasonStageOwnershipResult,
} from './reason-stage-ownership'
import {
  validatePrimaryLockState,
  type PrimaryLockState,
} from './primary-lock-integrity'

export const STAGE_GATE_ORDER = ['integrity', 'freshness', 'identity'] as const

export type StageGateName = (typeof STAGE_GATE_ORDER)[number]
export type StageGateStatus = 'pass' | 'fail' | 'not-evaluated'

export interface StageGateStatusTriad {
  integrity: StageGateStatus
  freshness: StageGateStatus
  identity: StageGateStatus
}

export interface StageGatePrimaryBlocker {
  stage: StageGateName
  reasonCode: string
}

export interface StageGateBlockedByMetadata {
  blockedByStage: StageGateName
  blockedByReasonCode: string
}

export interface StageGateAdapterParityPayload {
  stageStatus: StageGateStatusTriad
  primaryBlocker: StageGatePrimaryBlocker | null
  blockedBy?: Partial<Record<StageGateName, StageGateBlockedByMetadata>>
}

function blockedByToken(
  stage: StageGateName,
  blockedBy: Partial<Record<StageGateName, StageGateBlockedByMetadata>> | undefined,
): string {
  const metadata = blockedBy?.[stage]
  if (!metadata) {
    return `${stage}<-missing`
  }

  return `${stage}<-${metadata.blockedByStage}:${metadata.blockedByReasonCode}`
}

export function computeEarliestFailingStage(stageStatus: StageGateStatusTriad): StageGateName | null {
  for (const stage of STAGE_GATE_ORDER) {
    if (stageStatus[stage] === 'fail') {
      return stage
    }
  }

  return null
}

export function isPrimaryBlockerAlignedToEarliestFail(
  payload: StageGateAdapterParityPayload,
): boolean {
  const earliestFailingStage = computeEarliestFailingStage(payload.stageStatus)

  if (earliestFailingStage === null) {
    return payload.primaryBlocker === null
  }

  if (payload.primaryBlocker === null) {
    return false
  }

  return payload.primaryBlocker.stage === earliestFailingStage
}

export function hasRequiredBlockedByMetadata(
  payload: StageGateAdapterParityPayload,
): boolean {
  for (const stage of STAGE_GATE_ORDER) {
    if (payload.stageStatus[stage] !== 'not-evaluated') {
      continue
    }

    const metadata = payload.blockedBy?.[stage]
    if (!metadata) {
      return false
    }

    if (metadata.blockedByReasonCode.trim().length === 0) {
      return false
    }
  }

  return true
}

export function resolvePrimaryBlockerReasonStageOwnership(
  payload: StageGateAdapterParityPayload,
): ResolveReasonStageOwnershipResult | null {
  if (!payload.primaryBlocker) {
    return null
  }

  return resolveReasonStageOwnership({
    reasonCode: payload.primaryBlocker.reasonCode,
    claimedStageOwner: payload.primaryBlocker.stage,
  })
}

export type OwnershipFailureClass = 'none' | 'unmapped' | 'mismatch'

export interface StageGateOwnershipPreemptionSignals {
  ownershipFailureClass: OwnershipFailureClass
  stagePrimarySuppressed: boolean
  stageStatusContextOnly: boolean
}

export function deriveStageGateOwnershipPreemptionSignals(
  payload: StageGateAdapterParityPayload,
): StageGateOwnershipPreemptionSignals {
  const ownership = resolvePrimaryBlockerReasonStageOwnership(payload)

  if (!ownership || ownership.status === 'resolved') {
    return {
      ownershipFailureClass: 'none',
      stagePrimarySuppressed: false,
      stageStatusContextOnly: false,
    }
  }

  return {
    ownershipFailureClass: ownership.status,
    stagePrimarySuppressed: true,
    stageStatusContextOnly: true,
  }
}

export function deriveStageGatePrimaryLockState(
  payload: StageGateAdapterParityPayload,
): PrimaryLockState {
  const ownership = resolvePrimaryBlockerReasonStageOwnership(payload)

  const candidate = ownership && ownership.status !== 'resolved'
    ? {
        primarySource: 'ownership-contract',
        primaryLocked: true,
        primarySelectionReason: ownership.status === 'unmapped'
          ? 'ownership-unmapped'
          : 'ownership-mismatch',
      }
    : payload.primaryBlocker === null
      ? {
          primarySource: 'none',
          primaryLocked: false,
          primarySelectionReason: 'no-failure',
        }
      : {
          primarySource: 'stage-gate',
          primaryLocked: true,
          primarySelectionReason: 'earliest-failing-stage',
        }

  const validation = validatePrimaryLockState(candidate)
  if (!validation.ok) {
    throw new Error(`primary-lock-integrity-violation: ${validation.issues.map((issue) => issue.message).join(' | ')}`)
  }

  return validation.state
}

export function formatStageGateCompactSummary(
  payload: StageGateAdapterParityPayload,
): string {
  const ownership = resolvePrimaryBlockerReasonStageOwnership(payload)
  const preemptionSignals = deriveStageGateOwnershipPreemptionSignals(payload)
  const lockState = deriveStageGatePrimaryLockState(payload)

  const primary = ownership && ownership.status !== 'resolved'
    ? `ownership-contract:${ownership.contractReasonCode}`
    : payload.primaryBlocker === null
      ? 'none'
      : `${payload.primaryBlocker.stage}:${payload.primaryBlocker.reasonCode}`

  const stageToken = STAGE_GATE_ORDER
    .map((stage) => `${stage}=${payload.stageStatus[stage]}`)
    .join(',')

  const blockedStages = STAGE_GATE_ORDER
    .filter((stage) => payload.stageStatus[stage] === 'not-evaluated')

  const blockedToken = blockedStages.length === 0
    ? 'none'
    : blockedStages.map((stage) => blockedByToken(stage, payload.blockedBy)).join(';')

  return [
    `primary=${primary}`,
    `ownershipFailureClass=${preemptionSignals.ownershipFailureClass}`,
    `stagePrimarySuppressed=${String(preemptionSignals.stagePrimarySuppressed)}`,
    `stageStatusContextOnly=${String(preemptionSignals.stageStatusContextOnly)}`,
    `primarySource=${lockState.primarySource}`,
    `primaryLocked=${String(lockState.primaryLocked)}`,
    `primarySelectionReason=${lockState.primarySelectionReason}`,
    `stages=${stageToken}`,
    `blocked=${blockedToken}`,
  ].join('|')
}
