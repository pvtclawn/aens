import { describe, expect, test } from 'bun:test'

import { compareCanonicalMachinePayloads } from './machine-payload-parity'
import {
  formatStageGateCompactSummary,
  hasRequiredBlockedByMetadata,
  isPrimaryBlockerAlignedToEarliestFail,
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
      'primary=freshness:fixture-provenance-registry-stale|stages=integrity=pass,freshness=fail,identity=not-evaluated|blocked=identity<-freshness:fixture-provenance-registry-stale',
    )
    expect(hasRequiredBlockedByMetadata(fixture)).toBe(true)
    expect(isPrimaryBlockerAlignedToEarliestFail(fixture)).toBe(true)
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
        reasonCode: 'fixture-provenance-id-migration-conflict',
      },
    }

    const result = compareCanonicalMachinePayloads({ expected, observed })
    expect(result.equal).toBe(false)
    expect(result.mismatches.some((mismatch) => mismatch.fieldPath === '$.primaryBlocker.reasonCode')).toBe(true)
    expect(isPrimaryBlockerAlignedToEarliestFail(observed)).toBe(false)
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
})
