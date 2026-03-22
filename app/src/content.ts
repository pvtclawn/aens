import { DEFAULT_PUBLIC_ROOT_NAME, WRITE_RECORDS_PATH } from '../../src/public-route-capabilities'

export const writeRecordsPath = WRITE_RECORDS_PATH
export const repoUrl = 'https://github.com/pvtclawn/aens'

export const ensRoot = DEFAULT_PUBLIC_ROOT_NAME

export const capabilityBullets = [
  'Resolve ENS root records directly from chain',
  'Start from a demo preset, then edit capability names and service URLs before signing',
] as const
