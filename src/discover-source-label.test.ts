import { expect, test } from 'bun:test'
import { sourceTagForLookupMode, toDiscoverSourceView } from './discover-source-label'

test('sourceTagForLookupMode maps supported modes to runtime source tags', () => {
  expect(sourceTagForLookupMode('example')).toBe('demo-fixture')
  expect(sourceTagForLookupMode('live')).toBe('live-chain-direct')
  expect(sourceTagForLookupMode('service')).toBe('live-chain-via-service')
})

test('sourceTagForLookupMode fails closed for unknown modes', () => {
  expect(sourceTagForLookupMode('mystery')).toBe('unknown-mode:mystery')
})

test('toDiscoverSourceView returns trusted labels for known source tags', () => {
  expect(toDiscoverSourceView('demo-fixture')).toEqual({
    raw: 'demo-fixture',
    tag: 'demo-fixture',
    label: 'Demo fixture',
    warning: null,
  })

  expect(toDiscoverSourceView('live-chain-direct')).toEqual({
    raw: 'live-chain-direct',
    tag: 'live-chain-direct',
    label: 'Live chain (direct resolver)',
    warning: null,
  })
})

test('toDiscoverSourceView warns and de-trusts unknown source tags', () => {
  const view = toDiscoverSourceView('unknown-mode:mystery')

  expect(view.tag).toBeNull()
  expect(view.label).toContain('Unknown source')
  expect(view.warning).toContain('unknown-mode:mystery')
})
