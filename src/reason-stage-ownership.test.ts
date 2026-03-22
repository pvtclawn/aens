import { describe, expect, test } from 'bun:test'

import {
  REASON_STAGE_OWNERSHIP_REGISTRY_HASH,
  REASON_STAGE_OWNERSHIP_REGISTRY_VERSION,
  resolveReasonStageOwnership,
  type ReasonStageOwnershipResolutionStatus,
  type ResolveReasonStageOwnershipResult,
} from './reason-stage-ownership'

function assertStatus<TStatus extends ReasonStageOwnershipResolutionStatus>(
  result: ResolveReasonStageOwnershipResult,
  status: TStatus,
): asserts result is Extract<ResolveReasonStageOwnershipResult, { status: TStatus }> {
  expect(result.status).toBe(status)
}

describe('resolveReasonStageOwnership', () => {
  test('resolves known reason deterministically', () => {
    const result = resolveReasonStageOwnership({
      reasonCode: 'fixture-provenance-registry-stale',
      claimedStageOwner: 'freshness',
    })

    assertStatus(result, 'resolved')
    expect(result.canonicalStageOwner).toBe('freshness')
    expect(result.registryVersion).toBe(REASON_STAGE_OWNERSHIP_REGISTRY_VERSION)
    expect(result.registryHash).toBe(REASON_STAGE_OWNERSHIP_REGISTRY_HASH)
  })

  test('fails closed with deterministic unmapped contract reason', () => {
    const result = resolveReasonStageOwnership({
      reasonCode: 'fixture-provenance-not-registered',
      claimedStageOwner: 'identity',
    })

    assertStatus(result, 'unmapped')
    expect(result.contractReasonCode).toBe('fixture-provenance-stage-reason-unmapped')
    expect(result.remediationHint).toBe('add reason to canonical registry before emitting it')
    expect(result.registryVersion).toBe(REASON_STAGE_OWNERSHIP_REGISTRY_VERSION)
  })

  test('returns deterministic mismatch outcome when claimed owner differs', () => {
    const result = resolveReasonStageOwnership({
      reasonCode: 'fixture-provenance-id-migration-conflict',
      claimedStageOwner: 'freshness',
    })

    assertStatus(result, 'mismatch')
    expect(result.contractReasonCode).toBe('fixture-provenance-stage-owner-mismatch')
    expect(result.canonicalStageOwner).toBe('identity')
    expect(result.claimedStageOwner).toBe('freshness')
    expect(result.remediationHint).toBe('align emitted stage with canonical owner from registry')
  })
})
