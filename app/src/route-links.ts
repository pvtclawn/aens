import { ensRoot, writeRecordsPath } from './content'

export function normalizeEnsName(value: string): string {
  const normalized = value.trim().toLowerCase()
  return normalized.length > 0 ? normalized : ensRoot
}

export function buildRouteLinks(inputEnsName: string) {
  const ensName = normalizeEnsName(inputEnsName)
  const rootQuery = new URLSearchParams({ name: ensName }).toString()

  return {
    ensName,
    landing: `/?${rootQuery}`,
    writeRecords: `${writeRecordsPath}?${rootQuery}`,
  }
}
