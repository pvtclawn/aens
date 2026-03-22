import { expect, test } from 'bun:test'
import {
  buildPublicRouteCapabilityPlan,
  buildPublicRouteCapabilitySurfaces,
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

test('buildPublicRouteCapabilitySurfaces maps landing and write endpoints to explore/write capabilities', () => {
  expect(
    buildPublicRouteCapabilitySurfaces({
      rootName: DEFAULT_PUBLIC_ROOT_NAME,
      origin: 'https://aens-nine.vercel.app',
    }),
  ).toEqual([
    {
      kind: 'explore',
      capabilityName: 'explore.theaens.eth',
      servicePath: '/',
      serviceUrl: 'https://aens-nine.vercel.app/',
    },
    {
      kind: 'write',
      capabilityName: 'write.theaens.eth',
      servicePath: '/write-records/',
      serviceUrl: 'https://aens-nine.vercel.app/write-records/',
    },
  ])
})

test('mergeCapabilities keeps required route capabilities first and preserves existing extras once', () => {
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

test('buildPublicRouteCapabilityPlan produces the full route-capability write bundle', () => {
  const plan = buildPublicRouteCapabilityPlan({
    rootName: DEFAULT_PUBLIC_ROOT_NAME,
    origin: 'https://aens-nine.vercel.app',
    existingCapabilities: ['notes.theaens.eth'],
  })

  expect(plan.rootName).toBe('theaens.eth')
  expect(plan.mergedCapabilities).toEqual([
    'explore.theaens.eth',
    'write.theaens.eth',
    'notes.theaens.eth',
  ])
  expect(plan.plannedRecords).toEqual([
    {
      targetName: 'theaens.eth',
      key: 'aens.capabilities',
      value: '["explore.theaens.eth","write.theaens.eth","notes.theaens.eth"]',
    },
    {
      targetName: 'explore.theaens.eth',
      key: 'aens.parent',
      value: 'theaens.eth',
    },
    {
      targetName: 'explore.theaens.eth',
      key: 'aens.service',
      value: 'https://aens-nine.vercel.app/',
    },
    {
      targetName: 'write.theaens.eth',
      key: 'aens.parent',
      value: 'theaens.eth',
    },
    {
      targetName: 'write.theaens.eth',
      key: 'aens.service',
      value: 'https://aens-nine.vercel.app/write-records/',
    },
  ])
})
