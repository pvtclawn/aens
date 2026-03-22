import { describe, expect, test } from 'bun:test'

import { compareCanonicalMachinePayloads } from './machine-payload-parity'
import {
  deriveStageGateOwnershipPreemptionSignals,
  formatStageGateCompactSummary,
  hasRequiredBlockedByMetadata,
  isPrimaryBlockerAlignedToEarliestFail,
  resolvePrimaryBlockerReasonStageOwnership,
  type StageGateAdapterParityPayload,
} from './stage-gate-adapter-parity'

function buildFreshnessBlockedFixture(): StageGateAdapterParityPayload {
  return {
    stageStatus: {
      integrity: 'pass',
      freshness: 'fail',
      identity: 'not-evaluated',
    },
    primaryBlocker: {
      stage: 'freshness',
      reasonCode: 'fixture-provenance-registry-stale',
    },
    blockedBy: {
      identity: {
        blockedByStage: 'freshness',
        blockedByReasonCode: 'fixture-provenance-registry-stale',
      },
    },
  }
}

describe('stage-gate adapter parity contract', () => {
  test('keeps deterministic compact summary with stage triad + blocked-by metadata', () => {
    const fixture = buildFreshnessBlockedFixture()
    const summary = formatStageGateCompactSummary(fixture)

    expect(summary).toBe(
      'primary=freshness:fixture-provenance-registry-stale|ownershipFailureClass=none|stagePrimarySuppressed=false|stageStatusContextOnly=false|stages=integrity=pass,freshness=fail,identity=not-evaluated|blocked=identity<-freshness:fixture-provenance-registry-stale',
    )
    expect(hasRequiredBlockedByMetadata(fixture)).toBe(true)
    expect(isPrimaryBlockerAlignedToEarliestFail(fixture)).toBe(true)

    const ownership = resolvePrimaryBlockerReasonStageOwnership(fixture)
    expect(ownership?.status).toBe('resolved')
    expect(ownership?.registryVersion).toBe('aens-reason-stage-ownership/v1')

    const preemption = deriveStageGateOwnershipPreemptionSignals(fixture)
    expect(preemption).toEqual({
      ownershipFailureClass: 'none',
      stagePrimarySuppressed: false,
      stageStatusContextOnly: false,
    })
  })

  test('fails parity when an adapter omits a required stage field', () => {
    const expected = buildFreshnessBlockedFixture()
    const observed = {
      stageStatus: {
        integrity: 'pass',
        freshness: 'fail',
      },
      primaryBlocker: {
        stage: 'freshness',
        reasonCode: 'fixture-provenance-registry-stale',
      },
      blockedBy: {
        identity: {
          blockedByStage: 'freshness',
          blockedByReasonCode: 'fixture-provenance-registry-stale',
        },
      },
    }

    const result = compareCanonicalMachinePayloads({ expected, observed })
    expect(result.equal).toBe(false)
    expect(result.mismatches.some((mismatch) => mismatch.fieldPath === '$.stageStatus.identity')).toBe(true)
  })

  test('fails alignment when freshness fails but identity is emitted as primary blocker', () => {
    const expected = buildFreshnessBlockedFixture()
    const observed: StageGateAdapterParityPayload = {
      ...expected,
      primaryBlocker: {
        stage: 'identity',
        reasonCode: 'fixture-provenance-registry-stale',
      },
    }

    const result = compareCanonicalMachinePayloads({ expected, observed })
    expect(result.equal).toBe(false)
    expect(result.mismatches.some((mismatch) => mismatch.fieldPath === '$.primaryBlocker.stage')).toBe(true)
    expect(isPrimaryBlockerAlignedToEarliestFail(observed)).toBe(false)

    const ownership = resolvePrimaryBlockerReasonStageOwnership(observed)
    expect(ownership?.status).toBe('mismatch')
    expect(ownership?.reasonCode).toBe('fixture-provenance-registry-stale')

    const preemption = deriveStageGateOwnershipPreemptionSignals(observed)
    expect(preemption).toEqual({
      ownershipFailureClass: 'mismatch',
      stagePrimarySuppressed: true,
      stageStatusContextOnly: true,
    })

    const summary = formatStageGateCompactSummary(observed)
    expect(summary).toContain('primary=ownership-contract:fixture-provenance-stage-owner-mismatch')
    expect(summary).toContain('ownershipFailureClass=mismatch')
    expect(summary).toContain('stagePrimarySuppressed=true')
    expect(summary).toContain('stageStatusContextOnly=true')
    expect(summary).not.toContain('primary=identity:fixture-provenance-registry-stale')
  })

  test('fails required blocked-by metadata when downstream stage is not-evaluated', () => {
    const expected = buildFreshnessBlockedFixture()
    const observed: StageGateAdapterParityPayload = {
      stageStatus: {
        integrity: 'pass',
        freshness: 'fail',
        identity: 'not-evaluated',
      },
      primaryBlocker: {
        stage: 'freshness',
        reasonCode: 'fixture-provenance-registry-stale',
      },
    }

    const result = compareCanonicalMachinePayloads({ expected, observed })
    expect(result.equal).toBe(false)
    expect(result.mismatches.some((mismatch) => mismatch.fieldPath === '$.blockedBy')).toBe(true)
    expect(hasRequiredBlockedByMetadata(observed)).toBe(false)
  })

  test('fails closed when primary blocker reason is unmapped in canonical ownership registry', () => {
    const observed: StageGateAdapterParityPayload = {
      stageStatus: {
        integrity: 'fail',
        freshness: 'not-evaluated',
        identity: 'not-evaluated',
      },
      primaryBlocker: {
        stage: 'integrity',
        reasonCode: 'fixture-provenance-unknown-reason',
      },
      blockedBy: {
        freshness: {
          blockedByStage: 'integrity',
          blockedByReasonCode: 'fixture-provenance-unknown-reason',
        },
        identity: {
          blockedByStage: 'integrity',
          blockedByReasonCode: 'fixture-provenance-unknown-reason',
        },
      },
    }

    const ownership = resolvePrimaryBlockerReasonStageOwnership(observed)
    expect(ownership?.status).toBe('unmapped')
    expect(ownership?.reasonCode).toBe('fixture-provenance-unknown-reason')
    expect(ownership?.registryVersion).toBe('aens-reason-stage-ownership/v1')

    const preemption = deriveStageGateOwnershipPreemptionSignals(observed)
    expect(preemption).toEqual({
      ownershipFailureClass: 'unmapped',
      stagePrimarySuppressed: true,
      stageStatusContextOnly: true,
    })

    const summary = formatStageGateCompactSummary(observed)
    expect(summary).toContain('primary=ownership-contract:fixture-provenance-stage-reason-unmapped')
    expect(summary).toContain('ownershipFailureClass=unmapped')
    expect(summary).toContain('stagePrimarySuppressed=true')
    expect(summary).toContain('stageStatusContextOnly=true')
    expect(summary).not.toContain('primary=integrity:fixture-provenance-unknown-reason')
  })
})
