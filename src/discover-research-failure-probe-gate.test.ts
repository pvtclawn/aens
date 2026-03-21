import { afterEach, describe, expect, test } from 'bun:test'
import { shouldAllowFailureProbe } from '../api/discover-research'

describe('shouldAllowFailureProbe', () => {
  const oldEnable = process.env.AENS_ENABLE_FAILURE_PROBE
  const oldToken = process.env.AENS_FAILURE_PROBE_TOKEN

  afterEach(() => {
    process.env.AENS_ENABLE_FAILURE_PROBE = oldEnable
    process.env.AENS_FAILURE_PROBE_TOKEN = oldToken
  })

  test('returns false by default', () => {
    delete process.env.AENS_ENABLE_FAILURE_PROBE
    delete process.env.AENS_FAILURE_PROBE_TOKEN
    expect(shouldAllowFailureProbe({ headers: {} })).toBe(false)
  })

  test('returns true only when enabled and token matches', () => {
    process.env.AENS_ENABLE_FAILURE_PROBE = '1'
    process.env.AENS_FAILURE_PROBE_TOKEN = 'secret-probe-token'
    expect(shouldAllowFailureProbe({ headers: { 'x-aens-probe-token': 'secret-probe-token' } })).toBe(true)
    expect(shouldAllowFailureProbe({ headers: { 'x-aens-probe-token': 'wrong' } })).toBe(false)
  })
})
