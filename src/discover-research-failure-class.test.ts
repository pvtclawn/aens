import { describe, expect, test } from 'bun:test'
import { classifyFailure } from '../api/discover-research'

describe('classifyFailure', () => {
  test('maps timeout-like errors to rpc-timeout retryable', () => {
    const out = classifyFailure(new Error('request timed out after 8000ms'))
    expect(out).toEqual({ failureClass: 'rpc-timeout', retryable: true })
  })

  test('maps network availability errors to rpc-unavailable retryable', () => {
    const out = classifyFailure(new Error('fetch failed: ENOTFOUND eth.merkle.io'))
    expect(out).toEqual({ failureClass: 'rpc-unavailable', retryable: true })
  })

  test('maps generic failures to lookup-error non-retryable', () => {
    const out = classifyFailure(new Error('invalid ENS response shape'))
    expect(out).toEqual({ failureClass: 'lookup-error', retryable: false })
  })
})
