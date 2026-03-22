import { expect, test } from 'bun:test'

import {
  isClassFirstFailureSummary,
  parseSurfaceFailureSummary,
} from './surface-summary-format'

test('parseSurfaceFailureSummary parses class-first failure lines', () => {
  const parsed = parseSurfaceFailureSummary(
    'write records page: alias-expired (alias expired (canonical marker required)) (https://aens-nine.vercel.app/write-records/)',
  )

  expect(parsed).toEqual({
    surfaceLabel: 'write records page',
    failureClass: 'alias-expired',
    cue: 'alias expired (canonical marker required)',
    url: 'https://aens-nine.vercel.app/write-records/',
  })
})

test('isClassFirstFailureSummary rejects prose-first failure lines', () => {
  expect(
    isClassFirstFailureSummary(
      'write records page: reachable but missing expected marker (https://aens-nine.vercel.app/write-records/)',
    ),
  ).toBe(false)
})
