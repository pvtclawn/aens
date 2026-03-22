import { expect, test } from 'bun:test'
import {
  buildDemoRouteCapabilityDraft,
  buildPublicRouteCapabilityPlan,
  buildRouteLinks,
  DEFAULT_PUBLIC_ROOT_NAME,
  mergeCapabilities,
} from './public-route-capabilities'

test('buildRouteLinks uses bare public routes for the default theaens root', () => {
  expect(buildRouteLinks(DEFAULT_PUBLIC_ROOT_NAME)).toEqual({
    ensName: 'theaens.eth',
    landing: '/',
    writeRecords: '/write-records/',
  })
})

test('buildRouteLinks keeps query-scoped routes for non-default roots', () => {
  expect(buildRouteLinks('vitalik.eth')).toEqual({
    ensName: 'vitalik.eth',
    landing: '/?name=vitalik.eth',
    writeRecords: '/write-records/?name=vitalik.eth',
  })
})

test('buildDemoRouteCapabilityDraft creates theaens demo defaults without making them universal', () => {
  const draft = buildDemoRouteCapabilityDraft({
    rootName: DEFAULT_PUBLIC_ROOT_NAME,
    origin: 'https://aens-nine.vercel.app',
  })

  expect(draft.capabilitySurfaces).toEqual([
    {
      label: 'Demo landing capability',
      capabilityName: 'explore.theaens.eth',
      serviceUrl: 'https://aens-nine.vercel.app/',
      demoServicePath: '/',
    },
    {
      label: 'Demo write capability',
      capabilityName: 'write.theaens.eth',
      serviceUrl: 'https://aens-nine.vercel.app/write-records/',
      demoServicePath: '/write-records/',
    },
  ])
})

test('mergeCapabilities keeps required capability names first and preserves existing extras once', () => {
  expect(
    mergeCapabilities(
      ['write.theaens.eth', 'notes.theaens.eth', 'explore.theaens.eth'],
      ['explore.theaens.eth', 'write.theaens.eth'],
    ),
  ).toEqual([
    'explore.theaens.eth',
    'write.theaens.eth',
    'notes.theaens.eth',
  ])
})

test('buildPublicRouteCapabilityPlan supports arbitrary capability names and service urls', () => {
  const plan = buildPublicRouteCapabilityPlan({
    rootName: 'theaens.eth',
    capabilitySurfaces: [
      {
        label: 'Search endpoint',
        capabilityName: 'search.theaens.eth',
        serviceUrl: 'https://demo.example/search',
      },
      {
        label: 'Writer endpoint',
        capabilityName: 'writer.theaens.eth',
        serviceUrl: 'https://demo.example/write',
      },
    ],
    existingCapabilities: ['notes.theaens.eth'],
  })

  expect(plan.rootName).toBe('theaens.eth')
  expect(plan.mergedCapabilities).toEqual([
    'search.theaens.eth',
    'writer.theaens.eth',
    'notes.theaens.eth',
  ])
  expect(plan.plannedRecords).toEqual([
    {
      targetName: 'theaens.eth',
      key: 'aens.capabilities',
      value: '["search.theaens.eth","writer.theaens.eth","notes.theaens.eth"]',
    },
    {
      targetName: 'search.theaens.eth',
      key: 'aens.parent',
      value: 'theaens.eth',
    },
    {
      targetName: 'search.theaens.eth',
      key: 'aens.service',
      value: 'https://demo.example/search',
    },
    {
      targetName: 'writer.theaens.eth',
      key: 'aens.parent',
      value: 'theaens.eth',
    },
    {
      targetName: 'writer.theaens.eth',
      key: 'aens.service',
      value: 'https://demo.example/write',
    },
  ])
})
