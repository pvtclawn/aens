import { describe, expect, test } from 'bun:test'
import { classifyReasonCode } from '../api/discover-research'

describe('classifyReasonCode', () => {
  test('returns parent-authorized-with-service-url when authorized and service exists', () => {
    const reason = classifyReasonCode({
      parentListsChild: true,
      childDeclaresParent: true,
      childAddress: '0x123',
      childServiceUrl: 'https://example.com',
      childCapabilities: ['research.parent.eth'],
    })
    expect(reason).toBe('parent-authorized-with-service-url')
  })

  test('returns parent-authorized-without-service-url when authorized but url missing', () => {
    const reason = classifyReasonCode({
      parentListsChild: true,
      childDeclaresParent: true,
      childAddress: '0x123',
      childServiceUrl: null,
      childCapabilities: ['research.parent.eth'],
    })
    expect(reason).toBe('parent-authorized-without-service-url')
  })

  test('returns child-not-found when unauthorized and child has no address/url/capabilities', () => {
    const reason = classifyReasonCode({
      parentListsChild: false,
      childDeclaresParent: false,
      childAddress: null,
      childServiceUrl: null,
      childCapabilities: [],
    })
    expect(reason).toBe('child-not-found')
  })

  test('returns child-found-not-authorized for unauthorized child with partial signals', () => {
    const reason = classifyReasonCode({
      parentListsChild: false,
      childDeclaresParent: false,
      childAddress: '0x123',
      childServiceUrl: null,
      childCapabilities: [],
    })
    expect(reason).toBe('child-found-not-authorized')
  })
})
