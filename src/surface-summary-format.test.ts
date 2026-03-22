import { expect, test } from 'bun:test'

import {
  isClassFirstFailureSummary,
  parseSurfaceFailureSummary,
} from './surface-summary-format'

test('parseSurfaceFailureSummary parses class-first failure lines', () => {
  const parsed = parseSurfaceFailureSummary(
    'research endpoint page: alias-expired (alias expired (canonical marker required)) (https://aens-nine.vercel.app/research/)',
  )

  expect(parsed).toEqual({
    surfaceLabel: 'research endpoint page',
    failureClass: 'alias-expired',
    cue: 'alias expired (canonical marker required)',
    url: 'https://aens-nine.vercel.app/research/',
  })
})

test('isClassFirstFailureSummary rejects prose-first failure lines', () => {
  expect(
    isClassFirstFailureSummary(
      'research endpoint page: reachable but missing expected marker (https://aens-nine.vercel.app/research/)',
    ),
  ).toBe(false)
})
