import { expect, test } from 'bun:test'
import {
  buildRemovedSurfaceTargets,
  classifyRemovedSurfaceProbe,
  summarizeRemovedSurfaceClassification,
  type RemovedSurfaceTarget,
} from './removed-surface'

function getTarget(path: string): { target: RemovedSurfaceTarget; allTargets: RemovedSurfaceTarget[] } {
  const allTargets = buildRemovedSurfaceTargets('https://aens-nine.vercel.app/')
  const target = allTargets.find((entry) => entry.path === path)

  if (!target) {
    throw new Error(`removed-surface-target-missing: ${path}`)
  }

  return { target, allTargets }
}

test('buildRemovedSurfaceTargets freezes the removed-route matrix against the canonical alias', () => {
  expect(buildRemovedSurfaceTargets('https://aens-nine.vercel.app')).toEqual([
    {
      label: 'research route',
      path: 'research',
      url: 'https://aens-nine.vercel.app/research',
      approvedRedirectUrls: ['https://aens-nine.vercel.app/', 'https://aens-nine.vercel.app/write-records/'],
    },
    {
      label: 'research slash route',
      path: 'research/',
      url: 'https://aens-nine.vercel.app/research/',
      approvedRedirectUrls: ['https://aens-nine.vercel.app/', 'https://aens-nine.vercel.app/write-records/'],
    },
    {
      label: 'research capability alias',
      path: 'research-capability',
      url: 'https://aens-nine.vercel.app/research-capability',
      approvedRedirectUrls: ['https://aens-nine.vercel.app/', 'https://aens-nine.vercel.app/write-records/'],
    },
    {
      label: 'discover research route',
      path: 'discover-research',
      url: 'https://aens-nine.vercel.app/discover-research',
      approvedRedirectUrls: ['https://aens-nine.vercel.app/', 'https://aens-nine.vercel.app/write-records/'],
    },
  ])
})

test('classifyRemovedSurfaceProbe marks 404 and 410 as gone', () => {
  const { target, allTargets } = getTarget('research')

  expect(
    classifyRemovedSurfaceProbe({
      target,
      removedTargets: allTargets,
      probe: {
        requestedUrl: target.url,
        status: 404,
      },
    }),
  ).toMatchObject({
    outcomeClass: 'gone',
    reason: 'status 404',
  })

  expect(
    classifyRemovedSurfaceProbe({
      target,
      removedTargets: allTargets,
      probe: {
        requestedUrl: target.url,
        status: 410,
      },
    }),
  ).toMatchObject({
    outcomeClass: 'gone',
    reason: 'status 410',
  })
})

test('classifyRemovedSurfaceProbe marks non-gone 4xx responses as blocked', () => {
  const { target, allTargets } = getTarget('discover-research')

  expect(
    classifyRemovedSurfaceProbe({
      target,
      removedTargets: allTargets,
      probe: {
        requestedUrl: target.url,
        status: 403,
      },
    }),
  ).toMatchObject({
    outcomeClass: 'blocked',
    reason: 'status 403',
  })
})

test('classifyRemovedSurfaceProbe treats redirects to kept surfaces as acceptable outcomes', () => {
  const { target, allTargets } = getTarget('research-capability')

  expect(
    classifyRemovedSurfaceProbe({
      target,
      removedTargets: allTargets,
      probe: {
        requestedUrl: target.url,
        finalUrl: 'https://aens-nine.vercel.app/write-records',
        status: 200,
      },
    }),
  ).toMatchObject({
    outcomeClass: 'redirected-to-kept-surface',
    reason: 'final URL is approved kept surface',
  })
})

test('classifyRemovedSurfaceProbe treats redirects between removed routes as still-live legacy surfaces', () => {
  const { target, allTargets } = getTarget('research-capability')

  expect(
    classifyRemovedSurfaceProbe({
      target,
      removedTargets: allTargets,
      probe: {
        requestedUrl: target.url,
        finalUrl: 'https://aens-nine.vercel.app/research',
        status: 200,
      },
    }),
  ).toMatchObject({
    outcomeClass: 'still-live-legacy-surface',
    reason: 'final URL is still a removed-route surface',
  })
})

test('classifyRemovedSurfaceProbe treats direct 200 legacy pages as still-live legacy surfaces', () => {
  const { target, allTargets } = getTarget('research')

  expect(
    classifyRemovedSurfaceProbe({
      target,
      removedTargets: allTargets,
      probe: {
        requestedUrl: target.url,
        finalUrl: target.url,
        status: 200,
        title: 'Research endpoint — ÆNS',
      },
    }),
  ).toMatchObject({
    outcomeClass: 'still-live-legacy-surface',
    reason: 'final URL is still a removed-route surface',
  })
})

test('classifyRemovedSurfaceProbe treats unexpected live non-kept destinations as still-live legacy surfaces', () => {
  const { target, allTargets } = getTarget('discover-research')

  expect(
    classifyRemovedSurfaceProbe({
      target,
      removedTargets: allTargets,
      probe: {
        requestedUrl: target.url,
        finalUrl: 'https://aens-nine.vercel.app/some-other-live-page',
        status: 500,
      },
    }),
  ).toMatchObject({
    outcomeClass: 'still-live-legacy-surface',
    reason: 'unexpected live route outcome remains publicly reachable',
  })
})

test('summarizeRemovedSurfaceClassification keeps the requested and final URL visible', () => {
  const { target, allTargets } = getTarget('research-capability')
  const result = classifyRemovedSurfaceProbe({
    target,
    removedTargets: allTargets,
    probe: {
      requestedUrl: target.url,
      finalUrl: 'https://aens-nine.vercel.app/research',
      status: 200,
    },
  })

  expect(summarizeRemovedSurfaceClassification(result)).toBe(
    'research capability alias: still-live-legacy-surface (final URL is still a removed-route surface) (https://aens-nine.vercel.app/research-capability -> https://aens-nine.vercel.app/research)',
  )
})
