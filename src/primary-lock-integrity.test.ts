import { describe, expect, test } from 'bun:test'

import { validatePrimaryLockState } from './primary-lock-integrity'

describe('validatePrimaryLockState', () => {
  test('accepts canonical stage-gate locked primary state', () => {
    const result = validatePrimaryLockState({
      primarySource: 'stage-gate',
      primaryLocked: true,
      primarySelectionReason: 'earliest-failing-stage',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) {
      throw new Error('expected valid primary lock state')
    }

    expect(result.state).toEqual({
      primarySource: 'stage-gate',
      primaryLocked: true,
      primarySelectionReason: 'earliest-failing-stage',
    })
  })

  test('rejects alias source token as primary-lock-integrity-violation', () => {
    const result = validatePrimaryLockState({
      primarySource: 'ownership',
      primaryLocked: true,
      primarySelectionReason: 'ownership-mismatch',
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      throw new Error('expected invalid primary lock state')
    }

    expect(result.reasonCode).toBe('primary-lock-integrity-violation')
    expect(result.issues.some((issue) => issue.fieldPath === '$.primarySource')).toBe(true)
  })

  test('rejects none=>locked tuple as primary-lock-integrity-violation', () => {
    const result = validatePrimaryLockState({
      primarySource: 'none',
      primaryLocked: true,
      primarySelectionReason: 'no-failure',
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      throw new Error('expected invalid primary lock state')
    }

    expect(result.reasonCode).toBe('primary-lock-integrity-violation')
    expect(result.issues.some((issue) => issue.message.includes('primarySource=none requires primaryLocked=false'))).toBe(true)
  })
})
