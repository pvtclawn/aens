import { DEFAULT_PUBLIC_ROOT_NAME, WRITE_RECORDS_PATH } from '../../src/public-route-capabilities'

export const writeRecordsPath = WRITE_RECORDS_PATH
export const repoUrl = 'https://github.com/pvtclawn/aens'

export const ensRoot = DEFAULT_PUBLIC_ROOT_NAME

export const capabilityBullets = [
  'Resolve ENS root records directly from chain',
  'Register the landing and write endpoints as ENS capability surfaces',
] as const
