import { expect, test } from 'bun:test'
import {
  prioritizeValidationIssues,
  type WriteIntentValidationIssue,
} from './write-intent-validation-issues'

function issue(input: Partial<WriteIntentValidationIssue> & Pick<WriteIntentValidationIssue, 'reasonCode'>): WriteIntentValidationIssue {
  return {
    reasonCode: input.reasonCode,
    path: input.path ?? '$',
    severity: input.severity ?? 'error',
    phase: input.phase ?? 'payload',
    hint: input.hint ?? 'fix',
  }
}

test('prioritizeValidationIssues sorts deterministically by phase, severity, path, reasonCode', () => {
  const unordered: WriteIntentValidationIssue[] = [
    issue({ reasonCode: 'hash-mismatch', phase: 'hash', path: '$.intentPayloadHash' }),
    issue({ reasonCode: 'payload-type', phase: 'payload', path: '$.intentPayload.chainId' }),
    issue({ reasonCode: 'structure-missing-shell', phase: 'structure', path: '$.intentPayload' }),
    issue({ reasonCode: 'envelope-missing-intent-id', phase: 'envelope', path: '$.auditEnvelope.intentId' }),
    issue({ reasonCode: 'payload-unknown-key', phase: 'payload', path: '$.intentPayload.zzz', severity: 'warning' }),
    issue({ reasonCode: 'payload-missing-key', phase: 'payload', path: '$.intentPayload.aaa' }),
  ]

  const prioritized = prioritizeValidationIssues(unordered)

  expect(prioritized.allIssues.map((item) => item.reasonCode)).toEqual([
    'structure-missing-shell',
    'payload-missing-key',
    'payload-type',
    'payload-unknown-key',
    'envelope-missing-intent-id',
    'hash-mismatch',
  ])
})

test('prioritizeValidationIssues truncates primary output and reports remainingIssueCount', () => {
  const issues: WriteIntentValidationIssue[] = [
    issue({ reasonCode: 'a', phase: 'structure' }),
    issue({ reasonCode: 'b', phase: 'payload' }),
    issue({ reasonCode: 'c', phase: 'envelope' }),
    issue({ reasonCode: 'd', phase: 'hash' }),
  ]

  const prioritized = prioritizeValidationIssues(issues, { limit: 2 })

  expect(prioritized.primaryIssues.map((item) => item.reasonCode)).toEqual(['a', 'b'])
  expect(prioritized.remainingIssueCount).toBe(2)
})

test('prioritizeValidationIssues supports fail-closed compact output with zero/invalid limits', () => {
  const issues: WriteIntentValidationIssue[] = [
    issue({ reasonCode: 'a', phase: 'structure' }),
    issue({ reasonCode: 'b', phase: 'payload' }),
  ]

  const zero = prioritizeValidationIssues(issues, { limit: 0 })
  const negative = prioritizeValidationIssues(issues, { limit: -1 })

  expect(zero.primaryIssues).toHaveLength(0)
  expect(zero.remainingIssueCount).toBe(2)
  expect(negative.primaryIssues).toHaveLength(0)
  expect(negative.remainingIssueCount).toBe(2)
})
