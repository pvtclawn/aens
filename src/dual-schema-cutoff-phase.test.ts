import { expect, test } from 'bun:test'
import { evaluateDualSchemaCutoffPhase } from './dual-schema-cutoff-phase'

const POLICY = {
  cutoffPolicyVersion: 'aens-fixture-cutoff/v1',
  currentSchemaVersion: 'fixture-schema/v2',
  warningFrom: '2026-03-22T00:00:00.000Z',
  cutoffAt: '2026-03-23T00:00:00.000Z',
}

test('evaluateDualSchemaCutoffPhase returns prepare before warning window', () => {
  const result = evaluateDualSchemaCutoffPhase({
    evaluatedAt: '2026-03-21T23:59:59.000Z',
    policy: POLICY,
  })

  expect(result.ok).toBe(true)
  if (!result.ok) return
  expect(result.phase).toBe('prepare')
})

test('evaluateDualSchemaCutoffPhase returns warning within warning window', () => {
  const atWarningStart = evaluateDualSchemaCutoffPhase({
    evaluatedAt: '2026-03-22T00:00:00.000Z',
    policy: POLICY,
  })
  expect(atWarningStart.ok).toBe(true)
  if (atWarningStart.ok) {
    expect(atWarningStart.phase).toBe('warning')
  }

  const beforeCutoff = evaluateDualSchemaCutoffPhase({
    evaluatedAt: '2026-03-22T23:59:59.000Z',
    policy: POLICY,
  })
  expect(beforeCutoff.ok).toBe(true)
  if (beforeCutoff.ok) {
    expect(beforeCutoff.phase).toBe('warning')
  }
})

test('evaluateDualSchemaCutoffPhase returns hard-cutoff when now == cutoffAt and after', () => {
  const atCutoff = evaluateDualSchemaCutoffPhase({
    evaluatedAt: '2026-03-23T00:00:00.000Z',
    policy: POLICY,
  })
  expect(atCutoff.ok).toBe(true)
  if (atCutoff.ok) {
    expect(atCutoff.phase).toBe('hard-cutoff')
  }

  const afterCutoff = evaluateDualSchemaCutoffPhase({
    evaluatedAt: '2026-03-23T00:00:01.000Z',
    policy: POLICY,
  })
  expect(afterCutoff.ok).toBe(true)
  if (afterCutoff.ok) {
    expect(afterCutoff.phase).toBe('hard-cutoff')
  }
})

test('evaluateDualSchemaCutoffPhase fails closed on invalid cutoff metadata', () => {
  const invalidTimestamp = evaluateDualSchemaCutoffPhase({
    evaluatedAt: '2026-03-22T12:00:00.000Z',
    policy: {
      ...POLICY,
      warningFrom: 'not-a-timestamp',
    },
  })

  expect(invalidTimestamp).toEqual({
    ok: false,
    reasonCode: 'fixture-schema-cutoff-policy-invalid',
    path: 'policy.warningFrom',
    message: 'warningFrom must be a valid UTC timestamp',
  })

  const invalidWindow = evaluateDualSchemaCutoffPhase({
    evaluatedAt: '2026-03-22T12:00:00.000Z',
    policy: {
      ...POLICY,
      warningFrom: '2026-03-24T00:00:00.000Z',
      cutoffAt: '2026-03-23T00:00:00.000Z',
    },
  })

  expect(invalidWindow).toEqual({
    ok: false,
    reasonCode: 'fixture-schema-cutoff-policy-invalid',
    path: 'policy.cutoffAt',
    message: 'cutoffAt must be later than warningFrom for deterministic phase classification',
  })
})
