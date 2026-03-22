import { WRITE_RECORDS_PATH, normalizePublicBaseUrl } from './public-surface'

export type RemovedSurfaceOutcomeClass =
  | 'gone'
  | 'redirected-to-kept-surface'
  | 'blocked'
  | 'still-live-legacy-surface'

export interface RemovedSurfaceTarget {
  label: string
  path: string
  url: string
  approvedRedirectUrls: string[]
}

export interface RemovedSurfaceProbeInput {
  requestedUrl: string
  status: number
  finalUrl?: string
  title?: string
  body?: string
}

export interface RemovedSurfaceClassification {
  label: string
  requestedUrl: string
  finalUrl: string
  status: number
  outcomeClass: RemovedSurfaceOutcomeClass
  reason: string
}

const REMOVED_SURFACE_PATHS = Object.freeze([
  {
    label: 'research route',
    path: 'research',
  },
  {
    label: 'research slash route',
    path: 'research/',
  },
  {
    label: 'research capability alias',
    path: 'research-capability',
  },
  {
    label: 'discover research route',
    path: 'discover-research',
  },
] as const)

function normalizeComparableUrl(value: string): string {
  const url = new URL(value)
  const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')
  return `${url.origin}${pathname}`
}

function isGoneStatus(status: number): boolean {
  return status === 404 || status === 410
}

function isBlockedStatus(status: number): boolean {
  return status >= 400 && status < 500 && !isGoneStatus(status)
}

function isApprovedRedirect(finalUrl: string, approvedRedirectUrls: string[]): boolean {
  const normalizedFinalUrl = normalizeComparableUrl(finalUrl)
  return approvedRedirectUrls.some((url) => normalizeComparableUrl(url) === normalizedFinalUrl)
}

function isRemovedSurfaceUrl(finalUrl: string, removedTargets: RemovedSurfaceTarget[]): boolean {
  const normalizedFinalUrl = normalizeComparableUrl(finalUrl)
  return removedTargets.some((target) => normalizeComparableUrl(target.url) === normalizedFinalUrl)
}

export function buildRemovedSurfaceTargets(baseUrl: string): RemovedSurfaceTarget[] {
  const normalizedBaseUrl = normalizePublicBaseUrl(baseUrl)
  const approvedRedirectUrls = [normalizedBaseUrl, new URL(WRITE_RECORDS_PATH, normalizedBaseUrl).toString()]

  return REMOVED_SURFACE_PATHS.map((entry) => ({
    label: entry.label,
    path: entry.path,
    url: new URL(entry.path, normalizedBaseUrl).toString(),
    approvedRedirectUrls,
  }))
}

export function classifyRemovedSurfaceProbe(input: {
  target: RemovedSurfaceTarget
  probe: RemovedSurfaceProbeInput
  removedTargets?: RemovedSurfaceTarget[]
}): RemovedSurfaceClassification {
  const removedTargets = input.removedTargets ?? [input.target]
  const finalUrl = input.probe.finalUrl?.trim() ? input.probe.finalUrl : input.probe.requestedUrl

  if (isGoneStatus(input.probe.status)) {
    return {
      label: input.target.label,
      requestedUrl: input.probe.requestedUrl,
      finalUrl,
      status: input.probe.status,
      outcomeClass: 'gone',
      reason: `status ${input.probe.status}`,
    }
  }

  if (isBlockedStatus(input.probe.status)) {
    return {
      label: input.target.label,
      requestedUrl: input.probe.requestedUrl,
      finalUrl,
      status: input.probe.status,
      outcomeClass: 'blocked',
      reason: `status ${input.probe.status}`,
    }
  }

  if (isApprovedRedirect(finalUrl, input.target.approvedRedirectUrls)) {
    return {
      label: input.target.label,
      requestedUrl: input.probe.requestedUrl,
      finalUrl,
      status: input.probe.status,
      outcomeClass: 'redirected-to-kept-surface',
      reason: `final URL is approved kept surface`,
    }
  }

  if (isRemovedSurfaceUrl(finalUrl, removedTargets)) {
    return {
      label: input.target.label,
      requestedUrl: input.probe.requestedUrl,
      finalUrl,
      status: input.probe.status,
      outcomeClass: 'still-live-legacy-surface',
      reason: `final URL is still a removed-route surface`,
    }
  }

  return {
    label: input.target.label,
    requestedUrl: input.probe.requestedUrl,
    finalUrl,
    status: input.probe.status,
    outcomeClass: 'still-live-legacy-surface',
    reason: `unexpected live route outcome remains publicly reachable`,
  }
}

export function summarizeRemovedSurfaceClassification(result: RemovedSurfaceClassification): string {
  return `${result.label}: ${result.outcomeClass} (${result.reason}) (${result.requestedUrl} -> ${result.finalUrl})`
}
