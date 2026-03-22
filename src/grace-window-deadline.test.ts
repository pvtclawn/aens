import { expect, test } from 'bun:test'
import { formatGraceWindowDeadline } from './grace-window-deadline'

const EVALUATED_AT = '2026-03-22T01:23:00.000Z'

test('formatGraceWindowDeadline returns absolute and relative deadline fields for every result', () => {
  const result = formatGraceWindowDeadline({
    evaluatedAt: EVALUATED_AT,
    expiresAt: '2026-03-25T01:23:00.000Z',
  })

  expect(result.evaluatedAtUtc).toBe(EVALUATED_AT)
  expect(result.expiresAtUtc).toBe('2026-03-25T01:23:00.000Z')
  expect(result.graceRemainingSeconds).toBe(259200)
  expect(result.relativeLabel).toBe('in 3d 0h')
})

test('formatGraceWindowDeadline uses deterministic urgency thresholds', () => {
  expect(formatGraceWindowDeadline({
    evaluatedAt: EVALUATED_AT,
    expiresAt: '2026-03-25T01:23:00.000Z',
  }).urgencyTier).toBe('advisory') // exactly 72h

  expect(formatGraceWindowDeadline({
    evaluatedAt: EVALUATED_AT,
    expiresAt: '2026-03-25T01:22:59.000Z',
  }).urgencyTier).toBe('elevated') // 71:59:59

  expect(formatGraceWindowDeadline({
    evaluatedAt: EVALUATED_AT,
    expiresAt: '2026-03-23T01:23:00.000Z',
  }).urgencyTier).toBe('elevated') // exactly 24h

  expect(formatGraceWindowDeadline({
    evaluatedAt: EVALUATED_AT,
    expiresAt: '2026-03-23T01:22:59.000Z',
  }).urgencyTier).toBe('high') // 23:59:59

  expect(formatGraceWindowDeadline({
    evaluatedAt: EVALUATED_AT,
    expiresAt: EVALUATED_AT,
  }).urgencyTier).toBe('expired') // exactly 0
})

test('formatGraceWindowDeadline renders deterministic expired label', () => {
  const result = formatGraceWindowDeadline({
    evaluatedAt: EVALUATED_AT,
    expiresAt: '2026-03-22T01:22:59.000Z',
  })

  expect(result.graceRemainingSeconds).toBe(-1)
  expect(result.relativeLabel).toBe('expired 1s ago')
  expect(result.urgencyTier).toBe('expired')
})

test('formatGraceWindowDeadline fails closed on invalid timestamps', () => {
  expect(() => formatGraceWindowDeadline({
    evaluatedAt: 'not-a-date',
    expiresAt: EVALUATED_AT,
  })).toThrow('evaluatedAt must be a valid timestamp')

  expect(() => formatGraceWindowDeadline({
    evaluatedAt: EVALUATED_AT,
    expiresAt: 'never',
  })).toThrow('expiresAt must be a valid timestamp')
})
